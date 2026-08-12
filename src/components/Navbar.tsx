"use client";

import { useWallet } from "@/context/WalletContext";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { WalletConnect } from "@/components/WalletConnect";

export function Navbar() {
  const { state } = useWallet();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
      <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 rounded-md shrink-0">
            <span className="text-white text-sm">⌁</span>
          </div>
          <div className="shrink-0">
            <span className="block text-sm font-semibold leading-tight text-neutral-900 whitespace-nowrap">
              Split Bill
            </span>
            <span className="block text-[10px] text-neutral-400 leading-tight whitespace-nowrap">
              Stellar Testnet
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {state.isConnected && <BalanceDisplay />}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
