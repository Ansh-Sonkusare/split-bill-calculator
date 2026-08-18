import { create } from "zustand";
import { signAndSubmit, type Currency } from "@/lib/stellar";
import { generateBillId } from "@/lib/storage";
import type { Bill } from "@/lib/storage";

type Step = "form" | "summary" | "result";

interface FlowState {
  step: Step;
  totalAmount: string;
  currency: Currency;
  description: string;
  participants: string[];
  customAmounts: string[] | undefined;
  isSending: boolean;
  txStatus: "success" | "error" | null;
  txHash: string;
  txError: string;
}

interface BillFlowActions {
  calculate: (
    totalAmount: string,
    participants: string[],
    description: string,
    currency?: Currency,
    customAmounts?: string[]
  ) => void;
  send: (publicKey: string, addBill: (bill: Bill) => void) => Promise<void>;
  goBack: () => void;
  reset: () => void;
}

type BillFlowStore = FlowState & BillFlowActions;

const initialState: FlowState = {
  step: "form",
  totalAmount: "",
  currency: "XLM",
  description: "",
  participants: [],
  customAmounts: undefined,
  isSending: false,
  txStatus: null,
  txHash: "",
  txError: "",
};

export const useBillFlowStore = create<BillFlowStore>((set, get) => ({
  ...initialState,

  calculate: (totalAmount, participants, description, currency = "XLM", customAmounts) =>
    set({
      totalAmount,
      currency,
      participants,
      description,
      customAmounts,
      step: "summary",
    }),

  send: async (publicKey, addBill) => {
    const { totalAmount, participants, customAmounts, currency } = get();
    set({ isSending: true, txStatus: null });

    try {
      const perPerson = parseFloat(totalAmount) / participants.length;
      const recipients = participants.map((addr, i) => ({
        address: addr,
        amount: customAmounts
          ? parseFloat(customAmounts[i]).toFixed(7)
          : perPerson.toFixed(7),
      }));

      const result = await signAndSubmit(publicKey, recipients, currency);

      const bill: Bill = {
        id: generateBillId(),
        description: get().description,
        amount: parseFloat(totalAmount),
        currency,
        createdAt: new Date().toISOString(),
        createdBy: publicKey,
        splits: participants.map((addr, i) => ({
          participant: addr,
          share: customAmounts
            ? parseFloat(customAmounts[i])
            : perPerson,
          paid: true,
          settledVia: result.hash,
        })),
        settled: true,
      };
      addBill(bill);

      set({
        isSending: false,
        txStatus: "success",
        txHash: result.hash,
        txError: "",
        step: "result",
      });
    } catch (err) {
      set({
        isSending: false,
        txStatus: "error",
        txHash: "",
        txError: err instanceof Error ? err.message : "Transaction failed",
        step: "result",
      });
    }
  },

  goBack: () => set({ step: "form" }),

  reset: () => set(initialState),
}));
