# Complete Workflow: Dynamic Categories System

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Admin Panel                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Manage Categories                               │   │
│  │  - Add/Edit/Delete categories                    │   │
│  │  - Select input type                             │   │
│  │  - Set min/max for sliders                       │   │
│  │  - Define options for select types               │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  Categories API    │
         │  (POST/PUT/DELETE) │
         └─────────┬──────────┘
                   │
        ┌──────────▼───────────┐
        │   Database Schema    │
        │ ┌──────────────────┐ │
        │ │ categories       │ │
        │ │ ├─categoryId     │ │
        │ │ ├─category       │ │
        │ │ ├─inputType      │ │  ← NEW
        │ │ ├─minValue       │ │  ← NEW
        │ │ └─maxValue       │ │  ← NEW
        │ │                  │ │
        │ │ categoryOptionValues │
        │ │ ├─optionId       │ │
        │ │ ├─optionName     │ │
        │ │ └─categoryId     │ │
        │ │                  │ │
        │ │ projectOptions   │ │
        │ │ ├─id             │ │
        │ │ ├─projectId      │ │
        │ │ ├─categoryId     │ │
        │ │ └─optionId       │ │
        │ └──────────────────┘ │
        └──────────┬───────────┘
                   │
         ┌─────────▼──────────────┐
         │  Dynamic Category      │
         │  Field Component       │
         │  Renders based on:     │
         │  - inputType           │
         │  - options             │
         │  - min/max values      │
         └─────────┬──────────────┘
                   │
        ┌──────────▼──────────────┐
        │   User-Facing Forms     │
        │  ┌────────────────────┐ │
        │  │ Add Project        │ │
        │  │ Edit Project       │ │
        │  └────────────────────┘ │
        └───────────────────────┘
```

## Step-by-Step Workflow

### Phase 1: Admin Creates a Category

#### Scenario: Create "Department" as Multi-Select

1. **Access Admin Panel**
   - Navigate to `/admin`
   - Go to "Manage Categories"

2. **Click "Add New Category"**
   - Form appears with fields:
     - Category Name
     - Input Type (dropdown)
     - Input type-specific fields

3. **Fill in Details**
   ```
   Category Name: Department
   Input Type: Multi-Select
   ```

4. **Add Options**
   - Click "Add Option"
   - Enter: CSE, ECE, Mechanical, Civil, IT, EEE
   - Each becomes a checkbox in the form

5. **Save**
   - Database stores:
     ```
     categories: {
       categoryId: 5,
       category: "Department",
       inputType: "multi-select",
       minValue: NULL,
       maxValue: NULL
     }
     
     categoryOptionValues: [
       { optionId: 1, optionName: "CSE", categoryId: 5 },
       { optionId: 2, optionName: "ECE", categoryId: 5 },
       ... etc
     ]
     ```

### Phase 2: Create a Salary Range-Slider Category

1. **Fill Category Details**
   ```
   Category Name: Salary Range
   Input Type: Range-Slider
   ```

2. **Set Range**
   ```
   Min Value: 0
   Max Value: 2000000
   ```

3. **Save**
   - No options needed
   - Database stores:
     ```
     categories: {
       categoryId: 6,
       category: "Salary Range",
       inputType: "range-slider",
       minValue: 0,
       maxValue: 2000000
     }
     ```

### Phase 3: User Creates a Project

#### Flow: Adding a Project

1. **Navigate to Add Project Page**
   - Goes to `/add-project`

2. **API Fetches Categories**
   - GET `/api/categories`
   - Receives:
     ```json
     [
       {
         "categoryId": 5,
         "categoryName": "Department",
         "inputType": "multi-select",
         "options": [
           { "optionId": 1, "optionName": "CSE" },
           { "optionId": 2, "optionName": "ECE" },
           ...
         ]
       },
       {
         "categoryId": 6,
         "categoryName": "Salary Range",
         "inputType": "range-slider",
         "minValue": 0,
         "maxValue": 2000000,
         "options": []
       }
     ]
     ```

3. **Render Dynamic Form**
   - For Department (multi-select):
     ```
     ☑ CSE
     ☐ ECE
     ☐ Mechanical
     ☐ Civil
     ☐ IT
     ☐ EEE
     ```
   - For Salary Range (range-slider):
     ```
     Salary Range: 500,000
     |────●────────────────────|
     0        500K        2M
     ```

4. **User Selects Values**
   - Department: Checks CSE, ECE
   - Salary: Drags to 500,000

5. **Submit Form**
   - Sends POST to `/api/projects`:
     ```json
     {
       "projectName": "...",
       "projectCategoryOptions": [
         {
           "categoryName": "Department",
           "optionName": ["CSE", "ECE"]  ← Array for multi-select
         },
         {
           "categoryName": "Salary Range",
           "optionName": 500000  ← Number for slider
         }
       ]
     }
     ```

6. **Backend Processing**
   - For each category option:
     - Find category by name
     - For multi-select values:
       - For each value, find the optionId
       - Insert into projectOptions table
     - For range slider: Store as number

### Phase 4: User Edits Project

1. **Open Edit Modal**
   - Fetches project details
   - For Department (multi-select):
     - Queries: "Get all projectOptions where projectId=X AND categoryId=5"
     - Result: [CSE, ECE] (multiple rows)
     - Initializes component with array: ["CSE", "ECE"]

2. **Component Renders**
   - Multi-select component shows both CSE and ECE checked
   - User can add/remove selections

3. **Save Changes**
   - Deletes old projectOptions for this project
   - Inserts new selections

## Data Flow Diagram

```
┌─────────────────────┐
│   Admin Interface   │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ Select Type │
    │ (4 options) │
    └──────┬──────┘
           │
    ┌──────▼─────────────────────┐
    │ Based on Type:              │
    ├─────────────────────────────┤
    │ single-select → show options│
    │ multi-select  → show options│
    │ range-slider  → show min/max│
    │ text          → hide options│
    └──────┬─────────────────────┘
           │
    ┌──────▼──────────────┐
    │ Save to Database    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │ Clear Cache         │
    │ (localStorage)      │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │ Form Auto-Updates   │
    │ CategoryField picks │
    │ correct component   │
    └─────────────────────┘
