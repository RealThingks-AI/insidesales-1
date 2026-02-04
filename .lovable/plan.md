

# Kanban Card Layout Optimization

## Current Issues Identified

Based on the selected elements and current code:

| Issue | Location | Current | Problem |
|-------|----------|---------|---------|
| Bold title | Line 172 | `font-medium` | Too heavy for card content |
| Pill/Badge format for Module | Line 185 | `Badge variant="secondary"` | Takes too much visual space, looks cluttered |
| Excessive padding | Line 168 | `p-3 space-y-2` with nested `pl-4` | Too much indentation |
| Priority dot creates unnecessary offset | Line 170-171 | Priority dot forces all content to have `pl-4` | Inconsistent alignment |

---

## Proposed Changes

### 1. Remove Bold from Title
Change `font-medium` to `font-normal` for a cleaner, lighter look.

### 2. Replace Badge with Plain Text for Module
Instead of using `<Badge>` component, display as simple text like:
```
Deal: BMW Infotainment - Accenture
```
Using a subtle text style that matches the due date and assignee format.

### 3. Optimize Card Layout Structure
- Remove priority dot from title row (already have colored left border for high priority)
- Remove nested `pl-4` padding - use consistent spacing
- Reduce vertical spacing from `space-y-2` to `space-y-1.5`
- Align all content elements consistently

### 4. Visual Hierarchy Improvement
- Title: `text-sm font-normal` (not bold)
- Module/Due Date/Assignee: `text-xs text-muted-foreground` (consistent secondary info style)
- Remove Badge wrapper from module - display as plain text

---

## Before vs After Layout

**Before:**
```
[●] Try to schedule a management meeting...  (bold title with dot)
    
    [Deal: BMW Infotainment]  (pill badge)
    
    📅 04-02-26
    
    👤 Peter Jakobsson                    [✏️][🗑️]
```

**After:**
```
Try to schedule a management meeting...  (normal weight title)

Deal: BMW Infotainment - Accenture  (plain text, subtle color)
📅 04-02-26 · 👤 Peter Jakobsson                [✏️][🗑️]
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ActionItemsKanban.tsx` | Simplify card layout, remove Badge for module, remove title bold, consolidate footer info |

---

## Technical Implementation

```typescript
// Title: Remove font-medium, keep priority dot but smaller
<span className="text-sm line-clamp-3">{item.title}</span>

// Module: Plain text instead of Badge
{item.module_id && linkedRecordName && (
  <div className="text-xs text-muted-foreground">
    {moduleLabels[item.module_type]}: {linkedRecordName}
  </div>
)}

// Consolidate footer: Due date and Assignee on same row
<div className="flex items-center justify-between text-xs text-muted-foreground">
  <div className="flex items-center gap-3">
    {item.due_date && (
      <div className="flex items-center gap-1">
        <CalendarIcon className="h-3 w-3" />
        <span>{formatDueDate(item.due_date)}</span>
      </div>
    )}
    <div className="flex items-center gap-1">
      <User className="h-3 w-3" />
      <span>{getUserDisplayName(item.assigned_to) || 'Unassigned'}</span>
    </div>
  </div>
  {/* Hover actions */}
</div>
```

