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
    <div className="space-y-5 animate-fade-in">
      <div className="glass p-5 rounded-xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total</p>
            <p className="text-xl font-bold text-white">{total.toFixed(2)} <span className="text-sm text-stellar-cyan">XLM</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">People</p>
            <p className="text-xl font-bold text-white">{participants.length}</p>
          </div>
        </div>
        <div className="border-t border-stellar-purple/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Each person pays</span>
            <span className="text-2xl font-bold gradient-text">
              {perPerson.toFixed(4)} XLM
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
          Recipients
        </p>
        <div className="space-y-2">
          {participants.map((addr, i) => (
            <div
              key={i}
              className="glass flex items-center justify-between p-3 rounded-xl animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-stellar-purple to-stellar-blue flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="font-mono text-sm text-slate-300">
                  {truncateAddress(addr)}
                </span>
              </div>
              <span className="text-sm font-bold text-stellar-cyan">
                {perPerson.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSending}
          className="flex-1 py-3.5 text-sm font-semibold text-slate-300 glass rounded-xl hover:bg-white/5 disabled:opacity-50 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSending}
          className="btn-primary flex-1 py-3.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50"
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
              Sending...
            </span>
          ) : (
            "Send Payment to All →"
          )}
        </button>
      </div>
    </div>
  );
}
