"use client";

import React, { useState } from "react";

interface ArchNode {
  id: string;
  number: string;
  title: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  summary: string;
  tech: string;
  detail: string;
  securityScope: string;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: "detector",
    number: "01",
    title: "Detection Engine",
    category: "HEURISTICS",
    badgeBg: "bg-[#151515]",
    badgeText: "text-[#C6F36B]",
    summary: "Evaluates mempool events in real time for prefix/suffix collision entropy, dust amounts, and zero-value transfers.",
    tech: "TypeScript • Hamming / Levenshtein Distance • Viem • Multicall3",
    detail: "Calculates mathematical threat score (0-100) and detects prefix/suffix match patterns with sub-3ms latency.",
    securityScope: "Mempool stream inspection & mathematical entropy boundary",
  },
  {
    id: "arkiv",
    number: "02",
    title: "Arkiv Protocol Layer",
    category: "DECENTRALIZED EVIDENCE",
    badgeBg: "bg-[#5E7ED8]",
    badgeText: "text-white",
    summary: "Anchors forensic incident receipts permanently to the decentralized Arkiv protocol with cryptographic proofs.",
    tech: "JSON-LD • secp256k1 Signatures • Arkiv Gateway • EIP-712",
    detail: "Guarantees that once lookalikes are detected, proofs cannot be manipulated, deleted, or centrally modified.",
    securityScope: "Decentralized tamper-evident audit trail & public verifiable receipts",
  },
  {
    id: "extension",
    number: "03",
    title: "Client-Side Browser Extension",
    category: "RECIPIENT INTERCEPTOR",
    badgeBg: "bg-[#151515]",
    badgeText: "text-white",
    summary: "Actively monitors address paste actions inside dApps (Uniswap, Etherscan, Safe), visually flagging mismatched middle characters.",
    tech: "Manifest V3 • In-Tab DOM Interceptor • Local IndexedDB Cache",
    detail: "Warns users before transaction signing, eliminating the truncation blindspot where standard wallets deceive victims.",
    securityScope: "Zero credential access: reads only address inputs in active DOM",
  },
  {
    id: "guard",
    number: "04",
    title: "Gnosis Safe Guard Contract",
    category: "ON-CHAIN ENFORCEMENT",
    badgeBg: "bg-[#D94F4F]",
    badgeText: "text-white",
    summary: "Solidity smart contract implementing Gnosis Safe BaseGuard to automatically revert poisoned multi-sig executions.",
    tech: "Solidity 0.8.24 • Safe BaseGuard • Hardhat • Foundry",
    detail: "Intercepts execTransaction in the Safe before gas is spent, halting payment if recipient is a confirmed poisoner.",
    securityScope: "Deterministic on-chain revert logic with registry verification",
  },
  {
    id: "explorer",
    number: "05",
    title: "Public Threat Explorer",
    category: "INVESTIGATION PORTAL",
    badgeBg: "bg-[#2E7D52]",
    badgeText: "text-white",
    summary: "Public interface to search any Ethereum address, inspect vanity collisions, and view open Arkiv receipts.",
    tech: "Next.js 14 • Tailwind CSS • Refined Neo-Brutalist UI • Wagmi",
    detail: "Empowers security researchers, traders, and DAO operators to verify addresses without authentication or bias.",
    securityScope: "Public read-only forensic portal with non-biased validation",
  },
];

export default function ArchitectureDiagram() {
  const [selectedId, setSelectedId] = useState<string>(ARCH_NODES[0].id);
  const activeNode = ARCH_NODES.find((n) => n.id === selectedId) || ARCH_NODES[0];

  return (
    <div className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#151515] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#151515] text-[#C6F36B] font-mono text-[10px] font-bold uppercase px-2.5 py-0.5">
              SYSTEM TOPOLOGY // END-TO-END DEFENSE
            </span>
            <span className="font-mono text-[10px] text-gray-500 uppercase">
              5 INTERLOCKING COMPONENTS
            </span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#151515]">
            The 5 Coordinated Defense Pillars
          </h3>
        </div>
        <p className="font-mono text-xs text-gray-600 max-w-sm">
          Select any node to inspect operational role, cryptographic boundaries, and technology stack.
        </p>
      </div>

      {/* Interactive Node Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ARCH_NODES.map((node) => {
          const isSelected = node.id === selectedId;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedId(node.id)}
              className={`p-4 border-2 text-left transition-all relative ${
                isSelected
                  ? "bg-[#151515] text-white border-[#151515] shadow-neo -translate-y-1"
                  : "bg-white text-[#151515] border-[#151515] hover:bg-[#FAF9F6] shadow-neoSm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-xs font-bold ${
                    isSelected ? "text-[#C6F36B]" : "text-gray-500"
                  }`}
                >
                  {node.number}
                </span>
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                    isSelected
                      ? "bg-[#252525] text-gray-200 border border-gray-700"
                      : "bg-[#F4F2EC] text-gray-700"
                  }`}
                >
                  {node.category}
                </span>
              </div>
              <h4 className="font-heading font-black text-sm tracking-tight">
                {node.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Selected Node Deep-Dive Inspection Panel */}
      <div className="bg-[#FAF9F6] border-2 border-[#151515] p-6 shadow-neoSm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-300 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 font-mono text-xs font-bold uppercase ${activeNode.badgeBg} ${activeNode.badgeText}`}
            >
              MODULE {activeNode.number}
            </span>
            <h4 className="font-heading font-black text-xl text-[#151515]">
              {activeNode.title}
            </h4>
          </div>
          <span className="font-mono text-xs text-gray-500 font-semibold">
            {activeNode.category}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-500 block mb-1">
                OPERATIONAL SUMMARY
              </span>
              <p className="text-sm font-sans text-gray-800 leading-relaxed font-medium">
                {activeNode.summary}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-gray-500 block mb-1">
                DETAILED MECHANISM
              </span>
              <p className="text-xs font-mono text-gray-700 leading-relaxed">
                {activeNode.detail}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-white border border-[#151515] p-4 font-mono text-xs shadow-neoSm">
            <div>
              <span className="text-[10px] uppercase text-gray-400 block mb-1">
                TECHNOLOGY STACK
              </span>
              <span className="text-[#151515] font-bold block leading-relaxed">
                {activeNode.tech}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <span className="text-[10px] uppercase text-gray-400 block mb-1">
                SECURITY BOUNDARY
              </span>
              <span className="text-gray-700 block leading-relaxed">
                {activeNode.securityScope}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
