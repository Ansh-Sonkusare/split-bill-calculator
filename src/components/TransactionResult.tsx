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
      <div
        className={`text-center py-8 ${
          isSuccess ? "text-green-600" : "text-red-600"
        }`}
      >
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-neutral-50 border border-neutral-100 rounded-full">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            {isSuccess ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            )}
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900">
          {isSuccess ? "Payment Sent" : "Transaction Failed"}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          {isSuccess
            ? "Transaction confirmed on Stellar Testnet"
            : errorMessage || "Something went wrong"}
        </p>

        {isSuccess && txHash && (
          <div className="mt-5 max-w-sm mx-auto">
            <p className="text-xs text-neutral-400 mb-1">Transaction Hash</p>
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-indigo-600 hover:text-indigo-800 break-all transition-colors"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 text-sm font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
      >
        New Transaction
      </button>
    </div>
  );
}
