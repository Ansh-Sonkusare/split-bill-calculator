"use client";

interface SplitSummaryProps {
  totalAmount: string;
  participants: string[];
  onConfirm: () => void;
  onBack: () => void;
  isSending: boolean;
}

export function SplitSummary({
  totalAmount,
  participants,
  onConfirm,
  onBack,
  isSending,
}: SplitSummaryProps) {
  const total = parseFloat(totalAmount);
  const perPerson = total / participants.length;

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function avatarColor(i: number) {
    return i % 3 === 0
      ? "bg-indigo-100 text-indigo-600"
      : i % 3 === 1
      ? "bg-sky-100 text-sky-600"
      : "bg-emerald-100 text-emerald-600";
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            Total Bill
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {participants.length} people
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{total.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-0.5">XLM total</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-400">
              {perPerson.toFixed(4)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">XLM each</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-full bg-emerald-500 rounded-full" />
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
          Sending to
        </p>
        <div className="space-y-2">
          {participants.map((addr, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${avatarColor(
                    i
                  )}`}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-sm text-slate-600 truncate">
                  {truncateAddress(addr)}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900 shrink-0 ml-3">
                {perPerson.toFixed(4)}
                <span className="text-xs text-slate-400 font-normal"> XLM</span>
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
          className="flex-1 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSending}
          className="flex-1 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 transition-all"
        >
          {isSending ? (
            <span className="inline-flex items-center gap-2">
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
