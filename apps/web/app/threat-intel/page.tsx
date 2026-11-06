"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoopingLaserLine from "../../components/LoopingLaserLine";

interface CampaignCluster {
  id: string;
  name: string;
  targetAsset: string;
  identifiedVanities: number;
  firstSeen: string;
  status: "ACTIVE" | "CONTAINED" | "MONITORED";
  spoofedPrefix: string;
  spoofedSuffix: string;
  technique: string;
  totalLossEst: string;
}

const CAMPAIGNS: CampaignCluster[] = [
  {
    id: "CAMP-01",
    name: "WBTC High-Net-Worth Vanity Syndicate",
    targetAsset: "Wrapped BTC (WBTC)",
    identifiedVanities: 412,
    firstSeen: "May 2024",
    status: "ACTIVE",
    spoofedPrefix: "0xd9A1c3",
    spoofedSuffix: "44853a91",
    technique: "0.05 ETH Dust Transfer",
    totalLossEst: "$68.4M",
  },
  {
    id: "CAMP-02",
    name: "Tether USD Zero-Value Batch Emitter",
    targetAsset: "USDT (Tether)",
    identifiedVanities: 1840,
    firstSeen: "April 2024",
    status: "ACTIVE",
    spoofedPrefix: "0x71C4",
    spoofedSuffix: "88976F",
    technique: "Transfer(from, to, 0) Gasless",
    totalLossEst: "$14.2M",
  },
  {
    id: "CAMP-03",
    name: "DAO Treasury Payroll Mimic Cluster",
    targetAsset: "USDC / DAI",
    identifiedVanities: 620,
    firstSeen: "July 2024",
    status: "CONTAINED",
    spoofedPrefix: "0x4838",
    spoofedSuffix: "B0BAD5f97",
    technique: "High-Frequency GPU Vanity",
    totalLossEst: "$3.9M",
  },
];

