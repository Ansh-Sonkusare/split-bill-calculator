# Split Bill Calculator — Stellar dApp

A decentralized bill-splitting app on Stellar Testnet. Split any bill evenly or with custom amounts, and pay everyone in a single on-chain transaction. Supports XLM and USDC.

## Features

- **Freighter Wallet** — connect/disconnect with auto-reconnect
- **Dual Currency** — pay in XLM or USDC
- **Even & Custom Splits** — equal split or per-participant amounts
- **Bill Templates** — quick-start presets for dinner, rent, travel, groceries, subscriptions
- **Batch Payments** — multiple recipients in one Stellar transaction
- **Bill History** — past bills persisted in localStorage with settlement status
- **Settlement Tracking** — per-participant settled/pending with tx links

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | TanStack Query (server/async) + Zustand (UI wizard) |
| Blockchain | Stellar SDK, Stellar Testnet |
| Wallet | Freighter Browser Extension |

## Getting Started

### Prerequisites

1. Install [Freighter](https://freighter.app/) browser extension
2. Create/import a wallet on Stellar Testnet
3. Fund it with testnet XLM from [Stellar Friendbot](https://friendbot.stellar.org/)

### Install & Run

```bash
git clone https://github.com/Ansh-Sonkusare/split-bill-calculator.git
cd split-bill-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Connect** your Freighter wallet
2. **Pick a template** (or start custom) — sets currency and participant count
3. **Enter the bill** — total amount in XLM or USDC
4. **Add participants** — paste Stellar addresses (G...)
5. **Review the split** — see per-person amounts
6. **Send** — one batch transaction pays everyone
7. **Track** — bill appears in history with settlement status

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (QueryProvider)
│   ├── page.tsx              # Main page — wizard + history
│   └── globals.css
├── components/
│   ├── BalanceDisplay.tsx    # XLM + USDC balance
│   ├── BillForm.tsx          # Form with template picker + currency selector
│   ├── BillHistory.tsx       # Past bills list
│   ├── Navbar.tsx            # Header with balance + wallet
│   ├── SplitSummary.tsx      # Review before sending
│   ├── TransactionResult.tsx # Success/error display
│   └── WalletConnect.tsx     # Connect/disconnect button
├── hooks/
│   ├── useWallet.ts          # TanStack Query — wallet + balance
│   └── useBills.ts           # TanStack Query — bill CRUD (localStorage)
├── stores/
│   └── billFlowStore.ts      # Zustand — wizard state machine
├── providers/
│   └── QueryProvider.tsx     # TanStack Query client provider
└── lib/
    ├── stellar.ts            # Stellar SDK — payments, balances, USDC asset
    ├── freighter.ts           # Freighter wallet integration
    ├── storage.ts            # localStorage CRUD for bills
    └── templates.ts          # Bill template definitions
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

## License

MIT
