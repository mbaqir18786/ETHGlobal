"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DocSection {
  id: string;
  title: string;
  category: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const sections: DocSection[] = [
    {
      id: "overview",
      title: "Platform Overview & Threat Model",
      category: "Getting Started",
      content: (
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-[#151515]">
            Platform Overview & Threat Model
          </h2>
          <p className="text-sm text-[#151515]/80 leading-relaxed font-sans">
            HexFence is an open-architecture blockchain security platform engineered specifically to neutralize Ethereum address-poisoning attacks.
          </p>

          <div className="bg-[#ECEAE3] border-2 border-[#151515] p-5 font-mono text-xs space-y-2">
            <div className="font-bold text-[#151515]">CORE SYSTEM PACKAGES:</div>
            <div>• <code className="font-bold">services/detector</code>: Algorithmic vanity collision scoring engine</div>
            <div>• <code className="font-bold">packages/shared</code>: Canonical TypeScript interfaces and Zod schemas</div>
            <div>• <code className="font-bold">packages/contracts</code>: Solidity Safe Guard (<code className="font-bold">HexFenceGuard.sol</code>)</div>
            <div>• <code className="font-bold">apps/extension</code>: Manifest V3 Chrome Extension client defense</div>
            <div>• <code className="font-bold">apps/web & apps/explorer</code>: Refined Neo-Brutalist interfaces</div>
          </div>

          <h3 className="font-heading font-bold text-lg text-[#151515]">
            Guiding Security Principles
          </h3>
          <ul className="space-y-3 font-mono text-xs text-[#151515]">
            <li className="flex items-start gap-2">
              <span className="text-[#398B60] font-bold">1.</span>
              <span><strong>Zero Key Custody:</strong> HexFence never handles private keys, seed phrases, or sensitive wallet signing credentials.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#398B60] font-bold">2.</span>
              <span><strong>Server-Enforced Authorization:</strong> Role-based access control (User, Admin, Super Admin) is verified on the backend.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#398B60] font-bold">3.</span>
              <span><strong>Factual Integrity:</strong> No simulated telemetry or synthetic attacks are ever disguised as real production transactions.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "detector",
      title: "Heuristic Detection Engine",
      category: "Services",
      content: (
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-[#151515]">
            Heuristic Detection Engine (<code className="text-lg">services/detector</code>)
          </h2>
          <p className="text-sm text-[#151515]/80 leading-relaxed font-sans">
            The detection engine evaluates candidate addresses using multi-factor heuristics. It computes collision distances and classifies risks into deterministic bands.
          </p>

          <div className="bg-[#151515] text-[#C6F36B] border-2 border-[#151515] p-4 font-mono text-xs overflow-x-auto">
            <pre>
{`// services/detector/src/scorer.ts
export interface AddressScoreResult {
  candidateAddress: string;
  mimickedAddress: string;
  prefixLength: number;
  suffixLength: number;
  divergenceLength: number;
  isDustTransaction: boolean;
  isZeroValueTransfer: boolean;
  threatScore: number; // 0 - 100
  classification: "SAFE" | "SUSPICIOUS" | "CRITICAL_POISONED";
}`}
            </pre>
          </div>

          <h3 className="font-heading font-bold text-lg text-[#151515]">
            Classification Thresholds
          </h3>
          <div className="border-2 border-[#151515] bg-white font-mono text-xs">
            <div className="grid grid-cols-3 p-3 border-b-2 border-[#151515] font-bold bg-[#ECEAE3]">
              <div>Score Range</div>
              <div>Classification</div>
              <div>Action</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-[#151515]/20">
              <div className="font-bold">0 - 20</div>
              <div className="text-[#398B60] font-bold">SAFE</div>
              <div>Normal Transaction Allowed</div>
            </div>
            <div className="grid grid-cols-3 p-3 border-b border-[#151515]/20">
              <div className="font-bold">21 - 60</div>
              <div className="text-[#D9A441] font-bold">SUSPICIOUS</div>
              <div>Warning Prompt Triggered</div>
            </div>
            <div className="grid grid-cols-3 p-3">
              <div className="font-bold">61 - 100</div>
              <div className="text-[#D94F4F] font-bold">CRITICAL_POISONED</div>
              <div>Execution Blocked by Guard</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "arkiv",
      title: "Arkiv Public Evidence Protocol",
      category: "Evidence",
      content: (
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-[#151515]">
            Arkiv Public Evidence Protocol
          </h2>
          <p className="text-sm text-[#151515]/80 leading-relaxed font-sans">
            Confirmed poisoning events are cryptographically hashed and published to the Arkiv decentralized network under the namespace <code className="font-mono font-bold bg-[#ECEAE3] px-1">hexfence-evidence</code>.
          </p>

          <div className="bg-[#151515] text-[#F4F2EC] border-2 border-[#151515] p-4 font-mono text-xs overflow-x-auto">
            <pre>
{`// Canonical Arkiv Evidence Proof Structure
{
  "@context": "https://arkiv.network/v1/evidence",
  "protocol": "HexFence",
  "proofId": "arkiv://hexfence-evidence/proof_0x...",
  "threatType": "ETHEREUM_ADDRESS_POISONING",
  "attackerVanityAddress": "0x...",
  "mimickedCounterparty": "0x...",
  "heuristics": {
    "prefixCollision": "0xd9A1c3",
    "suffixCollision": "44853a91",
    "divergence": 26
  },
  "signature": "0x..."
}`}
            </pre>
          </div>

          <div className="p-4 bg-[#6B8CFF]/10 border-2 border-[#6B8CFF] font-mono text-xs text-[#151515]">
            <strong>Auditability:</strong> Because proofs are anchored on Arkiv, any third-party researcher or wallet team can query our public gateway or verify receipts on-chain without trusting a centralized database.
          </div>
        </div>
      ),
    },
    {
      id: "contracts",
      title: "Solidity Safe Guard",
      category: "Contracts",
      content: (
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-[#151515]">
            Solidity Safe Guard (<code className="text-lg">HexFenceGuard.sol</code>)
          </h2>
          <p className="text-sm text-[#151515]/80 leading-relaxed font-sans">
            The Safe Guard integrates natively with Gnosis Safe through the <code className="font-mono font-bold">BaseGuard</code> interface.
          </p>

          <div className="bg-[#151515] text-[#C6F36B] border-2 border-[#151515] p-4 font-mono text-xs overflow-x-auto">
            <pre>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@gnosis.pm/safe-contracts/contracts/base/Guard.sol";

contract HexFenceGuard is BaseGuard {
    mapping(address => bool) public isPoisonedAddress;

    error TransactionToPoisonedAddress(address destination);

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external view override {
        if (isPoisonedAddress[to]) {
            revert TransactionToPoisonedAddress(to);
        }
    }

    function checkAfterExecution(bytes32 txHash, bool success) external override {}
}`}
            </pre>
          </div>

          <p className="text-xs text-[#151515]/80 font-mono">
            When enabled on a Safe, the contract verifies the destination in <code className="font-bold">checkTransaction()</code> before any multi-sig signatures are consumed.
          </p>
        </div>
      ),
    },
    {
      id: "extension",
      title: "Chrome Manifest V3 Extension",
      category: "Client",
      content: (
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-[#151515]">
            Chrome Manifest V3 Extension (<code className="text-lg">apps/extension</code>)
          </h2>
          <p className="text-sm text-[#151515]/80 leading-relaxed font-sans">
            The browser extension safeguards individuals using MetaMask, Rabby, or browser wallets.
          </p>

          <h3 className="font-heading font-bold text-lg text-[#151515]">
            Installation Guide
          </h3>
          <div className="bg-[#F4F2EC] border-2 border-[#151515] p-5 font-mono text-xs space-y-3">
            <div>1. Clone the repository and navigate to <code className="bg-white px-1 font-bold">apps/extension</code>.</div>
            <div>2. Open Google Chrome and enter <code className="bg-white px-1 font-bold">chrome://extensions</code> into the URL bar.</div>
            <div>3. Toggle <strong>Developer mode</strong> in the top-right corner.</div>
            <div>4. Click <strong>Load unpacked</strong> and select the <code className="bg-white px-1 font-bold">apps/extension</code> directory.</div>
            <div>5. The HexFence icon will appear in your extension toolbar.</div>
          </div>
        </div>
      ),
    },
  ];

  const currentSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="border-b-2 border-[#151515] pb-6 mb-8">
        <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-bold px-2 py-0.5">
          Engineering Documentation
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#151515] mt-2">
          HexFence System Architecture & Specifications
        </h1>
        <p className="text-sm text-[#151515]/70 font-mono mt-1">
          Technical specifications for developers, auditors, and security engineers.
        </p>
      </div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <div className="text-xs font-mono font-bold text-[#151515]/60 uppercase tracking-wider mb-3">
            Documentation Index
          </div>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full text-left px-4 py-2.5 font-heading text-xs font-bold border-2 border-[#151515] transition-all ${
                activeTab === sec.id
                  ? "bg-[#151515] text-[#C6F36B] shadow-neoSm"
                  : "bg-white text-[#151515] hover:bg-[#ECEAE3]"
              }`}
            >
              {sec.title}
            </button>
          ))}

          <div className="pt-6 border-t-2 border-[#151515]/20">
            <Link
              href="/explorer"
              className="block w-full text-center px-4 py-2 bg-[#C6F36B] border-2 border-[#151515] shadow-neoSm font-heading font-bold text-xs hover:-translate-y-0.5 transition-transform"
            >
              Launch Threat Explorer →
            </Link>
          </div>
        </aside>

        {/* Content Pane */}
        <div className="md:col-span-3 bg-white border-2 border-[#151515] shadow-neo p-8 md:p-10">
          {currentSection.content}
        </div>
      </div>
    </div>
  );
}

