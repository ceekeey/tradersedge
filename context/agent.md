# AGENT.md — Traders Edge Development Rules & Execution Guidelines

## 🎯 Project Goal

Build **Traders Edge** as a reliable, high-performance, dark-themed personal trading operating system.

The implementation MUST prioritize:

- Real market data (Deriv API WebSocket integration)
- Accurate API contracts & payload schemas
- Stable, leak-free chart rendering
- Clean, modular component architecture
- Incremental milestone validation
- ZERO fake, guessed, or silently fallback trading data

---

## 🛑 NON-DESTRUCTIVE REFACTORING RULES (STRICT)

1. **DO NOT TOUCH OR REWRITE EXISTING WORKING LOGIC**
   - Never delete, rewrite, or alter existing WebSocket event handlers (`onmessage`, `onopen`, `onclose`), active tick subscriptions, price calculations, order execution logic, or data-fetching hooks unless directly requested to fix a verified bug within that specific function.
   - Layout, UI, and structural refactoring MUST be non-destructive. Wrap changes around existing structures using Tailwind wrappers or custom design utility classes.

2. **ISOLATED AND TARGETED EDITS**
   - Make the smallest possible change to achieve a task.
   - Do NOT rewrite an entire component, file, or sibling module just to apply minor styling changes or fix an isolated issue.

3. **PROGRESS & CRASH RECOVERY LOGGING (`progress.md`)**
   - Before executing complex tasks or milestone shifts, inspect the codebase and update/create `progress.md` in the project root/context directory.
   - Document: Active Milestone, Current Completed Tasks, Modified Files, Unresolved Errors, and the **Exact Next Step**.
   - If an error, API rate limit, or context timeout occurs, resume directly by reading `progress.md`.

---

## 🎨 DESIGN SYSTEM & UI COLOR SCHEME (`index.css` & Tokens)

Maintain the calm, technical dark UI visual language. Use CSS Variables / Design System Utility Classes from `index.css`:

### Design System CSS Variables & Utility Mapping

- **App Background (`--app-bg: #070707`):** Utility `.bg-app-bg` or Tailwind `bg-[#070707]`
- **Primary Surface (`--surface: #0d0d0d`):** Utility `.bg-surface` or Tailwind `bg-[#0d0d0d]`
- **Elevated Surface (`--elevated-surface: #151515`):** Utility `.bg-elevated` / `.card-surface` or Tailwind `bg-[#151515]`
- **Primary Border (`--border: #29251b`):** Utility `.border-primary` / `.muted-divider` or Tailwind `border-[#29251b]`
- **Primary Gold (`--gold: #d4af37`):** Utility `.text-gold`, `.bg-gold`, `.btn-primary`, or Tailwind `text-[#d4af37]` / `bg-[#d4af37]`
- **Light Gold Hover (`--gold-hover: #e5c76b`):** Utility `.text-gold-hover:hover`, `.bg-gold-hover:hover`, `.btn-primary:hover`
- **Primary Text (`--text-primary: #f5f5f0`):** Utility `.text-primary` or Tailwind `text-[#f5f5f0]`
- **Muted Text (`--text-muted: #6f6f68`):** Utility `.text-muted` or Tailwind `text-[#6f6f68]`
- **Positive / Bullish / Win:** `#10B981` (`text-[#10B981]`, `bg-[#10B981]`) / `emerald-400`
- **Negative / Bearish / Loss:** `#EF4444` (`text-red-400`, `bg-red-500`) / `rose-400`

### Focus & Utility Helpers

- Use `.focus-gold` for keyboard navigation focus outlines.
- Use `.accent-dot` for gold indicator badges.
- All UI panels should feature custom dark gold scrollbars as configured in `index.css`.

### Typography & Density Rules

- High-density layout: Preferred font sizes are `text-[10px]`, `text-[11px]`, and `text-xs`.
- Monospace numbers: Numerical prices, PnL values, timestamps, and chart metrics MUST use `font-mono`.
- Compact padding: Standard inner panel padding should range from `p-2` to `p-4` to maximize workspace area.

---

## 📈 MILESTONE ROADMAP & ACCEPTANCE CRITERIA

Work strictly milestone-by-milestone. Do NOT skip ahead because code compiles.

- [ ] **Milestone 1 — One Real Deriv Chart**
  - Connect Deriv WS (`wss://api.derivws.com/trading/v1/options/ws/public`).
  - Request `ticks_history` for a valid symbol (e.g., `R_100` / `1HZ100V`).
  - Render real OHLC candles using TradingView Lightweight Charts.
  - Chart auto-resizes via `ResizeObserver` without stretching.

- [ ] **Milestone 2 — Dynamic Symbols**
  - Fetch `active_symbols` directly from Deriv WS API.
  - Populate dynamic symbol dropdown/search.
  - Selecting a symbol re-renders the chart with the new market data.

- [ ] **Milestone 3 — Live Price Streaming**
  - Subscribe to real-time tick stream (`subscribe: 1`).
  - Update current active candle in real-time using `series.update()`.
  - Properly clean up sockets on symbol change or component unmount.

- [ ] **Milestone 4 — Watchlist**
  - Build market watchlist sidebar using real WebSocket feeds.
  - Support symbol name, price ticker, dynamic change %, and selection.

- [ ] **Milestone 5 — Timeframe Switching (1M, 15M, 1H, 4H, 1D)**
  - Map UI timeframes to Deriv granularity in seconds (`1M`=60, `15M`=900, `1H`=3600, `4H`=14400, `1D`=86400).
  - Re-subscribe candle feeds smoothly when switching timeframes without duplicate sockets.
  - Retain execution price overlay lines (Entry/Exit) across timeframe switches.

- [ ] **Milestone 6 — 4H/1H Zone Strategy Tools**
  - Implement strategy overlays, demand/supply zones, and risk-reward calculation tools.

- [ ] **Milestone 7 — Order Execution & Account Integration**
  - Deriv OAuth account authentication, balance display, and safe contract execution.

---

## 🏗️ ARCHITECTURE & DECOUPLING RULES

Maintain standard separation of concerns:
