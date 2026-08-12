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

  return (
    <div
      className={`p-4 rounded-lg ${
        status === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">
          {status === "success" ? "✓" : "✗"}
        </span>
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              status === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {status === "success" ? "Transaction Successful!" : "Transaction Failed"}
          </h3>
          {status === "success" && txHash && (
            <div className="mt-2">
              <p className="text-sm text-green-700">Transaction Hash:</p>
              <a
                href={getExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-indigo-600 hover:underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}
          {status === "error" && errorMessage && (
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          )}
        </div>
      </div>
      <button
        onClick={onReset}
        className="mt-4 w-full py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        New Transaction
      </button>
    </div>
  );
}
