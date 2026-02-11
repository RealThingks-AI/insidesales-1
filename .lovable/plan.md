

## Audit Logs: Default Filter and Column Reorder

### Change 1: Show All Activities Except Authentication by Default

Add a new filter category `'all_except_auth'` that shows everything except login/logout entries. Set this as the default.

**File: `src/components/settings/audit/auditLogUtils.ts`**
- Add `'all_except_auth'` to `FilterCategory` type
- Add filtering logic in `filterByCategory` to exclude authentication actions

**File: `src/components/settings/AuditLogsSettings.tsx`**
- Change default `category` state from `'record_changes'` to `'all_except_auth'`

**File: `src/components/settings/audit/AuditLogFilters.tsx`**
- Add new dropdown option "All (except Auth)" as the first item

### Change 2: Rearrange Column Order and Widths

New column order with percentage-based widths using the requested layout:

| # | Column | Width |
|---|--------|-------|
| 1 | Activity | 10% |
| 2 | Module | 10% |
| 3 | Summary | 50% |
| 4 | User | 10% |
| 5 | Time | 10% |
| 6 | Actions | 10% |

**File: `src/components/settings/AuditLogsSettings.tsx`**
- Reorder `TableHead` elements to: Activity, Module, Summary, User, Time, Actions
- Replace fixed `w-[...]` widths with percentage-based `w-[10%]` / `w-[50%]`
- Reorder corresponding `TableCell` elements in each row to match
- Remove the Date/Time column name, rename to just "Time"

### Files to Modify
1. `src/components/settings/audit/auditLogUtils.ts` -- new filter category type and logic
2. `src/components/settings/AuditLogsSettings.tsx` -- default state + column reorder
3. `src/components/settings/audit/AuditLogFilters.tsx` -- new dropdown option

