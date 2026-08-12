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

  const inputClasses =
    "w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-neutral-400 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Total Bill Amount
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
            className={`${inputClasses} pr-14`}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
            XLM
          </span>
        </div>
        {errors.totalAmount && (
          <p className="mt-1.5 text-xs text-red-600">{errors.totalAmount}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-neutral-700">
            Participants
          </label>
          <button
            type="button"
            onClick={addParticipant}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2.5">
          {participants.map((participant, index) => (
            <div key={participant.id}>
              <div className="flex items-center gap-2">
                <span className="w-5 text-xs text-neutral-400 font-mono">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={participant.address}
                  onChange={(e) => updateAddress(participant.id, e.target.value)}
                  placeholder="G... (Stellar address)"
                  className={`${inputClasses} font-mono`}
                />
                {participants.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              {errors[`address-${index}`] && (
                <p className="mt-1 ml-7 text-xs text-red-600">
                  {errors[`address-${index}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        {errors.participants && (
          <p className="mt-1.5 text-xs text-red-600">{errors.participants}</p>
        )}
      </div>

      {participantCount > 0 && amount > 0 && (
        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-md px-4 py-3">
          <span className="text-sm text-neutral-500">
            {amount.toFixed(2)} ÷ {participantCount}
          </span>
          <span className="text-sm font-semibold text-neutral-900">
            {splitAmount.toFixed(4)} XLM each
          </span>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 text-sm font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
      >
        Calculate Split
      </button>
    </form>
  );
}
