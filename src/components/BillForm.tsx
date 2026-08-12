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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Bill Amount (XLM)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.totalAmount && (
          <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Participants
          </label>
          <button
            type="button"
            onClick={addParticipant}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={participant.id} className="flex gap-2">
              <input
                type="text"
                value={participant.address}
                onChange={(e) => updateAddress(participant.id, e.target.value)}
                placeholder="G... (Stellar address)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
              {participants.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeParticipant(participant.id)}
                  className="px-3 py-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
              {errors[`address-${index}`] && (
                <p className="text-xs text-red-600">
                  {errors[`address-${index}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        {errors.participants && (
          <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
        )}
      </div>

      {participantCount > 0 && amount > 0 && (
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-sm text-indigo-800">
            Split: <span className="font-semibold">{amount.toFixed(2)}</span> ÷{" "}
            <span className="font-semibold">{participantCount}</span> ={" "}
            <span className="font-semibold">{splitAmount.toFixed(4)} XLM</span>{" "}
            each
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Calculate Split
      </button>
    </form>
  );
}
