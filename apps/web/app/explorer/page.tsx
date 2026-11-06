"use client";

import React, { useState } from "react";
import {
  EvidenceRecord,
  EvidenceStatus,
  DetectionReason,
} from "../../lib/explorer-types";
import {
  MOCK_EVIDENCE_REGISTRY,
  validateEthereumAddress,
  searchAddressEvidence,
} from "../../lib/mock-evidence";
import AddressRelationshipVisualizer from "../../components/AddressRelationshipVisualizer";
import EvidenceTimeline from "../../components/EvidenceTimeline";

// Sample verified addresses for quick testing
const QUICK_SAMPLES = [
  {
    label: "Case 1: $68M WBTC Lookalike",
    address: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
    tag: "Confirmed Poisoner",
  },
  {
    label: "Case 2: Zero-Value USDT Spoof",
    address: "0x71C412a83158c35B4EbA692998982312d288976F",
    tag: "Confirmed Poisoner",
  },
  {
    label: "Case 3: DAO Multi-Sig Counterparty",
    address: "0x483896587c4273E1B95B1348b598A913B0BAD5f97",
    tag: "Under Review",
  },
  {
    label: "Case 4: 1inch Router",
    address: "0x1111111254fb6c44bac0bed2854e76f90643097d",
    tag: "False Positive",
  },
  {
    label: "Clean Unindexed Address",
    address: "0x534631Bcf33BDb069fB20A75d2791Cd8F9345f4f",
    tag: "No Threat Recorded",
  },
];

