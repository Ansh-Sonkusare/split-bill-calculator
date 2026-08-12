"use client";

import { useWallet } from "@/context/WalletContext";

export function WalletConnect() {
  const { state, connect, disconnect } = useWallet();

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (state.isConnected && state.publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600 font-mono bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-md">
          {truncateAddress(state.publicKey)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={state.isConnecting}
      className="px-6 py-2.5 text-sm font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {state.isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
