"use client";

import { getExplorerUrl } from "@/lib/stellar";

interface TransactionResultProps {
  status: "success" | "error" | null;
  txHash?: string;
  errorMessage?: string;
  onReset: () => void;
}

export function TransactionResult({
  status,
  txHash,
  errorMessage,
  onReset,
}: TransactionResultProps) {
  if (!status) return null;

  const isSuccess = status === "success";

  return (
    <div>
      <div className="text-center py-10">
        <div
          className={`w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl shadow-sm ${
            isSuccess
              ? "bg-emerald-50 border border-emerald-100 text-emerald-500"
              : "bg-red-50 border border-red-100 text-red-500"
          }`}
        >
          {isSuccess ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {isSuccess ? "Payment Sent" : "Transaction Failed"}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {isSuccess
            ? "Transaction confirmed on Stellar Testnet"
            : errorMessage || "Something went wrong"}
        </p>

        {isSuccess && txHash && (
          <div className="mt-6 max-w-sm mx-auto">
            <p className="text-xs text-slate-400 mb-1.5">Transaction Hash</p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <a
                href={getExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-indigo-600 hover:text-indigo-800 break-all transition-colors"
              >
                {txHash}
              </a>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              View on explorer ↗
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
      >
        New Transaction
      </button>
    </div>
  );
}