export default function AddressExplorerPage() {
  const [searchInput, setSearchInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [tokenFilter, setTokenFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [reasonFilter, setReasonFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const executeSearch = (rawAddress: string) => {
    const validation = validateEthereumAddress(rawAddress);
    if (!validation.isValid) {
      setInputError(validation.error || "Invalid Ethereum address format.");
      return;
    }

    setInputError(null);
    setActiveAddress(rawAddress.trim());
    setHasSearched(true);
  };

  const handleQuickSelect = (addr: string) => {
    setSearchInput(addr);
    executeSearch(addr);
  };

  // Run search on mock dataset
  const investigationResult = activeAddress
    ? searchAddressEvidence(activeAddress)
    : null;

  // Apply filters to evidence records
  const filteredEvidence = (investigationResult?.evidenceList || []).filter((item) => {
    if (tokenFilter !== "ALL" && item.relationship.token !== tokenFilter) {
      return false;
    }
    if (statusFilter !== "ALL" && item.status !== statusFilter) {
      return false;
    }
    if (reasonFilter !== "ALL" && item.detectionReason !== reasonFilter) {
      return false;
    }
    if (dateFilter !== "ALL") {
      const recordDate = new Date(item.isoDate);
      const now = new Date();
      const diffDays = (now.getTime() - recordDate.getTime()) / (1000 * 3600 * 24);
      if (dateFilter === "24H" && diffDays > 1) return false;
      if (dateFilter === "7D" && diffDays > 7) return false;
      if (dateFilter === "30D" && diffDays > 30) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Header Banner */}
      <div className="border-b-2 border-[#151515] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-bold px-2.5 py-1 shadow-neoSm">
              PUBLIC INVESTIGATION PORTAL
            </span>
            <span className="bg-white text-[#151515] border border-[#151515] font-mono text-[10px] font-bold px-2 py-0.5">
              ARKIV PUBLIC EVIDENCE LAYER
            </span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#151515] tracking-tight">
            Ethereum Address Threat Explorer
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-sans max-w-3xl mt-2 font-medium">
            Search any Ethereum wallet or contract address to audit historical lookalike collisions, check decentralized Arkiv evidence receipts, and inspect character vanity mimicry.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="bg-white border-2 border-[#151515] p-3.5 shadow-neoSm font-mono text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E7D52] animate-ping" />
            <span className="font-bold text-[#151515]">ARKIV GATEWAY CONNECTED</span>
          </div>
          <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
            Namespace: hexfence-evidence • v2.4.2
          </span>
        </div>
      </div>

      {/* Address Search Form */}
      <div className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-8 space-y-5">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block font-mono text-xs font-bold text-[#151515] uppercase tracking-wider">
            ENTER ETHEREUM ADDRESS TO INVESTIGATE:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-mono text-xs font-bold text-gray-400">
                ETH
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91"
                className={`w-full pl-12 pr-4 py-3 bg-[#FAF9F6] border-2 font-mono text-xs sm:text-sm text-[#151515] focus:outline-none focus:bg-white transition-colors ${
                  inputError
                    ? "border-[#D94F4F] bg-[#FFF2F2] text-[#D94F4F]"
                    : "border-[#151515]"
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-[#151515] text-[#C6F36B] border border-[#151515] shadow-neoSm font-heading font-black text-sm uppercase tracking-wider hover:bg-[#252525] hover:-translate-y-0.5 transition-all"
            >
              Investigate Address 🔍
            </button>
          </div>

          {/* Validation Error Banner */}
          {inputError && (
            <div className="p-3 bg-[#FFF2F2] border border-[#D94F4F] text-[#D94F4F] font-mono text-xs flex items-center gap-2">
              <span className="font-bold text-sm">⚠</span>
              <span>{inputError}</span>
            </div>
          )}
        </form>

        {/* Quick Sample Selector */}
        <div className="pt-3 border-t border-gray-200">
          <span className="font-mono text-[11px] font-bold text-gray-500 block mb-2 uppercase">
            Quick Investigation Samples:
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_SAMPLES.map((sample) => (
              <button
                key={sample.label}
                onClick={() => handleQuickSelect(sample.address)}
                className="px-3 py-1.5 bg-white border border-[#151515] shadow-neoSm hover:bg-[#FAF9F6] hover:-translate-y-0.5 font-mono text-xs font-bold text-[#151515] transition-all flex items-center gap-2"
              >
                <span>{sample.label}</span>
                <span className="px-1.5 py-0.2 bg-[#FAF9F6] text-[9px] border border-gray-300 uppercase font-bold text-gray-700">
                  {sample.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE INVESTIGATION RESULTS PANEL
         ========================================================================= */}
      {hasSearched && investigationResult && (
        <div className="space-y-8">
          {/* Address Status Card */}
          <div className="bg-[#151515] text-[#F4F2EC] border-2 border-[#151515] shadow-neo p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#333333] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#C6F36B] uppercase tracking-wider block mb-1">
                  INVESTIGATED TARGET WALLET
                </span>
                <div className="font-mono text-sm md:text-lg font-bold break-all text-white select-all">
                  {investigationResult.address}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`https://etherscan.io/address/${investigationResult.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white text-[#151515] border border-[#151515] font-mono text-xs font-bold uppercase hover:bg-[#FAF9F6] transition-colors"
                >
                  View on Etherscan ↗
                </a>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  INVESTIGATION STATUS:
                </span>
                <span className="font-bold text-[#C6F36B]">AUDIT COMPLETED</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  MATCHING EVIDENCE:
                </span>
                <span
                  className={`font-bold ${
                    investigationResult.hasMatchingEvidence
                      ? "text-[#D94F4F]"
                      : "text-gray-200"
                  }`}
                >
                  {investigationResult.hasMatchingEvidence
                    ? `FOUND (${investigationResult.totalAssociatedLookalikes} RECORD${investigationResult.totalAssociatedLookalikes > 1 ? "S" : ""})`
                    : "NO THREAT EVIDENCE FOUND"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  SUSPECTED LOOKALIKES:
                </span>
                <span className="font-bold text-white">
                  {investigationResult.totalAssociatedLookalikes} IDENTIFIED
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  AUDIT TIMESTAMP:
                </span>
                <span className="text-white">
                  {new Date(investigationResult.searchedAt).toLocaleTimeString()} UTC
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              IF NO EVIDENCE EXISTS (NEUTRAL INFORMATIVE EMPTY STATE)
             ========================================================================= */}
          {!investigationResult.hasMatchingEvidence && (
            <div className="bg-white border-2 border-[#151515] shadow-neo p-8 md:p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-[#FAF9F6] border border-[#151515] flex items-center justify-center text-xl mx-auto shadow-neoSm">
                🔍
              </div>
              <h3 className="font-heading font-black text-2xl text-[#151515]">
                No matching threat evidence found in the currently available dataset.
              </h3>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto font-sans leading-relaxed font-medium">
                This address is not currently indexed in any reported vanity lookalike cluster or confirmed address-poisoning incident record within the Arkiv protocol registry.
              </p>

              {/* Explicit Security Notice: No fake green badge */}
              <div className="bg-[#FAF9F6] border-l-4 border-[#151515] p-4 max-w-xl mx-auto text-left font-mono text-xs text-gray-800">
                <strong className="block mb-1 text-[#151515] font-bold uppercase">
                  IMPORTANT CYBERSECURITY NOTICE:
                </strong>
                The absence of indexed evidence does NOT guarantee that an address is safe. Adversaries generate new lookalikes on-demand. Always verify all 42 characters manually or use the HexFence Safe Guard.
              </div>
            </div>
          )}

          {/* =========================================================================
              IF MATCHING EVIDENCE EXISTS
             ========================================================================= */}
          {investigationResult.hasMatchingEvidence && (
            <div className="space-y-8">
              {/* Filter Controls Bar */}
              <div className="bg-white border-2 border-[#151515] shadow-neoSm p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase text-[#151515]">
                      FILTER EVIDENCE:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    {/* Token Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-[10px] font-bold">TOKEN:</span>
                      <select
                        value={tokenFilter}
                        onChange={(e) => setTokenFilter(e.target.value)}
                        className="bg-[#FAF9F6] border border-[#151515] px-2 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="ALL">All Tokens</option>
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                        <option value="WBTC">WBTC</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-[10px] font-bold">STATUS:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#FAF9F6] border border-[#151515] px-2 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="Suspected">Suspected</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Confirmed by Review">Confirmed by Review</option>
                        <option value="False Positive">False Positive</option>
                      </select>
                    </div>

                    {/* Detection Reason */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-[10px] font-bold">REASON:</span>
                      <select
                        value={reasonFilter}
                        onChange={(e) => setReasonFilter(e.target.value)}
                        className="bg-[#FAF9F6] border border-[#151515] px-2 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="ALL">All Reasons</option>
                        <option value="Dust Transfer">Dust Transfer</option>
                        <option value="Zero-Value Transfer">Zero-Value Transfer</option>
                        <option value="GPU Vanity Collision">GPU Vanity Collision</option>
                        <option value="High Hamming Similarity">High Hamming Similarity</option>
                      </select>
                    </div>

                    {/* Reset Filters */}
                    {(tokenFilter !== "ALL" || statusFilter !== "ALL" || reasonFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setTokenFilter("ALL");
                          setStatusFilter("ALL");
                          setReasonFilter("ALL");
                        }}
                        className="px-2 py-1 bg-[#151515] text-[#C6F36B] font-bold text-xs uppercase"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Relationship Visualizers */}
              <div className="space-y-6">
                {filteredEvidence.map((record) => (
                  <AddressRelationshipVisualizer
                    key={record.id}
                    relationship={record.relationship}
                    status={record.status}
                  />
                ))}
              </div>

              {/* Evidence Timeline */}
              <EvidenceTimeline evidenceList={filteredEvidence} />
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GLOBAL DATASET SUMMARY (WHEN NO SEARCH ACTIVE)
         ========================================================================= */}
      {!hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#151515] pb-3">
            <h3 className="font-heading font-black text-xl text-[#151515]">
              Recently Verified Arkiv Threat Incidents
            </h3>
            <span className="font-mono text-xs text-gray-500">
              Live Mock Evidence Registry ({MOCK_EVIDENCE_REGISTRY.length} Incident Records)
            </span>
          </div>

          <div className="space-y-4">
            {MOCK_EVIDENCE_REGISTRY.map((record) => {
              const getStatusBadge = () => {
                switch (record.status) {
                  case "Confirmed by Review":
                    return "bg-[#D94F4F] text-white";
                  case "Under Review":
                    return "bg-[#151515] text-[#C6F36B]";
                  case "False Positive":
                    return "bg-[#2E7D52] text-white";
                  default:
                    return "bg-[#5E7ED8] text-white";
                }
              };

              return (
                <div
                  key={record.id}
                  className="bg-white border-2 border-[#151515] p-5 shadow-neoSm hover:shadow-neo hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 font-mono text-[11px] font-bold uppercase border border-[#151515] ${getStatusBadge()}`}
                      >
                        {record.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#151515]">
                        {record.detectionReason}
                      </span>
                      <span className="px-2 py-0.2 bg-[#FAF9F6] border border-gray-300 font-mono text-[10px] font-bold text-gray-700">
                        {record.relationship.token}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-gray-500 flex items-center gap-2">
                      <span>{record.detectionTimestamp}</span>
                      <span>•</span>
                      <button
                        onClick={() => handleQuickSelect(record.investigatedAddress)}
                        className="text-[#151515] font-bold underline hover:text-[#5E7ED8] transition-colors"
                      >
                        Audit This Incident →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#FAF9F6] p-3 border border-gray-300">
                      <span className="text-[10px] uppercase font-bold text-[#2E7D52] block mb-0.5">
                        Genuine Counterparty:
                      </span>
                      <span className="break-all font-medium select-all text-[#151515]">
                        {record.relationship.genuineAddress}
                      </span>
                    </div>
                    <div className="bg-[#FFF8F8] p-3 border border-[#D94F4F]/40">
                      <span className="text-[10px] uppercase font-bold text-[#D94F4F] block mb-0.5">
                        Attacker Vanity Lookalike:
                      </span>
                      <span className="break-all font-bold select-all text-[#D94F4F]">
                        {record.relationship.suspectedAddress}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
