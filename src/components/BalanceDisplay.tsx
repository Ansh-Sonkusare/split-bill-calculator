"use client";

import { useWallet } from "@/context/WalletContext";

export function BalanceDisplay() {
  const { state, refreshBalance } = useWallet();

  if (!state.isConnected) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-slate-400">
        Balance:
        {state.isBalanceLoading ? (
          <span className="ml-2 text-slate-500">Loading...</span>
        ) : (
          <span className="ml-2 font-bold text-white text-base">
            {state.balance ? parseFloat(state.balance).toFixed(2) : "0.00"}{" "}
            <span className="text-stellar-cyan text-xs font-normal">XLM</span>
          </span>
        )}
      </div>
      <button
        onClick={refreshBalance}
        disabled={state.isBalanceLoading}
        className="text-xs text-stellar-purple hover:text-stellar-cyan disabled:opacity-50 transition-colors"
      >
        ↻
      </button>
    </div>
  );
}
