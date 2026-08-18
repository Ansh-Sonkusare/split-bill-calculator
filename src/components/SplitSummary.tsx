"use client";

import type { Currency } from "@/lib/stellar";

interface SplitSummaryProps {
  totalAmount: string;
  currency: Currency;
  description: string;
  participants: string[];
  customAmounts?: string[];
  onConfirm: () => void;
  onBack: () => void;
  isSending: boolean;
}

const avatarColors = [
  "bg-indigo-100 text-indigo-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
];

export function SplitSummary({
  totalAmount,
  currency,
  description,
  participants,
  customAmounts,
  onConfirm,
  onBack,
  isSending,
}: SplitSummaryProps) {
  const total = parseFloat(totalAmount);
  const perPerson = total / participants.length;
  const isCustom = !!customAmounts;

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
        {description && (
          <p className="text-sm font-medium text-slate-300 mb-3 truncate">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Total Bill
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {participants.length} people
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold tabular-nums tracking-tight">
              {total.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{currency} total</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">
              {isCustom ? "Custom" : perPerson.toFixed(4)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {isCustom ? "amounts" : `${currency} each`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">
          Sending to
        </p>
        <div className="space-y-2">
          {participants.map((addr, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border border-slate-200/70 rounded-xl px-3.5 py-2.5 shadow-sm hover:shadow-md transition-shadow animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${avatarColors[i % 4]}`}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-sm text-slate-600 truncate">
                  {truncateAddress(addr)}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900 tabular-nums shrink-0 ml-3">
                {perPerson.toFixed(4)}
                <span className="text-xs text-slate-400 font-normal"> {currency}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSending}
          className="flex-1 h-12 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSending}
          className="flex-1 h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] disabled:opacity-50 transition-all"
        >
          {isSending ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            "Send Payments"
          )}
        </button>
      </div>
    </div>
  );
}
