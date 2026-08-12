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
      <header className="glass-strong border-b border-stellar-purple/10">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stellar-purple to-stellar-cyan flex items-center justify-center">
              <span className="text-white text-sm font-bold">✦</span>
            </div>
            <h1 className="text-lg font-bold gradient-text">Split Bill</h1>
          </div>
          <div className="flex items-center gap-4">
            <BalanceDisplay />
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
        {state.error && (
          <div className="mb-5 p-4 glass rounded-xl border border-stellar-red/30 text-sm text-stellar-red animate-fade-in">
            {state.error}
          </div>
        )}

        {!state.isConnected ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-7xl mb-6 animate-float">✦</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Split Bills <span className="gradient-text">Instantly</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">
              Connect your wallet to split bills and send XLM on Stellar Testnet
            </p>
            <div className="glass p-6 rounded-2xl text-left max-w-sm mx-auto">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stellar-purple animate-pulse" />
                How it works
              </h3>
              <ol className="space-y-3">
                {[
                  "Connect your Freighter wallet",
                  "Enter the total bill amount",
                  "Add participant Stellar addresses",
                  "Review and send payments",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-stellar-purple to-stellar-blue flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : step === "form" ? (
          <div className="glass-strong p-6 rounded-2xl animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stellar-cyan" />
              New Split
            </h2>
            <BillForm onCalculate={handleCalculate} />
          </div>
        ) : step === "summary" ? (
          <div className="glass-strong p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stellar-purple" />
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
          <div className="glass-strong p-6 rounded-2xl">
            <TransactionResult
              status={txStatus}
              txHash={txHash}
              errorMessage={txError}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-xs text-slate-600">
        Stellar Testnet · Built for splitting bills
      </footer>
    </div>
  );
}
