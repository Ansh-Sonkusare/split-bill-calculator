"use client";

import { useWallet } from "@/context/WalletContext";

export function WalletConnect() {
  const { state, connect, disconnect } = useWallet();

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (state.isConnected && state.publicKey) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-slate-700 font-mono whitespace-nowrap">
            {truncateAddress(state.publicKey)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="px-3 py-2 text-xs font-medium text-slate-500 border border-slate-200 rounded-full hover:bg-slate-50 hover:text-slate-700 transition-colors"
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
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9"
        />
      </svg>
      {state.isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
