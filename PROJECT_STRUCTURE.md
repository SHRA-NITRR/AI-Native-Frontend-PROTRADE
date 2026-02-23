# Project Structure Diagram

```
AI-Native-Frontend/
├── README.md
├── PROJECT_STRUCTURE.md
├── package.json
├── tsconfig.json
├── jest.config.cjs
├── .gitignore
├── client/
│   ├── index.html
│   ├── index.css
│   └── src/
│       ├── components/
│       │   ├── ChartPanel.tsx
│       │   ├── PortfolioPanel.tsx
│       │   ├── OrdersPanel.tsx
│       │   ├── WatchlistPanel.tsx
│       │   ├── OrderEntryPanel.tsx
│       │   ├── NativeChart.tsx
│       │   ├── PriceFlash.tsx
│       │   ├── Sparkline.tsx
│       │   └── ui/
│       │       └── ... (UI primitives)
│       ├── hooks/
│       │   └── use-toast.ts
│       ├── lib/
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       ├── pages/
│       │   ├── Terminal.tsx
│       │   └── not-found.tsx
│       ├── store/
│       │   └── useTradingStore.ts
│       └── main.tsx
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── static.ts
│   ├── vite.ts
│   └── db.ts (removed logic)
├── shared/
│   ├── schema.ts
│   └── routes.ts
├── __tests__/
│   └── orderExecution.test.ts
├── script/
│   └── build.ts
├── attached_assets/
│   └── ... (images, icons)
├── components.json
├── tailwind.config.ts
├── vite.config.ts
├── .replit
```

**Legend:**
- `client/` — Frontend UI and state
- `server/` — Backend server
- `shared/` — Shared types/schema
- `__tests__/` — Unit tests
- `script/` — Build scripts
- `attached_assets/` — Static assets

This diagram shows the modular layout and separation of concerns for easy navigation and scaling.
# Project Structure

This document explains the folder and module layout for the AI-Native-Frontend PROTRADE project.

## Root
- `README.md` — Project overview and instructions
- `PROJECT_STRUCTURE.md` — This file
- `.gitignore` — Git ignored files
- `package.json` — Project dependencies and scripts
- `tsconfig.json` — TypeScript configuration
- `jest.config.cjs` — Jest config for TypeScript tests

## Main Folders

### `client/`
- **Purpose:** React frontend application
- **Key subfolders:**
  - `src/` — Main source code
    - `components/` — UI components (ChartPanel, WatchlistPanel, PortfolioPanel, etc.)
      - `ui/` — Reusable UI primitives (button, dialog, table, etc.)
    - `hooks/` — Custom React hooks
    - `lib/` — Utilities (queryClient, utils)
    - `pages/` — Page components (Terminal, not-found)
    - `store/` — Zustand state management (useTradingStore)
  - `index.html` — Entry HTML file
  - `index.css` — Global styles

### `server/`
- **Purpose:** Express backend server
- **Files:**
  - `index.ts` — Main server entry
  - `routes.ts` — API route registration
  - `static.ts` — Static file serving
  - `vite.ts` — Vite dev server integration

### `shared/`
- **Purpose:** Shared types and schema between client and server
- **Files:**
  - `schema.ts` — Type definitions for Ticker, Order, Portfolio, PriceData
  - `routes.ts` — Shared API route definitions

### `__tests__/`
- **Purpose:** Unit tests
- **Files:**
  - `orderExecution.test.ts` — Tests for order execution logic

### `attached_assets/`
- **Purpose:** Static assets (images, icons, etc.)

### `script/`
- **Purpose:** Build scripts
- **Files:**
  - `build.ts` — Custom build logic for client/server

## Other Files
- `components.json` — shadcn/ui config
- `tailwind.config.ts` — Tailwind CSS config
- `vite.config.ts` — Vite build/dev config
- `.replit` — Replit deployment config

## Summary
- **Client:** All UI and state logic
- **Server:** API and static serving
- **Shared:** Types and schemas for type safety
- **Tests:** Unit tests for business logic

This structure supports modular development, clear separation of concerns, and easy scaling for new features.
