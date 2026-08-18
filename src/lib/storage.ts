const STORAGE_KEY = "split-bills-history";
const MAX_BILLS = 50;

export interface BillSplit {
  participant: string;
  share: number;
  paid: boolean;
  settledVia?: string;
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  currency: "XLM" | "USDC";
  createdAt: string;
  createdBy: string;
  splits: BillSplit[];
  settled: boolean;
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function loadBills(): Bill[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Bill[];
  } catch {
    return [];
  }
}

export function saveBill(bill: Bill): Bill[] {
  const bills = loadBills();
  bills.unshift(bill);
  const trimmed = bills.slice(0, MAX_BILLS);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
  return trimmed;
}

export function markSettled(
  billId: string,
  participantIndex: number,
  txHash: string
): Bill[] {
  const bills = loadBills();
  const bill = bills.find((b) => b.id === billId);
  if (bill && bill.splits[participantIndex]) {
    bill.splits[participantIndex].paid = true;
    bill.splits[participantIndex].settledVia = txHash;
    bill.settled = bill.splits.every((s) => s.paid);
    if (isClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    }
  }
  return bills;
}

export function deleteBill(billId: string): Bill[] {
  const bills = loadBills().filter((b) => b.id !== billId);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  }
  return bills;
}

export function generateBillId(): string {
  return `bill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
