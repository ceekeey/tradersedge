AGENT.md — Traders Edge Development Rules

Project Goal

Build Traders Edge as a reliable personal trading operating system.

The implementation must prioritize:

Real market data

Correct API integration

Stable chart rendering

Clean architecture

Incremental milestones

No fake or guessed trading data

Core Development Rules

1. Work milestone-by-milestone

Never implement several major trading features at once.

The current roadmap is:

📈 Milestone 1 — One real Deriv chart

🔎 Milestone 2 — Dynamic symbols

🔴 Milestone 3 — Live price streaming

⭐ Milestone 4 — Watchlist

⏱️ Milestone 5 — Timeframe switching (1H/4H/etc.)

📊 Milestone 6 — 4H/1H zone strategy tools

💱 Milestone 7 — Trading/order integration

A milestone is not complete until its acceptance criteria are verified.

Do not start the next milestone just because the code compiles.

Milestone 1 — One Real Deriv Chart

Objective

Get ONE real Deriv market displaying real historical candlestick data in TradingView Lightweight Charts.

Flow:

Deriv WebSocket
↓
Valid Deriv symbol
↓
Historical candle request
↓
Real OHLC data
↓
Lightweight Charts
↓
Visible candlestick chart

Rules

Use the currently documented Deriv API.

Use a real, verified Deriv symbol.

Never invent symbol identifiers.

Never use fake candle data.

Never use hard-coded fake prices.

Do not make active_symbols dynamic discovery a dependency until the basic chart pipeline is proven.

Preserve the existing dark/gold Traders Edge visual language.

Keep ChartSection.jsx focused on chart responsibilities.

Acceptance Criteria

Milestone 1 is complete only when:

Deriv WebSocket connects.

A valid real symbol is confirmed.

ticks_history successfully returns candles.

OHLC data is converted correctly.

Lightweight Charts renders the candles.

The chart is responsive.

Errors are visible and actionable.

No fake market data is used.

Milestone 2 — Dynamic Symbols

Objective

Retrieve real symbols directly from Deriv and allow the user to select them.

Flow:

Deriv
↓
active_symbols
↓
Normalize response
↓
Symbol list
↓
Dropdown/search
↓
Selected symbol
↓
Chart

Rules

Use the current official Deriv API documentation.

Do not rely on outdated examples.

Do not guess response fields.

Log the raw API response when debugging.

Do not filter symbols until the actual response schema is understood.

Never replace missing API data with fake symbols.

The chart must use the exact symbol identifier returned by Deriv.

Example concept:

{
symbol: "...",
name: "..."
}

The exact fields must come from the current API response.

Acceptance Criteria

Real Deriv symbols populate the UI.

Symbol display names are correct.

Symbol identifiers are correct.

Selecting a symbol loads its real chart.

Invalid symbols are handled gracefully.

Milestone 3 — Live Price Streaming

Objective

Stream real-time prices and update the active candle.

Flow:

Deriv tick stream
↓
Current price
↓
Current 1H candle
↓
series.update()

Rules

Use real Deriv tick data.

Do not poll unnecessarily when WebSocket streaming is available.

Do not recreate the entire chart for every tick.

Use series.update() for live candle updates.

Correctly calculate the candle bucket from the tick timestamp.

Clean up subscriptions when changing symbols or unmounting.

Acceptance Criteria

Current price updates in real time.

Current candle updates without flickering.

No duplicate subscriptions.

Switching symbols does not leave stale streams running.

WebSocket cleanup is reliable.

Milestone 4 — Watchlist

Objective

Create a real watchlist powered by the same market-data layer.

Each watchlist item should support:

Symbol

Display name

Current price

Price movement/change where supported

Selection

Loading state

Error state

Rules

Watchlist data must come from the market-data layer.

Do not duplicate WebSocket logic unnecessarily.

Do not hard-code prices.

Avoid creating one independent connection per symbol unless technically required.

Prefer a reusable market-data service/hook.

Acceptance Criteria

User can add/remove supported symbols.

Watchlist prices are real.

Clicking an item changes the chart symbol.

No stale data remains after symbol changes.

