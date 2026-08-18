# Interfaces — split-bill-calculator

Last updated: 2026-08-18
**This is the single source of truth for all cross-boundary interactions.**

## Canonical Types

```typescript
// src/lib/stellar.ts
type Currency = "XLM" | "USDC";

interface Balances {
  xlm: string;
  usdc: string;
}

interface Recipient {
  address: string;
  amount: string; // decimal string for Stellar SDK
}

// src/lib/storage.ts
interface BillSplit {
  participant: string; // Stellar public key
  share: number; // calculated amount owed
  paid: boolean; // settled on-chain
  settledVia?: string; // transaction hash if settled
}

interface Bill {
  id: string; // bill_{timestamp}_{random}
  description: string;
  amount: number;
  currency: Currency;
  createdAt: string; // ISO 8601
  createdBy: string; // Stellar public key of creator
  splits: BillSplit[];
  settled: boolean; // true when all splits are paid
}

// src/lib/templates.ts
interface BillTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  defaultCurrency: Currency;
  suggestedSplits: number;
}
```

## Context Providers (3 layers)

```
WalletContext   — wallet auth + dual balance (connect, disconnect, refreshBalance, xlmBalance, usdcBalance)
BillContext     — bill persistence (bills, addBill, markSettled, deleteBill)
BillFlowContext — wizard state machine (step, form data, currency, tx result, send, reset)
```

**Provider order in layout.tsx:**
WalletProvider → BillProvider → BillFlowProvider

**Why 3 contexts:** Each owns a single concern. WalletContext = external service integration. BillContext = data persistence. BillFlowContext = transient UI state for the create-bill wizard. No god context, no prop drilling.

## Flow State Machine

```
FORM → CALCULATE → SUMMARY → send → RESULT
                 ← GO_BACK ←
RESULT → RESET → FORM
```

## API Contracts

```
No server API — all operations are client-side.
Stellar on-chain transactions via Freighter:
  Payment { destination, amount, asset } → TransactionResult
  Supported assets: XLM (native), USDC (testnet issuer)
```

## Storage

```
localStorage key: "split-bills-history"
Max bills: 50 (oldest pruned)
```

## Error Codes

| Code | Meaning |
|---|---|
| WALLET_NOT_CONNECTED | Freighter wallet not connected |
| WALLET_NOT_INSTALLED | Freighter extension not detected |
| INSUFFICIENT_BALANCE | Not enough funds to settle |
| NETWORK_ERROR | Stellar network unreachable |
| INVALID_SPLIT | Custom amounts don't sum to total |

## Naming Conventions

- Types: PascalCase
- Fields: camelCase
- Contexts: `{Name}Context` + `{Name}Provider` + `use{Name}` hook
- Components: PascalCase

## Breaking Changes

_(log any breaking changes here with date)_
