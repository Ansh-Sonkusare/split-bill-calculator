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
    <div className="animate-fade-up">
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
              strokeWidth="2.5"
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
              strokeWidth="2.5"
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
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isSuccess ? "Payment Sent" : "Transaction Failed"}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">
          {isSuccess
            ? "Transaction confirmed on Stellar Testnet"
            : errorMessage || "Something went wrong"}
        </p>

        {isSuccess && txHash && (
          <div className="mt-6 max-w-sm mx-auto text-left">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">
              Transaction Hash
            </p>
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-mono text-xs text-indigo-600 break-all group-hover:text-indigo-800 transition-colors">
                {txHash}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
            <p className="mt-2 text-[11px] text-slate-400">
              View on Stellar explorer
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] transition-all"
      >
        New Transaction
      </button>
    </div>
  );
}
