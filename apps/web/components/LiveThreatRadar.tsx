"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ThreatIncident {
  id: string;
  token: string;
  tokenColor: string;
  tokenBg: string;
  title: string;
  targetAddress: string;
  lookalikeAddress: string;
  detectedTime: string;
  status: "BLOCKED BY SAFE GUARD" | "SEALED ON ARKIV" | "INTERCEPTED BY EXTENSION" | "HEURISTIC FLAGGED";
  statusBg: string;
  statusText: string;
  collisionChars: number;
  entropy: string;
  capitalAtRisk: string;
  attackVector: string;
}

const LIVE_INCIDENTS: ThreatIncident[] = [
  {
    id: "INC-9812",
    token: "WBTC",
    tokenColor: "#B45309",
    tokenBg: "#FEF3C7",
    title: "$68M High-Entropy Vanity Poisoning",
    targetAddress: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
    lookalikeAddress: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
    detectedTime: "2 mins ago",
    status: "BLOCKED BY SAFE GUARD",
    statusBg: "#D94F4F",
    statusText: "#FFFFFF",
    collisionChars: 14,
    entropy: "16^-14",
    capitalAtRisk: "1,162 WBTC ($68,000,000)",
    attackVector: "0.05 ETH dust transfer mimicry",
  },
  {
    id: "INC-7421",
    token: "USDT",
    tokenColor: "#047857",
    tokenBg: "#D1FAE5",
    title: "Zero-Value Spoofed transferFrom Attack",
    targetAddress: "0x28c6c06298d514db089934071355e5743bf21d60",
    lookalikeAddress: "0x28c6c06283748281928392817283948271bf21d60",
    detectedTime: "8 mins ago",
    status: "SEALED ON ARKIV",
    statusBg: "#8B5CF6",
    statusText: "#FFFFFF",
    collisionChars: 15,
    entropy: "16^-15",
    capitalAtRisk: "250,000 USDT ($250,000)",
    attackVector: "Zero-value event log injection",
  },
  {
    id: "INC-5190",
    token: "USDC",
    tokenColor: "#1D4ED8",
    tokenBg: "#DBEAFE",
    title: "DAO Payroll Lookalike Clone Sweep",
    targetAddress: "0xa090e606e30bd747d4e6245a1517ebe430f0057e",
    lookalikeAddress: "0xa090e606e30b1293810293810293810293f0057e",
    detectedTime: "14 mins ago",
    status: "INTERCEPTED BY EXTENSION",
    statusBg: "#C6F36B",
    statusText: "#151515",
    collisionChars: 12,
    entropy: "16^-12",
    capitalAtRisk: "145,000 USDC ($145,000)",
    attackVector: "Pre-signing browser paste intercept",
  },
  {
    id: "INC-3904",
    token: "ETH",
    tokenColor: "#4338CA",
    tokenBg: "#E0E7FF",
    title: "Mempool GPU Cluster Vanity Injection",
    targetAddress: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
    lookalikeAddress: "0x71C412a83158c35B4EbA692998982312d288976F",
    detectedTime: "21 mins ago",
    status: "HEURISTIC FLAGGED",
    statusBg: "#F59E0B",
    statusText: "#151515",
    collisionChars: 12,
    entropy: "16^-12",
    capitalAtRisk: "50 ETH ($185,000)",
    attackVector: "Rapid counterparty replacement spoof",
  },
];

