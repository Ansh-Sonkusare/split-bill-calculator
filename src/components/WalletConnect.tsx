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
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg font-mono">
          {truncateAddress(state.publicKey)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
      className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {state.isConnecting ? "Connecting..." : "Connect Freighter"}
    </button>
  );
}
