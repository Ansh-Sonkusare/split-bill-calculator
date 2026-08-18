# Architecture — split-bill-calculator

Last updated: 2026-08-18

## Overview

A Next.js 16 single-page application that lets users create bills, split costs among participants, and settle debts via Stellar blockchain payments. The app is fully client-side with no traditional backend — bill data is stored locally and settlements happen on-chain via Freighter wallet integration.

## Components

| Component | Responsibility | Tech |
|---|---|---|
| Bill Creator | Form to create and split bills | React 19, Tailwind CSS 4 |
| Balance Tracker | Aggregate who owes whom | React state + local storage |
| Settlement Engine | Execute Stellar payments | @stellar/stellar-sdk, Freighter |
| Wallet Connector | Auth and sign transactions | @stellar/freighter-api |

## Data Flow

1. User connects Stellar wallet via Freighter
2. User creates a bill — enters amount, description, participants
3. App calculates per-person share and tracks who paid
4. Balance engine aggregates debts across all bills
5. User initiates settlement — app signs and submits Stellar payment
6. Transaction confirmed on-chain, balances updated

## Constraints

- No server-side storage — all data lives in the browser (localStorage)
- Stellar network fees apply to each settlement transaction
- Freighter extension must be installed for wallet interaction
- Settlement only works with wallets on Stellar public network

## Failure Modes

- If Freighter not installed → prompt user to install, degrade gracefully
- If Stellar network is down → queue settlements, show pending status
- If localStorage is cleared → bill history is lost (v1 accepted risk)

## Security Assumptions

- Freighter handles key management — app never sees private keys
- All settlement transactions are signed client-side
- No sensitive data stored server-side (no server exists)
