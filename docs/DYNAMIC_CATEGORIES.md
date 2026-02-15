# Dynamic Categories and Projects Migration Guide

This guide explains how to migrate your existing database schema to support fully dynamic categories and projects.

## Overview

The system now supports:
- **Multiple input types** per category:
  - `single-select`: Standard dropdown (one choice)
  - `multi-select`: Checkbox list (multiple choices)
  - `range-slider`: Slider input (numeric range)
  - `text`: Text input field
- **Automatic UI generation** based on input type
- **Scalable architecture** for future feature additions

## Database Migration

### Step 1: Add New Columns to Categories Table

Add the following columns to the `categories` table:

```sql
ALTER TABLE categories ADD COLUMN input_type VARCHAR(50) DEFAULT 'single-select' NOT NULL;
ALTER TABLE categories ADD COLUMN min_value INTEGER;
ALTER TABLE categories ADD COLUMN max_value INTEGER;
```

### Step 2: Update Existing Categories (Optional)

If you want to migrate existing categories to new input types:

```sql
-- Example: Set Department category to multi-select
UPDATE categories 
SET input_type = 'multi-select' 
WHERE category = 'Department';

-- Example: Set Salary category to range-slider
UPDATE categories 
SET input_type = 'range-slider', min_value = 0, max_value = 1000000
WHERE category = 'Salary';

-- Example: Set Company Name to text input
UPDATE categories 
SET input_type = 'text'
WHERE category = 'Company Name';
```

### Step 3: Verify Migration

Run this query to verify your categories are properly configured:

```sql
SELECT categoryId, category, input_type, min_value, max_value, 
       (SELECT COUNT(*) FROM category_option_values WHERE category_option_values.category_id = categories.category_id) as option_count
FROM categories;
```

## UI Changes

### Adding a New Category via Admin Panel

1. Go to **Manage Categories** page
2. Click **Add New Category**
3. Enter **Category Name**
4. Select **Input Type**:
   - **Single Select**: For single-choice fields (Department, Job Type, etc.)
   - **Multi-Select**: For multiple-choice fields (Skills, Departments, etc.)
   - **Range Slider**: For numeric ranges (Salary, Experience in years, etc.)
   - **Text Input**: For free-text fields (Company Name, Location, etc.)
5. If **Range Slider** is selected:
   - Enter **Min Value** and **Max Value**
6. If **Single/Multi-Select** is selected:
   - Add options by clicking **Add Option**
   - Each option becomes a choice in the form
7. Click **Save Category**

### Creating/Editing Projects

When creating or editing a project, the form will automatically render the correct input based on the category's input type:

- **Single-Select**: Shows a dropdown menu
- **Multi-Select**: Shows checkboxes (select multiple)
- **Range Slider**: Shows a slider with min/max values
- **Text**: Shows a text input field

## Code Changes Summary

### Schema Changes
- `lib/schema.ts`: Added `inputType`, `minValue`, `maxValue` to categories table

### New Components
- `components/CategoryField.tsx`: Reusable component that renders appropriate input based on category type

### API Changes
- `app/api/categories/route.ts`: Updated to handle `inputType`, `minValue`, `maxValue`
- `app/api/projects/route.ts`: Enhanced to support multi-select values (stored as arrays)

### UI Updates
- `app/manage-categories/page.tsx`: Added input type selector and validation
- `app/add-project/page.tsx`: Now uses `CategoryField` component
- `app/manage-projects/page.tsx`: Now uses `CategoryField` component for editing

### Type Updates
- `types/project.ts`: Updated `Category` interface to include `inputType`, `minValue`, `maxValue`

## Best Practices

### Naming Categories
- Use clear, descriptive names: "Department", "Job Type", "Salary Range"
- Avoid abbreviations unless they're widely understood

### Organizing Options
For multi-select categories, group related options together:
```
Department:
  - CSE
  - ECE
  - Mechanical
  - Civil
  - IT
```

### Range Sliders
Set realistic min/max values:
- Salary: min=0, max=2000000 (in rupees)
- Experience: min=0, max=50 (in years)
- Batch Year: min=2020, max=2028

### Text Input Categories
Use for fields that have unlimited possible values:
- Company Name
- Position Title
- Custom Descriptions

## Troubleshooting

### Cache Issues
If you see stale category data, try:
1. Clear browser cache (or use Incognito mode)
2. Clear localStorage: Open DevTools → Console → `localStorage.removeItem('cachedCategories')`
3. Refresh the page

### Categories Not Showing in Forms
- Verify the category exists in the database: `SELECT * FROM categories;`
- Check that the category has `input_type` set (should default to 'single-select')
- Clear the cache as described above

### Multi-Select Not Working
- Ensure the category's `input_type` is set to `'multi-select'`
- Verify options exist: `SELECT * FROM category_option_values WHERE category_id = X;`

## Future Enhancements

The system is now structured to easily support:
- Date pickers for date fields
- Time pickers for scheduling
- Color pickers for design fields
- File uploads
- Rating scales
- Custom validation rules
- Conditional field visibility

Simply add a new `inputType` enum value and create the corresponding component!

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the server logs in `dev_logs.txt`
3. Test with fresh data: Add a simple category and verify it appears correctly
