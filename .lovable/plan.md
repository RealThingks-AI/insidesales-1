

# Fix: Card to Top-Left + Details Panel Fills 70% Viewport

## Desired Behavior

When clicking any deal card Expand button:
1. The selected card's stage column moves to the **top-left** of the viewport
2. The details panel fills the almost half of the viewport** to the right
3. Both scrollbars are properly functional to achieve above goal.
4. Smooth animations for the transition



## Technical Detail

**Grid when expanded (3-column layout):**

[Stage 1 Column ~15%] [Details Panel ~70%][Stage 2 Column ~15%]

**Grid when collapsed (normal):**

[Stage1] [Stage2] [Stage3] [Stage4] [Stage5] ...
