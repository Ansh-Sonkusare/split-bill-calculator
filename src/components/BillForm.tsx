"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { isValidStellarAddress } from "@/lib/stellar";

interface Participant {
  id: number;
  address: string;
}

interface BillFormProps {
  onCalculate: (totalAmount: string, participants: string[]) => void;
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
  const { state } = useWallet();
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, address: "" },
    { id: 2, address: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const balance = state.balance ? parseFloat(state.balance) : 0;
  const amount = parseFloat(totalAmount) || 0;
  const participantCount = participants.length;
  const splitAmount = participantCount > 0 ? amount / participantCount : 0;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      newErrors.totalAmount = "Enter a valid amount";
    }

    if (balance < amount + 0.00001) {
      newErrors.totalAmount = "Insufficient balance (need +0.00001 XLM for fee)";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const addresses = participants
      .map((p) => p.address.trim())
      .filter(Boolean);
    onCalculate(totalAmount, addresses);
  }

  function addParticipant() {
    const newId = Math.max(...participants.map((p) => p.id), 0) + 1;
    setParticipants([...participants, { id: newId, address: "" }]);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            XLM
          </span>
        </div>
        {errors.totalAmount && (
          <p className="mt-1.5 text-xs text-red-600">{errors.totalAmount}</p>
        )}
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
        <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-3 animate-fade-up">
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <span className="font-semibold text-slate-700 tabular-nums">
              {amount.toFixed(2)} XLM
            </span>
            <span className="text-slate-300">/</span>
            <span>{participantCount} people</span>
          </div>
          <span className="text-sm font-bold text-indigo-600 tabular-nums">
            {splitAmount.toFixed(4)} XLM each
          </span>
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
