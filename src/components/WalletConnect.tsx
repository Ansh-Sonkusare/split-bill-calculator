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
        <span className="text-sm text-stellar-cyan font-mono bg-stellar-cyan/10 px-3 py-1.5 rounded-lg border border-stellar-cyan/20">
          {truncateAddress(state.publicKey)}
        </span>
        <button
          onClick={disconnect}
          className="btn-danger px-4 py-2 text-sm font-medium text-white rounded-lg"
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
      className="btn-primary px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {state.isConnecting ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          Connecting...
        </span>
      ) : (
        "Connect Freighter"
      )}
    </button>
  );
}
