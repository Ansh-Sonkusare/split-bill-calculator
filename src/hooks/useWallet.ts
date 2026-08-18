"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  connectFreighter,
  getFreighterAddress,
  checkFreighterConnected,
} from "@/lib/freighter";
import { getBalances } from "@/lib/stellar";

const WALLET_KEY = ["wallet"];
const BALANCE_KEY = ["balance"];

export function useWalletQuery() {
  const queryClient = useQueryClient();

  const walletQuery = useQuery({
    queryKey: WALLET_KEY,
    queryFn: async () => {
      const connected = await checkFreighterConnected();
      if (!connected) return { publicKey: null, isConnected: false };
      const address = await getFreighterAddress();
      if (!address) return { publicKey: null, isConnected: false };
      return { publicKey: address, isConnected: true };
    },
    staleTime: Infinity,
  });

  const balanceQuery = useQuery({
    queryKey: BALANCE_KEY,
    queryFn: async () => {
      const wallet = queryClient.getQueryData<{ publicKey: string | null }>(WALLET_KEY);
      if (!wallet?.publicKey) return { xlm: "0", usdc: "0" };
      return getBalances(wallet.publicKey);
    },
    enabled: !!walletQuery.data?.publicKey,
    refetchInterval: 30_000,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const address = await connectFreighter();
      return address;
    },
    onSuccess: (address) => {
      queryClient.setQueryData(WALLET_KEY, { publicKey: address, isConnected: true });
      queryClient.invalidateQueries({ queryKey: BALANCE_KEY });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      queryClient.setQueryData(WALLET_KEY, { publicKey: null, isConnected: false });
      queryClient.setQueryData(BALANCE_KEY, { xlm: "0", usdc: "0" });
    },
  });

  const refreshBalance = () => {
    queryClient.invalidateQueries({ queryKey: BALANCE_KEY });
  };

  return {
    publicKey: walletQuery.data?.publicKey ?? null,
    isConnected: walletQuery.data?.isConnected ?? false,
    isConnecting: connectMutation.isPending,
    xlmBalance: balanceQuery.data?.xlm ?? "0",
    usdcBalance: balanceQuery.data?.usdc ?? "0",
    isBalanceLoading: balanceQuery.isFetching,
    error: walletQuery.error?.message ?? connectMutation.error?.message ?? null,
    connect: connectMutation.mutateAsync,
    disconnect: disconnectMutation.mutate,
    refreshBalance,
  };
}