export default function ThreatIntelPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCluster>(CAMPAIGNS[0]);

  return (
    <div className="space-y-14 py-12 md:py-16">
      {/* Top Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-3 border-[#151515] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#151515] text-[#C6F36B] font-mono text-xs uppercase font-black px-2.5 py-1 shadow-neoSm">
                MACRO THREAT SURVEILLANCE
              </span>
              <span className="bg-white text-[#151515] border-2 border-[#151515] font-mono text-[10px] font-bold px-2 py-0.5">
                OPEN FORENSICS
              </span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#151515] tracking-tight">
              Threat Intelligence & Campaign Radar
            </h1>
            <p className="text-sm md:text-base text-[#151515]/80 font-sans max-w-3xl mt-2 font-medium">
              Global threat intelligence tracking automated address-poisoning campaigns, GPU vanity cluster generation rates, and decentralized Arkiv proof distributions across Ethereum.
            </p>
          </div>

          <Link
            href="/explorer"
            className="px-6 py-3.5 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo font-heading font-black text-xs uppercase tracking-wider hover:shadow-neoLg hover:-translate-y-0.5 transition-all self-start md:self-auto shrink-0"
          >
            Launch Address Investigator →
          </Link>
        </div>
      </section>

      {/* Kinetic Scan Line */}
      <LoopingLaserLine
        label="ARKIV THREAT STREAM"
        sublabel="MACRO-CLUSTER SURVEILLANCE"
        theme="dark"
      />

      {/* Macro Metrics HUD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
            <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 block mb-1">
              TRACKED POISONER VANITIES
            </span>
            <div className="font-heading font-black text-4xl text-[#151515]">48,912</div>
            <span className="font-mono text-xs text-[#D94F4F] font-bold block mt-2">
              +342 Detected Last 24h
            </span>
          </div>

          <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
            <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 block mb-1">
              DOCUMENTED ESTIMATED LOSSES
            </span>
            <div className="font-heading font-black text-4xl text-[#D94F4F]">$112.4M</div>
            <span className="font-mono text-xs text-[#151515]/70 font-semibold block mt-2">
              Across 1,280+ Incidents
            </span>
          </div>

          <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
            <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 block mb-1">
              ARKIV ANCHORED PROOFS
            </span>
            <div className="font-heading font-black text-4xl text-[#6B8CFF]">18,420</div>
            <span className="font-mono text-xs text-[#398B60] font-bold block mt-2">
              100% Cryptographically Verified
            </span>
          </div>

          <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
            <span className="text-[10px] font-mono font-bold uppercase text-[#151515]/60 block mb-1">
              SAFE GUARDS ACTIVE
            </span>
            <div className="font-heading font-black text-4xl text-[#398B60]">942</div>
            <span className="font-mono text-xs text-[#151515]/70 font-semibold block mt-2">
              Protecting $450M+ TVL
            </span>
          </div>
        </div>
      </section>

      {/* Active Attack Campaigns Table & Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#151515] pb-3">
          <div>
            <span className="text-[10px] font-mono font-black text-[#151515]/60 uppercase">
              CAMPAIGN SYNDICATE DIRECTORY
            </span>
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Active Address-Poisoning Clusters
            </h3>
          </div>
          <span className="font-mono text-xs text-[#151515]/70">
            Updated hourly via automated heuristic mempool ingestion
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign List (1 Col) */}
          <div className="space-y-3">
            {CAMPAIGNS.map((camp) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaign(camp)}
                className={`w-full text-left p-5 border-3 border-[#151515] transition-all relative ${
                  selectedCampaign.id === camp.id
                    ? "bg-[#151515] text-[#F4F2EC] shadow-neo -translate-x-1"
                    : "bg-white text-[#151515] hover:bg-[#F4F2EC] shadow-neoSm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-[#151515] ${
                    camp.status === "ACTIVE" ? "bg-[#D94F4F] text-white" : "bg-[#398B60] text-white"
                  }`}>
                    {camp.status}
                  </span>
                  <span className="font-mono text-xs font-bold opacity-80">
                    Est: {camp.totalLossEst}
                  </span>
                </div>
                <h4 className="font-heading font-black text-base mb-1">
                  {camp.name}
                </h4>
                <div className="text-xs font-mono opacity-80 flex items-center justify-between">
                  <span>{camp.targetAsset}</span>
                  <span>{camp.identifiedVanities} Vanities</span>
                </div>
              </button>
            ))}
          </div>

          {/* Campaign Deep Dive Inspector (2 Cols) */}
          <div className="lg:col-span-2 bg-white border-3 border-[#151515] shadow-neoLg p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#151515] pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-[#151515]/60">
                  CLUSTER FORENSIC DOSSIER // {selectedCampaign.id}
                </span>
                <h3 className="font-heading font-black text-2xl text-[#151515]">
                  {selectedCampaign.name}
                </h3>
              </div>
              <span className="px-3 py-1 bg-[#C6F36B] text-[#151515] border-2 border-[#151515] font-mono text-xs font-black shadow-neoSm">
                Target: {selectedCampaign.targetAsset}
              </span>
            </div>

            {/* Campaign Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#F4F2EC] border border-[#151515] p-3">
                <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">ATTACK VECTOR:</span>
                <span className="font-black text-[#151515]">{selectedCampaign.technique}</span>
              </div>
              <div className="bg-[#F4F2EC] border border-[#151515] p-3">
                <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">IDENTIFIED VANITIES:</span>
                <span className="font-black text-[#D94F4F]">{selectedCampaign.identifiedVanities} Wallets</span>
              </div>
              <div className="bg-[#F4F2EC] border border-[#151515] p-3">
                <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">TOTAL LOSS RECORDED:</span>
                <span className="font-black text-[#D94F4F]">{selectedCampaign.totalLossEst}</span>
              </div>
            </div>

            {/* Vanity Collision Anatomy Box */}
            <div className="bg-[#ECEAE3] border-2 border-[#151515] p-5 space-y-3 font-mono text-xs">
              <div className="font-black uppercase text-[#151515] flex items-center justify-between">
                <span>VANITY COLLISION FINGERPRINT:</span>
                <span className="text-[10px] text-[#151515]/70">P(collision) ≈ 16^-14</span>
              </div>
              <div className="bg-white border-2 border-[#151515] p-3 break-all flex items-center gap-1 text-xs">
                <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-black">{selectedCampaign.spoofedPrefix}</span>
                <span className="text-[#D94F4F] px-1 line-through">[DIVERGENT GPU MINED CHARS]</span>
                <span className="bg-[#C6F36B] px-1 py-0.5 border border-[#151515] font-black">{selectedCampaign.spoofedSuffix}</span>
              </div>
              <p className="text-[#151515]/80 text-[11px] leading-relaxed">
                The syndicate uses distributed GPU rigs to continuously mine keys that match the leading {selectedCampaign.spoofedPrefix.length} and trailing {selectedCampaign.spoofedSuffix.length} characters of legitimate high-volume treasury counterparties.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="font-mono text-xs text-[#151515]/70">
                All records anchored to Arkiv namespace <code className="font-bold text-[#151515]">hexfence-evidence</code>
              </span>
              <Link
                href="/explorer"
                className="px-5 py-2.5 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neoSm font-heading font-black text-xs uppercase hover:shadow-neo transition-all"
              >
                Inspect Matching Incidents →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

