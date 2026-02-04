

# Enhanced Action Items Kanban Card Design

## Overview

The current Kanban cards are functional but basic. This plan enhances them to be more visually polished, information-dense, and interactive - matching enterprise CRM standards like Salesforce, HubSpot, and Monday.com.

---

## Current Issues

1. **Visual Hierarchy**: Title lacks emphasis; all text looks similar
2. **Priority Indicator**: Only shows colored left border for High priority - other priorities invisible
3. **Assignee Display**: Text-only, no avatar
4. **Module Link**: Plain text, not clickable or visually distinct
5. **Missing Features**: No quick status indicator, no progress feel, no hover card preview
6. **Actions**: Edit/Delete buttons appear on hover but are small and hard to target
7. **Card Density**: Good spacing but could be more compact for better overview

---

## Enhanced Card Design

### 1. Card Header Section
- **Priority Badge**: Always visible badge showing Low/Medium/High with color coding
- **Module Type Icon**: Small icon (Briefcase for Deal, User for Lead, Building for Contact) before linked record name
- **Title**: Bolder typography, slightly larger, always visible all text with ellipsis

### 2. Card Body Section
- **Description**: Light gray, max 2 lines (already implemented)
- **Linked Record**: Clickable link with module icon, styled as a subtle chip/tag
- **Due Date**: Show relative time for overdue/upcoming (e.g., "Overdue by 2 days", "Due tomorrow")

### 3. Card Footer Section
- **Assignee Avatar**: Small circular avatar with initials fallback, tooltip for full name
- **Due Date Badge**: Color-coded (red if overdue, yellow if due soon, gray otherwise)
- **Quick Actions**: Slightly larger touch targets, always visible on mobile

### 4. Visual Enhancements
- **Priority Left Border**: All priorities get colored borders (blue/yellow/red)
- **Overdue State**: Subtle red tint on overdue cards
- **Completed State**: Strikethrough title, muted colors
- **Hover Effects**: Subtle lift with shadow, reveal quick-complete checkbox

---

## Technical Implementation

### File Changes

**1. `src/components/ActionItemsKanban.tsx`**

Updates:
- Import `Avatar`, `AvatarFallback` from `@/components/ui/avatar`
- Import `Tooltip`, `TooltipContent`, `TooltipTrigger` from `@/components/ui/tooltip`
- Import additional icons: `Briefcase`, `UserCircle`, `Building2`, `Clock`, `AlertCircle`
- Add `isPast`, `isToday`, `isTomorrow`, `differenceInDays` from `date-fns`
- Create helper functions:
  - `getRelativeDueDate()` - returns "Overdue", "Today", "Tomorrow", or formatted date
  - `getDueDateColor()` - returns red/yellow/gray based on due status
  - `getModuleIcon()` - returns appropriate icon component
  - `getInitials()` - extracts initials from display name

Card Structure Changes:
```
Card (with priority left border for ALL priorities)
├── CardContent
│   ├── Header Row (flex between)
│   │   ├── Priority Badge (always visible)
│   │   └── Quick Actions (edit/delete)
│   ├── Title (font-medium, line-clamp-2)
│   ├── Description (if exists, muted, line-clamp-2)
│   ├── Linked Record Chip (icon + name, clickable style)
│   └── Footer Row
│       ├── Due Date Badge (with relative text, color-coded)
│       └── Assignee Avatar (with tooltip)
```

### Priority Badge Styling
```tsx
const priorityBadgeStyles = {
  Low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};
```

### Due Date Color Logic
```tsx
const getDueDateStyles = (dueDate: string) => {
  const date = new Date(dueDate);
  const today = new Date();
  const diffDays = differenceInDays(date, today);
  
  if (diffDays < 0) return { text: 'Overdue', class: 'text-red-600 bg-red-100' };
  if (diffDays === 0) return { text: 'Today', class: 'text-orange-600 bg-orange-100' };
  if (diffDays === 1) return { text: 'Tomorrow', class: 'text-yellow-600 bg-yellow-100' };
  if (diffDays <= 7) return { text: format(date, 'EEE'), class: 'text-muted-foreground' };
  return { text: format(date, 'dd MMM'), class: 'text-muted-foreground' };
};
```

### Assignee Avatar Component
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Avatar className="h-6 w-6">
      <AvatarFallback className="text-[10px] bg-primary/10">
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  </TooltipTrigger>
  <TooltipContent>{displayName}</TooltipContent>
</Tooltip>
```

### Module Icon Mapping
```tsx
const moduleIcons = {
  deals: Briefcase,
  leads: UserCircle,
  contacts: Building2,
};
```

---

## Visual Comparison

### Before
```
┌─────────────────────────────────┐
│ Work with REFU purchasing...   │  <- Title, no emphasis
│ Deal: REFU - GnT                │  <- Plain text link
│ 📅 06-02-26  👤 Peter Jakobsson │  <- Basic footer
└─────────────────────────────────┘
```

### After
```
┌────────────────────────────────────┐
│ [High] ●●●               ✏️ 🗑️    │  <- Priority badge + actions
│ Work with REFU purchasing and...  │  <- Bold title
│ engineering to understand OS...   │
│ [🧳 REFU - GnT]                   │  <- Clickable module chip
│ [⚠️ Overdue]            [PJ]     │  <- Color-coded + avatar
└────────────────────────────────────┘
```

---

## Additional Enhancements

### Empty State Improvement
- Add subtle illustration or icon
- More encouraging copy: "No items in this column - drag tasks here or create new ones"

### Column Count Badge
- Keep current implementation (already good)

### Drag Preview
- Current rotation effect is good, keep it

### Mobile Responsiveness
- Actions always visible on mobile (touch devices)
- Larger touch targets for buttons

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| Priority | Always-visible colored badge instead of just high-priority border |
| Title | Bolder, better truncation |
| Module Link | Icon + chip style, visually distinct |
| Due Date | Relative text + color coding (overdue = red) |
| Assignee | Avatar with initials + tooltip |
| Actions | Always visible header placement |
| Left Border | All priorities get colored borders |
| Overdue Cards | Subtle visual treatment |

---

## Files Modified

1. `src/components/ActionItemsKanban.tsx` - Complete card redesign

