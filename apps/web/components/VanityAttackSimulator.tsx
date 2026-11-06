"use client";

import React, { useState } from "react";

interface IncidentCase {
  id: string;
  label: string;
  title: string;
  targetedCapital: string;
  attackVector: string;
  lossValue: string;
  genuine: string;
  poisoned: string;
  prefixMatch: string;
  suffixMatch: string;
  victimGenuineMiddle: string;
  divergentMiddle: string;
  hammingSimilarity: string;
  entropyChance: string;
  arkivReceipt: string;
  latency: string;
  collisionChars: number;
}

const CASES: IncidentCase[] = [
  {
    id: "case-1",
    label: "CASE 01",
    title: "$68M WBTC POISONING",
    targetedCapital: "1,162 WBTC ($68,000,000 USD)",
    attackVector: "0.05 ETH Dust Transfer",
    lossValue: "$68,000,000 USD",
    genuine: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
    poisoned: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
    prefixMatch: "0xd9A1",
    suffixMatch: "44853a91",
    victimGenuineMiddle: "c3788D81257612E2581A6ea0aDa2",
    divergentMiddle: "C3C6f3590059B2E3516A6ea0ADa2",
    hammingSimilarity: "94.8% Match",
    entropyChance: "16^(-14) [GPU BRUTE]",
    arkivReceipt: "SEALED #9812",
    latency: "< 2.4 ms",
    collisionChars: 14,
  },
  {
    id: "case-2",
    label: "CASE 02",
    title: "250K USDT ZERO-TRANSFER",
    targetedCapital: "250,000 USDT ($250,000 USD)",
    attackVector: "Transfer(from, to, 0) Gasless",
    lossValue: "$250,000 USD",
    genuine: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
    poisoned: "0x71C412a83158c35B4EbA692998982312d288976F",
    prefixMatch: "0x71C4",
    suffixMatch: "88976F",
    victimGenuineMiddle: "09fE06718E3c1A488c03F05C334d72",
    divergentMiddle: "12a83158c35B4EbA692998982312d2",
    hammingSimilarity: "92.4% Match",
    entropyChance: "16^(-12) [VANITY RIG]",
    arkivReceipt: "SEALED #4419",
    latency: "< 1.9 ms",
    collisionChars: 12,
  },
  {
    id: "case-3",
    label: "CASE 03",
    title: "DAO PAYROLL MULTI-SIG",
    targetedCapital: "500 ETH ($1,850,000 USD)",
    attackVector: "High-Frequency GPU Cluster",
    lossValue: "$1,850,000 USD",
    genuine: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
    poisoned: "0x483896587c4273E1B95B1348b598A913B0BAD5f97",
    prefixMatch: "0x4838",
    suffixMatch: "B0BAD5f97",
    victimGenuineMiddle: "B106FCe9647Bdf1E7877BF73cE8",
    divergentMiddle: "96587c4273E1B95B1348b598A913",
    hammingSimilarity: "95.1% Match",
    entropyChance: "16^(-15) [GPU CLUSTER]",
    arkivReceipt: "SEALED #7821",
    latency: "< 2.1 ms",
    collisionChars: 15,
  },
];

