# Decisions

Decision log with context and consequences.

## Format

### Decision {{NNN}}: {{title}}
- **Date**: {{YYYY-MM-DD}}
- **Context**: {{why this came up}}
- **Options**: {{what was considered}}
- **Decision**: {{what was chosen}}
- **Consequences**: {{what this means going forward}}

## Log

### Decision 001: No backend — client-side only
- **Date**: 2026-08-18
- **Context**: Need to decide on architecture for bill storage and settlement
- **Options**: (1) Next.js API routes + database, (2) Client-side with localStorage + Stellar
- **Decision**: Client-side only — localStorage for bill history, Stellar for settlements
- **Consequences**: Simpler architecture, no server costs, but data loss risk if localStorage cleared. Acceptable for v1.

### Decision 002: Stellar for settlement
- **Date**: 2026-08-18
- **Context**: Need a payment rail for settling debts
- **Options**: (1) Stellar (XLM/USDC), (2) Mock/simulated payments
- **Decision**: Stellar via Freighter — real on-chain payments
- **Consequences**: Requires Freighter extension, network fees apply, but provides real settlement capability

### Decision 003: Centralized state management via React Context
- **Date**: 2026-08-18
- **Context**: page.tsx accumulated 8+ useState calls for form wizard (step, totalAmount, description, participants, customAmounts, isSending, txStatus, txHash, txError). As features grew (custom splits, descriptions, bill history), scattered state became unmaintainable.
- **Options**: (1) Keep useState + prop drilling, (2) useReducer in page.tsx, (3) Dedicated BillFlowContext with reducer
- **Decision**: BillFlowContext using useReducer — single source of truth for the bill creation wizard flow. Keeps WalletContext and BillContext separate (wallet = auth/balance, bills = persistence, flow = wizard state).
- **Consequences**: page.tsx becomes thin (layout + routing). All wizard logic lives in BillFlowContext. Easier to add new steps/features without prop drilling. Three focused contexts instead of one god context.

### Decision 004: Next.js 16 compatibility confirmed
- **Date**: 2026-08-18
- **Context**: AGENTS.md warns about breaking changes in Next.js 16. Need to verify our code doesn't use deprecated/removed APIs.
- **Options**: (1) Ignore and hope for the best, (2) Review upgrade guide and verify
- **Decision**: Reviewed full version-16.md upgrade guide. No impact on this project — we don't use middleware, params, searchParams, cookies, images, or any removed APIs. `next lint` removal doesn't affect us (we use `eslint` directly). Turbopack is already default in our build.
- **Consequences**: No code changes needed. Project is fully compatible with Next.js 16.

### Decision 005: Mandatory agent coordination protocol
- **Date**: 2026-08-18
- **Context**: Previous sessions skipped protocol steps (didn't read status.md at start, didn't update it at end). Inconsistent adherence led to stale coordination files.
- **Options**: (1) Keep protocol as guidelines, (2) Make protocol mandatory with enforcement checklist
- **Decision**: Made protocol mandatory with explicit checklist in agents/agents.md. Added reference in AGENTS.md so every agent session sees it. Each step has a checkbox — agent must complete all before finishing.
- **Consequences**: Every session now starts by reading state and ends by updating it. Cross-boundary work requires interfaces.md update first. Decisions are logged before implementation. Build verification is required at session end.
