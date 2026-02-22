## Packages
zustand | State management for highly optimized, frequent updates
framer-motion | Smooth animations for UI panels and value changes
date-fns | Formatting timestamps for order history
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes without style conflicts

## Notes
- Using Zustand with `persist` middleware for localStorage caching of Portfolio and Orders.
- Zustand selectors are used to prevent global re-renders on the 1000ms price tick.
- The chart is implemented strictly with Native SVG (no external libraries).
- `Ticker`, `Order`, `Portfolio` types assume a client-side shape since there is no backend DB integration needed for the MVP.
