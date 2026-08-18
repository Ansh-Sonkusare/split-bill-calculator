"use client";

import { useWalletQuery } from "@/hooks/useWallet";

export function BalanceDisplay() {
  const { xlmBalance, usdcBalance, isBalanceLoading, refreshBalance } = useWalletQuery();

  return (
    <div className="flex items-center gap-2 h-10 bg-white border border-slate-200 rounded-xl pl-3 pr-1.5 shadow-sm">
      {isBalanceLoading ? (
        <span className="text-[13px] text-slate-400">Loading…</span>
      ) : (
        <>
          <span className="text-[13px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
            {parseFloat(xlmBalance).toFixed(2)}
          </span>
          <span className="text-[11px] font-medium text-slate-400">XLM</span>
          <span className="text-slate-200">·</span>
          <span className="text-[13px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
            {parseFloat(usdcBalance).toFixed(2)}
          </span>
          <span className="text-[11px] font-medium text-slate-400">USDC</span>
        </>
      )}
      <button
        onClick={refreshBalance}
        disabled={isBalanceLoading}
        title="Refresh balance"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}
