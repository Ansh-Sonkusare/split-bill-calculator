# Tech Stack — split-bill-calculator

Last updated: 2026-08-18

## Core Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: None (client-side only)
- **Database**: localStorage (browser)
- **Blockchain**: Stellar (XLM / USDC via @stellar/stellar-sdk)
- **Wallet**: Freighter (@stellar/freighter-api)

## Development Environment

- **Package manager**: npm
- **Node version**: 18+ (Next.js 16 requirement)
- **Setup steps**:
  1. `npm install`
  2. `npm run dev`
  3. Install Freighter browser extension for wallet features

## Configuration

- Env vars: none required for v1
- Secrets handling: no secrets — Freighter handles key management client-side
- Network: Stellar public network (default)

## Key Dependencies

| Package | Purpose |
|---|---|
| next | React framework and dev server |
| react / react-dom | UI rendering |
| @stellar/stellar-sdk | Stellar blockchain interactions |
| @stellar/freighter-api | Wallet connection and transaction signing |
| tailwindcss | Utility-first CSS |
| typescript | Type safety |
