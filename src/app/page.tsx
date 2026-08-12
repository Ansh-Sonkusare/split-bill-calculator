"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Navbar } from "@/components/Navbar";
import { BillForm } from "@/components/BillForm";
import { SplitSummary } from "@/components/SplitSummary";
import { TransactionResult } from "@/components/TransactionResult";
import { signAndSubmit } from "@/lib/stellar";

type Step = "form" | "summary" | "result";

export default function Home() {
  const { state, connect } = useWallet();
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

  const cardTitle = {
    form: { icon: "✦", text: "New Split", color: "bg-indigo-100 text-indigo-600" },
    summary: { icon: "✓", text: "Confirm Payment", color: "bg-emerald-100 text-emerald-600" },
    result: { icon: "→", text: "Result", color: "bg-sky-100 text-sky-600" },
  }[step];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
        {state.error && (
          <div className="mb-6 p-3.5 flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {state.error}
          </div>
        )}

        {!state.isConnected ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-900 rounded-2xl shadow-md mb-6">
              <span className="text-3xl text-white">⌁</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Split bills, send XLM
            </h2>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">
              Connect your Freighter wallet to split a bill evenly and send
              payments on Stellar Testnet.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-left">
              {[
                {
                  n: "01",
                  t: "Connect wallet",
                  d: "Link your Freighter wallet",
                },
                {
                  n: "02",
                  t: "Enter the bill",
                  d: "Total amount in XLM",
                },
                {
                  n: "03",
                  t: "Add people",
                  d: "Stellar addresses of each",
                },
                {
                  n: "04",
                  t: "Send & track",
                  d: "Review and send payments",
                },
              ].map(({ n, t, d }) => (
                <div
                  key={n}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-[10px] font-semibold text-indigo-500 tracking-wider">
                    {n}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {t}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{d}</p>
                </div>
              ))}
            </div>

            <button
              onClick={connect}
              className="mt-8 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
            >
              Connect Wallet to Start
            </button>
          </div>
        ) : step !== "form" ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${cardTitle.color}`}
              >
                {cardTitle.icon}
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                {cardTitle.text}
              </h2>
            </div>
            {step === "summary" ? (
              <SplitSummary
                totalAmount={totalAmount}
                participants={participants}
                onConfirm={handleSend}
                onBack={() => setStep("form")}
                isSending={isSending}
              />
            ) : (
              <TransactionResult
                status={txStatus}
                txHash={txHash}
                errorMessage={txError}
                onReset={handleReset}
              />
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${cardTitle.color}`}
              >
                {cardTitle.icon}
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                {cardTitle.text}
              </h2>
            </div>
            <BillForm onCalculate={handleCalculate} />
          </div>
        )}
      </main>

      <footer className="py-6 text-center">
        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Stellar Testnet · Split Bill dApp
        </span>
      </footer>
    </div>
  );
}
