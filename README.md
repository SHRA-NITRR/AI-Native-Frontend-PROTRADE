# AI-Native-Frontend PROTRADE

A professional trading terminal for simulated "Paper Trading" with live price engine, custom SVG chart, and optimized state management.

## Features
- Mock Price Engine for BTC, ETH, SOL (random walk, 1s updates)
- Watchlist with live price and add/remove functionality
- Custom SVG chart (no visualization libraries)
- Trade execution (Buy/Sell, Limit Orders)
- Portfolio with instant updates and trade history
- State persisted in localStorage
- Unit tests for order execution logic

## Build & Run Instructions

### 1. Install dependencies
```
npm install
```

### 2. Start the development server
```
npm run dev
```
- The server will run on [http://localhost:5001](http://localhost:5001) (or the port specified in your environment)

### 3. Run tests
```
npm test
```
- Uses Jest and ts-jest for TypeScript unit tests

### 4. Build for production
```
npm run build
```

## Project Structure
- `client/` — React frontend (SVG chart, watchlist, portfolio, etc.)
- `server/` — Express backend (serves client, handles SSR/dev)
- `shared/` — Shared types and schema
- `__tests__/` — Unit tests

## Requirements
- Node.js >= 20.19.0
- No database required

## License
MIT
