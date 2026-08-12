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
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-neutral-100">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-neutral-900">
            Split Bill
          </h1>
          <div className="flex items-center gap-4">
            <BalanceDisplay />
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-10">
        {state.error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
            {state.error}
          </div>
        )}

        {!state.isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Split bills, send XLM
            </h2>
            <p className="mt-2 text-neutral-500 max-w-sm mx-auto">
              Connect your Freighter wallet to split a bill evenly and send
              payments on Stellar Testnet.
            </p>
            <ol className="mt-10 text-left max-w-sm mx-auto space-y-4">
              {[
                ["01", "Connect your Freighter wallet"],
                ["02", "Enter the total bill amount"],
                ["03", "Add participant Stellar addresses"],
                ["04", "Review and send payments"],
              ].map(([num, text]) => (
                <li key={num} className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-xs font-medium text-neutral-500 shrink-0">
                    {num}
                  </span>
                  <span className="text-sm text-neutral-600">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : step === "form" ? (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              New Split
            </h2>
            <BillForm onCalculate={handleCalculate} />
          </div>
        ) : step === "summary" ? (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
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
          <div>
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