Milestone 5 — Timeframe Switching

Objective

Support multiple chart timeframes.

Initial targets:

1H

4H

Potential future targets:

5m

15m

30m

1D

Rules

Use the correct Deriv candle granularity for each timeframe.

Do not fabricate higher-timeframe candles unless there is a clear technical reason to aggregate them locally.

Preserve chart state where practical.

Changing timeframe must reload/transform data correctly.

Live updates must use the selected timeframe.

Acceptance Criteria

1H chart works.

4H chart works.

Switching timeframe does not create duplicate WebSockets.

Candle boundaries are correct.

Live candle updates remain correct.

Milestone 6 — 4H/1H Zone Strategy Tools

Objective

Build chart tools around the Traders Edge 4H/1H zone strategy.

The strategy layer should eventually support:

Higher-timeframe analysis

4H zones

1H zones

Zone marking

Zone boundaries

Entry areas

Risk/reward visualization

Relevant price levels

Strategy notes

Rules

Keep strategy logic separate from raw market-data logic.

Do not mix Deriv API code with zone calculations.

Strategy calculations must be deterministic.

Never silently alter user-defined strategy rules.

Do not present strategy calculations as guaranteed predictions.

Keep chart overlays performant.

Acceptance Criteria

4H analysis can be displayed.

1H analysis can be displayed.

Zones can be created/edited/removed.

Zones remain associated with the correct symbol/timeframe.

Chart performance remains smooth.

Milestone 7 — Trading / Order Integration

Objective

Connect the platform to actual Deriv trading functionality only after the market-data and chart layers are stable.

Potential functionality:

Account authentication

Balance

Contract/order creation

Position state

Order status

Trade history

Risk controls

Rules

Safety first

Trading functionality must never silently submit an order.

Before sending an order:

Confirm the selected symbol.

Confirm direction.

Confirm stake/amount.

Confirm contract/order parameters.

Confirm account/environment.

Show a clear user confirmation step where appropriate.

API rules

Use the current official Deriv API documentation.

Never expose sensitive authentication tokens in frontend source code.

Never commit secrets to Git.

Never log authentication tokens.

Never hard-code account credentials.

Error handling

Every trading request must handle:

API errors

Network errors

Authentication errors

Invalid symbols

Invalid parameters

Insufficient funds

Timeouts

Connection loss

Never assume an order succeeded because the request was sent.

Only treat an order as successful after receiving and validating the appropriate Deriv response.

Architecture Rules

Separation of responsibilities

Prefer this architecture:

components/
ChartSection.jsx
TradePanel.jsx
SidebarPanel.jsx

services/
deriv/
websocket.js
marketData.js
trading.js

hooks/
useDerivSymbols.js
useDerivTicks.js
useDerivCandles.js

utils/
candles.js
symbols.js

The exact folder structure may evolve.

Do not create files unnecessarily.

ChartSection responsibilities

ChartSection should primarily handle:

Chart lifecycle

Chart rendering

Selected market

Selected timeframe

Display state

Chart-specific interactions

It should not become a giant file containing:

Authentication

Trading execution

Database operations

Watchlist persistence

Every Deriv API request

Strategy calculations

Move reusable API logic into appropriate services/hooks as the project grows.

Deriv API Rules

Official documentation first

When working with Deriv:

Check the current official documentation.

Verify request schema.

Verify response schema.

Verify endpoint.

Verify symbol identifiers.

Test the smallest possible request.

Only then integrate into React.

Never assume an old Deriv API example is still correct.

Debugging

Always distinguish between:

WebSocket connection problem
API request problem
API response problem
Data transformation problem
Chart rendering problem
React lifecycle problem

Do not fix one by hiding another.

When debugging WebSockets, log:

CONNECT
REQUEST
RAW RESPONSE
PARSED RESPONSE
ERROR
CLOSE

Do not only log generic:

Event { isTrusted: true }

React Rules

Effects

Keep useEffect dependencies correct.

Clean up WebSockets.

Prevent stale callbacks from updating state.

Account for React Strict Mode during development.

Never disable Strict Mode merely to hide lifecycle bugs.

