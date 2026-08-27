# Traders Edge — Frontend Handoff

## Purpose

This document describes the existing React frontend and the API, routing, and layout contracts needed before backend work begins. The client is a Vite + React application using React Router, Tailwind CSS, and `react-hot-toast`.

The product is a personal trading operating system: real Deriv market data, trade execution safeguards, a trade journal, discipline tools, and account settings. The dark-and-gold visual language should be retained.

## Current frontend areas

| Area | Current route | Layout | Backend needs |
| --- | --- | --- | --- |
| Marketing landing page | `/` | Public marketing layout | None initially; optional public content/config later. |
| Sign in | `/signin` | Public auth layout | Session creation, validation errors, remember-me behavior, and social auth only when enabled. |
| Sign up | `/signup` | Public auth layout | Account creation, duplicate-email handling, terms/privacy acceptance, and verification state. |
| Forgot password | `/forgot-password` | Public auth layout | Password-reset request; always return a privacy-safe success response. |
| Reset password | `/reset-password` | Public auth layout | Token-based reset flow, invalid/expired token handling, and success redirect. |
| Dashboard home | `/dashboard` | `DashboardLayout` | User summary, recent executions, performance, and discipline-score data. |
| Trading terminal | `/dashboard/trade` | `DashboardLayout` | Deriv market data first; later orders, positions, pending orders, and order history. |
| Journal | `/dashboard/journal` | `DashboardLayout` | Paginated/filterable journal entries, calendar aggregates, and performance metrics. |
| Trade detail | `/journal/:id` (current) | `DashboardLayout` | One journal entry, screenshots, notes, metrics, and a not-found state. |
| Notes | `/dashboard/notes` | `DashboardLayout` | CRUD notes with category, period, search, and safe concurrent-save behavior. |
| Rules / playbook | `/dashboard/rules` | `DashboardLayout` | CRUD trading plans/rules, ordered lists, and image attachments if retained. |
| Sanctuary | `/dashboard/sanctuary` | `DashboardLayout` | Optional persistence for sessions, selected state, and timers; it must remain usable offline. |
| Profile/settings | `/dashboard/profile` | `DashboardLayout` | Profile, preferences, risk limits, credential handling, password change, and 2FA. |

## Route and authentication contract

All dashboard pages require an authenticated session. The frontend should have three auth states: loading/unknown, unauthenticated, and authenticated. It must not briefly render protected content while session validation is pending.

Use `/signin` as the canonical login route. The frontend currently contains stale references to `/login` in the landing page, reset-password page, and `ProtectedRoute`; these will otherwise resolve to the 404 page. Preserve the originally requested protected URL in `location.state.from` and redirect there after successful sign-in.

Recommended normalized route structure:

```text
/
/signin
/signup
/forgot-password
/reset-password?token=…
/dashboard
/dashboard/trade
/dashboard/journal
/dashboard/journal/:id
/dashboard/notes
/dashboard/rules
/dashboard/sanctuary
/dashboard/profile
*
```

The current detail route is `/journal/:id`, while its parent section is `/dashboard/journal`. Move it to `/dashboard/journal/:id`, or explicitly preserve and test the current route. The 404 page currently links to `/journal`, which is also not routed.

Authentication edge cases:

- Expired or revoked sessions must clear local client auth state and return users to `/signin` without a redirect loop.
- A user opening a reset link with a missing, malformed, used, or expired token needs an actionable error and a link to request another reset.
- Sign-in and sign-up submissions require disabled/loading states to prevent duplicates; server field errors should map to their inputs, with a non-field error for general failures.
- Logout must invalidate the session server-side where applicable, clear client state, close private streams, and navigate to `/signin`.
- Do not store Deriv access tokens, password-reset tokens, or API secrets in frontend source, logs, or query-string history. Prefer secure, httpOnly cookies for the app session.

## Layout requirements

### Public layouts

The landing page uses a responsive navbar, marketing sections, and footer. Its calls to action should use router links, not full-page anchors, for internal navigation.

Auth pages use a two-column desktop view with an image/feature panel and form panel. At mobile sizes, the visual column is hidden. Forms must scroll rather than clip when the viewport is short, the keyboard is open, error messages expand, or text is zoomed.

Legal links on sign-up currently target `#terms` and `#privacy`; provide real routes or modals before launch so acceptance is auditable.

### Dashboard layout

`DashboardLayout` is an application shell with:

- desktop collapsible left navigation;
- mobile off-canvas navigation and backdrop;
- persistent top bar for notifications, identity, and logout;
- independently scrolling main-content area.

