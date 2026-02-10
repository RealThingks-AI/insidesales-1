

# Fix: Card and Details Panel Side-by-Side Alignment

## Problem

When clicking a deal card to expand its details panel, the panel does not align vertically with the selected card. The `cardTopOffset` is measured **before** the CSS grid restructures (columns change from equal to expanded+details), so by the time the new layout settles, the card has moved and the offset is stale.

## Solution

Replace the pre-expansion offset measurement with a **post-layout measurement** that runs after the grid has finished transitioning. Instead of calculating `cardTopOffset` in `beginExpand`, calculate it in a `useEffect` that fires after the grid has settled (during `expanding` and `expanded` states).

### Approach

1. **Remove offset calculation from `beginExpand`** -- stop measuring before the grid changes
2. **Add a post-layout effect** that measures the card's position within its stage column after the grid has restructured
3. **Calculate offset as card's position relative to the details panel column start** -- both are grid children starting at the same row, so `marginTop` on the details panel should equal the card's `offsetTop` within the stage column's droppable area
4. **Re-measure on transition changes** to handle the expanding -> expanded transition

### Files Modified

**1. `src/components/KanbanBoard.tsx`**

- Remove `cardTopOffset` calculation from `beginExpand` (lines ~128-139)
- Add new `useEffect` that runs when `transition` is `expanding` or `expanded`:
  - Uses triple `requestAnimationFrame` to wait for layout
  - Finds the card element via `[data-deal-id="..."]`
  - Finds the stage column via `[data-stage-column="..."]`
  - Calculates card's `offsetTop` relative to the stage column top
  - Sets `cardTopOffset` to that value
- Keep the scroll logic (`performLayoutSafeScroll`) as-is since it already handles post-layout measurement

**2. `src/components/kanban/InlineDetailsPanel.tsx`**

- Keep `marginTop` approach but make it sticky-aware:
  - Use `position: sticky` with `top` set to the offset so the panel stays aligned even during scroll
  - Or simply keep current `marginTop` approach since the post-layout measurement will be accurate

### Technical Detail

```tsx
// In KanbanBoard.tsx - new effect replacing pre-expansion measurement
useEffect(() => {
  if ((transition === 'expanding' || transition === 'expanded') && expandedDealId && scrollContainerRef.current) {
    // Wait for grid layout to settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current;
          if (!container) return;
          
          const cardEl = container.querySelector(`[data-deal-id="${expandedDealId}"]`);
          const stageCol = container.querySelector(`[data-stage-column="${expandedStage}"]`);
          
          if (cardEl && stageCol) {
            const stageRect = stageCol.getBoundingClientRect();
            const cardRect = cardEl.getBoundingClientRect();
            // Card's vertical offset within the stage column
            const offset = cardRect.top - stageRect.top;
            setCardTopOffset(Math.max(0, offset));
          }
        });
      });
    });
  }
}, [transition, expandedDealId, expandedStage]);
```

This ensures the details panel's `marginTop` matches the card's actual position after the grid has restructured, achieving true side-by-side alignment.

