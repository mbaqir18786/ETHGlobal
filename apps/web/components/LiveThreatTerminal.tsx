"use client";

import React, { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  time: string;
  block: number;
  type: "INTERCEPTED" | "ANALYZING" | "ARKIV_ANCHORED" | "SAFE";
  target: string;
  spoof: string;
  detail: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    time: "03:38:12",
    block: 21142890,
    type: "INTERCEPTED",
    target: "0xd9A1c3...44853a91",
    spoof: "0xd9A1C3...44853a91",
    detail: "Vanity match (14 chars) | Dust 0.0001 ETH | Divergence in mid-26 chars",
  },
  {
    id: "log-2",
    time: "03:38:18",
    block: 21142891,
    type: "ARKIV_ANCHORED",
    target: "0x71C409...d7288976",
    spoof: "0x71C412...d288976F",
    detail: "Zero-Value Transfer(from, to, 0) | Proof #9821 published to Arkiv",
  },
  {
    id: "log-3",
    time: "03:38:24",
    block: 21142892,
    type: "ANALYZING",
    target: "0x4838B1...cE8B0BAD",
    spoof: "0x483896...A913B0BA",
    detail: "Prefix match 0x4838 | GPU vanity generation fingerprint detected",
  },
  {
    id: "log-4",
    time: "03:38:30",
    block: 21142893,
    type: "SAFE",
    target: "0x28C6c0...355E5743",
    spoof: "N/A",
    detail: "Legitimate counterparty verified via 12 past outgoing txs",
  },
];

export default function LiveThreatTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<"terminal" | "matrix">("terminal");

  // Simulate new incoming mempool transactions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newBlock = 21142890 + Math.floor(Math.random() * 20);
      const isThreat = Math.random() > 0.35;

      const newEntry: LogEntry = isThreat
        ? {
            id: `log-${Date.now()}`,
            time: timeStr,
            block: newBlock,
            type: Math.random() > 0.5 ? "INTERCEPTED" : "ARKIV_ANCHORED",
            target: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
            spoof: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
            detail: "Dust injection flagged | Safe Guard policy triggered",
          }
        : {
            id: `log-${Date.now()}`,
            time: timeStr,
            block: newBlock,
            type: "SAFE",
            target: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
            spoof: "N/A",
            detail: "Regular transfer approved by address history cache",
          };

      setLogs((prev) => [newEntry, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#151515] border-3 border-[#151515] shadow-neoLg text-[#F4F2EC] font-mono text-xs overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="bg-[#262626] border-b-2 border-[#151515] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#D94F4F] inline-block border border-black" />
          <span className="w-3 h-3 bg-[#D9A441] inline-block border border-black" />
          <span className="w-3 h-3 bg-[#398B60] inline-block border border-black" />
          <span className="text-xs font-bold text-[#F4F2EC] ml-2 tracking-wider">
            HEXFENCE_MEMPOOL_INGESTION_DAEMON // V2.4
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6F36B] animate-ping" />
          <span className="text-[#C6F36B] text-[10px] font-bold uppercase tracking-wider">
            STREAM: ACTIVE (12 PEERS)
          </span>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="p-5 space-y-3 font-mono overflow-x-auto min-h-[220px]">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-[#2e2e2e] pb-2 text-xs">
            <div className="text-[#F4F2EC]/50 shrink-0 font-bold">
              [{log.time}] #{log.block}
            </div>

            <div className="shrink-0">
              {log.type === "INTERCEPTED" && (
                <span className="px-2 py-0.5 bg-[#D94F4F] text-white font-extrabold text-[10px] uppercase">
                  ⚡ INTERCEPTED
                </span>
              )}
              {log.type === "ARKIV_ANCHORED" && (
                <span className="px-2 py-0.5 bg-[#6B8CFF] text-[#151515] font-extrabold text-[10px] uppercase">
                  🔗 ARKIV ANCHORED
                </span>
              )}
              {log.type === "ANALYZING" && (
                <span className="px-2 py-0.5 bg-[#D9A441] text-[#151515] font-extrabold text-[10px] uppercase">
                  🔍 SCANNING
                </span>
              )}
              {log.type === "SAFE" && (
                <span className="px-2 py-0.5 bg-[#398B60] text-white font-extrabold text-[10px] uppercase">
                  ✓ VERIFIED SAFE
                </span>
              )}
            </div>

            <div className="text-[#F4F2EC] shrink-0 font-bold">
              {log.target} {log.spoof !== "N/A" && <span className="text-[#D94F4F]">&lt;-- [SPOOF: {log.spoof}]</span>}
            </div>

            <div className="text-[#F4F2EC]/70 text-[11px] truncate flex-1">
              {log.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-[#1f1f1f] px-4 py-2 border-t border-[#333333] flex items-center justify-between text-[11px] text-[#F4F2EC]/70">
        <div>Total Filtered Transactions: <strong className="text-[#C6F36B]">142,890</strong></div>
        <div>Engine Latency: <strong className="text-[#C6F36B]">1.2ms</strong></div>
      </div>
    </div>
  );
}

