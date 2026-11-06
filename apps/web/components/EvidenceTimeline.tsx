"use client";

import React from "react";
import { EvidenceRecord } from "../lib/explorer-types";

interface Props {
  evidenceList: EvidenceRecord[];
}

export default function EvidenceTimeline({ evidenceList }: Props) {
  if (evidenceList.length === 0) return null;

  return (
    <div className="bg-white border-2 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block mb-1">
            FORENSIC AUDIT TRAIL // CHRONOLOGICAL LOG
          </span>
          <h3 className="font-heading font-black text-xl text-[#151515]">
            Evidence Chronology &amp; Arkiv Receipts
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-[#151515] text-[#C6F36B] font-mono text-xs font-bold uppercase shadow-neoSm">
          {evidenceList.length} RECORD{evidenceList.length > 1 ? "S" : ""} ANCHORED
        </span>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#151515] before:z-0">
        {evidenceList.map((item) => {
          const getStatusBadge = () => {
            switch (item.status) {
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
            <div key={item.id} className="relative z-10 pl-8 space-y-3">
              {/* Dot marker */}
              <div className="absolute left-1.5 top-2 w-3.5 h-3.5 bg-[#C6F36B] border border-[#151515] shadow-neoSm" />

              <div className="bg-[#FAF9F6] border border-[#151515] shadow-neoSm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 font-mono text-xs font-bold uppercase border border-[#151515] ${getStatusBadge()}`}>
                      {item.status}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#151515]">
                      Reason: {item.detectionReason}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-gray-500 flex items-center gap-3">
                    <span>Detected: <strong className="text-[#151515]">{item.detectionTimestamp}</strong></span>
                    <span>•</span>
                    <span className="bg-white px-2 py-0.5 border border-gray-300 font-bold text-[#151515]">
                      {item.detectorVersion}
                    </span>
                  </div>
                </div>

                {/* Evidence Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold uppercase">
                      ARKIV EVIDENCE ID:
                    </span>
                    <span className="font-bold text-[#151515] break-all select-all">
                      {item.arkivEvidenceId}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold uppercase">
                      INCIDENT TRANSACTION HASH:
                    </span>
                    <a
                      href={item.etherscanTxUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#151515] underline hover:text-[#5E7ED8] break-all"
                    >
                      {item.relationship.txHash} ↗
                    </a>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white border border-gray-300 p-3 text-xs font-sans text-gray-800 leading-relaxed">
                  <strong className="font-mono font-bold text-[#151515]">Investigator Notes: </strong>
                  {item.investigationNotes}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
