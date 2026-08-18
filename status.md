# Status — split-bill-calculator

Last updated: 2026-08-18
Current phase: building

## Completed

- Project scaffolding and agentic coordination repo
- Wallet connection via Freighter (connect, disconnect, auto-reconnect)
- Dual balance display (XLM + USDC) with refresh
- Bill creation form with amount + participant addresses
- Real-time split preview in form
- Split summary review screen
- Stellar batch payment TX construction
- Transaction signing and submission
- Transaction result display with explorer link
- Error handling (wallet, network, validation, insufficient balance)
- Loading states (connecting, sending, balance fetch)
- Landing page with "how it works" onboarding flow
- Navbar with wallet status and balance
- Bill history with localStorage persistence
- Custom split mode (even / custom amounts)
- Description field on bills
- Settlement tracking (per-participant settled/pending with tx links)
- USDC currency support (selector, dual balance, asset-aware transactions)
- Bill templates (dinner, groceries, rent, travel, subscriptions, custom)
- Template picker in bill form
- **State management refactor**: TanStack Query + Zustand (replaced 3 Context providers)

## Architecture

```
State management:
  TanStack Query  — wallet (balance, connection) + bills (localStorage CRUD)
  Zustand         — bill flow wizard (form state, step navigation, send)
  QueryProvider   — single provider in layout.tsx (replaces Wallet/Bill/BillFlow providers)

New hooks:
  src/hooks/useWallet.ts   — useWalletQuery() (connect, disconnect, balance, refresh)
  src/hooks/useBills.ts    — useBillsQuery() (bills, addBill, markSettled, deleteBill)
  src/stores/billFlowStore.ts — useBillFlowStore() (calculate, send, goBack, reset)
```

## In Progress

_(none)_

## Blocked

_(none)_

## Next

- Deploy to Vercel
- User testing on Stellar Testnet

## Daily Log

### 2026-08-18 — opencode
- **Done**: Built full MVP, USDC support, bill templates, state management refactor (TanStack Query + Zustand), renamed `.claude/` to `.opencode/`
- **Doing**: Session complete
- **Blocked**: none
- **Next**: Deploy, user testing

## Key Metrics

| Metric | Value |
|---|---|
| Features shipped | 11 (wallet, form, split, payments, results, history, custom splits, descriptions, settlement tracking, USDC, templates) |
| State management | TanStack Query (server/async) + Zustand (UI wizard) |
| Providers | 1 (QueryProvider — replaced 3 context providers) |
| Open blockers | 0 |
| Build status | passing (Next.js 16 + Turbopack) |
| Lint status | clean (excluding graft helpers) |

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| localStorage data loss | Low | Acceptable for v1 — users can recreate bills |
| Stellar testnet instability | Low | Horizon API is reliable; error handling in place |
| Freighter not installed | Medium | Clear onboarding prompt on landing page |

## Submission Checklist

- [x] All interfaces match implementation
- [x] status.md reflects reality
- [x] No unlogged decisions
- [x] No unresolved blockers
- [x] Next.js 16 breaking changes reviewed — no impact on this project
