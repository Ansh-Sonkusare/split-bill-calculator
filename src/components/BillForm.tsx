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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
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
            className="input-field w-full px-4 py-3 rounded-xl text-lg font-semibold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stellar-cyan font-medium">
            XLM
          </span>
        </div>
        {errors.totalAmount && (
          <p className="mt-2 text-sm text-stellar-red">{errors.totalAmount}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-300">
            Participants
          </label>
          <button
            type="button"
            onClick={addParticipant}
            className="text-sm text-stellar-purple hover:text-stellar-cyan transition-colors font-medium"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={participant.id} className="animate-fade-in">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stellar-purple text-xs font-mono">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={participant.address}
                    onChange={(e) =>
                      updateAddress(participant.id, e.target.value)
                    }
                    placeholder="G... (Stellar address)"
                    className="input-field w-full pl-8 pr-3 py-2.5 rounded-xl font-mono text-sm"
                  />
                </div>
                {participants.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="w-10 flex items-center justify-center text-stellar-red/60 hover:text-stellar-red hover:bg-stellar-red/10 rounded-xl transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              {errors[`address-${index}`] && (
                <p className="mt-1 ml-2 text-xs text-stellar-red">
                  {errors[`address-${index}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        {errors.participants && (
          <p className="mt-2 text-sm text-stellar-red">{errors.participants}</p>
        )}
      </div>

      {participantCount > 0 && amount > 0 && (
        <div className="glass p-4 rounded-xl animate-scale-in">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {amount.toFixed(2)} ÷ {participantCount}
            </span>
            <span className="text-lg font-bold gradient-text">
              {splitAmount.toFixed(4)} XLM each
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full py-3.5 text-sm font-semibold text-white rounded-xl"
      >
        Calculate Split →
      </button>
    </form>
  );
}
