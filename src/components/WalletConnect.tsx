"use client";

import { useWallet } from "@/context/WalletContext";

export function WalletConnect() {
  const { state, connect, disconnect } = useWallet();

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (state.isConnected && state.publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2.5 pl-2 pr-3 h-10 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <span className="text-[13px] text-slate-700 font-mono whitespace-nowrap">
            {truncateAddress(state.publicKey)}
          </span>
        </div>
        <button
          onClick={disconnect}
          title="Disconnect wallet"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 border border-slate-200 bg-white shadow-sm hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
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
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={state.isConnecting}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
