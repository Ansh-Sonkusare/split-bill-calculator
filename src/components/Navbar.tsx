"use client";

import { useWalletQuery } from "@/hooks/useWallet";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { WalletConnect } from "@/components/WalletConnect";

export function Navbar() {
  const { isConnected } = useWalletQuery();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 flex items-center justify-center bg-slate-900 rounded-xl shadow-sm shrink-0">
            <span className="text-white text-base">⌁</span>
            <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <span className="block text-[15px] font-bold leading-tight text-slate-900 whitespace-nowrap tracking-tight">
                Split Bill
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                Testnet
              </span>
            </div>
            <span className="block text-[11px] text-slate-400 leading-tight whitespace-nowrap">
              Powered by Stellar
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 shrink-0 ml-auto">
          {isConnected && <BalanceDisplay />}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
