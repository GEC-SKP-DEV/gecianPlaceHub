# Quick Reference: Placement Portal Theme

## 🎨 Color Codes

### Navigation & Branding (Blue)
```
Navbar: from-blue-600 to-blue-700
Footer: from-blue-900 to-blue-800
Institutional color for trust and credibility
```

### Primary Actions (Green)
```
Buttons: from-green-600 to-teal-600
Hover: from-green-700 to-teal-700
Filters: bg-green-600, hover:bg-green-700
Accents: border-green-200, hover:bg-green-50
```

### Supporting Colors
```
Background: from-gray-50 to-gray-100
Text: text-gray-800, text-gray-600
Borders: border-gray-200, border-green-200
Links: text-blue-700 (email), text-green-600 (whatsapp)
```

## 🔄 Component Changes

### Text Replacements

| Old | New | Component |
|-----|-----|-----------|
| "Gecian_Collab" | "Placement Portal" | Navbar |
| "Add Project" | "Post Job" | FAB Button |
| "All", "Latest", "Oldest", "This Week" | "Active", "Closed", "Full-Time", "Internship" | Tabs |
| "Backlogs" | "Qualification" | Card |
| "Salary" (in label) | "Job Type" | Card |
| "Google Forum" | "View Job Details" | Button |
| "Contact the Project Owner:" | "Contact Recruiter:" | Card |

### Icon Changes

| Old | New | Meaning | Component |
|-----|-----|---------|-----------|
| CalendarDays | Briefcase | Job Qualification/Role | Card |
| WalletCards | DollarSign | Compensation/Job Type | Card |
| Users | MapPin | Location/Venue | Card |
| (removed) | (removed) | Instagram/LinkedIn | Card |
| (kept) | (kept) | Email/WhatsApp | Card |

## 🎯 Key Files

### Components to Update
```
components/Navbar.tsx           ✅ Updated
components/Footer.tsx            ✅ Updated
components/repeto/AddProjectFAB.tsx     ✅ Updated
components/repeto/TabSection.tsx        ✅ Updated
components/repeto/ProjectCard.tsx       ✅ Updated
components/repeto/FilterSection.tsx     ✅ Updated
app/page.tsx                     ✅ Updated
```

### Components That May Need Updates
```
components/repeto/ProjectGrid.tsx      ⚠️  May need API endpoint update
app/add-project/page.tsx         ⚠️  Should be renamed to add-job
app/manage-projects/page.tsx     ⚠️  Should be renamed to manage-jobs
```

## 🚀 Common Tasks

### Add a New Filter Category
1. Go to `/app/api/categories/route.ts`
2. Add category to categories table
3. Add options to categoryOptionValues
4. FilterSection will automatically fetch and display

### Change Button Colors
Replace in Tailwind classes:
```
// Old button (blue)
bg-blue-600 hover:bg-blue-700

// New button (green)
bg-green-600 hover:bg-green-700
```

### Update Tab Labels
Edit `components/repeto/TabSection.tsx`:
```typescript
const tabs = ["Active", "Closed", "Full-Time", "Internship"];
```

### Change Navbar Branding
Edit `components/Navbar.tsx`:
- Line ~17: Brand name
- Line ~18: Subtitle
- Color gradients: Lines 1-2

### Update Card Icons
Edit `components/repeto/ProjectCard.tsx`:
- Import statement: Line 2
- Icon usage: Lines 48-54

## 📊 Responsive Design

### Desktop (md and up)
- Navbar: Full width with all elements visible
- Layout: Filters (fixed width) + Content (flexible)
- Cards: Grid layout
- Footer: Three-column layout

### Tablet (sm to md)
- Navbar: Slightly compressed
- Layout: Single column
- Cards: Stack vertically
- Filters: Mobile FAB button

### Mobile (below sm)
- Navbar: Compact with menu
- Layout: Full width single column
- Cards: Full width
- Filters: Slide-in panel from bottom

## 🔧 Development Tips

### Tailwind CSS Color Utilities
- Use `from-green-600 to-teal-600` for gradients
- Use `hover:bg-green-50` for hover states
- Use `border-green-200` for subtle borders
- Use `text-green-600` for text accents

### Icons (lucide-react)
```tsx
import { Briefcase, DollarSign, MapPin, Mail, MessageCircle } from "lucide-react";

<Briefcase className="w-5 h-5 text-green-600" />
<DollarSign className="w-5 h-5 text-green-600" />
<MapPin className="w-5 h-5 text-green-600" />
```

### Typography
- Headings: `text-lg font-bold text-gray-800`
- Subtext: `text-xs text-gray-500`
- Labels: `text-sm text-gray-700`
- Emphasis: `font-semibold text-green-700`

## ⚠️ Common Mistakes to Avoid

1. **Don't mix blue and green** - Use blue for nav/footer, green for actions
2. **Don't forget hover states** - Always include `hover:` variants
3. **Don't hardcode colors** - Use Tailwind classes
4. **Don't miss icon colors** - Keep icon colors consistent with element
5. **Don't break responsiveness** - Test on mobile before deploying

## 📝 SQL for New Categories

```sql
-- Example: Adding Job Level Filter
INSERT INTO categories (categoryName, categoryDescription, inputType, minValue, maxValue)
VALUES ('Job Level', 'Experience level required', 'single-select', NULL, NULL);

INSERT INTO categoryOptionValues (categoryId, optionName)
SELECT id, 'Fresher' FROM categories WHERE categoryName = 'Job Level'
UNION ALL
SELECT id, 'Experienced' FROM categories WHERE categoryName = 'Job Level'
UNION ALL
SELECT id, 'Senior' FROM categories WHERE categoryName = 'Job Level';
```

## 🎓 Learning Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev
- **Next.js**: https://nextjs.org/docs
- **React Hooks**: https://react.dev/reference/react/hooks

## 📞 Support

For issues or questions:
1. Check `THEME_TRANSFORMATION.md` for overview
2. Check `IMPLEMENTATION_DETAILS.md` for technical details
3. Review component source code
4. Check git history for previous implementations

## 🔗 Related Documents

- `THEME_TRANSFORMATION.md` - Complete overview of changes
- `IMPLEMENTATION_DETAILS.md` - Technical deep-dive
- `COMPLETION_SUMMARY.md` - Project completion status

---

**Keep this file bookmarked for quick reference during development!**
