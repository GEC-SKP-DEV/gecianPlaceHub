# Quick Reference: Dynamic Categories

## TL;DR - What Changed

**Before**: Categories were hardcoded with only single-select dropdowns
**Now**: Categories support 4 input types and automatically adapt the UI

## Input Types Explained

| Type | Use Case | Example | UI |
|------|----------|---------|-----|
| **Single-Select** | One choice only | Job Type | Dropdown menu |
| **Multi-Select** | Multiple choices | Departments | Checkboxes |
| **Range-Slider** | Numeric range | Salary | Slider with min/max |
| **Text** | Free text input | Company Name | Text box |

## Admin: How to Create a Category

1. Go to **Manage Categories**
2. Click **Add New Category**
3. Enter category name
4. Pick input type
5. Add options (if not text/slider)
6. Click **Save**

**That's it!** The form will automatically update to show this new category.

## User: How Categories Appear in Forms

The form automatically renders based on type:

```
Single-Select Category:
┌─ Select Job Type ─────┐
│ ▼ Internship          │  ← Dropdown
└───────────────────────┘

Multi-Select Category:
┌─ Select Departments ──┐
│ ☑ CSE                 │
│ ☐ ECE                 │  ← Checkboxes
│ ☐ Mechanical          │
└───────────────────────┘

Range-Slider Category:
┌─ Salary: 500000 ──────┐
│ |─────●──────────────| │  ← Slider
│ 0    500000   1000000  │
└───────────────────────┘

Text Category:
┌─ Company Name ────────┐
│ [_________________]   │  ← Text box
└───────────────────────┘
```

## Real-World Examples

### Department (Multi-Select)
**Why?** Students can be from multiple departments
- Type: Multi-Select
- Options: CSE, ECE, Mechanical, Civil, IT, EEE

### Salary (Range-Slider)
**Why?** Better UX for numeric ranges
- Type: Range-Slider
- Min: 0
- Max: 2,000,000

### Passout Year (Single-Select)
**Why?** One year per person
- Type: Single-Select
- Options: 2025, 2026, 2027, 2028

### Location (Text)
**Why?** Unlimited location values
- Type: Text
- (No options needed)

## Database Changes (For Developers)

```sql
ALTER TABLE categories ADD COLUMN input_type VARCHAR(50) DEFAULT 'single-select';
ALTER TABLE categories ADD COLUMN min_value INTEGER;
ALTER TABLE categories ADD COLUMN max_value INTEGER;
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| New category not showing | Clear browser cache or use Incognito mode |
| Multi-select shows as dropdown | Check `input_type` is set to `'multi-select'` |
| Slider not working | Verify `min_value` and `max_value` are set |
| Options not appearing | Check options exist in database for that category |

## Code Changes (For Developers)

### Files Modified:
- `lib/schema.ts` - Added `inputType`, `minValue`, `maxValue` columns
- `components/CategoryField.tsx` - New reusable component
- `app/api/categories/route.ts` - Handles new metadata
- `app/api/projects/route.ts` - Supports multi-select arrays
- `app/manage-categories/page.tsx` - Input type selector
- `app/add-project/page.tsx` - Uses CategoryField component
- `app/manage-projects/page.tsx` - Uses CategoryField component

### New Files:
- `lib/cacheUtils.ts` - Cache management utilities
- `docs/DYNAMIC_CATEGORIES.md` - Full migration guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

## Future Features

The architecture supports adding:
- Date/time pickers
- Color pickers
- File uploads
- Rating scales
- Custom validation
- Conditional fields
