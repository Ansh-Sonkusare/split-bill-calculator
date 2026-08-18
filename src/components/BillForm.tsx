"use client";

import { useState } from "react";
import { useWalletQuery } from "@/hooks/useWallet";
import { isValidStellarAddress, type Currency } from "@/lib/stellar";
import { templates } from "@/lib/templates";

interface Participant {
  id: number;
  address: string;
  customAmount: string;
}

interface BillFormProps {
  onCalculate: (
    totalAmount: string,
    participants: string[],
    description: string,
    currency?: Currency,
    customAmounts?: string[]
  ) => void;
}

const inputClasses =
  "w-full px-3.5 h-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400 transition-all";

const avatarColors = [
  "bg-indigo-100 text-indigo-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
];

export function BillForm({ onCalculate }: BillFormProps) {
  const { xlmBalance, usdcBalance } = useWalletQuery();
  const [totalAmount, setTotalAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("XLM");
  const [description, setDescription] = useState("");
  const [splitMode, setSplitMode] = useState<"even" | "custom">("even");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, address: "", customAmount: "" },
    { id: 2, address: "", customAmount: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const balance = currency === "USDC" ? parseFloat(usdcBalance) : parseFloat(xlmBalance);
  const amount = parseFloat(totalAmount) || 0;
  const participantCount = participants.length;
  const splitAmount = participantCount > 0 ? amount / participantCount : 0;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      newErrors.totalAmount = "Enter a valid amount";
    }

    if (balance < amount + 0.00001) {
      newErrors.totalAmount = `Insufficient ${currency} balance`;
    }

    if (participantCount < 2) {
      newErrors.participants = "At least 2 participants required";
    }

    const addresses = participants.map((p) => p.address.trim());
    const uniqueAddresses = new Set(addresses);

    participants.forEach((p, i) => {
      if (!p.address.trim()) {
        newErrors[`address-${i}`] = "Address required";
      } else if (!isValidStellarAddress(p.address.trim())) {
        newErrors[`address-${i}`] = "Invalid Stellar address";
      } else if (uniqueAddresses.size !== addresses.filter(Boolean).length) {
        newErrors[`address-${i}`] = "Duplicate address";
      }
    });

    if (splitMode === "custom" && amount > 0) {
      const customTotal = participants.reduce(
        (sum, p) => sum + (parseFloat(p.customAmount) || 0),
        0
      );
      const diff = Math.abs(customTotal - amount);
      if (diff > 0.0001) {
        newErrors.customSplit = `Custom amounts sum to ${customTotal.toFixed(4)}, expected ${amount.toFixed(4)}`;
      }
      participants.forEach((p, i) => {
        if (!p.customAmount || parseFloat(p.customAmount) <= 0) {
          newErrors[`custom-${i}`] = "Amount required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const addresses = participants
      .map((p) => p.address.trim())
      .filter(Boolean);

    if (splitMode === "custom") {
      const customAmounts = participants.map((p) => p.customAmount);
      onCalculate(totalAmount, addresses, description, currency, customAmounts);
    } else {
      onCalculate(totalAmount, addresses, description, currency);
    }
  }

  function addParticipant() {
    const newId = Math.max(...participants.map((p) => p.id), 0) + 1;
    setParticipants([...participants, { id: newId, address: "", customAmount: "" }]);
  }

  function removeParticipant(id: number) {
    if (participants.length <= 2) return;
    setParticipants(participants.filter((p) => p.id !== id));
  }

  function updateAddress(id: number, address: string) {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, address } : p))
    );
  }

  function updateCustomAmount(id: number, value: string) {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, customAmount: value } : p))
    );
  }

  const customTotal = participants.reduce(
    (sum, p) => sum + (parseFloat(p.customAmount) || 0),
    0
  );
  const remaining = amount - customTotal;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[13px] font-medium text-slate-700 mb-2">
          Quick Start
        </label>
        <div className="grid grid-cols-3 gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setCurrency(t.defaultCurrency);
                if (participants.length < t.suggestedSplits) {
                  const newParticipants = [...participants];
                  for (let i = participants.length; i < t.suggestedSplits; i++) {
                    newParticipants.push({ id: i + 1, address: "", customAmount: "" });
                  }
                  setParticipants(newParticipants);
                }
              }}
              className="flex flex-col items-center gap-1 h-16 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700 transition-colors"
            >
              <span className="text-lg">{t.emoji}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-slate-700 mb-2">
          Total Bill Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-1.5-8.5h3a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h3"
              />
            </svg>
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
            className={`${inputClasses} pl-11 pr-16 h-14 text-xl font-bold tabular-nums`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
            {currency}
          </span>
        </div>
        {errors.totalAmount && (
          <p className="mt-1.5 text-xs text-red-600">{errors.totalAmount}</p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-medium text-slate-700 mb-2">
          Currency
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrency("XLM")}
            className={`flex-1 h-10 rounded-xl text-sm font-medium border transition-colors ${
              currency === "XLM"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            XLM
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USDC")}
            className={`flex-1 h-10 rounded-xl text-sm font-medium border transition-colors ${
              currency === "USDC"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            USDC
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-slate-700 mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Dinner at Luigi's"
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-slate-700 mb-2">
          Split Mode
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSplitMode("even")}
            className={`flex-1 h-10 rounded-xl text-sm font-medium border transition-colors ${
              splitMode === "even"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            Even Split
          </button>
          <button
            type="button"
            onClick={() => setSplitMode("custom")}
            className={`flex-1 h-10 rounded-xl text-sm font-medium border transition-colors ${
              splitMode === "custom"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            Custom Amounts
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[13px] font-medium text-slate-700">
            Participants
          </label>
          <span className="text-xs text-slate-400 tabular-nums">
            {participantCount} people
          </span>
        </div>

        <div className="space-y-2.5">
          {participants.map((participant, index) => (
            <div key={participant.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${avatarColors[index % 4]}`}
                >
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={participant.address}
                  onChange={(e) => updateAddress(participant.id, e.target.value)}
                  placeholder="G... (Stellar address)"
                  className={`${inputClasses} font-mono text-[13px]`}
                />
                {participants.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    title="Remove participant"
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {errors[`address-${index}`] && (
                <p className="mt-1 ml-10 text-xs text-red-600">
                  {errors[`address-${index}`]}
                </p>
              )}
              {splitMode === "custom" && (
                <div className="ml-10 mt-1.5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={participant.customAmount}
                      onChange={(e) => updateCustomAmount(participant.id, e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 h-9 bg-slate-50 border border-slate-200 rounded-lg text-sm tabular-nums focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                  {errors[`custom-${index}`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`custom-${index}`]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addParticipant}
          className="mt-3 w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-[13px] font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Participant
        </button>
        {errors.participants && (
          <p className="mt-1.5 text-xs text-red-600">{errors.participants}</p>
        )}
      </div>

      {participantCount > 0 && amount > 0 && (
        <div className="space-y-2 animate-fade-up">
          <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <span className="font-semibold text-slate-700 tabular-nums">
                {amount.toFixed(2)} {currency}
              </span>
              <span className="text-slate-300">/</span>
              <span>{participantCount} people</span>
            </div>
            {splitMode === "even" ? (
              <span className="text-sm font-bold text-indigo-600 tabular-nums">
                {splitAmount.toFixed(4)} {currency} each
              </span>
            ) : (
              <span className="text-sm font-bold text-indigo-600 tabular-nums">
                {remaining.toFixed(4)} remaining
              </span>
            )}
          </div>
          {splitMode === "custom" && Math.abs(remaining) > 0.0001 && (
            <p className="text-xs text-amber-600 text-right">
              {remaining > 0
                ? `${remaining.toFixed(4)} ${currency} left to assign`
                : `${Math.abs(remaining).toFixed(4)} ${currency} over total`}
            </p>
          )}
          {errors.customSplit && (
            <p className="text-xs text-red-600 text-right">{errors.customSplit}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] transition-all"
      >
        Calculate Split
      </button>
    </form>
  );
}
