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
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-semibold">{total.toFixed(2)} XLM</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Participants</span>
          <span className="font-semibold">{participants.length}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Each pays</span>
            <span className="text-lg font-bold text-indigo-600">
              {perPerson.toFixed(4)} XLM
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Recipients:</p>
        {participants.map((addr, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg"
          >
            <span className="font-mono text-sm text-gray-700">
              {truncateAddress(addr)}
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              {perPerson.toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSending}
          className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSending}
          className="flex-1 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSending ? "Sending..." : "Send Payment to All"}
        </button>
      </div>
    </div>
  );
}
