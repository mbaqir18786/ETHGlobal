"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PendingSubmission {
  id: string;
  suspectedAddress: string;
  genuineAddress: string;
  reporter: string;
  submittedAt: string;
  token: string;
  amount: string;
  status: "Pending Review" | "Under Review" | "Confirmed" | "Rejected";
  heuristicConfidence: number;
}

interface DisputeItem {
  id: string;
  address: string;
  contractName: string;
  claimant: string;
  submittedAt: string;
  status: "Under Review" | "Cleared" | "Upheld";
  documentationLink: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  operator: string;
  target: string;
  timestamp: string;
  badge: "ANCHOR" | "DISPUTE" | "REVERT" | "REVIEW";
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "queue" | "evidence" | "disputes" | "audit"
  >("overview");

  const [submissions, setSubmissions] = useState<PendingSubmission[]>([
    {
      id: "SUB-8921",
      suspectedAddress: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
      genuineAddress: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
      reporter: "0x89ab...12ef",
      submittedAt: "2024-05-04 10:12 UTC",
      token: "WBTC",
      amount: "1,152 WBTC ($68M Target)",
      status: "Under Review",
      heuristicConfidence: 98,
    },
    {
      id: "SUB-8922",
      suspectedAddress: "0x71C412a83158c35B4EbA692998982312d288976F",
      genuineAddress: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
      reporter: "0x44cd...991a",
      submittedAt: "2024-06-14 09:30 UTC",
      token: "USDT",
      amount: "250,000 USDT",
      status: "Pending Review",
      heuristicConfidence: 94,
    },
    {
      id: "SUB-8923",
      suspectedAddress: "0x483896587c4273E1B95B1348b598A913B0BAD5f97",
      genuineAddress: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
      reporter: "0x12fa...7788",
      submittedAt: "2024-07-21 16:45 UTC",
      token: "USDC",
      amount: "500 ETH ($1.8M)",
      status: "Pending Review",
      heuristicConfidence: 89,
    },
  ]);

  const [disputes, setDisputes] = useState<DisputeItem[]>([
    {
      id: "DISP-101",
      address: "0x1111111254fb6c44bac0bed2854e76f90643097d",
      contractName: "1inch Aggregation Router v5",
      claimant: "1inch DevOps Core",
      submittedAt: "2024-08-15 14:10 UTC",
      status: "Under Review",
      documentationLink: "https://etherscan.io/address/0x1111111254fb6c44bac0bed2854e76f90643097d",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: "AUD-401",
      action: "ANCHORED_TO_ARKIV",
      operator: "admin_security_01",
      target: "proof_0x8f2a991a3e8749b (WBTC Incident)",
      timestamp: "2024-05-04 11:20:01 UTC",
      badge: "ANCHOR",
    },
    {
      id: "AUD-402",
      action: "DISPUTE_REVIEW_STARTED",
      operator: "admin_security_02",
      target: "0x1111111254fb6c44bac0bed2854e76f90643097d",
      timestamp: "2024-08-15 15:00:12 UTC",
      badge: "DISPUTE",
    },
  ]);

  const updateSubmissionStatus = (id: string, newStatus: "Confirmed" | "Rejected") => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    const targetSub = submissions.find((s) => s.id === id);
    if (targetSub) {
      const newAudit: AuditLogItem = {
        id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
        action: newStatus === "Confirmed" ? "ANCHORED_TO_ARKIV" : "SUBMISSION_REJECTED",
        operator: "admin_dev_operator",
        target: `${targetSub.suspectedAddress.slice(0, 10)}... (${targetSub.token})`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        badge: newStatus === "Confirmed" ? "ANCHOR" : "REVIEW",
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }
  };

