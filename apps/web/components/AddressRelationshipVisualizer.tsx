"use client";

import React from "react";
import { AddressRelationship, EvidenceStatus } from "../lib/explorer-types";

interface Props {
  relationship: AddressRelationship;
  status: EvidenceStatus;
}

export default function AddressRelationshipVisualizer({ relationship, status }: Props) {
  const {
    genuineAddress,
    suspectedAddress,
    sharedPrefix,
    sharedSuffix,
    divergentCharacters,
    txHash,
    blockNumber,
    token,
    amount,
  } = relationship;

  // Split addresses into prefix, middle, suffix
  const genPrefix = genuineAddress.slice(0, sharedPrefix.length);
  const genSuffix = genuineAddress.slice(genuineAddress.length - sharedSuffix.length);
  const genMiddle = genuineAddress.slice(sharedPrefix.length, genuineAddress.length - sharedSuffix.length);

  const suspPrefix = suspectedAddress.slice(0, sharedPrefix.length);
  const suspSuffix = suspectedAddress.slice(suspectedAddress.length - sharedSuffix.length);
  const suspMiddle = suspectedAddress.slice(sharedPrefix.length, suspectedAddress.length - sharedSuffix.length);

  const getStatusBadge = () => {
    switch (status) {
      case "Confirmed by Review":
        return "bg-[#D94F4F] text-white";
      case "Under Review":
        return "bg-[#151515] text-[#C6F36B]";
      case "Suspected":
        return "bg-[#5E7ED8] text-white";
      case "False Positive":
        return "bg-[#2E7D52] text-white";
      default:
        return "bg-[#151515] text-white";
    }
  };

  return (
    <div className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#151515] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block mb-1">
            RELATIONSHIP TOPOLOGY // VANITY ENTROPY COLLISION
          </span>
          <h3 className="font-heading font-black text-xl text-[#151515]">
            Counterparty Vanity Spoof Analysis
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border border-[#151515] ${getStatusBadge()}`}>
            STATUS: {status}
          </span>
          <span className="px-2.5 py-1 bg-[#FAF9F6] border border-[#151515] shadow-neoSm font-mono text-xs font-bold text-[#151515]">
            Asset: {token}
          </span>
        </div>
      </div>

      {/* Visual Relationship Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* Genuine Address Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#2E7D52] p-5 shadow-neoSm relative">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 bg-[#2E7D52] text-white font-mono text-[11px] font-bold uppercase">
              GENUINE / REFERENCE RECIPIENT
            </span>
            <span className="text-xs font-mono text-[#2E7D52] font-bold">LEGITIMATE</span>
          </div>

          <div className="bg-[#FAF9F6] border border-[#151515] p-3 font-mono text-xs sm:text-sm break-all leading-relaxed select-all">
            <span className="bg-[#C6F36B] text-[#151515] font-bold px-1 py-0.5 border border-[#151515]">
              {genPrefix}
            </span>
            <span className="px-1 text-gray-700">{genMiddle}</span>
            <span className="bg-[#C6F36B] text-[#151515] font-bold px-1 py-0.5 border border-[#151515]">
              {genSuffix}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-3 mt-3 border-t border-gray-200">
            <span>Historical verified counterparty</span>
            <a
              href={`https://etherscan.io/address/${genuineAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#151515] underline font-bold hover:text-[#2E7D52]"
            >
              Etherscan ↗
            </a>
          </div>
        </div>

        {/* Middle Connector Bridge (1 Col) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="h-0.5 w-full bg-[#151515] hidden lg:block" />
          <div className="bg-[#151515] text-[#C6F36B] p-2 border border-[#151515] shadow-neoSm font-mono text-xs font-bold text-center">
            VS
          </div>
          <div className="h-0.5 w-full bg-[#151515] hidden lg:block" />
        </div>

        {/* Suspected Lookalike Address Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#D94F4F] p-5 shadow-neoSm relative">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 bg-[#D94F4F] text-white font-mono text-[11px] font-bold uppercase">
              SUSPECTED LOOKALIKE ADDRESS
            </span>
            <span className="text-xs font-mono text-[#D94F4F] font-bold">POISONER CANDIDATE</span>
          </div>

          <div className="bg-[#FAF9F6] border border-[#151515] p-3 font-mono text-xs sm:text-sm break-all leading-relaxed select-all">
            <span className="bg-[#C6F36B] text-[#151515] font-bold px-1 py-0.5 border border-[#151515]">
              {suspPrefix}
            </span>
            <span className="px-1 text-[#D94F4F] font-bold">
              {suspMiddle}
            </span>
            <span className="bg-[#C6F36B] text-[#151515] font-bold px-1 py-0.5 border border-[#151515]">
              {suspSuffix}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-3 mt-3 border-t border-gray-200">
            <span className="text-[#D94F4F] font-bold">Mismatched middle chars</span>
            <a
              href={`https://etherscan.io/address/${suspectedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D94F4F] underline font-bold"
            >
              Etherscan ↗
            </a>
          </div>
        </div>
      </div>

      {/* Shared Pattern Collision Breakdown Banner */}
      <div className="bg-[#FAF9F6] border border-[#151515] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-500 font-bold uppercase">MATCHING ANATOMY:</span>
          <span className="bg-[#C6F36B] text-[#151515] px-2 py-0.5 border border-[#151515] font-bold">
            Prefix: {sharedPrefix} ({sharedPrefix.length} chars)
          </span>
          <span className="bg-[#C6F36B] text-[#151515] px-2 py-0.5 border border-[#151515] font-bold">
            Suffix: {sharedSuffix} ({sharedSuffix.length} chars)
          </span>
          <span className="bg-white text-[#D94F4F] px-2 py-0.5 border border-[#D94F4F] font-bold">
            Divergent: {divergentCharacters} chars
          </span>
        </div>

        <div className="text-gray-600 font-bold">
          Collision Entropy: <span className="text-[#151515]">16^-({sharedPrefix.length + sharedSuffix.length})</span>
        </div>
      </div>

      {/* Transaction Evidence Footer */}
      <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-gray-600">
        <div>
          <span>Triggering Transaction: </span>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#151515] underline font-bold hover:text-[#5E7ED8]"
          >
            {txHash.slice(0, 14)}...{txHash.slice(-8)} ↗
          </a>
          <span className="ml-2 text-gray-400">Block #{blockNumber}</span>
        </div>
        <div>
          <span className="font-bold text-[#151515]">Transfer Amount: </span>
          <span>{amount} {token}</span>
        </div>
      </div>
    </div>
  );
}
