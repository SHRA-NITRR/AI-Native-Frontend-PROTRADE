# ARCHITECTURE.md

## Chart Rendering Logic

The chart is rendered using native SVG elements in the `NativeChart.tsx` and `Sparkline.tsx` components. Here’s how price data is converted into a visual line:

1. **Input:** An array of price values (e.g., `[64230.5, 64231.2, 64229.8, ...]`).
2. **Mapping:**
   - Each price is mapped to an (x, y) coordinate.
   - `x` is calculated based on the index in the array, scaled to the chart width.
   - `y` is calculated by normalizing the price within the min/max range, then inverting for SVG (higher price = lower y).
3. **Path Construction:**
   - The coordinates are joined into a string for the SVG `path` element, starting with `M` (move to) and then `L` (line to) for each subsequent point.
   - Example: `M 0,100 L 10,95 L 20,90 ...`
4. **Rendering:**
   - The SVG `<path>` is rendered with a stroke color and optional fill for area charts.
   - Grid lines and min/max labels are added for context.

**No visualization libraries are used. All logic is custom and uses React’s `useMemo` for performance.**

---

## Mock Price Engine

The mock price engine is implemented in the Zustand store (`useTradingStore.ts`).

1. **Random Walk Algorithm:**
   - Every second, a `tick` function updates each ticker’s price using a random walk (small random change based on volatility).
   - The new price is pushed to the price history array.
   - 24h change is calculated from the oldest value in the history.

2. **Global State Consistency:**
   - Zustand selectors are used so each component subscribes only to the relevant slice of state (e.g., `prices`, `portfolio`, `orders`).
   - The price engine updates the global store, and all components (Watchlist, Chart, Portfolio) read from the same source.
   - This ensures live data is consistent and synchronized across the dashboard.

3. **Performance:**
   - `useMemo` and Zustand selectors prevent unnecessary re-renders.
   - Only affected components update when prices change.

---

**Summary:**
- Chart rendering is custom, mapping price arrays to SVG paths.
- The mock price engine updates global state, ensuring live data consistency across all components.
- State management and memoization optimize performance and UI responsiveness.
