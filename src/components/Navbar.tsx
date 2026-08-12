"use client";

import { useWallet } from "@/context/WalletContext";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { WalletConnect } from "@/components/WalletConnect";

export function Navbar() {
  const { state } = useWallet();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
      <div className="max-w-md mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 rounded-md">
            <span className="text-white text-sm">⌁</span>
          </div>
          <div>
            <span className="block text-sm font-semibold leading-tight text-neutral-900">
              Split Bill
            </span>
            <span className="block text-[10px] text-neutral-400 leading-tight">
              Stellar Testnet
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {state.isConnected && <BalanceDisplay />}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
