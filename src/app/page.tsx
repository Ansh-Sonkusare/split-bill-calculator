"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { BillForm } from "@/components/BillForm";
import { SplitSummary } from "@/components/SplitSummary";
import { TransactionResult } from "@/components/TransactionResult";
import { signAndSubmit } from "@/lib/stellar";

type Step = "form" | "summary" | "result";

export default function Home() {
  const { state } = useWallet();
  const [step, setStep] = useState<Step>("form");
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [txStatus, setTxStatus] = useState<"success" | "error" | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  const [txError, setTxError] = useState<string>("");

  function handleCalculate(amount: string, addrs: string[]) {
    setTotalAmount(amount);
    setParticipants(addrs);
    setStep("summary");
  }

  async function handleSend() {
    if (!state.publicKey) return;

    setIsSending(true);
    setTxStatus(null);

    try {
      const recipients = participants.map((addr) => ({
        address: addr,
        amount: (parseFloat(totalAmount) / participants.length).toFixed(7),
      }));

      const result = await signAndSubmit(state.publicKey, recipients);
      setTxHash(result.hash);
      setTxStatus("success");
      setStep("result");
    } catch (err: any) {
      setTxError(err.message || "Transaction failed");
      setTxStatus("error");
      setStep("result");
    } finally {
      setIsSending(false);
    }
  }

  function handleReset() {
    setStep("form");
    setTotalAmount("");
    setParticipants([]);
    setTxStatus(null);
    setTxHash("");
    setTxError("");
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b bg-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Split Bill</h1>
          <div className="flex items-center gap-4">
            <BalanceDisplay />
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        {state.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {state.error}
          </div>
        )}

        {!state.isConnected ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Split Bills Easily
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Freighter wallet to start splitting bills and sending
              XLM on Stellar Testnet.
            </p>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-left">
              <h3 className="font-medium text-gray-900 mb-3">How it works:</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">1.</span>
                  Connect your Freighter wallet
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">2.</span>
                  Enter the total bill amount
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">3.</span>
                  Add participant Stellar addresses
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">4.</span>
                  Review and send payments to all
                </li>
              </ol>
            </div>
          </div>
        ) : step === "form" ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              New Split
            </h2>
            <BillForm onCalculate={handleCalculate} />
          </div>
        ) : step === "summary" ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Payment
            </h2>
            <SplitSummary
              totalAmount={totalAmount}
              participants={participants}
              onConfirm={handleSend}
              onBack={() => setStep("form")}
              isSending={isSending}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <TransactionResult
              status={txStatus}
              txHash={txHash}
              errorMessage={txError}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
