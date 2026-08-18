"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loadBills,
  saveBill,
  markSettled as storageMarkSettled,
  deleteBill as storageDeleteBill,
  type Bill,
} from "@/lib/storage";

const BILLS_KEY = ["bills"];

export function useBillsQuery() {
  const queryClient = useQueryClient();

  const billsQuery = useQuery({
    queryKey: BILLS_KEY,
    queryFn: loadBills,
    staleTime: Infinity,
  });

  const addBillMutation = useMutation({
    mutationFn: async (bill: Bill) => {
      return saveBill(bill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_KEY });
    },
  });

  const markSettledMutation = useMutation({
    mutationFn: async ({
      billId,
      participantIndex,
      txHash,
    }: {
      billId: string;
      participantIndex: number;
      txHash: string;
    }) => {
      return storageMarkSettled(billId, participantIndex, txHash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_KEY });
    },
  });

  const deleteBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      return storageDeleteBill(billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_KEY });
    },
  });

  return {
    bills: billsQuery.data ?? [],
    isLoaded: billsQuery.isSuccess,
    addBill: addBillMutation.mutate,
    markSettled: markSettledMutation.mutate,
    deleteBill: deleteBillMutation.mutate,
  };
}