Persist the user’s desktop sidebar preference locally if desired, but reset mobile drawer state on route changes. The mobile drawer must support Escape-to-close, focus management, and a visible accessible label. Avoid nesting scroll containers where page content needs to scroll naturally.

The top bar’s current display name, initials, role, notification badge, and “Deriv WS: Connected” indicator are placeholders. Their UI states must distinguish loading, connected, reconnecting, disconnected, unauthorized, and error; do not show a connected indicator merely because the layout has rendered.

### Trading-terminal layout

The trade screen composes a chart area, a right-side watchlist/alerts/trade-plan panel, and a collapsible bottom positions panel. It needs explicit behavior at narrow widths:

- define a stacked/mobile terminal layout so the chart retains a usable minimum height;
- preserve selected symbol, timeframe, panel tab, and collapsed states when panels resize or navigation occurs;
- make tables horizontally scrollable with key columns retained/readable;
- prevent collapsed panels from trapping keyboard focus in hidden controls;
- show empty, loading, reconnecting, and API-error states in every market-data panel.

The existing watchlist opens one WebSocket per hard-coded symbol and its prices/labels are presentation placeholders. Backend/market-data work should centralize connection ownership, use verified symbols, clean subscriptions on change/unmount, and never substitute fake data after an error.

## API and data expectations

Use a consistent envelope for JSON APIs, for example `{ data, error, meta }`, and return structured validation errors such as `{ field: "email", code: "invalid_email", message: "…" }`. Date-times should be ISO 8601 UTC; monetary values should carry a currency and decimal-safe representation; pagination should use a stable cursor or documented page scheme.

Suggested resource boundaries:

| Resource | Operations needed first |
| --- | --- |
| Auth/session | sign up, sign in, sign out, session lookup, password-reset request/confirm, password change, optional 2FA. |
| User/profile | read/update profile, preferences, risk defaults, notification preferences. |
| Journal entries | list with date/filter/search, calendar summary, read one, create, update, delete, attachments. |
| Notes | list/search, create, update, delete, categories. |
| Trading plans | list, read, create, update, archive/delete; ordered rule items. |
| Notifications | unread count, list, mark read/seen. |
| Market data | client-facing connection/status abstraction for verified Deriv symbols, candles, ticks, and watchlist quotes. |
| Trading (later milestone) | account state, order preview/confirmation, submit, order status, positions, and history. |

For journal and trade details, enforce ownership by authenticated user and return `404` for missing or inaccessible IDs. For list endpoints, return explicit empty results—not an error—and supply loading/error state information the UI can render.

## Trading and security constraints

- Real market data only: no fabricated prices, candles, symbols, positions, P/L, or successful order states.
- Follow the project’s Deriv milestones: establish one verified historical candlestick chart before dynamic symbols, streams, watchlists, timeframes, strategy tools, or order integration.
- Keep Deriv transport/market-data logic separate from React components and from strategy calculations.
- Later order submission must be explicit and confirm symbol, direction, amount/stake, order parameters, and account/environment. Treat an order as successful only after a validated provider response.
- Risk controls are server-enforced, not only UI hints. Validate limits, permissions, resource ownership, and every incoming field server-side.
- Encrypt sensitive provider credentials at rest if retained at all; redact credentials from errors and observability.

## Frontend cleanup items before integration

1. Replace all `/login` references with `/signin`.
2. Choose and implement the canonical trade-detail path; update journal links and the 404-page journal link accordingly.
3. Replace `ProtectedRoute`’s hard-coded `isAuthenticated = true` with session-aware loading and redirect logic.
4. Replace static UI data across dashboard, profile, rules, notes, journal, watchlist, and trade panels with explicit loading, empty, error, and populated states.
5. Remove the visible sample Deriv token from `Profile.jsx`; use a masked credential status and a dedicated secure update flow.
6. Turn landing-page internal anchors into React Router links.
7. Verify keyboard, focus, Escape, reduced-motion, small-screen, network-loss, and deep-link behavior for each layout.

## Backend-ready acceptance checks

Before backend setup is considered connected, verify that:

- direct navigation to every public and protected route behaves correctly;
- a deep link to a protected page returns to that page after sign-in;
- session expiry, logout, and password-reset failures have usable recovery paths;
- every API-backed panel shows loading, empty, validation-error, network-error, and retry states;
- journal/trade-detail IDs cannot expose another user’s records;
- dashboard navigation and terminal panels work at mobile, tablet, and desktop widths;
- market-data disconnects and invalid symbols are visible and actionable, with no fake fallback values.