export default function LiveThreatRadar() {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<ThreatIncident | null>(null);

  const filtered = LIVE_INCIDENTS.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "BLOCKED") return item.status === "BLOCKED BY SAFE GUARD";
    if (filter === "ARKIV") return item.status === "SEALED ON ARKIV";
    if (filter === "EXTENSION") return item.status === "INTERCEPTED BY EXTENSION";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#151515] p-4 shadow-neo">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
          <div>
            <h3 className="font-heading font-black text-lg text-[#151515] flex items-center gap-2">
              <span>Live Threat Interception Radar</span>
              <span className="px-2 py-0.5 bg-[#FEF08A] text-[#151515] border border-[#151515] text-[10px] font-mono font-bold uppercase">
                Active Mempool
              </span>
            </h3>
            <span className="text-xs font-mono text-gray-500 font-medium">
              Real-time heuristic detections &amp; Safe Guard protection events
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {[
            { id: "ALL", label: "All Incidents" },
            { id: "BLOCKED", label: "Safe Guard Blocks" },
            { id: "ARKIV", label: "Arkiv Proofs" },
            { id: "EXTENSION", label: "Extension Alerts" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={`px-3 py-1 font-bold border border-[#151515] transition-all duration-200 ${
                filter === pill.id
                  ? "bg-[#151515] text-[#C6F36B] shadow-neoSm translate-x-[-1px] translate-y-[-1px]"
                  : "bg-[#FAF9F6] text-[#151515] hover:bg-white"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colourful Incident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-[#151515] p-5 shadow-neo hover:shadow-neoLg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group"
            onClick={() => setSelectedIncident(item)}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 font-mono font-bold text-xs border border-[#151515] shadow-neoSm"
                    style={{ backgroundColor: item.tokenBg, color: item.tokenColor }}
                  >
                    {item.token}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    {item.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 font-mono font-black text-[10px] uppercase border border-[#151515] shadow-neoSm"
                    style={{ backgroundColor: item.statusBg, color: item.statusText }}
                  >
                    {item.status}
                  </span>
                  <span className="font-mono text-[11px] text-gray-400">
                    {item.detectedTime}
                  </span>
                </div>
              </div>

              {/* Title & Threat Description */}
              <h4 className="font-heading font-black text-base text-[#151515] group-hover:text-[#5E7ED8] transition-colors mb-1">
                {item.title}
              </h4>
              <p className="text-xs font-mono text-gray-600 font-medium mb-3">
                Attack Vector: <strong className="text-[#151515]">{item.attackVector}</strong>
              </p>

              {/* Address Visualizer Box */}
              <div className="space-y-2 bg-[#FAF9F6] border border-[#151515] p-3 font-mono text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#2E7D52]">Genuine Payee:</span>
                  <span className="text-[11px] font-bold text-[#151515] break-all select-all">
                    <span className="bg-[#BAF7D0] px-1">{item.targetAddress.slice(0, 6)}</span>
                    <span className="text-gray-400">...</span>
                    <span className="bg-[#BAF7D0] px-1">{item.targetAddress.slice(-6)}</span>
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 border-t border-gray-200 pt-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#D94F4F]">Attacker Vanity:</span>
                  <span className="text-[11px] font-bold text-[#D94F4F] break-all select-all">
                    <span className="bg-[#FED7AA] text-[#151515] px-1">{item.lookalikeAddress.slice(0, 6)}</span>
                    <span className="text-gray-400">...</span>
                    <span className="bg-[#FED7AA] text-[#151515] px-1">{item.lookalikeAddress.slice(-6)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FEF08A] text-[#151515] border border-[#151515] text-[10px] font-bold">
                  {item.collisionChars} Colliding Chars
                </span>
                <span className="text-gray-500 text-[11px]">
                  Entropy: <strong>{item.entropy}</strong>
                </span>
              </div>
              <span className="text-xs font-bold text-[#151515] group-hover:underline">
                Inspect Incident →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Incident Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#F4F2EC] border-3 border-[#151515] shadow-neo max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between border-b-2 border-[#151515] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 font-mono font-bold text-xs border border-[#151515]"
                  style={{ backgroundColor: selectedIncident.tokenBg, color: selectedIncident.tokenColor }}
                >
                  {selectedIncident.token}
                </span>
                <strong className="text-sm font-black text-[#151515]">
                  {selectedIncident.id} Telemetry Breakdown
                </strong>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="w-7 h-7 bg-white border border-[#151515] font-bold flex items-center justify-center hover:bg-[#D94F4F] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-white border-2 border-[#151515] p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Incident Title:</span>
                <strong className="text-sm text-[#151515]">{selectedIncident.title}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#151515] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Capital at Risk:</span>
                  <span className="font-bold text-[#151515]">{selectedIncident.capitalAtRisk}</span>
                </div>
                <div className="bg-white border border-[#151515] p-2.5">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Collision Probability:</span>
                  <span className="font-bold text-[#D94F4F]">{selectedIncident.entropy} (Intentional GPU Brute)</span>
                </div>
              </div>

              <div className="bg-white border-2 border-[#151515] p-3 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#2E7D52] block">Legitimate Payee Address:</span>
                  <span className="break-all font-bold text-[#151515]">{selectedIncident.targetAddress}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#D94F4F] block">Attacker Lookalike Address:</span>
                  <span className="break-all font-bold text-[#D94F4F]">{selectedIncident.lookalikeAddress}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/explorer?address=${selectedIncident.targetAddress}`}
                className="px-4 py-2 bg-[#C6F36B] text-[#151515] border-2 border-[#151515] font-black uppercase shadow-neoSm hover:shadow-neo transition-all"
              >
                Open in Address Explorer 🔍
              </Link>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-white text-[#151515] border-2 border-[#151515] font-bold uppercase shadow-neoSm hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

