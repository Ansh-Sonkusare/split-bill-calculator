"use client";

import { useWallet } from "@/context/WalletContext";

export function BalanceDisplay() {
  const { state, refreshBalance } = useWallet();

  if (!state.isConnected) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-600">
        Balance:
        {state.isBalanceLoading ? (
          <span className="ml-2 text-gray-400">Loading...</span>
        ) : (
          <span className="ml-2 font-semibold text-gray-900">
            {state.balance ? parseFloat(state.balance).toFixed(2) : "0.00"} XLM
          </span>
        )}
      </div>
      <button
        onClick={refreshBalance}
        disabled={state.isBalanceLoading}
        className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
      >
        Refresh
      </button>
    </div>
  );
}
