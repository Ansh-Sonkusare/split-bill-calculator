# Split Bill Calculator - Stellar dApp

A decentralized application for splitting bills and sending XLM payments on the Stellar Testnet. Built with Next.js, TypeScript, Tailwind CSS, and integrated with Freighter wallet.

## Features

- **Wallet Integration**: Connect and disconnect Freighter wallet
- **Balance Display**: View your XLM balance in real-time
- **Bill Splitting**: Enter a total amount and split equally among participants
- **Batch Payments**: Send XLM to multiple participants in a single transaction
- **Transaction Feedback**: View transaction hash and status on Stellar Explorer

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Blockchain**: Stellar SDK, Stellar Testnet
- **Wallet**: Freighter Browser Extension

## Setup Instructions

### Prerequisites

1. Install [Freighter](https://freighter.app/) browser extension
2. Create or import a wallet on Stellar Testnet
3. Get testnet XLM from the [Stellar Friendbot](https://friendbot.stellar.org/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/split-bill-calculator.git

# Navigate to the project
cd split-bill-calculator

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Connect Wallet**: Click "Connect Freighter" to link your Stellar wallet
2. **Enter Bill Amount**: Input the total XLM amount to split
3. **Add Participants**: Enter Stellar addresses (G...) for each person
4. **Review Split**: See how much each participant will receive
5. **Send Payment**: Confirm and send XLM to all participants in one transaction

## Screenshots

### Wallet Connected State
![Wallet Connected](screenshots/wallet-connected.png)

### Balance Displayed
![Balance Display](screenshots/balance-displayed.png)

### Successful Transaction
![Transaction Success](screenshots/transaction-success.png)

### Transaction Result Shown
![Transaction Result](screenshots/transaction-result.png)

## Project Structure

```
split-bill-calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with WalletProvider
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── WalletConnect.tsx   # Wallet connection UI
│   │   ├── BalanceDisplay.tsx  # XLM balance display
│   │   ├── BillForm.tsx        # Bill input form
│   │   ├── SplitSummary.tsx    # Payment summary
│   │   └── TransactionResult.tsx # Transaction feedback
│   ├── context/
│   │   └── WalletContext.tsx   # Global wallet state
│   └── lib/
│       ├── freighter.ts        # Freighter wallet helpers
│       └── stellar.ts          # Stellar SDK utilities
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## License

MIT
