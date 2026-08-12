"use client";

import { useWallet } from "@/context/WalletContext";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { WalletConnect } from "@/components/WalletConnect";

export function Navbar() {
  const { state } = useWallet();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex items-center justify-center bg-slate-900 rounded-lg shadow-sm shrink-0">
            <span className="text-white text-base">⌁</span>
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <span className="block text-sm font-semibold leading-tight text-slate-900 whitespace-nowrap">
                Split Bill
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                Testnet
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 leading-tight whitespace-nowrap">
              Powered by Stellar
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 shrink-0 ml-auto">
          {state.isConnected && <BalanceDisplay />}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
