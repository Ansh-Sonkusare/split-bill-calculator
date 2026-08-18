"use client";

import { useBillsQuery } from "@/hooks/useBills";
import { getExplorerUrl } from "@/lib/stellar";

const avatarColors = [
  "bg-indigo-100 text-indigo-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
];

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BillHistory() {
  const { bills, deleteBill, isLoaded } = useBillsQuery();

  if (!isLoaded) return null;
  if (bills.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
          Recent Bills
        </h3>
        <span className="text-xs text-slate-400 tabular-nums">
          {bills.length} total
        </span>
      </div>

      <div className="space-y-3">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow animate-fade-up"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {bill.description || "Untitled bill"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(bill.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {bill.settled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Settled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Pending
                  </span>
                )}
                <button
                  onClick={() => deleteBill(bill.id)}
                  title="Delete bill"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xl font-bold text-slate-900 tabular-nums tracking-tight">
                  {bill.amount.toFixed(2)}
                </p>
                <p className="text-[11px] text-slate-400">{bill.currency} total</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-indigo-600 tabular-nums">
                  {(bill.amount / bill.splits.length).toFixed(4)}
                </p>
                <p className="text-[11px] text-slate-400">
                  {bill.currency} each · {bill.splits.length} people
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {bill.splits.map((split, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold shrink-0 ${avatarColors[i % 4]}`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-mono text-slate-500 truncate">
                      {truncateAddress(split.participant)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="tabular-nums text-slate-700 font-medium">
                      {split.share.toFixed(4)}
                    </span>
                    {split.paid && split.settledVia ? (
                      <a
                        href={getExplorerUrl(split.settledVia)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-600 transition-colors"
                        title="View transaction"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </a>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
