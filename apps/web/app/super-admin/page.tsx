"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  assignedIncidents: number;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "admins" | "permissions" | "config" | "security" | "audit"
  >("overview");

  // System Configuration State
  const [minVanityMatch, setMinVanityMatch] = useState(10);
  const [dustThresholdEth, setDustThresholdEth] = useState("0.0001");
  const [ivrThresholdUsd, setIvrThresholdUsd] = useState("100000");
  const [arkivPublisherKey, setArkivPublisherKey] = useState(
    "0x78a5C5D8334812a819b16Bcf6B8CFF54178B81a8"
  );
  const [emergencyPause, setEmergencyPause] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Admin users state
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "ADM-01",
      name: "Security Lead Alpha",
      email: "security.alpha@hexfence.eth",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      assignedIncidents: 142,
    },
    {
      id: "ADM-02",
      name: "Arkiv Operator Beta",
      email: "arkiv.beta@hexfence.eth",
      role: "ADMIN",
      status: "ACTIVE",
      assignedIncidents: 89,
    },
    {
      id: "ADM-03",
      name: "Incident Triage Gamma",
      email: "triage.gamma@hexfence.eth",
      role: "ADMIN",
      status: "SUSPENDED",
      assignedIncidents: 12,
    },
  ]);

  const toggleAdminStatus = (id: string) => {
    setAdmins(
      admins.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : a
      )
    );
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dev Mode Banner */}
      <div className="bg-[#D94F4F] text-white border-3 border-[#151515] p-4 flex items-center justify-between font-mono text-xs shadow-neoSm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-white animate-ping" />
          <strong className="uppercase">[DEVELOPMENT_INTERFACE // SUPER_ADMIN_PORTAL]</strong>
          <span className="opacity-90 hidden sm:inline-block">
            — Root System Governance Simulated (No Auth Required)
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#151515] text-[#C6F36B] font-black uppercase">
          Role: Super Admin (Root Governor)
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-3 border-[#151515] pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#151515]/60 block mb-1">
            HEXFENCE ROOT INFRASTRUCTURE
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#151515]">
            Super Admin Control Center
          </h1>
        </div>

        {/* Emergency Killswitch Toggle */}
        <div className="flex items-center gap-3 bg-white border-2 border-[#151515] p-3 shadow-neoSm font-mono text-xs">
          <span className="font-bold text-[#151515]">EMERGENCY CIRCUIT BREAKER:</span>
          <button
            onClick={() => setEmergencyPause(!emergencyPause)}
            className={`px-3 py-1 font-black uppercase transition-colors ${
              emergencyPause
                ? "bg-[#D94F4F] text-white animate-pulse"
                : "bg-[#398B60] text-white"
            }`}
          >
            {emergencyPause ? "CIRCUIT TRIPPED (PAUSED)" : "SYSTEM ARMED (NORMAL)"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#151515] pb-2 font-mono text-xs font-bold">
        {[
          { id: "overview", label: "Overview" },
          { id: "admins", label: `Admin Governance (${admins.length})` },
          { id: "permissions", label: "RBAC Matrix" },
          { id: "config", label: "Heuristic & Arkiv Config" },
          { id: "security", label: "Security & API Keys" },
          { id: "audit", label: "Root Audit Log" },
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
          TAB 1: OVERVIEW
         ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                ARKIV GATEWAY LATENCY
              </span>
              <div className="font-heading font-black text-3xl text-[#398B60]">142 ms</div>
              <span className="font-mono text-xs text-[#151515]/70 block mt-1">
                12 Validating Peers
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                ACTIVE ADMINS
              </span>
              <div className="font-heading font-black text-3xl text-[#151515]">
                {admins.filter((a) => a.status === "ACTIVE").length}
              </div>
              <span className="font-mono text-xs text-[#6B8CFF] font-bold block mt-1">
                2 Security Reviewers
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                MEMPOOL PARSER THROUGHPUT
              </span>
              <div className="font-heading font-black text-3xl text-[#151515]">4.2k tx/s</div>
              <span className="font-mono text-xs text-[#398B60] font-bold block mt-1">
                0 Dropped Blocks
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                EMERGENCY STATUS
              </span>
              <div className="font-heading font-black text-3xl text-[#398B60]">
                {emergencyPause ? "PAUSED" : "OPERATIONAL"}
              </div>
              <span className="font-mono text-xs text-[#151515]/70 block mt-1">
                Global Guard Active
              </span>
            </div>
          </div>

          <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-4 font-mono text-xs">
            <h3 className="font-heading font-black text-xl text-[#151515] border-b-2 border-[#151515] pb-3">
              Root Infrastructure Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F4F2EC] p-4 border border-[#151515]">
                <span className="text-[#151515]/60 text-[10px] uppercase font-bold block mb-1">
                  DETECTOR ENGINE WORKER:
                </span>
                <span className="font-black text-sm text-[#398B60]">RUNNING (PID: 19820)</span>
              </div>
              <div className="bg-[#F4F2EC] p-4 border border-[#151515]">
                <span className="text-[#151515]/60 text-[10px] uppercase font-bold block mb-1">
                  ARKIV PUBLISHER KEY:
                </span>
                <span className="font-black text-xs text-[#151515] break-all select-all">
                  {arkivPublisherKey.slice(0, 16)}...
                </span>
              </div>
              <div className="bg-[#F4F2EC] p-4 border border-[#151515]">
                <span className="text-[#151515]/60 text-[10px] uppercase font-bold block mb-1">
                  IVR DISPATCH ENGINE:
                </span>
                <span className="font-black text-sm text-[#6B8CFF]">READY (TWILIO API ONLINE)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ADMIN MANAGEMENT
         ========================================================================= */}
      {activeTab === "admins" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
            <div>
              <h3 className="font-heading font-black text-2xl text-[#151515]">
                Administrator Governance & Roles
              </h3>
              <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
                Grant or suspend security review privileges for community threat submission moderation.
              </p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {admins.map((adm) => (
              <div key={adm.id} className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-sm text-[#151515]">{adm.name}</span>
                    <span className="px-2 py-0.2 bg-[#151515] text-[#C6F36B] font-bold text-[10px]">
                      {adm.role}
                    </span>
                    <span
                      className={`px-2 py-0.2 font-bold text-[10px] uppercase border border-[#151515] ${
                        adm.status === "ACTIVE"
                          ? "bg-[#398B60] text-white"
                          : "bg-[#D94F4F] text-white"
                      }`}
                    >
                      {adm.status}
                    </span>
                  </div>
                  <div className="text-[#151515]/70 text-[11px]">{adm.email} | Audited {adm.assignedIncidents} Incidents</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAdminStatus(adm.id)}
                    className="px-3 py-1.5 bg-white border border-[#151515] font-bold hover:bg-[#151515] hover:text-[#C6F36B] transition-colors"
                  >
                    {adm.status === "ACTIVE" ? "Suspend Operator" : "Re-activate Operator"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PERMISSIONS MATRIX (RBAC)
         ========================================================================= */}
      {activeTab === "permissions" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Strict platform boundary definitions enforced server-side.
            </p>
          </div>

          <div className="border-2 border-[#151515] font-mono text-xs overflow-x-auto">
            <div className="grid grid-cols-4 p-3 bg-[#ECEAE3] font-bold border-b-2 border-[#151515]">
              <div>System Capability</div>
              <div>User</div>
              <div>Admin</div>
              <div>Super Admin</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-[#151515]/20">
              <div>Address Investigation & Lookup</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-[#151515]/20">
              <div>Submit Threat Report / Dispute</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-[#151515]/20">
              <div>Review & Anchor to Arkiv</div>
              <div className="text-[#D94F4F] font-bold">✕ Forbidden</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-[#151515]/20">
              <div>Manage Admin Operators</div>
              <div className="text-[#D94F4F] font-bold">✕ Forbidden</div>
              <div className="text-[#D94F4F] font-bold">✕ Forbidden</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
            </div>
            <div className="grid grid-cols-4 p-3">
              <div>Calibrate Heuristic Thresholds</div>
              <div className="text-[#D94F4F] font-bold">✕ Forbidden</div>
              <div className="text-[#D94F4F] font-bold">✕ Forbidden</div>
              <div className="text-[#398B60] font-bold">✓ Enabled</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SYSTEM CONFIGURATION
         ========================================================================= */}
      {activeTab === "config" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 max-w-3xl space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Heuristic Calibration & Arkiv Key Configuration
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Tune mathematical collision parameters and decentralized protocol endpoints.
            </p>
          </div>

          {savedNotice && (
            <div className="p-3 bg-[#C6F36B] border-2 border-[#151515] font-mono text-xs font-bold">
              SYSTEM CONFIGURATION APPLIED TO HEURISTIC ENGINE!
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#151515] font-bold uppercase mb-1">
                MINIMUM VANITY COLLISION CHARACTERS (PREFIX + SUFFIX)
              </label>
              <input
                type="number"
                min={6}
                max={16}
                value={minVanityMatch}
                onChange={(e) => setMinVanityMatch(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F4F2EC] border-2 border-[#151515] text-xs font-bold"
              />
              <span className="text-[10px] text-[#151515]/70 mt-1 block">
                Default: 10 hex characters (Probability: 16^-10 ≈ 9.09 × 10^-13)
              </span>
            </div>

            <div>
              <label className="block text-[#151515] font-bold uppercase mb-1">
                DUST DETECTION THRESHOLD (ETH)
              </label>
              <input
                type="text"
                value={dustThresholdEth}
                onChange={(e) => setDustThresholdEth(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border-2 border-[#151515] text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[#151515] font-bold uppercase mb-1">
                URGENT IVR VOICE TRIGGER THRESHOLD (USD EQUIVALENT)
              </label>
              <input
                type="text"
                value={ivrThresholdUsd}
                onChange={(e) => setIvrThresholdUsd(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border-2 border-[#151515] text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[#151515] font-bold uppercase mb-1">
                ARKIV PUBLISHER SIGNER ADDRESS
              </label>
              <input
                type="text"
                value={arkivPublisherKey}
                onChange={(e) => setArkivPublisherKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border-2 border-[#151515] text-xs font-bold"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo font-heading font-black text-xs uppercase tracking-wider hover:shadow-neoLg transition-all"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SECURITY SETTINGS
         ========================================================================= */}
      {activeTab === "security" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 max-w-2xl space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Security & API Access Token Management
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Generate read/write tokens for institutional API ingestion and browser extension feeds.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 space-y-2">
              <span className="font-black text-sm block">EXTENSION API MASTER KEY:</span>
              <div className="bg-white p-2 border border-[#151515] break-all select-all font-bold">
                hf_ext_live_89127cbf9012a8b92c10928a
              </div>
              <span className="text-[10px] text-[#151515]/60 block">Scope: read_address_threats, rate_limit: 1000req/min</span>
            </div>

            <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 space-y-2">
              <span className="font-black text-sm block">ARKIV PROTOCOL RELAY KEY:</span>
              <div className="bg-white p-2 border border-[#151515] break-all select-all font-bold">
                hf_arkiv_relayer_0019283019284019284
              </div>
              <span className="text-[10px] text-[#151515]/60 block">Scope: publish_evidence_proofs</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: ROOT AUDIT LOG
         ========================================================================= */}
      {activeTab === "audit" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <h3 className="font-heading font-black text-2xl text-[#151515]">
              Root System Governance Audit Log
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
              Tamper-evident logs of configuration updates, administrator permissions, and emergency operations.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#F4F2EC] border-2 border-[#151515] p-3.5 flex items-center justify-between">
              <div>
                <span className="font-black text-[#D94F4F]">[CONFIG_CHANGE]</span> Min vanity threshold set to 10 chars
              </div>
              <span className="text-[#151515]/70 text-[11px]">2024-08-20 18:00 UTC • super_admin_01</span>
            </div>
            <div className="bg-[#F4F2EC] border-2 border-[#151515] p-3.5 flex items-center justify-between">
              <div>
                <span className="font-black text-[#6B8CFF]">[KEY_ROTATION]</span> Arkiv publisher signing address verified
              </div>
              <span className="text-[#151515]/70 text-[11px]">2024-08-18 12:30 UTC • super_admin_01</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

