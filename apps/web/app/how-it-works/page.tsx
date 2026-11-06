"use client";

import React from "react";
import Link from "next/link";
import VanityAttackSimulator from "../../components/VanityAttackSimulator";

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-14">
      {/* Page Header */}
      <div className="max-w-4xl border-b-2 border-[#151515] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-bold px-2.5 py-1 shadow-neoSm">
            SECURITY ARCHITECTURE DEEP DIVE
          </span>
          <span className="bg-white text-[#151515] border border-[#151515] font-mono text-xs font-bold uppercase px-2 py-0.5">
            EIP-712 &amp; SAFE GUARD
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-[#151515] tracking-tight mt-2">
          How Address Poisoning Works &amp; How HexFence Halts It
        </h1>
        <p className="text-base sm:text-lg text-gray-700 font-sans leading-relaxed font-medium mt-3">
          Address poisoning drains millions across Ethereum treasuries. It does not exploit smart contract bugs—it tricks human cognitive visual habits in truncated wallet displays.
        </p>
      </div>

      {/* Interactive Simulator Component Embedded */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C6F36B] border border-[#151515]" />
          <h2 className="font-heading font-black text-xl text-[#151515]">
            Live Attack &amp; Defense Simulator
          </h2>
        </div>
        <VanityAttackSimulator />
      </section>

      {/* Section 1: The Anatomy of Truncation */}
      <section className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-10 space-y-8">
        <div className="max-w-3xl">
          <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-bold px-3 py-1 shadow-neoSm">
            THE COGNITIVE VULNERABILITY
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#151515] mt-3 mb-2">
            Why Truncated Addresses Deceive Even Crypto Natives
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
            Ethereum addresses are 40 hexadecimal characters (160 bits). Because full 42-character strings cannot comfortably fit in desktop transaction lists or mobile apps, wallet interfaces abbreviate them:
          </p>
        </div>

        {/* Truncation Demo Graphic */}
        <div className="bg-[#FAF9F6] border-2 border-[#151515] p-5 max-w-xl shadow-neoSm space-y-3">
          <div className="text-xs font-mono font-bold text-gray-600 uppercase">
            TYPICAL WALLET UI DISPLAY (BOTH RESOLVE IDENTICALLY):
          </div>
          <div className="bg-white border border-[#151515] p-3.5 flex items-center justify-between font-mono text-sm sm:text-base font-bold shadow-neoSm">
            <span className="text-[#151515]">0xd9A1c3...44853a91</span>
            <span className="text-xs bg-[#C6F36B] text-[#151515] px-2 py-0.5 border border-[#151515] font-bold uppercase">Copy 📋</span>
          </div>
          <p className="text-xs text-gray-600 font-mono">
            The victim checks the first 6 chars (&apos;0xd9A1c3&apos;) and last 6 chars (&apos;44853a91&apos;), confirms they match, and copies without realizing the middle 26 characters were mined by an attacker.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#151515] p-5 bg-[#FAF9F6] shadow-neoSm">
            <div className="w-8 h-8 bg-[#151515] text-[#C6F36B] font-mono font-bold text-sm flex items-center justify-center border border-[#151515] mb-3">
              1
            </div>
            <h3 className="font-heading font-black text-lg text-[#151515] mb-1.5">
              GPU Vanity Brute Force
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Attacker scrapes mempool transactions, identifies routine high-volume counterparties, and spins up GPU clusters to generate lookalike addresses.
            </p>
          </div>

          <div className="border border-[#151515] p-5 bg-[#FAF9F6] shadow-neoSm">
            <div className="w-8 h-8 bg-[#151515] text-[#C6F36B] font-mono font-bold text-sm flex items-center justify-center border border-[#151515] mb-3">
              2
            </div>
            <h3 className="font-heading font-black text-lg text-[#151515] mb-1.5">
              History Pollution
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              Attacker sends zero-value ERC20 transfers or 0.0001 dust, placing their vanity address at the top of the victim&apos;s recent transfer history.
            </p>
          </div>

          <div className="border border-[#151515] p-5 bg-[#FAF9F6] shadow-neoSm">
            <div className="w-8 h-8 bg-[#D94F4F] text-white font-mono font-bold text-sm flex items-center justify-center border border-[#151515] mb-3">
              3
            </div>
            <h3 className="font-heading font-black text-lg text-[#151515] mb-1.5">
              Unwitting Capital Transfer
            </h3>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              When the victim executes their next legitimate transfer, they copy from recent history and divert funds straight into the attacker&apos;s vault.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Mathematical Proof */}
      <section className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-10 space-y-6">
        <div>
          <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-bold px-3 py-1 shadow-neoSm">
            MATHEMATICAL IMPOSSIBILITY OF RANDOM COLLISION
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#151515] mt-3 mb-2">
            Collision Entropy &amp; Threat Scoring
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium max-w-3xl">
            Because Ethereum addresses are uniformly distributed 160-bit integers, sharing outer characters by pure chance is statistically impossible:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[#151515] bg-[#FAF9F6] p-5 shadow-neoSm space-y-3 font-mono text-xs">
            <h3 className="font-heading font-black text-base text-[#151515]">
              Probability Formula
            </h3>
            <div className="bg-white border border-[#151515] p-3 text-center font-bold text-sm shadow-neoSm">
              P(collision) = 16^-(k + m)
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              For a 6-character prefix and 6-character suffix match (k = 6, m = 6), the collision probability is 16^(-12) ≈ 3.55 × 10^(-15)—statistically impossible without deliberate GPU vanity computation.
            </p>
          </div>

          <div className="border border-[#151515] bg-[#FAF9F6] p-5 shadow-neoSm space-y-3 font-mono text-xs">
            <h3 className="font-heading font-black text-base text-[#151515]">
              What HexFence Flags in Real Time
            </h3>
            <ul className="space-y-1.5 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#D94F4F] font-bold">•</span>
                <span>ERC-20 transfer event logs where <code className="font-bold bg-white px-1 border border-gray-300">value == 0</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D94F4F] font-bold">•</span>
                <span>Unsolicited micro-dust transfers &lt; 0.0001 ETH from unindexed counterparties.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D94F4F] font-bold">•</span>
                <span>Addresses matching ≥ 8 characters with established counterparties.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Arkiv & Safe Guard Revert */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#151515] shadow-neo p-7 flex flex-col justify-between space-y-6">
          <div>
            <span className="bg-[#5E7ED8] text-white font-mono text-xs uppercase font-bold px-2.5 py-1 shadow-neoSm">
              DECENTRALIZED EVIDENCE
            </span>
            <h3 className="font-heading font-black text-xl text-[#151515] mt-3 mb-2">
              Arkiv Protocol Evidence Layer
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-sans font-medium">
              Every confirmed attack cluster is cryptographically hashed and published to the decentralized Arkiv protocol. Anyone can independently audit proofs and verify that receipts are tamper-proof.
            </p>
          </div>
          <Link
            href="/explorer"
            className="self-start px-5 py-2.5 bg-[#151515] text-[#C6F36B] font-mono text-xs font-bold uppercase border border-[#151515] shadow-neoSm hover:shadow-neo hover:-translate-y-0.5 transition-all"
          >
            Inspect Arkiv Proofs →
          </Link>
        </div>

        <div className="bg-white border-2 border-[#151515] shadow-neo p-7 flex flex-col justify-between space-y-6">
          <div>
            <span className="bg-[#D94F4F] text-white font-mono text-xs uppercase font-bold px-2.5 py-1 shadow-neoSm">
              ON-CHAIN REVERT ENFORCEMENT
            </span>
            <h3 className="font-heading font-black text-xl text-[#151515] mt-3 mb-2">
              Solidity Gnosis Safe Guard
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-sans font-medium">
              Even if human signers make a copy-paste error, the <code className="font-bold text-[#151515] bg-[#FAF9F6] px-1 border border-gray-300">HexFenceGuard.sol</code> smart contract intercepts execution on-chain, automatically reverting any transaction to a confirmed vanity poisoner.
            </p>
          </div>
          <Link
            href="/explorer"
            className="self-start px-5 py-2.5 bg-[#151515] text-white font-mono text-xs font-bold uppercase border border-[#151515] shadow-neoSm hover:shadow-neo hover:-translate-y-0.5 transition-all"
          >
            Launch Address Explorer 🔍
          </Link>
        </div>
      </section>
    </div>
  );
}
