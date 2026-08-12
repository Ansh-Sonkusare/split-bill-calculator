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
    <div className="animate-scale-in">
      {status === "success" ? (
        <div className="glass p-6 rounded-xl border border-stellar-green/30 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stellar-green/20 flex items-center justify-center">
            <span className="text-3xl text-stellar-green">✓</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Payment Sent!
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Transaction confirmed on Stellar Testnet
          </p>
          {txHash && (
            <div className="glass p-3 rounded-lg mb-4">
              <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
              <a
                href={getExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-stellar-cyan hover:text-stellar-purple transition-colors break-all"
              >
                {txHash}
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="glass p-6 rounded-xl border border-stellar-red/30 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stellar-red/20 flex items-center justify-center">
            <span className="text-3xl text-stellar-red">✗</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Transaction Failed
          </h3>
          {errorMessage && (
            <p className="text-sm text-stellar-red mb-4">{errorMessage}</p>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-5 w-full py-3.5 text-sm font-semibold text-white glass rounded-xl hover:bg-white/5 transition-all"
      >
        New Transaction
      </button>
    </div>
  );
}