```

## Multi-Select Storage

### How Multi-Select Values are Stored

For a project with Department = [CSE, ECE]:

**Old Way (Single-Select Only):**
```
projectOptions:
  id=100, projectId=1, categoryId=5, optionId=1 (CSE)
```

**New Way (Multi-Select Support):**
```
projectOptions:
  id=100, projectId=1, categoryId=5, optionId=1 (CSE)
  id=101, projectId=1, categoryId=5, optionId=2 (ECE)
```

**Retrieval:**
```javascript
// Find all options for this project and category
const options = await db.select()
  .from(projectOptions)
  .where(and(
    eq(projectOptions.projectId, 1),
    eq(projectOptions.categoryId, 5)
  ));
// Returns: [CSE, ECE]
```

## Cache Invalidation Flow

```
┌──────────────────────┐
│ Category Modified    │
└──────────┬───────────┘
           │
    ┌──────▼────────────────────┐
    │ API Response Success       │
    └──────┬────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ localStorage.removeItem()    │
    │ ('cachedCategories')         │
    └──────┬──────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ Next time form loads:        │
    │ - No cache found             │
    │ - Fetch fresh from API       │
    │ - Cache new data             │
    │ - Show latest categories     │
    └──────────────────────────────┘
```

## Testing Checklist

### Create Categories
- [ ] Create single-select with 3+ options
- [ ] Create multi-select with 5+ options
- [ ] Create range-slider with reasonable min/max
- [ ] Create text input
- [ ] Edit category, change type
- [ ] Delete category

### Create Projects
- [ ] Create project with single-select
- [ ] Create project with multi-select (select 2+ options)
- [ ] Create project with range-slider
- [ ] Create project with text input

### Edit Projects
- [ ] Edit single-select value
- [ ] Edit multi-select (add/remove selections)
- [ ] Edit range-slider value
- [ ] Edit text input

### Edge Cases
- [ ] Multi-select with 0 selections
- [ ] Multi-select with all options selected
- [ ] Range-slider at min/max values
- [ ] Text input with special characters
- [ ] Switch category type (single → multi)
- [ ] Delete category used by existing projects

## Performance Considerations

1. **Caching**: 1-hour localStorage cache reduces API calls
2. **Lazy Loading**: Categories loaded only when needed
3. **Batch Operations**: Multi-select options inserted in single query
4. **Index Optimization**: Queries on projectId, categoryId are indexed

## Security

- Admin-only access to manage categories
- Server-side validation of category existence
- Foreign key constraints prevent orphaned data
- CORS protection on API endpoints
- Firebase authentication required for project creation
