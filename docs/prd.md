# Product Requirements — split-bill-calculator

Last updated: 2026-08-18

## Problem

Friends, roommates, and groups need an easy way to split bills fairly — tracking who paid what, who owes whom, and settling up, without manual math or awkward conversations.

## Opportunity

Existing solutions like Splitwise are bloated with features most users don't need. A lightweight, blockchain-native alternative on Stellar can offer transparency, instant settlement, and zero platform lock-in.

## Target Users

- Groups of friends splitting dinner, rent, or travel expenses
- Roommates managing shared household costs
- Small teams tracking project expenses

## MVP Scope

- Create bills with amount, description, and date
- Split a bill evenly among N participants
- Track who paid and who owes
- Settle debts via Stellar payments (USDC or XLM)
- View balance summary across all active bills

## Non-Goals (v1)

- Currency conversion
- Recurring bill automation
- Multi-currency support
- Photo receipt scanning
- Mobile app (web only for v1)

## Success Criteria

- Users can create and split a bill in under 30 seconds
- Balance calculations are accurate to 0.01
- Stellar settlement completes within 10 seconds
- No backend database required (client-side + Stellar)

## Out of Scope

- Anything that doesn't move the core metric
