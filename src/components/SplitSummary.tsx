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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border border-neutral-200 rounded-md px-4 py-3.5">
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            Total
          </p>
          <p className="text-xl font-semibold text-neutral-900 mt-0.5">
            {total.toFixed(2)} <span className="text-sm text-neutral-500 font-normal">XLM</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            Each pays
          </p>
          <p className="text-xl font-semibold text-neutral-900 mt-0.5">
            {perPerson.toFixed(4)} <span className="text-sm text-neutral-500 font-normal">XLM</span>
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">
          Recipients ({participants.length})
        </p>
        <div className="space-y-2">
          {participants.map((addr, i) => (
            <div
              key={i}
              className="flex items-center justify-between border border-neutral-100 rounded-md px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs font-medium text-neutral-600 shrink-0">
                  {i + 1}
                </span>
                <span className="font-mono text-sm text-neutral-600 truncate">
                  {truncateAddress(addr)}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-900 shrink-0 ml-3">
                {perPerson.toFixed(4)}
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
          className="flex-1 py-3 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSending}
          className="flex-1 py-3 text-sm font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {isSending ? "Sending..." : "Send Payments"}
        </button>
      </div>
    </div>
  );
}
