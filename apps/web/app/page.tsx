"use client";

import React, { useState } from "react";
import Link from "next/link";
import VanityAttackSimulator from "../components/VanityAttackSimulator";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import BrutalistTicker from "../components/BrutalistTicker";
import LiveThreatRadar from "../components/LiveThreatRadar";

export default function HomePage() {
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const FAQ_ITEMS = [
    {
      q: "Why don't MetaMask, Ledger, or Safe catch address poisoning natively?",
      a: "Standard wallet interfaces truncate 42-character Ethereum addresses into abbreviated displays like 0xd9A1...3a91 to fit on screens. Because lookalike addresses match the exact outer characters (prefix and suffix), standard UI displays treat the vanity address as legitimate. HexFence is purpose-built to calculate boundary entropy and uncover the mismatched center characters.",
      tag: "CORE PROBLEM",
      color: "#FEF08A",
    },
    {
      q: "How does the HexFence Extension protect my privacy without seeing my transactions?",
      a: "HexFence never transmits your recipient addresses or wallet activities to external servers. The Chrome extension downloads bulk threat snapshots from Arkiv and performs all recipient comparisons, prefix-suffix collision math, and Safe approved payee checks 100% on-device inside your browser.",
      tag: "PRIVACY FIRST",
      color: "#BAF7D0",
    },
    {
      q: "How does the Safe Guard smart contract halt attacks on-chain?",
      a: "HexFenceGuard.sol implements the Gnosis Safe IGuard interface. Before any multi-sig transaction executes, the Guard inspects the intended recipient. If an unapproved recipient shares leading and trailing vanity characters with an approved payee (a 32-bit vanity collision), the transaction is automatically reverted with a custom error, keeping treasury funds safe.",
      tag: "ON-CHAIN DEFENSE",
      color: "#FED7AA",
    },
    {
      q: "What role does the Arkiv decentralized protocol play?",
      a: "Arkiv provides an immutable, decentralized registry (schema hexfence.poisoning.v1 on Rabdi Testnet #7794095) for forensic threat evidence. When address-poisoning patterns are detected in the mempool, structured evidence is published to Arkiv so third-party wallets, explorers, and security analysts can query verified incident records freely.",
      tag: "ARKIV EVIDENCE",
      color: "#DDD6FE",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* Kinetic Infinite Top Marquee Ticker */}
      <BrutalistTicker />

      {/* =========================================================================
          HERO SECTION: VIBRANT, COLOURFUL & CREATIVE NEO-BRUTALISM
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="flex flex-col items-start gap-6 max-w-5xl mb-10">
          {/* Playful Floating Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] font-mono text-xs uppercase font-bold tracking-wider shadow-neoSm hover:-translate-y-0.5 transition-transform">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <span>LIVE MEMPOOL DEFENSE ACTIVE</span>
            </span>

            <span className="bg-[#DDD6FE] text-[#151515] px-3 py-1 border-2 border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm hover:-translate-y-0.5 transition-transform">
              📦 ARKIV TESTNET #7794095
            </span>

            <span className="bg-[#BAF7D0] text-[#151515] px-3 py-1 border-2 border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm hover:-translate-y-0.5 transition-transform">
              🛡️ SAFE GUARD SEPOLIA
            </span>

            <span className="bg-[#FEF08A] text-[#151515] px-3 py-1 border-2 border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm hover:-translate-y-0.5 transition-transform hidden sm:inline-block">
              🔒 100% LOCAL PRIVACY
            </span>
          </div>

          {/* Bold Impactful Headline with Colourful Accents */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-[#151515] leading-[1.05] tracking-tight">
            STOP LOSING TREASURY FUNDS TO{" "}
            <span className="inline-block bg-[#D94F4F] text-white px-3 py-1 border-3 border-[#151515] shadow-neo transform -rotate-1 hover:rotate-0 transition-transform">
              ADDRESS-POISONING
            </span>{" "}
            VANITY SPOOFS.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-[#151515]/90 font-sans max-w-3xl leading-relaxed font-medium">
            Adversaries generate GPU vanity lookalikes matching your counterparty&apos;s outer characters and inject dust transfers into your recent history.{" "}
            <strong className="bg-[#C6F36B] text-[#151515] px-1.5 py-0.5 border border-[#151515]">
              HexFence exposes the fake middle characters
            </strong>
            , anchors cryptographic evidence to Arkiv, and halts lookalike executions on-chain with Gnosis Safe Guards.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/explorer"
              className="px-7 py-3.5 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo hover:shadow-neoLg hover:-translate-y-1 font-heading font-black text-sm uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore Threat Intelligence</span>
              <span className="font-mono text-base">🔍</span>
            </Link>

            <Link
              href="/how-it-works"
              className="px-7 py-3.5 bg-[#FEF08A] text-[#151515] border-2 border-[#151515] shadow-neo hover:shadow-neoLg hover:-translate-y-1 font-heading font-black text-sm uppercase tracking-wider transition-all duration-200"
            >
              How It Works 💡
            </Link>

            <button
              onClick={() => setExtensionModalOpen(true)}
              className="px-6 py-3.5 bg-white text-[#151515] border-2 border-[#151515] shadow-neo hover:shadow-neoLg hover:-translate-y-1 font-heading font-black text-sm uppercase tracking-wider transition-all duration-200"
            >
              Get Extension 🛡️
            </button>
          </div>
        </div>

        {/* Real-Time Attack & Vanity Comparator (Screenshot Matching Lab) */}
        <div className="mt-4">
          <VanityAttackSimulator />
        </div>
      </section>

      {/* =========================================================================
          LIVE INCIDENT INTERCEPTION RADAR (CLEAN & COLOURFUL NEO-BRUTALIST FEED)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <LiveThreatRadar />
      </section>

      {/* =========================================================================
          ATTACK MECHANISM: 3 PLAYFUL COLOURFUL STEPS
         ========================================================================= */}
      <section className="bg-white border-y-3 border-[#151515] py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="bg-[#FED7AA] text-[#151515] border-2 border-[#151515] font-mono text-xs uppercase font-black px-3 py-1 shadow-neoSm">
              THE ANATOMY OF A \$68M HACK
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#151515] mt-3 mb-3">
              How Victims Fall Into the Truncation Trap
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-sans font-medium">
              Standard wallets abbreviate 42-character hexadecimal addresses into truncated labels like <code className="bg-[#FAF9F6] px-1.5 py-0.5 border border-[#151515] font-mono font-bold text-[#151515]">0xd9A1...3a91</code>. Attackers exploit this psychological habit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Lavender Card */}
            <div className="bg-[#F5F3FF] border-3 border-[#151515] p-6 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#8B5CF6] text-white font-mono font-black text-lg flex items-center justify-center border-2 border-[#151515] mb-4 shadow-neoSm">
                  01
                </div>
                <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                  GPU Vanity Matching
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Using high-density GPU mining rigs, attackers generate millions of keypairs until they create an address matching your counterparty&apos;s outer characters (first 6 and last 6 characters).
                </p>
              </div>
              <div className="mt-6 pt-3 border-t-2 border-[#151515] font-mono text-xs font-bold text-[#151515] flex items-center justify-between">
                <span>Entropy Barrier:</span>
                <span className="bg-[#8B5CF6] text-white px-2 py-0.5 border border-[#151515]">16^-14 Collision</span>
              </div>
            </div>

            {/* Step 2: Sky Blue Card */}
            <div className="bg-[#F0F9FF] border-3 border-[#151515] p-6 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#0284C7] text-white font-mono font-black text-lg flex items-center justify-center border-2 border-[#151515] mb-4 shadow-neoSm">
                  02
                </div>
                <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                  Dust History Injection
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  The attacker sends $0.0001 in dust or triggers a gasless <code className="bg-white px-1 font-mono font-bold border border-[#151515]">Transfer(from, to, 0)</code>. Your wallet activity feed places this fake transfer right at the top of your recent list.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t-2 border-[#151515] font-mono text-xs font-bold text-[#151515] flex items-center justify-between">
                <span>Attacker Cost:</span>
                <span className="bg-[#0284C7] text-white px-2 py-0.5 border border-[#151515]">&lt; $0.20 Gas</span>
              </div>
            </div>

            {/* Step 3: Coral Card */}
            <div className="bg-[#FFF1F2] border-3 border-[#151515] p-6 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#E11D48] text-white font-mono font-black text-lg flex items-center justify-center border-2 border-[#151515] mb-4 shadow-neoSm">
                  03
                </div>
                <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                  The Fatal Copy &amp; Loss
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  When you initiate your next scheduled payment, you glance at the truncated outer characters, confirm they look familiar, copy the lookalike, and sign. Funds transfer directly to the attacker.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t-2 border-[#151515] font-mono text-xs font-bold text-[#E11D48] flex items-center justify-between">
                <span>Consequence:</span>
                <span className="bg-[#E11D48] text-white px-2 py-0.5 border border-[#151515]">100% Non-Reversible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUR PILLARS OF DEFENSE: COLOURFUL NEO-BRUTALIST GRID
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mb-12">
          <span className="bg-[#BAF7D0] text-[#151515] border-2 border-[#151515] font-mono text-xs uppercase font-black px-3 py-1 shadow-neoSm">
            COMPLETE DEFENSE IN DEPTH
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#151515] mt-3 mb-3">
            Four Interlocking Layers of Protection
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-sans leading-relaxed font-medium">
            HexFence intervenes across the entire lifecycle: from client-side copy-paste actions to on-chain multi-sig execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Lemon Butter */}
          <div className="bg-[#FEF9C3] border-3 border-[#151515] p-7 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#151515] text-[#FEF08A] font-mono text-xs font-bold uppercase shadow-neoSm">
                  PILLAR 01 // HEURISTIC DETECTOR
                </span>
                <span className="font-mono text-xs font-bold text-gray-600">
                  services/detector
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                Algorithmic Vanity Collision Math
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-5">
                Evaluates candidate recipients using boundary Hamming entropy formulas, cross-referencing recent counterparties with micro-dust transfers and zero-value event log injection patterns.
              </p>
            </div>
            <ul className="space-y-2 border-t-2 border-[#151515] pt-4 font-mono text-xs text-[#151515]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#151515] text-[#C6F36B] rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Prefix &amp; Suffix entropy formula (16^-(k1 + k2))</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#151515] text-[#C6F36B] rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Dust value profiling (USDT, USDC, WBTC, ETH)</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Soft Violet */}
          <div className="bg-[#F3E8FF] border-3 border-[#151515] p-7 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#8B5CF6] text-white font-mono text-xs font-bold uppercase shadow-neoSm">
                  PILLAR 02 // ARKIV PROTOCOL
                </span>
                <span className="font-mono text-xs font-bold text-gray-600">
                  packages/arkiv
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                Decentralized Evidence Layer
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-5">
                Confirmed attack clusters and vanity signatures are hashed and permanently anchored to the Arkiv decentralized testnet (schema hexfence.poisoning.v1) with immutable secp256k1 receipts.
              </p>
            </div>
            <ul className="space-y-2 border-t-2 border-[#151515] pt-4 font-mono text-xs text-[#151515]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Rabdi Testnet Chain ID 7794095 compliance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Cryptographic deduplication on-chain</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Mint Green */}
          <div className="bg-[#DCFCE7] border-3 border-[#151515] p-7 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#10B981] text-white font-mono text-xs font-bold uppercase shadow-neoSm">
                  PILLAR 03 // BROWSER EXTENSION
                </span>
                <span className="font-mono text-xs font-bold text-gray-600">
                  apps/extension
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                Zero-Leakage Recipient Interceptor
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-5">
                The HexFence Chrome Extension actively monitors transaction drafting on app.safe.global. All recipient matching runs 100% on-device against bulk Arkiv snapshots without leaking addresses.
              </p>
            </div>
            <ul className="space-y-2 border-t-2 border-[#151515] pt-4 font-mono text-xs text-[#151515]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Standalone security alert window in English &amp; Hindi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Zero recipient queries sent over the network</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Peach Coral */}
          <div className="bg-[#FFE4E6] border-3 border-[#151515] p-7 shadow-neo hover:shadow-neoLg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#E11D48] text-white font-mono text-xs font-bold uppercase shadow-neoSm">
                  PILLAR 04 // SAFE GUARD
                </span>
                <span className="font-mono text-xs font-bold text-gray-600">
                  packages/contracts
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#151515] mb-2">
                On-Chain Multi-Sig Revert Enforcer
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-5">
                For DAOs and treasury signers, the <code className="font-mono font-bold bg-white px-1 border border-[#151515]">HexFenceGuard.sol</code> contract intercepts execution on-chain, rejecting transactions when a recipient mimics an approved genuine payee.
              </p>
            </div>
            <ul className="space-y-2 border-t-2 border-[#151515] pt-4 font-mono text-xs text-[#151515]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#E11D48] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Native Gnosis Safe BaseGuard compliance (Solidity ^0.8.24)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#E11D48] text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Custom error LookalikePoisoningDetected halts execution</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ARCHITECTURE TOPOLOGY
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ArchitectureDiagram />
      </section>

      {/* =========================================================================
          INTERACTIVE FAQ / ACCORDION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border-3 border-[#151515] shadow-neo p-8 md:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="px-3 py-1 bg-[#FEF08A] text-[#151515] border-2 border-[#151515] font-mono text-xs uppercase font-black shadow-neoSm">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#151515] mt-3 mb-2">
              Everything You Need to Know
            </h2>
            <p className="text-gray-700 font-sans font-medium text-base">
              Learn how HexFence coordinates client-side interception with on-chain guarantees.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={item.q}
                  className="border-2 border-[#151515] transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: isOpen ? item.color : "#FAF9F6" }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-heading font-bold text-lg sm:text-xl text-[#151515] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#151515] text-white font-mono text-xs font-bold uppercase shadow-neoSm">
                        {item.tag}
                      </span>
                      <span>{item.q}</span>
                    </div>
                    <span className="font-mono text-2xl font-black shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 font-sans text-sm md:text-base text-gray-800 leading-relaxed font-medium border-t-2 border-[#151515] bg-white/70">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER (CREATIVE NEO-BRUTALIST LIME & CHARCOAL)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#151515] text-white border-3 border-[#151515] shadow-neoLg p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#C6F36B] rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="max-w-2xl space-y-3 z-10">
            <span className="bg-[#C6F36B] text-[#151515] font-mono text-xs uppercase font-black px-3 py-1 border border-[#151515] inline-block">
              ARM YOUR WORKSTATION &amp; TREASURY TODAY
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white leading-tight">
              NEVER COPY A POISONED VANITY ADDRESS AGAIN.
            </h2>
            <p className="text-sm md:text-base text-gray-300 font-sans font-medium">
              Investigate suspect counterparties in the public Arkiv explorer or load the HexFence Chrome Extension to protect your team in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10 font-mono">
            <Link
              href="/explorer"
              className="px-7 py-4 bg-[#C6F36B] text-[#151515] border-2 border-[#C6F36B] shadow-neo hover:shadow-neoLg hover:-translate-y-1 font-heading font-black text-xs text-center uppercase tracking-wider transition-all duration-200"
            >
              Launch Address Explorer 🔍
            </Link>

            <button
              onClick={() => setExtensionModalOpen(true)}
              className="px-7 py-4 bg-white text-[#151515] border-2 border-white shadow-neo hover:shadow-neoLg hover:-translate-y-1 font-heading font-black text-xs text-center uppercase tracking-wider transition-all duration-200"
            >
              Install Safe Guard Extension 🛡️
            </button>
          </div>
        </div>
      </section>

      {/* Extension Installation Guide Modal */}
      {extensionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#F4F2EC] border-4 border-[#151515] shadow-neo max-w-lg w-full p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b-2 border-[#151515] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <strong className="text-sm font-black text-[#151515]">
                  Install HexFence Chrome Extension (Manifest V3)
                </strong>
              </div>
              <button
                onClick={() => setExtensionModalOpen(false)}
                className="w-7 h-7 bg-white border border-[#151515] font-bold flex items-center justify-center hover:bg-[#D94F4F] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 font-sans text-xs font-medium leading-relaxed">
              HexFence runs natively as an unpacked Chrome extension built with TypeScript and Viem, providing 100% on-device matching with zero data leakage.
            </p>

            <div className="space-y-2 bg-white border-2 border-[#151515] p-4 text-[11px]">
              <div className="font-bold text-[#151515] uppercase border-b border-gray-200 pb-1">
                Quick Setup Instructions:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-800">
                <li>Navigate to <code className="bg-[#FAF9F6] px-1 border border-gray-300">chrome://extensions/</code> in your browser.</li>
                <li>Enable <strong>Developer mode</strong> (top-right toggle).</li>
                <li>Click <strong>Load unpacked</strong>.</li>
                <li>Select the directory: <code className="bg-[#FAF9F6] px-1 border border-gray-300">apps/extension</code>.</li>
                <li>Open <code className="bg-[#FAF9F6] px-1 border border-gray-300">app.safe.global</code> to experience real-time protection!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-gray-500 font-bold">Local client privacy guaranteed</span>
              <button
                onClick={() => setExtensionModalOpen(false)}
                className="px-5 py-2 bg-[#151515] text-[#C6F36B] border border-[#151515] font-black uppercase shadow-neoSm hover:bg-black transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
