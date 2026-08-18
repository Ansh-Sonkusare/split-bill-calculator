# Roadmap — split-bill-calculator

Last updated: 2026-08-18
Current phase: building

## Phase 1: Planning & Architecture
**Deliverable**: PRD, architecture doc, type definitions, decisions logged
**Exit criteria**:
- [x] PRD finalized with MVP scope
- [x] Architecture decisions documented
- [x] Core types defined in interfaces.md
- [x] Roadmap updated with build phases

## Phase 2: Core UI
**Deliverable**: Bill creation form, bill list, balance summary
**Exit criteria**:
- [x] Bill creation form with amount, description, participants
- [x] Split summary view with review before sending
- [x] Balance summary showing wallet balance
- [x] Responsive layout working on mobile

## Phase 3: Stellar Integration
**Deliverable**: Wallet connection and on-chain settlements
**Exit criteria**:
- [x] Freighter wallet connect/disconnect
- [x] Display connected wallet address and balance
- [x] Initiate Stellar payment from split summary
- [x] Transaction confirmation and status display

## Phase 4: Polish & Ship
**Deliverable**: Production-ready app
**Exit criteria**:
- [x] Error handling for all failure modes
- [x] Loading states and empty states
- [x] Linting passes (`npm run lint`)
- [x] Build succeeds (`npm run build`)

## Phase 5: Bill History & State Management
**Deliverable**: Persistent bill history, centralized state
**Exit criteria**:
- [x] localStorage persistence for bills
- [x] Bill history component with settled/pending status
- [x] Per-participant settlement tracking with tx links
- [x] Custom split mode (even / custom amounts)
- [x] Description field on bills
- [x] Centralized state management (BillFlowContext with useReducer)
- [x] 3-context architecture (Wallet, Bill, BillFlow)
- [x] Next.js 16 compatibility verified

## Phase 6: USDC & Templates
**Deliverable**: Multi-currency support and bill presets
**Exit criteria**:
- [x] USDC currency selector in bill form
- [x] Dual balance display (XLM + USDC)
- [x] Bill templates (dinner, groceries, rent, travel, subscriptions)
- [x] Template picker in bill form

## Phase 7: Deploy & Test
**Deliverable**: Live app on Stellar Testnet
**Exit criteria**:
- [ ] Deployed to Vercel
- [ ] End-to-end testing on testnet
- [ ] User feedback collected

## Parking Lot

- Recurring bill automation
- Export to CSV/PDF
- Mobile native app
- Multi-wallet support (other than Freighter)
- Bill sharing via URL/link