export default function VanityAttackSimulator() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [walletViewMode, setWalletViewMode] = useState<"protected" | "vulnerable">("protected");
  const [copiedType, setCopiedType] = useState<"genuine" | "poisoned" | null>(null);
  const [simRunning, setSimRunning] = useState(false);

  const current = CASES[activeIdx];

  const handleCopy = (type: "genuine" | "poisoned") => {
    const text = type === "genuine" ? current.genuine : current.poisoned;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3500);
  };

  const handleRerun = () => {
    setSimRunning(true);
    setTimeout(() => {
      setSimRunning(false);
    }, 600);
  };

  return (
    <div className="relative bg-white border-2 border-[#151515] shadow-neo overflow-hidden">
      {/* Dark Precision Lab Header Bar */}
      <div className="bg-[#151515] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#151515]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#C6F36B]" />
          <h3 className="font-mono font-bold text-xs sm:text-sm tracking-wider uppercase text-[#C6F36B]">
            LAB // REAL-TIME ATTACK &amp; VANITY COMPARATOR
          </h3>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-[#252525] border border-[#333] text-[10px] font-mono text-gray-300">
            EVAL: ACTIVE MEMPOOL
          </span>
        </div>

        {/* Case Selector Buttons */}
        <div className="flex items-center gap-1.5">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveIdx(i);
                setCopiedType(null);
              }}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors ${
                activeIdx === i
                  ? "bg-[#C6F36B] text-[#151515]"
                  : "bg-[#252525] text-gray-300 hover:text-white hover:bg-[#333]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8 space-y-6 bg-[#FAF9F6]">
        {/* Meta Box: Case Info & Re-run Action */}
        <div className="bg-white border-2 border-[#151515] p-5 shadow-neoSm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">
                CASE TITLE:
              </span>
              <span className="font-heading font-black text-sm md:text-base text-[#151515] tracking-tight">
                {current.title}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">
                TARGETED CAPITAL:
              </span>
              <span className="font-mono font-bold text-xs md:text-sm text-[#D94F4F]">
                {current.targetedCapital}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">
                ATTACK VECTOR:
              </span>
              <span className="font-mono font-medium text-xs md:text-sm text-[#151515]">
                {current.attackVector}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleRerun}
              disabled={simRunning}
              className="px-4 py-2 bg-[#151515] text-white hover:text-[#C6F36B] border border-[#151515] font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-neoSm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>⚡</span>
              <span>{simRunning ? "SCANNING..." : "RE-RUN ATTACK SIM"}</span>
            </button>
          </div>
        </div>

        {/* Perspective Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <span className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
            FORENSIC PERSPECTIVE:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWalletViewMode("protected")}
              className={`px-3 py-1 font-mono text-xs font-bold border transition-all ${
                walletViewMode === "protected"
                  ? "bg-[#151515] text-[#C6F36B] border-[#151515] shadow-neoSm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#151515]"
              }`}
            >
              🛡️ With HexFence Guard (Protected)
            </button>
            <button
              onClick={() => setWalletViewMode("vulnerable")}
              className={`px-3 py-1 font-mono text-xs font-bold border transition-all ${
                walletViewMode === "vulnerable"
                  ? "bg-[#D94F4F] text-white border-[#D94F4F] shadow-neoSm"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#D94F4F]"
              }`}
            >
              ⚠️ Standard Wallet View (Vulnerable)
            </button>
          </div>
        </div>

        {/* Perspective 1: Vulnerable Standard Wallet Blindspot */}
        {walletViewMode === "vulnerable" && (
          <div className="bg-[#FFF8F8] border-2 border-[#D94F4F] p-5 shadow-neoSm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D94F4F]/30 pb-3">
              <span className="font-mono text-xs font-bold uppercase text-[#D94F4F] flex items-center gap-2">
                <span>⚠️</span> WHAT STANDARD WALLETS DISPLAY TO THE USER:
              </span>
              <span className="font-mono text-[10px] bg-[#D94F4F] text-white px-2 py-0.5 font-bold uppercase">
                TRUNCATION BLINDSPOT
              </span>
            </div>

            <div className="bg-white border border-[#151515] p-4 font-mono text-sm sm:text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-[#151515]">
                  {current.prefixMatch}...{current.suffixMatch}
                </span>
              </div>
              <span className="text-xs bg-[#F4F2EC] px-2.5 py-1 border border-gray-300 font-mono text-gray-700">
                Recent Activity 📋
              </span>
            </div>

            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Standard wallets display only outer characters. Both genuine counterparty and attacker lookalike resolve to <span className="font-bold bg-[#F4F2EC] px-1 text-[#151515]">{current.prefixMatch}...{current.suffixMatch}</span>. The victim copied this blindly and lost {current.lossValue}.
            </p>
          </div>
        )}

        {/* Perspective 2: Protected HexFence View */}
        {walletViewMode === "protected" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Genuine Address Card */}
            <div className="bg-white border-2 border-[#2E7D52] p-5 shadow-neoSm space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#2E7D52] text-white font-mono text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <span>✓</span> GENUINE COUNTERPARTY ADDRESS
                </span>
                <button
                  onClick={() => handleCopy("genuine")}
                  className="px-3 py-1 bg-white border border-[#151515] font-mono text-xs font-bold text-[#151515] hover:bg-[#F4F2EC] transition-colors"
                >
                  Copy Address 📋
                </button>
              </div>

              {/* Address Box */}
              <div className="bg-white border border-[#151515] p-3.5 font-mono text-xs sm:text-sm break-all leading-relaxed select-all">
                <span className="bg-[#C6F36B] text-[#151515] px-1 py-0.5 font-bold border border-[#151515]">
                  {current.prefixMatch}
                </span>
                <span className="px-1 text-[#151515]">{current.victimGenuineMiddle}</span>
                <span className="bg-[#C6F36B] text-[#151515] px-1 py-0.5 font-bold border border-[#151515]">
                  {current.suffixMatch}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Status: Historical recipient verified</span>
                <span className="text-[#2E7D52] font-bold uppercase">SAFE TO SEND</span>
              </div>
            </div>

            {/* Right Column: Attacker Vanity Lookalike */}
            <div className="bg-white border-2 border-[#D94F4F] p-5 shadow-neoSm space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#D94F4F] text-white font-mono text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                  <span>⚠</span> ATTACKER VANITY LOOKALIKE
                </span>
                <button
                  onClick={() => handleCopy("poisoned")}
                  className="px-3 py-1 bg-white border border-[#151515] font-mono text-xs font-bold text-[#151515] hover:bg-[#FFF2F2] transition-colors"
                >
                  Copy Poisoned 📋
                </button>
              </div>

              {/* Address Box */}
              <div className="bg-white border border-[#151515] p-3.5 font-mono text-xs sm:text-sm break-all leading-relaxed select-all">
                <span className="bg-[#C6F36B] text-[#151515] px-1 py-0.5 font-bold border border-[#151515]">
                  {current.prefixMatch}
                </span>
                <span className="px-1 text-[#D94F4F] font-bold">
                  {current.divergentMiddle}
                </span>
                <span className="bg-[#C6F36B] text-[#151515] px-1 py-0.5 font-bold border border-[#151515]">
                  {current.suffixMatch}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-gray-200">
                <span className="text-[#D94F4F] font-medium">
                  Collision Match: {current.collisionChars} Hex Characters
                </span>
                <span className="bg-[#D94F4F] text-white px-2 py-0.5 font-bold uppercase text-[11px]">
                  BLOCKED BY SAFE GUARD
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {copiedType && (
          <div
            className={`p-3.5 border-2 border-[#151515] shadow-neoSm font-mono text-xs flex items-center justify-between gap-4 transition-all ${
              copiedType === "genuine"
                ? "bg-[#E8F5EE] text-[#2E7D52] border-[#2E7D52]"
                : "bg-[#FFF2F2] text-[#D94F4F] border-[#D94F4F]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{copiedType === "genuine" ? "✓" : "🚨"}</span>
              <div>
                <strong className="block uppercase text-xs">
                  {copiedType === "genuine"
                    ? "Genuine Address Copied"
                    : "Poisoned Lookalike Address Copied — HexFence Interceptor Triggered!"}
                </strong>
                <p className="text-[11px] opacity-90">
                  {copiedType === "genuine"
                    ? "Matches verified counterparty in registry. Safe to proceed."
                    : "Notice: The middle 26 characters differ completely. In a production browser with the HexFence extension, this address paste triggers an on-screen visual flag."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCopiedType(null)}
              className="px-2 py-1 bg-white border border-[#151515] text-[#151515] text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Bottom Forensic Telemetry HUD Bar */}
      <div className="bg-[#151515] border-t-2 border-[#151515] px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div>
          <span className="text-gray-400 text-[10px] uppercase block tracking-wider">
            HAMMING SIMILARITY:
          </span>
          <span className="font-bold text-sm sm:text-base text-[#C6F36B]">
            {current.hammingSimilarity}
          </span>
        </div>

        <div>
          <span className="text-gray-400 text-[10px] uppercase block tracking-wider">
            COLLISION ENTROPY:
          </span>
          <span className="font-bold text-sm sm:text-base text-[#C6F36B]">
            {current.entropyChance}
          </span>
        </div>

        <div>
          <span className="text-gray-400 text-[10px] uppercase block tracking-wider">
            ARKIV PROOF ANCHOR:
          </span>
          <span className="font-bold text-sm sm:text-base text-[#5E7ED8]">
            {current.arkivReceipt}
          </span>
        </div>

        <div>
          <span className="text-gray-400 text-[10px] uppercase block tracking-wider">
            DEFENSE LATENCY:
          </span>
          <span className="font-bold text-sm sm:text-base text-[#C6F36B]">
            {current.latency}
          </span>
        </div>
      </div>
    </div>
  );
}
