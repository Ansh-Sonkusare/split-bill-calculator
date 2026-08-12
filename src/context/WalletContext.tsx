"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  connectFreighter,
  getFreighterAddress,
  checkFreighterConnected,
} from "@/lib/freighter";
import { getBalance } from "@/lib/stellar";

interface WalletState {
  publicKey: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isBalanceLoading: boolean;
  error: string | null;
}

interface WalletContextType {
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    isBalanceLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async (pk: string) => {
    setState((prev) => ({ ...prev, isBalanceLoading: true, error: null }));
    try {
      const balance = await getBalance(pk);
      setState((prev) => ({ ...prev, balance, isBalanceLoading: false }));
    } catch {
      setState((prev) => ({
        ...prev,
        isBalanceLoading: false,
        error: "Failed to fetch balance",
      }));
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (state.publicKey) {
      await fetchBalance(state.publicKey);
    }
  }, [state.publicKey, fetchBalance]);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const address = await connectFreighter();
      setState((prev) => ({
        ...prev,
        publicKey: address,
        isConnected: true,
        isConnecting: false,
      }));
      await fetchBalance(address);
    } catch {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to connect wallet",
      }));
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setState({
      publicKey: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
      isBalanceLoading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    async function checkExistingConnection() {
      const connected = await checkFreighterConnected();
      if (connected) {
        const address = await getFreighterAddress();
        if (address) {
          setState((prev) => ({
            ...prev,
            publicKey: address,
            isConnected: true,
          }));
          await fetchBalance(address);
        }
      }
    }
    checkExistingConnection();
  }, [fetchBalance]);

  return (
    <WalletContext.Provider value={{ state, connect, disconnect, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
