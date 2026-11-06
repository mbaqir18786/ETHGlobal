"use client";

import React, { useState } from "react";

interface AddressPair {
  label: string;
  genuine: string;
  poisoned: string;
  token: string;
  lossContext: string;
}

const SAMPLE_PAIRS: AddressPair[] = [
  {
    label: "Case 1: $68M WBTC Poisoning Incident (May 2024)",
    genuine: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
    poisoned: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
    token: "1,152 WBTC ($68,000,000)",
    lossContext: "Victim copied the address from transaction history after receiving a 0.05 ETH dust transfer matching the exact first 6 and last 6 characters.",
  },
  {
    label: "Case 2: Zero-Value USDT Poisoner",
    genuine: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
    poisoned: "0x71C412a83158c35B4EbA692998982312d288976F",
    token: "250,000 USDT",
    lossContext: "Attacker emitted a fake Transfer(from, to, 0) event spoofing a verified transfer in MetaMask transaction history.",
  },
  {
    label: "Case 3: High-Frequency Multi-Sig Vault",
    genuine: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
    poisoned: "0x483896587c4273E1B95B1348b598A913B0BAD5f97",
    token: "500 ETH",
    lossContext: "Lookalike address vanity generated with identical leading 5 and trailing 7 characters using GPU clusters.",
  },
];

export default function AddressDiffViewer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = SAMPLE_PAIRS[selectedIdx];

  // Helper to split address into prefix (6 chars), middle (28 chars), suffix (6 chars)
  const parseParts = (addr: string) => {
    return {
      prefix: addr.slice(0, 6),
      middle: addr.slice(6, addr.length - 6),
      suffix: addr.slice(addr.length - 6),
    };
  };

  const genParts = parseParts(current.genuine);
  const poisParts = parseParts(current.poisoned);

  return (
    <div className="bg-white border-2 border-[#151515] shadow-neoLg p-6 md:p-8">
      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#151515] pb-4 mb-6">
        <div>
          <span className="inline-block bg-[#151515] text-[#C6F36B] font-mono text-[10px] uppercase font-bold px-2 py-0.5 mb-1">
            Real Attack Vector Simulation
          </span>
          <h3 className="font-heading font-bold text-lg md:text-xl text-[#151515]">
            Vanity Address Collision Comparator
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PAIRS.map((pair, idx) => (
            <button
              key={pair.label}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1 text-xs font-mono font-semibold border-2 border-[#151515] transition-all ${
                selectedIdx === idx
                  ? "bg-[#C6F36B] text-[#151515] shadow-neoSm font-bold"
                  : "bg-white text-[#151515] hover:bg-[#ECEAE3]"
              }`}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-sans text-[#151515]/80 mb-6 bg-[#ECEAE3] border-l-4 border-[#151515] p-3 font-medium">
        <strong className="text-[#151515] font-bold">Context: </strong>
        {current.lossContext}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Genuine Address Card */}
        <div className="border-2 border-[#398B60] bg-[#398B60]/5 p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#398B60] text-white font-mono text-xs font-bold uppercase">
              <span>✓</span> Genuine Counterparty
            </span>
            <span className="font-mono text-xs text-[#398B60] font-bold">
              Target Value: {current.token}
            </span>
          </div>

          <div className="bg-white border-2 border-[#151515] p-4 font-mono text-xs md:text-sm break-all leading-loose">
            <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-bold text-[#151515]">
              {genParts.prefix}
            </span>
            <span className="px-1 text-[#151515] font-normal">
              {genParts.middle}
            </span>
            <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-bold text-[#151515]">
              {genParts.suffix}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#151515]/70 font-mono">
            <span>Verified established recipient</span>
            <span className="text-[#398B60] font-semibold">SAFE</span>
          </div>
        </div>

        {/* Poisoned Lookalike Address Card */}
        <div className="border-2 border-[#D94F4F] bg-[#D94F4F]/5 p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#D94F4F] text-white font-mono text-xs font-bold uppercase">
              <span>⚠</span> Attacker Vanity Lookalike
            </span>
            <span className="font-mono text-xs text-[#D94F4F] font-bold">
              Vanity Collision: 12 Hex Chars
            </span>
          </div>

          <div className="bg-white border-2 border-[#151515] p-4 font-mono text-xs md:text-sm break-all leading-loose">
            <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-bold text-[#151515]">
              {poisParts.prefix}
            </span>
            <span className="bg-[#D94F4F]/20 text-[#D94F4F] px-1 py-0.5 border border-[#D94F4F] font-bold line-through">
              {poisParts.middle}
            </span>
            <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-bold text-[#151515]">
              {poisParts.suffix}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#D94F4F] font-bold">CRITICAL POISONING MATCH</span>
            <span className="bg-[#D94F4F] text-white px-1.5 py-0.2 font-bold">REJECTED BY GUARD</span>
          </div>
        </div>
      </div>

      {/* Explanatory breakdown banner */}
      <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-[#151515] text-[#C6F36B] border border-[#151515] flex items-center justify-center font-bold text-sm">
            i
          </div>
          <p className="text-xs text-[#151515] leading-snug">
            Standard wallet interfaces truncate addresses into <code className="font-bold font-mono">0xd9A1...3a91</code>. 
            Because the attacker’s prefix and suffix match precisely, the human eye cannot distinguish the fraud without automated heuristic screening.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-[#C6F36B] border border-[#151515]" />
          <span className="text-[11px] font-mono font-bold text-[#151515]">Spoofed Match</span>
          <span className="inline-block w-3 h-3 bg-[#D94F4F] border border-[#151515] ml-2" />
          <span className="text-[11px] font-mono font-bold text-[#151515]">Attacker Divergence</span>
        </div>
      </div>
    </div>
  );
}