  const resolveDispute = (id: string, resolution: "Cleared" | "Upheld") => {
    setDisputes(
      disputes.map((d) => (d.id === id ? { ...d, status: resolution } : d))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dev Mode Banner */}
      <div className="bg-[#151515] text-[#C6F36B] border-3 border-[#151515] p-4 flex items-center justify-between font-mono text-xs shadow-neoSm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C6F36B] animate-ping" />
          <strong className="text-white uppercase">[DEVELOPMENT_INTERFACE // ADMIN_PORTAL]</strong>
          <span className="text-[#C6F36B]/80 hidden sm:inline-block">
            — Authorized Reviewer Session Simulated (No Auth Required)
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#C6F36B] text-[#151515] font-black uppercase">
          Role: Admin (Security Officer)
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-3 border-[#151515] pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#151515]/60 block mb-1">
            HEXFENCE PLATFORM GOVERNANCE
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#151515]">
            Security Administration Portal
          </h1>
        </div>

        <div className="font-mono text-xs bg-white border-2 border-[#151515] p-3 shadow-neoSm">
          <span className="text-[#151515]/70 block text-[10px] uppercase font-bold">ARKIV PUBLISHER STATUS:</span>
          <span className="font-black text-[#398B60]">AUTHORIZED // SECP256K1 KEY LOADED</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#151515] pb-2 font-mono text-xs font-bold">
        {[
          { id: "overview", label: "Overview" },
          { id: "queue", label: `Review Queue (${submissions.filter((s) => s.status !== "Confirmed" && s.status !== "Rejected").length})` },
          { id: "evidence", label: "Evidence Dossiers" },
          { id: "disputes", label: `Dispute Claims (${disputes.length})` },
          { id: "audit", label: `Audit Trail (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border-2 border-[#151515] transition-all ${
              activeTab === tab.id
                ? "bg-[#151515] text-[#C6F36B] shadow-neoSm font-black"
                : "bg-white text-[#151515] hover:bg-[#F4F2EC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: ADMIN OVERVIEW
         ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                PENDING SUBMISSIONS
              </span>
              <div className="font-heading font-black text-3xl text-[#151515]">
                {submissions.filter((s) => s.status === "Pending Review").length}
              </div>
              <span className="font-mono text-xs text-[#D9A441] font-bold block mt-1">
                Requires Heuristic Review
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                ACTIVE DISPUTES
              </span>
              <div className="font-heading font-black text-3xl text-[#D94F4F]">
                {disputes.filter((d) => d.status === "Under Review").length}
              </div>
              <span className="font-mono text-xs text-[#151515]/70 block mt-1">
                False-Positive Appeals
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                ARKIV RECEIPTS PUBLISHED
              </span>
              <div className="font-heading font-black text-3xl text-[#6B8CFF]">18,420</div>
              <span className="font-mono text-xs text-[#398B60] font-bold block mt-1">
                Namespace: hexfence-evidence
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                SYSTEM HEURISTIC BAND
              </span>
              <div className="font-heading font-black text-3xl text-[#398B60]">90%+</div>
              <span className="font-mono text-xs text-[#151515]/70 block mt-1">
                Critical Confidence Gate
              </span>
            </div>
          </div>

          {/* Quick Review Action */}
          <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
              <h3 className="font-heading font-black text-xl text-[#151515]">
                High-Confidence Threat Submissions Requiring Arkiv Publication
              </h3>
              <button
                onClick={() => setActiveTab("queue")}
                className="font-mono text-xs font-bold text-[#151515] underline hover:text-[#D94F4F]"
              >
                Go to Review Queue →
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-[#151515]">{sub.id}</span>
                      <span className="px-2 py-0.2 bg-[#151515] text-[#C6F36B] font-bold text-[10px]">
                        CONFIDENCE: {sub.heuristicConfidence}%
                      </span>
                      <span className="text-[#151515]/60">{sub.token} ({sub.amount})</span>
                    </div>
                    <div className="text-[11px] text-[#151515]/80 break-all">
                      Suspect: <span className="font-bold text-[#D94F4F]">{sub.suspectedAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status === "Confirmed" ? (
                      <span className="px-3 py-1 bg-[#398B60] text-white font-bold text-xs uppercase">
                        Anchored to Arkiv ✓
                      </span>
                    ) : sub.status === "Rejected" ? (
                      <span className="px-3 py-1 bg-[#D94F4F] text-white font-bold text-xs uppercase">
                        Rejected ✕
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => updateSubmissionStatus(sub.id, "Confirmed")}
                          className="px-3 py-1.5 bg-[#151515] text-[#C6F36B] border border-[#151515] font-bold hover:shadow-neoSm"
                        >
                          Approve & Anchor
                        </button>
                        <button
                          onClick={() => updateSubmissionStatus(sub.id, "Rejected")}
                          className="px-3 py-1.5 bg-white text-[#D94F4F] border border-[#151515] font-bold hover:bg-[#D94F4F] hover:text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: REVIEW QUEUE
         ========================================================================= */}
      {activeTab === "queue" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
            <div>
              <h3 className="font-heading font-black text-2xl text-[#151515]">
                Community Submission Moderation Queue
              </h3>
              <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
                Inspect heuristic entropy and anchor verified attack signatures to the Arkiv public evidence layer.
              </p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-[#F4F2EC] border-2 border-[#151515] p-5 space-y-3 shadow-neoSm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151515]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">{sub.id}</span>
                    <span className="px-2 py-0.5 bg-[#C6F36B] text-[#151515] font-bold border border-[#151515] text-[10px]">
                      CONFIDENCE: {sub.heuristicConfidence}%
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-[#151515] font-bold">
                      {sub.token}
                    </span>
                  </div>
                  <span className="text-[#151515]/70 text-[11px]">Submitted: {sub.submittedAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">
                      SUSPECTED LOOKALIKE ADDRESS:
                    </span>
                    <span className="font-bold text-[#D94F4F] break-all select-all">{sub.suspectedAddress}</span>
                  </div>
                  <div>
                    <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">
                      MIMICKED RECIPIENT:
                    </span>
                    <span className="font-bold text-[#151515] break-all select-all">{sub.genuineAddress}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#151515]/10">
                  <div className="text-[11px] text-[#151515]/70">
                    Reported by: <code className="font-bold">{sub.reporter}</code> | Target Loss: <strong className="text-[#151515]">{sub.amount}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.status === "Confirmed" ? (
                      <span className="px-3 py-1 bg-[#398B60] text-white font-bold text-xs uppercase">
                        Anchored to Arkiv ✓
                      </span>
                    ) : sub.status === "Rejected" ? (
                      <span className="px-3 py-1 bg-[#D94F4F] text-white font-bold text-xs uppercase">
                        Submission Dismissed ✕
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => updateSubmissionStatus(sub.id, "Confirmed")}
                          className="px-4 py-2 bg-[#151515] text-[#C6F36B] border border-[#151515] font-bold hover:shadow-neoSm uppercase text-xs"
                        >
                          Approve & Anchor to Arkiv
                        </button>
                        <button
                          onClick={() => updateSubmissionStatus(sub.id, "Rejected")}
                          className="px-4 py-2 bg-white text-[#D94F4F] border border-[#151515] font-bold hover:bg-[#D94F4F] hover:text-white uppercase text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: EVIDENCE DOSSIERS
         ========================================================================= */}
      {activeTab === "evidence" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Arkiv Cryptographic Payload Inspector
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Review raw cryptographic signatures and proof payloads before anchoring to the Arkiv public protocol.
            </p>
          </div>

          <div className="bg-[#151515] text-[#C6F36B] p-5 font-mono text-xs border-2 border-[#151515] overflow-x-auto">
            <pre>
{`// SAMPLE DECENTRALIZED EVIDENCE RECEIPT (SECP256K1)
{
  "@context": "https://arkiv.network/v1/evidence",
  "threatType": "ETHEREUM_ADDRESS_POISONING",
  "proofId": "arkiv://hexfence-evidence/proof_0x8f2a991a3e8749b",
  "payload": {
    "targetVictim": "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
    "attackerVanity": "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
    "matchedPrefix": "0xd9A1c3",
    "matchedSuffix": "44853a91",
    "mismatchDivergence": 26,
    "confidenceScore": 98,
    "vector": "Dust Transfer"
  },
  "publisherKey": "0x78a5C5D8334812a819b16Bcf6B8CFF54178B81a8",
  "signature": "0x7f1a92...a89b"
}`}
            </pre>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FALSE-POSITIVE DISPUTES
         ========================================================================= */}
      {activeTab === "disputes" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              False-Positive Dispute Resolution Queue
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Review and clear legitimate vanity contracts and protocols that were accidentally flagged by automated heuristics.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {disputes.map((disp) => (
              <div key={disp.id} className="bg-[#F4F2EC] border-2 border-[#151515] p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151515]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">{disp.id}</span>
                    <span className="font-bold text-[#151515]">{disp.contractName}</span>
                    <span
                      className={`px-2 py-0.2 font-bold uppercase border border-[#151515] text-[10px] ${
                        disp.status === "Cleared"
                          ? "bg-[#398B60] text-white"
                          : disp.status === "Upheld"
                          ? "bg-[#D94F4F] text-white"
                          : "bg-[#D9A441] text-[#151515]"
                      }`}
                    >
                      {disp.status}
                    </span>
                  </div>
                  <span className="text-[#151515]/60 text-[11px]">{disp.submittedAt}</span>
                </div>

                <div>
                  <span className="text-[#151515]/60 text-[10px] uppercase block font-bold">FLAGGED CONTRACT:</span>
                  <span className="font-bold break-all">{disp.address}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={disp.documentationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6B8CFF] font-bold underline"
                  >
                    View Etherscan Verified Source ↗
                  </a>

                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveDispute(disp.id, "Cleared")}
                      className="px-3 py-1 bg-[#398B60] text-white border border-[#151515] font-bold"
                    >
                      Clear & Whitelist
                    </button>
                    <button
                      onClick={() => resolveDispute(disp.id, "Upheld")}
                      className="px-3 py-1 bg-[#D94F4F] text-white border border-[#151515] font-bold"
                    >
                      Uphold Flag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: AUDIT LOGS
         ========================================================================= */}
      {activeTab === "audit" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Administrative Audit Activity Log
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Immutable chronological record of administrator reviews, Arkiv publications, and dispute resolutions.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#151515]">{log.id}</span>
                  <span className="px-2 py-0.5 bg-[#151515] text-[#C6F36B] font-bold text-[10px] uppercase">
                    {log.action}
                  </span>
                  <span className="text-[#151515] font-semibold">{log.target}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#151515]/70">
                  <span>Operator: <strong>{log.operator}</strong></span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

