"use client";

import { useWallet } from "@/context/WalletContext";

export function BalanceDisplay() {
  const { state, refreshBalance } = useWallet();

  if (!state.isConnected) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-500">
        {state.isBalanceLoading ? (
          "Loading..."
        ) : (
          <>
            <span className="font-semibold text-neutral-900">
              {state.balance ? parseFloat(state.balance).toFixed(2) : "0.00"}
            </span>{" "}
            XLM
          </>
        )}
      </span>
      <button
        onClick={refreshBalance}
        disabled={state.isBalanceLoading}
        className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}