State

Keep state minimal.

Do not store values in React state if they can safely live in refs or derived values.

Avoid unnecessary re-renders of the chart.

Lightweight Charts Rules

Use the installed TradingView Lightweight Charts package.

The chart must:

Resize with its container.

Clean itself up on unmount.

Avoid unnecessary recreation.

Use candlestick series for OHLC data.

Use Unix timestamps in the format expected by the installed version.

Receive validated numeric OHLC values.

Handle empty datasets gracefully.

Never pass malformed candle objects into the series.

Error Handling Rules

Errors must be meaningful.

Prefer:

Deriv API error: InvalidSymbol — ...

over:

Something went wrong.

For WebSocket errors, log:

{
code,
reason,
wasClean
}

when available.

Never swallow errors silently.

Never fake successful state after an error.

Data Integrity Rules

This is a trading application.

Therefore:

REAL DATA ONLY.

Never:

fabricate prices

fabricate candles

fabricate symbols

fabricate balances

fabricate orders

fabricate positions

fabricate trade results

Mock data may only be used when explicitly requested for UI development and must be clearly marked as mock data.

Security Rules

Never put:

API tokens

private keys

passwords

secret credentials

inside:

React source code

Git commits

console logs

public environment variables

If an API credential is required in the browser, verify the provider's recommended authentication architecture first.

Code Quality Rules

Before changing code:

Understand the current implementation.

Identify the actual failure.

Make the smallest appropriate change.

Test the affected flow.

Check for regressions.

Explain what changed.

Do not rewrite unrelated components just because a bug exists in one component.

Avoid unnecessary dependencies.

Reuse existing packages before adding new ones.

UI / Design Rules

Traders Edge should remain:

Clean

Focused

Premium

Calm

Technical

Minimal

Existing visual language:

Dark interface

Gold accent

Green positive state

Red negative/error state

Subtle borders

Rounded panels

Dense but readable trading UI

Do not introduce random colors or unrelated design systems.

Use the existing project conventions before adding new UI libraries.

Agent Workflow

For every task:

Step 1 — Inspect

Understand:

Existing files

Existing architecture

Existing dependencies

Current API integration

Current errors

Step 2 — Verify

If an external API is involved:

Read current official documentation.

Verify the exact request.

Verify the exact response.

Step 3 — Plan

State:

Root cause

Files that need modification

Minimal implementation approach

Step 4 — Implement

Make focused changes.

Step 5 — Test

Verify:

Build

Runtime

Browser console

Network/WebSocket behavior

UI behavior

Step 6 — Report

Report:

What changed

Why it changed

What was tested

Any remaining issue

Which milestone is now complete

Anti-Patterns

Never do these:

❌ Guess Deriv symbols
❌ Use fake market prices
❌ Hide API errors
❌ Disable React Strict Mode to hide bugs
❌ Rewrite the whole application for a small bug
❌ Add dependencies without a reason
❌ Put all API logic inside ChartSection
❌ Create duplicate WebSocket connections unnecessarily
❌ Claim a milestone is complete without testing
❌ Assume a WebSocket request succeeded because send() executed
❌ Assume an order succeeded because the request was sent
❌ Expose secrets in frontend code
❌ Use outdated API documentation without verification

Definition of Done

A feature is DONE only when:

The implementation works.

The implementation uses real data where required.

Errors are handled.

Cleanup is correct.

The UI behaves correctly.

Existing functionality is not unnecessarily broken.

The implementation follows the current architecture.

The relevant milestone acceptance criteria are satisfied.

If something cannot be verified, explicitly say:

NOT VERIFIED

Do not claim success without evidence.

Current Priority

🔴 CURRENT MILESTONE: 1

Get one real Deriv chart running with Lightweight Charts.

Do not move to:

dynamic symbols

watchlist

timeframe switching

strategy tools

trading

until Milestone 1 is working reliably.

The immediate target is:

ONE REAL DERIV SYMBOL
↓
REAL HISTORICAL OHLC
↓
LIGHTWEIGHT CHART
↓
VISIBLE CANDLESTICKS
