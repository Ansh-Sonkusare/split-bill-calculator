"use client";

import { useCallback } from "react";
import { useWalletQuery } from "@/hooks/useWallet";
import { useBillsQuery } from "@/hooks/useBills";
import { useBillFlowStore } from "@/stores/billFlowStore";
import { Navbar } from "@/components/Navbar";
import { BillForm } from "@/components/BillForm";
import { SplitSummary } from "@/components/SplitSummary";
import { TransactionResult } from "@/components/TransactionResult";
import { BillHistory } from "@/components/BillHistory";

const stepMeta = {
  form: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    title: "New Split",
    subtitle: "Enter the bill and add people",
    badge: "bg-indigo-100 text-indigo-600",
  },
  summary: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Confirm Payment",
    subtitle: "Review the split before sending",
    badge: "bg-sky-100 text-sky-600",
  },
  result: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    title: "Result",
    subtitle: "Transaction feedback",
    badge: "bg-emerald-100 text-emerald-600",
  },
} as const;

export default function Home() {
  const wallet = useWalletQuery();
  const { addBill } = useBillsQuery();
  const { step, totalAmount, currency, description, participants, customAmounts, isSending, txStatus, txHash, txError, calculate, send, goBack, reset } = useBillFlowStore();
  const meta = stepMeta[step];

  const handleSend = useCallback(() => {
    if (wallet.publicKey) send(wallet.publicKey, addBill);
  }, [wallet.publicKey, send, addBill]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-10">
        {wallet.error && (
          <div className="mb-6 p-3.5 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {wallet.error}
          </div>
        )}

        {!wallet.isConnected ? (
          <div className="text-center pt-6 pb-10">
            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-slate-900 rounded-3xl shadow-lg mb-7 animate-fade-up">
              <span className="text-4xl text-white">⌁</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight animate-fade-up animate-fade-up-delay-1">
              Split bills. <br />
              <span className="text-indigo-600">Send crypto together.</span>
            </h2>
            <p className="mt-3 text-[15px] text-slate-500 max-w-sm mx-auto animate-fade-up animate-fade-up-delay-2">
              Connect your Freighter wallet to split any bill evenly and pay
              everyone in a single transaction.
            </p>

            <button
              onClick={() => wallet.connect()}
              className="mt-8 inline-flex items-center gap-2.5 h-12 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] transition-all animate-fade-up animate-fade-up-delay-3"
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
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9"
                />
              </svg>
              Connect Wallet to Start
            </button>

            <div className="mt-12 text-left">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-5 text-center">
                How it works
              </p>
              <div className="space-y-3">
                {[
                  ["1", "Connect your wallet", "Link your Freighter wallet on Stellar Testnet."],
                  ["2", "Enter the bill", "Type the total amount in XLM or USDC you want to split."],
                  ["3", "Add the people", "Paste each person's Stellar address."],
                  ["4", "Send & confirm", "Review the split and send one payment to everyone."],
                ].map(([num, title, desc], i) => (
                  <div
                    key={num}
                    className="flex items-start gap-4 bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm animate-fade-up"
                    style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0">
                        {num}
                      </div>
                      {i < 3 && <div className="w-px h-6 bg-slate-200" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[13px] text-slate-500">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-up">
            <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-100">
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${meta.badge}`}
              >
                {meta.icon}
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                  {meta.title}
                </h2>
                <p className="text-xs text-slate-400">{meta.subtitle}</p>
              </div>
            </div>

            {step === "form" ? (
              <BillForm onCalculate={calculate} />
            ) : step === "summary" ? (
              <SplitSummary
                totalAmount={totalAmount}
                currency={currency}
                description={description}
                participants={participants}
                customAmounts={customAmounts}
                onConfirm={handleSend}
                onBack={goBack}
                isSending={isSending}
              />
            ) : (
              <TransactionResult
                status={txStatus}
                txHash={txHash}
                errorMessage={txError}
                onReset={reset}
              />
            )}
          </div>
        )}
      </main>

      {wallet.isConnected && (
        <div className="max-w-lg mx-auto w-full px-5 pb-10">
          <BillHistory />
        </div>
      )}

      <footer className="py-6 text-center">
        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Stellar Testnet · Split Bill dApp
        </span>
      </footer>
    </div>
  );
}
