# PERFORMANCE.md

## 1-Second Update Interval & UI Responsiveness

### Approach
- The price engine updates ticker prices every 1 second using a `setInterval` in `Terminal.tsx`.
- All price updates are handled in the global Zustand store (`useTradingStore.ts`).

### State Management
- **Zustand selectors**: Components subscribe only to the specific slices of state they need (e.g., `prices`, `portfolio`, `orders`).
- **No global re-renders**: Only components affected by the updated state re-render, not the entire dashboard.

### React Optimization
- **useMemo**: Used in chart components (`NativeChart.tsx`, `Sparkline.tsx`) to recalculate SVG paths only when price data changes.
- **useRef**: Used for transient UI effects (e.g., price flash) without triggering full re-renders.

### Result
- The dashboard remains highly responsive even as prices update every second.
- UI animations and chart rendering are smooth, with no lag or jank.
- State changes are efficiently propagated, minimizing unnecessary renders.

### Summary
- Efficient state management and memoization ensure that frequent updates do not degrade UI performance.
- The architecture supports real-time updates and a professional trading terminal experience.
