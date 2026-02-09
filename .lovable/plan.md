
## What’s happening (root cause)
You’re still seeing the old **two inline row icons (pencil + trash)** in the Preview site for:
- Accounts
- Leads
- Deals
- Action Items

From code inspection, the reason is **not a single global setting**—it’s that **at least one active table implementation still renders the old inline buttons**, and we need to make sure *every route’s actual list table component* uses the same “MoreHorizontal → dropdown menu” pattern.

One confirmed offender in the current codebase is:
- **Deals (List view)**: `src/components/ListView.tsx` still renders inline Pencil + Trash buttons in the row actions cell.

For the other modules (Accounts/Leads/Action Items), the expected dropdown code exists in some files, but since you still see old icons in Preview, we will **re-audit and update the exact components that are actually rendering those rows**, and remove any remaining inline action button groups.

---

## Goal (final UI behavior)
In each module’s table rows:
- The right-most actions column shows **one MoreHorizontal (… ) button** (revealed on hover, same as current behavior)
- Clicking it opens a dropdown with module-specific actions
- No inline pencil/trash icons remain in the row

---

## Implementation approach
### Phase 1 — Identify the exact rendering components (per module)
For each affected route, we will verify the component chain and then edit the exact file that renders the row actions cell:

1) **Accounts** (`/accounts`)
- Confirm: `src/pages/Accounts.tsx` → `src/components/AccountTable.tsx` → `src/components/account-table/AccountTableBody.tsx`
- Re-check the row action cell implementation in `AccountTableBody.tsx`.
- If the Preview still shows inline icons, it means a different table implementation is being used somewhere; we’ll locate it by searching for inline Pencil/Trash patterns tied to accounts rows and update that file.

2) **Leads** (`/leads`)
- Confirm: `src/pages/Leads.tsx` → `src/components/LeadTable.tsx`
- Re-check/update the row action cell in `LeadTable.tsx` (and ensure no alternate leads table is being used anywhere in that route).

3) **Action Items** (`/action-items`)
- Confirm: `src/pages/ActionItems.tsx` → `src/components/ActionItemsTable.tsx`
- Re-check/update the row action cell in `ActionItemsTable.tsx` and remove any remaining inline action buttons if present in the actual rendered component.

4) **Deals** (`/deals` list view)
- Confirm: `src/pages/DealsPage.tsx` → `src/components/ListView.tsx`
- This file currently uses the old inline buttons; we will replace them with the dropdown menu.

Deliverable of this phase: a short checklist confirming “this is the file that renders the row actions for each module”.

---

### Phase 2 — Apply the unified Row Actions Dropdown everywhere
We will standardize the action cell markup across all affected tables to this structure:

- Container:
  - `opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex justify-center`
- Trigger:
  - Ghost icon button with `MoreHorizontal`
- Menu:
  - `DropdownMenuContent align="end"` using existing `src/components/ui/dropdown-menu.tsx` (already has solid background and `z-50`)

#### A) Deals — fix `src/components/ListView.tsx` (required)
Replace the inline pencil/trash buttons in the row action cell with a dropdown menu:

Menu items:
- Edit (calls existing `onDealClick(deal)`)
- Action Items (calls existing `handleActionClick(deal)` to open `DealActionItemsModal`)
- Delete (sets `setDealToDelete(deal.id)` and opens existing delete dialog)

Also:
- Add needed imports (`MoreHorizontal`, `ListTodo`, `DropdownMenuSeparator`, and dropdown components).
- Ensure click events don’t trigger row selection/click unintentionally by stopping propagation on the actions cell (same as other tables).

#### B) Accounts — ensure action menu includes “View Linked Contacts”
In the active accounts table row action cell:
- Edit
- View Linked Contacts (opens the linked contacts dialog)
- Delete (destructive)

If the route is still rendering inline icons, we will:
- Find the exact component rendering the accounts rows (search for the inline actions pattern within accounts-related components)
- Replace it with the dropdown pattern

#### C) Leads — ensure menu includes Convert + Action Items
In the active leads table row action cell:
- Edit
- Convert to Deal (opens existing `ConvertToDealModal`)
- Action Items (opens existing `LeadActionItemsModal`)
- Delete (destructive)

Same fallback approach: if inline icons are still rendered, locate the actual component and replace the action cell.

#### D) Action Items — ensure menu includes Mark Complete
In the active action items list table row action cell:
- Edit
- Mark Complete (only if status != Completed)
- Delete (destructive)

---

### Phase 3 — Verification checklist (end-to-end)
After applying changes, we will verify in Preview:

1) **Accounts**
- Hover a row → only (… ) appears in the actions column
- Dropdown shows: Edit, View Linked Contacts, Delete
- View Linked Contacts opens dialog correctly

2) **Leads**
- Hover a row → only (… ) appears
- Dropdown shows: Edit, Convert to Deal, Action Items, Delete
- Convert to Deal opens modal
- Action Items opens modal

3) **Deals (List view)**
- Hover a row → only (… ) appears
- Dropdown shows: Edit, Action Items, Delete
- Action Items opens the DealActionItemsModal
- Delete opens confirmation dialog

4) **Action Items (List view)**
- Hover a row → only (… ) appears
- Dropdown shows: Edit, Mark Complete (when applicable), Delete
- Mark Complete updates status

---

## Files expected to change
- `src/components/ListView.tsx` (definite change; currently still old inline actions)
- Potentially (depending on where the old inline actions are actually coming from in Preview):
  - `src/components/account-table/AccountTableBody.tsx`
  - `src/components/LeadTable.tsx`
  - `src/components/ActionItemsTable.tsx`
  - Any alternate table component discovered during Phase 1 audit that still renders inline action buttons for these routes

---

## Notes on keeping the UI consistent
- We will keep the existing hover-reveal interaction standard (`opacity-0 group-hover:opacity-100`).
- The dropdown background and z-index are already handled well by `src/components/ui/dropdown-menu.tsx` (uses `bg-popover` + `z-50`), so we’ll reuse it everywhere.
