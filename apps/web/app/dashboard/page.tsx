"use client";

import React, { useState } from "react";
import Link from "next/link";
import { validateEthereumAddress } from "../../lib/mock-evidence";

interface UserReport {
  id: string;
  suspectedAddress: string;
  genuineAddress: string;
  txHash: string;
  token: string;
  status: "Pending Review" | "Confirmed by Review" | "Under Review" | "False Positive";
  submittedAt: string;
}

interface MonitoredWallet {
  id: string;
  address: string;
  label: string;
  type: "Gnosis Safe Multi-Sig" | "EOA Treasury";
  safeGuardActive: boolean;
  activeThreatCount: number;
}

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "reports" | "report-threat" | "report-fp" | "safes" | "notifications" | "profile"
  >("overview");

  // Form states for reporting
  const [reportSuspect, setReportSuspect] = useState("");
  const [reportGenuine, setReportGenuine] = useState("");
  const [reportTx, setReportTx] = useState("");
  const [reportToken, setReportToken] = useState("USDT");
  const [reportNotes, setReportNotes] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // False positive form states
  const [fpAddress, setFpAddress] = useState("");
  const [fpReason, setFpReason] = useState("");
  const [fpSuccess, setFpSuccess] = useState(false);

  // User Reports State
  const [userReports, setUserReports] = useState<UserReport[]>([
    {
      id: "REP-9021",
      suspectedAddress: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
      genuineAddress: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
      txHash: "0x8f2a991a3e8749b5c208479b18361029c7381920acbf82019b83749b01294821",
      token: "WBTC",
      status: "Confirmed by Review",
      submittedAt: "2024-05-04 09:12 UTC",
    },
    {
      id: "REP-9022",
      suspectedAddress: "0x483896587c4273E1B95B1348b598A913B0BAD5f97",
      genuineAddress: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
      txHash: "0x99ddc1201fa88279812903819023801284901823901289038129038129038129",
      token: "USDC",
      status: "Under Review",
      submittedAt: "2024-07-21 14:30 UTC",
    },
  ]);

  // Monitored Wallets State
  const [monitoredSafes, setMonitoredSafes] = useState<MonitoredWallet[]>([
    {
      id: "safe-1",
      address: "0x3841C5f71E3C8A02901239102830192840192840",
      label: "DAO Mainnet Multi-Sig Treasury",
      type: "Gnosis Safe Multi-Sig",
      safeGuardActive: true,
      activeThreatCount: 0,
    },
    {
      id: "safe-2",
      address: "0x9182371928301928301928401928301928301928",
      label: "Deployer Operating Vault",
      type: "EOA Treasury",
      safeGuardActive: false,
      activeThreatCount: 1,
    },
  ]);

  // Notifications & IVR State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifIVR, setNotifIVR] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);

  // Phone Verification & Voice Alerts (Phase 10)
  const [phoneNumber, setPhoneNumber] = useState("+1-555-019-2834");
  const [otpInput, setOtpInput] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [otpFeedback, setOtpFeedback] = useState<string | null>(null);
  const [activeCallModal, setActiveCallModal] = useState<{
    callId: string;
    destinationPhone: string;
    eventType: "CONFIRMED_BLOCKED_ON_CHAIN" | "ATTEMPTED_TX";
    script: string;
    lang: "en" | "hi";
    status: string;
  } | null>(null);

  const [ivrLogs, setIvrLogs] = useState<Array<{
    id: string;
    time: string;
    phone: string;
    event: string;
    status: "DISPATCHED" | "RATE_LIMITED" | "DEDUPLICATED";
    note: string;
  }>>([
    {
      id: "CALL-882190",
      time: "2 mins ago",
      phone: "+1-555-019-2834",
      event: "CONFIRMED_BLOCKED_ON_CHAIN",
      status: "DISPATCHED",
      note: "[SIMULATION] Safe Guard blocked lookalike $68M WBTC payment. Spoken voice alert completed.",
    },
    {
      id: "CALL-882189",
      time: "10 mins ago",
      phone: "+1-555-019-2834",
      event: "CONFIRMED_BLOCKED_ON_CHAIN",
      status: "DEDUPLICATED",
      note: "[SIMULATION] Suppressed repeated call for identical txHash within cooldown window.",
    },
  ]);

  const [lastCallTimestamp, setLastCallTimestamp] = useState<number>(Date.now() - 120_000);

  const handleSendOtp = () => {
    setOtpFeedback("📱 [SIMULATION] SMS verification code sent: '779409'. Valid for 10 minutes.");
  };

  const handleVerifyOtp = () => {
    if (otpInput === "779409" || otpInput.length === 6) {
      setIsPhoneVerified(true);
      setOtpFeedback("✅ Phone number verified successfully for emergency IVR voice alerts.");
    } else {
      setOtpFeedback("❌ Invalid verification code. Try '779409' (Simulated OTP).");
    }
  };

  const triggerVoiceSimulation = (
    eventType: "CONFIRMED_BLOCKED_ON_CHAIN" | "ATTEMPTED_TX",
    lang: "en" | "hi"
  ) => {
    const now = Date.now();
    // Rate limit check: 30s cooldown
    if (now - lastCallTimestamp < 30_000) {
      const waitSec = Math.ceil((30_000 - (now - lastCallTimestamp)) / 1000);
      alert(`⚠️ Rate Limit Active: Voice notification throttled to prevent fatigue. Retry in ${waitSec}s.`);
      return;
    }

    setLastCallTimestamp(now);
    const callId = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;

    const isConfirmed = eventType === "CONFIRMED_BLOCKED_ON_CHAIN";
    const scriptEn = isConfirmed
      ? "HexFence Security Alert. A confirmed blocked lookalike transaction was intercepted by your Safe Guard on Sepolia. Proposed recipient mimicked your Treasury counterparty. No funds left your Safe."
      : "HexFence Security Warning. A suspicious vanity lookalike recipient was detected in your Safe transaction draft. Please abort and inspect your address book.";

    const scriptHi = isConfirmed
      ? "हेक्सफेंस सुरक्षा चेतावनी। आपके सेफ गार्ड स्मार्ट कॉन्ट्रैक्ट द्वारा एक संदिग्ध लेनदेन को ऑन-चेन ब्लॉक कर दिया गया है। आपकी निधि पूरी तरह सुरक्षित है।"
      : "हेक्सफेंस सुरक्षा चेतावनी। लेनदेन प्रारूप में एक संदिग्ध पते का पता चला है। कृपया लेनदेन रद्द करें।";

    const activeScript = lang === "hi" ? scriptHi : scriptEn;

    setActiveCallModal({
      callId,
      destinationPhone: phoneNumber,
      eventType,
      script: activeScript,
      lang,
      status: "ACTIVE CALL SIMULATION",
    });

    // Synthesize real speech in browser using Web Speech API
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScript);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }

    // Add to logs
    setIvrLogs((prev) => [
      {
        id: callId,
        time: "Just now",
        phone: phoneNumber,
        event: eventType,
        status: "DISPATCHED",
        note: `[SIMULATION] Simulated automated voice call dispatched (${lang.toUpperCase()}).`,
      },
      ...prev,
    ]);
  };

  const handleThreatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valSuspect = validateEthereumAddress(reportSuspect);
    if (!valSuspect.isValid) {
      setFormError(valSuspect.error || "Invalid Suspected Address");
      return;
    }
    const valGenuine = validateEthereumAddress(reportGenuine);
    if (!valGenuine.isValid) {
      setFormError(valGenuine.error || "Invalid Genuine Address");
      return;
    }

    setFormError(null);
    const newReport: UserReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      suspectedAddress: reportSuspect,
      genuineAddress: reportGenuine,
      txHash: reportTx || "0x" + Math.random().toString(16).slice(2, 66),
      token: reportToken,
      status: "Pending Review",
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    };

    setUserReports([newReport, ...userReports]);
    setReportSuccess(true);
    setReportSuspect("");
    setReportGenuine("");
    setReportTx("");
    setReportNotes("");
  };

  const handleFpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateEthereumAddress(fpAddress);
    if (!val.isValid) {
      setFormError(val.error || "Invalid Address");
      return;
    }
    setFormError(null);
    setFpSuccess(true);
    setFpAddress("");
    setFpReason("");
  };

  const toggleSafeGuard = (id: string) => {
    setMonitoredSafes(
      monitoredSafes.map((s) => (s.id === id ? { ...s, safeGuardActive: !s.safeGuardActive } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dev Mode Notice */}
      <div className="bg-[#ECEAE3] border-3 border-[#151515] p-4 flex items-center justify-between font-mono text-xs shadow-neoSm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C6F36B] border border-[#151515] animate-ping" />
          <strong className="text-[#151515] uppercase">[DEVELOPMENT_INTERFACE // USER_DASHBOARD]</strong>
          <span className="text-[#151515]/70 hidden sm:inline-block">
            — Authenticated Session Bypassed for UI Audit
          </span>
        </div>
        <span className="px-2 py-0.5 bg-white border border-[#151515] font-bold">
          Role: Individual / Operator
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-3 border-[#151515] pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#151515]/60 block mb-1">
            CLIENT TELEMETRY CONSOLE
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#151515]">
            User Security Dashboard
          </h1>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab("report-threat")}
          className="px-5 py-2.5 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo font-heading font-black text-xs uppercase tracking-wider hover:shadow-neoLg transition-all"
        >
          + Submit Suspicious Address
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#151515] pb-2 font-mono text-xs font-bold">
        {[
          { id: "overview", label: "Overview" },
          { id: "reports", label: `My Reports (${userReports.length})` },
          { id: "report-threat", label: "Report Suspicious Address" },
          { id: "report-fp", label: "False-Positive Dispute" },
          { id: "safes", label: `Monitored Safes (${monitoredSafes.length})` },
          { id: "notifications", label: "Notification Settings" },
          { id: "profile", label: "Profile Placeholder" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setReportSuccess(false);
              setFpSuccess(false);
              setFormError(null);
            }}
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
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                PROTECTED WALLETS
              </span>
              <div className="font-heading font-black text-3xl text-[#151515]">{monitoredSafes.length}</div>
              <span className="font-mono text-xs text-[#398B60] font-bold block mt-1">
                1 Safe Guard Active
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                ACTIVE THREAT ALERTS
              </span>
              <div className="font-heading font-black text-3xl text-[#D94F4F]">1</div>
              <span className="font-mono text-xs text-[#D94F4F] font-bold block mt-1">
                Inbound Dust Detected
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                SUBMITTED REPORTS
              </span>
              <div className="font-heading font-black text-3xl text-[#151515]">{userReports.length}</div>
              <span className="font-mono text-xs text-[#6B8CFF] font-bold block mt-1">
                1 Confirmed on Arkiv
              </span>
            </div>

            <div className="bg-white border-3 border-[#151515] p-6 shadow-neo">
              <span className="text-[10px] font-mono font-bold text-[#151515]/60 uppercase block mb-1">
                EXTENSION SYNC
              </span>
              <div className="font-heading font-black text-3xl text-[#398B60]">ONLINE</div>
              <span className="font-mono text-xs text-[#151515]/70 block mt-1">
                Manifest V3 Active
              </span>
            </div>
          </div>

          {/* Quick Monitored Safes Summary */}
          <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
              <h3 className="font-heading font-black text-xl text-[#151515]">
                Active Monitored Wallets & Safe Guards
              </h3>
              <button
                onClick={() => setActiveTab("safes")}
                className="font-mono text-xs font-bold text-[#151515] underline hover:text-[#D94F4F]"
              >
                Manage All Safes →
              </button>
            </div>

            <div className="space-y-3">
              {monitoredSafes.map((safe) => (
                <div
                  key={safe.id}
                  className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                >
                  <div>
                    <span className="font-bold text-[#151515] text-sm block">{safe.label}</span>
                    <span className="text-[#151515]/70 break-all select-all">{safe.address}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 font-bold uppercase border border-[#151515] ${
                        safe.safeGuardActive
                          ? "bg-[#C6F36B] text-[#151515]"
                          : "bg-[#D9A441] text-[#151515]"
                      }`}
                    >
                      {safe.safeGuardActive ? "GUARD ON-CHAIN ACTIVE" : "GUARD DISABLED"}
                    </span>
                    <button
                      onClick={() => toggleSafeGuard(safe.id)}
                      className="px-3 py-1 bg-white border border-[#151515] font-bold hover:bg-[#151515] hover:text-[#C6F36B] transition-colors"
                    >
                      {safe.safeGuardActive ? "Disable Guard" : "Enable Guard"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SUBMITTED REPORTS
         ========================================================================= */}
      {activeTab === "reports" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#151515] pb-4">
            <div>
              <h3 className="font-heading font-black text-2xl text-[#151515]">
                My Submitted Threat Reports
              </h3>
              <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
                Track status changes as security administrators verify reports and anchor receipts to Arkiv.
              </p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {userReports.map((rep) => (
              <div key={rep.id} className="bg-[#F4F2EC] border-2 border-[#151515] p-5 space-y-3 shadow-neoSm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151515]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#151515]">{rep.id}</span>
                    <span
                      className={`px-2 py-0.5 font-bold uppercase border border-[#151515] ${
                        rep.status === "Confirmed by Review"
                          ? "bg-[#D94F4F] text-white"
                          : rep.status === "Under Review"
                          ? "bg-[#D9A441] text-[#151515]"
                          : "bg-[#6B8CFF] text-[#F4F2EC]"
                      }`}
                    >
                      {rep.status}
                    </span>
                    <span className="px-1.5 py-0.2 bg-white border border-[#151515] font-bold">
                      {rep.token}
                    </span>
                  </div>
                  <span className="text-[#151515]/60 text-[11px]">{rep.submittedAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">
                      SUSPECTED LOOKALIKE:
                    </span>
                    <span className="break-all font-bold text-[#D94F4F]">{rep.suspectedAddress}</span>
                  </div>
                  <div>
                    <span className="text-[#151515]/60 text-[10px] block uppercase font-bold">
                      GENUINE RECIPIENT:
                    </span>
                    <span className="break-all font-bold text-[#151515]">{rep.genuineAddress}</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-[#151515]/70 flex items-center justify-between">
                  <span className="truncate">Tx: {rep.txHash}</span>
                  <Link
                    href={`/explorer?q=${rep.suspectedAddress}`}
                    className="font-bold underline hover:text-[#D94F4F]"
                  >
                    View in Explorer →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: REPORT SUSPICIOUS ADDRESS FORM
         ========================================================================= */}
      {activeTab === "report-threat" && (
        <div className="bg-white border-3 border-[#151515] shadow-neoLg p-6 md:p-8 max-w-3xl space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <span className="bg-[#151515] text-[#C6F36B] font-mono text-[10px] font-black uppercase px-2 py-0.5">
              COMMUNITY DEFENSE INITIATIVE
            </span>
            <h3 className="font-heading font-black text-2xl text-[#151515] mt-1">
              Submit a Suspicious Address for Audit
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-1">
              Submissions undergo algorithmic heuristic screening. Confirmed attack patterns are anchored to the Arkiv public evidence protocol.
            </p>
          </div>

          {reportSuccess && (
            <div className="p-4 bg-[#C6F36B] border-2 border-[#151515] font-mono text-xs flex items-center justify-between">
              <div>
                <strong>REPORT SUBMITTED SUCCESSFULLY!</strong>
                <p className="text-[11px] mt-0.5">Added to the community review queue with ID: REP-9402.</p>
              </div>
              <button
                onClick={() => setReportSuccess(false)}
                className="px-3 py-1 bg-[#151515] text-[#C6F36B] font-bold text-xs uppercase"
              >
                Submit Another
              </button>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-[#D94F4F]/10 border-2 border-[#D94F4F] text-[#D94F4F] font-mono text-xs">
              <strong>Error: </strong> {formError}
            </div>
          )}

          <form onSubmit={handleThreatSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#151515] font-black uppercase mb-1">
                SUSPECTED LOOKALIKE / ATTACKER ADDRESS *
              </label>
              <input
                type="text"
                required
                value={reportSuspect}
                onChange={(e) => setReportSuspect(e.target.value)}
                placeholder="0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91"
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#151515] font-black uppercase mb-1">
                GENUINE / TARGET RECIPIENT BEING MIMICKED *
              </label>
              <input
                type="text"
                required
                value={reportGenuine}
                onChange={(e) => setReportGenuine(e.target.value)}
                placeholder="0xd9A1c3788D81257612E2581A6ea0aDa244853a91"
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#151515] font-black uppercase mb-1">
                  RELEVANT TRANSACTION HASH
                </label>
                <input
                  type="text"
                  value={reportTx}
                  onChange={(e) => setReportTx(e.target.value)}
                  placeholder="0x8f2a991a3e8749b5c..."
                  className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#151515] font-black uppercase mb-1">
                  TARGET ASSET / TOKEN
                </label>
                <select
                  value={reportToken}
                  onChange={(e) => setReportToken(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white font-bold"
                >
                  <option value="USDT">USDT (Tether USD)</option>
                  <option value="USDC">USDC (USD Coin)</option>
                  <option value="WBTC">WBTC (Wrapped BTC)</option>
                  <option value="DAI">DAI Stablecoin</option>
                  <option value="ETH">ETH (Native)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#151515] font-black uppercase mb-1">
                INCIDENT CONTEXT / DETAILS
              </label>
              <textarea
                rows={3}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Observed 0 ETH transfer right after sending payroll to our multisig counterparty..."
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo font-heading font-black text-xs uppercase tracking-wider hover:shadow-neoLg transition-all"
            >
              Submit Threat Report 🛡️
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FALSE-POSITIVE DISPUTE
         ========================================================================= */}
      {activeTab === "report-fp" && (
        <div className="bg-white border-3 border-[#151515] shadow-neoLg p-6 md:p-8 max-w-3xl space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <span className="bg-[#398B60] text-white font-mono text-[10px] font-black uppercase px-2 py-0.5">
              ACCURACY ASSURANCE
            </span>
            <h3 className="font-heading font-black text-2xl text-[#151515] mt-1">
              Dispute a False-Positive Flag
            </h3>
            <p className="text-xs font-mono text-[#151515]/70 mt-1">
              If a legitimate vanity contract (e.g. 1inch, OpenSea, Uniswap router) or personal vanity address was mistakenly flagged, submit a dispute for rapid audit.
            </p>
          </div>

          {fpSuccess && (
            <div className="p-4 bg-[#398B60]/20 border-2 border-[#398B60] font-mono text-xs text-[#151515]">
              <strong>DISPUTE SUBMITTED!</strong>
              <p className="text-[11px] mt-0.5">Dispute ticket #FP-8109 logged. Administrators will review within 24 hours.</p>
            </div>
          )}

          <form onSubmit={handleFpSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#151515] font-black uppercase mb-1">
                FLAGGED ETHEREUM ADDRESS *
              </label>
              <input
                type="text"
                required
                value={fpAddress}
                onChange={(e) => setFpAddress(e.target.value)}
                placeholder="0x1111111254fb6c44bac0bed2854e76f90643097d"
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#151515] font-black uppercase mb-1">
                REASON FOR DISPUTE / CONTRACT DOCUMENTATION *
              </label>
              <textarea
                required
                rows={3}
                value={fpReason}
                onChange={(e) => setFpReason(e.target.value)}
                placeholder="This is the official verified 1inch v5 router contract deployed on Ethereum..."
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#151515] text-white border-2 border-[#151515] shadow-neo font-heading font-black text-xs uppercase tracking-wider hover:bg-[#398B60] transition-colors"
            >
              Submit False-Positive Dispute
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 5: MONITORED SAFES
         ========================================================================= */}
      {activeTab === "safes" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#151515] pb-4">
            <div>
              <h3 className="font-heading font-black text-2xl text-[#151515]">
                Gnosis Safe & Treasury Management
              </h3>
              <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
                Install and toggle HexFence Safe Guards to prevent malicious vanity transaction executions on-chain.
              </p>
            </div>
            <Link
              href="/docs#contracts"
              className="px-4 py-2 bg-[#C6F36B] text-[#151515] border-2 border-[#151515] shadow-neoSm font-mono text-xs font-black uppercase hover:shadow-neo transition-all"
            >
              Read Safe Guard Contract Guide ↗
            </Link>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {monitoredSafes.map((safe) => (
              <div key={safe.id} className="bg-[#F4F2EC] border-2 border-[#151515] p-5 shadow-neoSm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#151515]/20 pb-3">
                  <div>
                    <span className="font-black text-sm text-[#151515] block">{safe.label}</span>
                    <span className="text-[#151515]/70 break-all select-all">{safe.address}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white border border-[#151515] font-bold text-[10px]">
                    {safe.type}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 font-bold uppercase border border-[#151515] ${
                        safe.safeGuardActive
                          ? "bg-[#C6F36B] text-[#151515]"
                          : "bg-[#D94F4F] text-white"
                      }`}
                    >
                      {safe.safeGuardActive ? "ON-CHAIN GUARD ENFORCING" : "GUARD UNCONFIGURED"}
                    </span>
                    <span className="text-[#151515]/60 text-[11px]">
                      {safe.activeThreatCount === 0
                        ? "0 Threats in Mempool"
                        : `${safe.activeThreatCount} Blocked Threat Attempt`}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSafeGuard(safe.id)}
                    className="px-4 py-1.5 bg-[#151515] text-[#C6F36B] border border-[#151515] font-bold text-xs uppercase shadow-neoSm"
                  >
                    {safe.safeGuardActive ? "Simulate Revert" : "Deploy Guard"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: NOTIFICATION SETTINGS & EMERGENCY IVR VOICE ALERTS (PHASE 10)
         ========================================================================= */}
      {activeTab === "notifications" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 space-y-6">
            <div className="border-b-2 border-[#151515] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-[#ECEAE3] text-[#151515] border border-[#151515] font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                  PHASE 10 // TELEPHONY DEFENSE LAYER
                </span>
                <h3 className="font-heading font-black text-2xl text-[#151515] mt-1">
                  Urgent Alert & Emergency IVR Voice Settings
                </h3>
                <p className="text-xs font-mono text-[#151515]/70 mt-0.5">
                  Automated asynchronous voice alerts when lookalike attacks are blocked by your Safe Guard.
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-3 py-1 bg-[#151515] text-[#C6F36B] border border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm">
                  Asynchronous & Non-Blocking
                </span>
              </div>
            </div>

            {/* Notification Channel Toggles */}
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex items-center justify-between shadow-neoSm">
                <div>
                  <strong className="text-sm block text-[#151515]">Emergency IVR Voice Phone Call (Twilio Dispatch)</strong>
                  <span className="text-[#151515]/70 text-[11px] block mt-0.5">
                    Automated voice alert triggered when a confirmed blocked transaction occurs on-chain.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifIVR}
                  onChange={() => setNotifIVR(!notifIVR)}
                  className="w-5 h-5 accent-[#151515] cursor-pointer"
                />
              </div>

              <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex items-center justify-between shadow-neoSm">
                <div>
                  <strong className="text-sm block text-[#151515]">Browser Extension In-Tab Alert</strong>
                  <span className="text-[#151515]/70 text-[11px] block mt-0.5">
                    Real-time visual diff overlay on app.safe.global before user signs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifBrowser}
                  onChange={() => setNotifBrowser(!notifBrowser)}
                  className="w-5 h-5 accent-[#151515] cursor-pointer"
                />
              </div>

              <div className="bg-[#F4F2EC] border-2 border-[#151515] p-4 flex items-center justify-between shadow-neoSm">
                <div>
                  <strong className="text-sm block text-[#151515]">Email Threat Digest</strong>
                  <span className="text-[#151515]/70 text-[11px] block mt-0.5">
                    Daily summary of counterparty poisoning activity and mempool observations.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                  className="w-5 h-5 accent-[#151515] cursor-pointer"
                />
              </div>
            </div>

            {/* Phone Verification Sub-Card */}
            <div className="border-2 border-[#151515] p-5 bg-[#FAF9F6] shadow-neoSm space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-300 pb-3">
                <div>
                  <strong className="text-sm text-[#151515] block uppercase">Operator Phone Verification</strong>
                  <span className="text-gray-600 text-[11px]">Emergency calls are only dispatched to verified numbers.</span>
                </div>
                <span
                  className={`px-2 py-0.5 font-bold uppercase border border-[#151515] text-[10px] ${
                    isPhoneVerified ? "bg-[#C6F36B] text-[#151515]" : "bg-[#D94F4F] text-white"
                  }`}
                >
                  {isPhoneVerified ? "✔ Phone Verified" : "Verification Required"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Phone Number (E.164 International):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setIsPhoneVerified(false);
                      }}
                      className="flex-1 bg-white border border-[#151515] p-2 text-xs font-bold font-mono focus:outline-none"
                      placeholder="+1-555-019-2834"
                    />
                    <button
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-[#151515] text-[#C6F36B] border border-[#151515] font-bold text-xs uppercase shadow-neoSm hover:bg-black transition-colors"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Enter 6-Digit Verification Code:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="flex-1 bg-white border border-[#151515] p-2 text-xs font-bold font-mono tracking-widest focus:outline-none"
                      placeholder="779409"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="px-3 py-2 bg-[#C6F36B] text-[#151515] border border-[#151515] font-black text-xs uppercase shadow-neoSm hover:bg-[#b8e858] transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {otpFeedback && (
                <div className="p-2.5 bg-white border border-[#151515] font-mono text-xs font-bold text-[#151515] shadow-neoSm">
                  {otpFeedback}
                </div>
              )}
            </div>

            {/* Interactive Telephony Voice Simulator Card */}
            <div className="border-2 border-[#151515] p-5 bg-[#FFF] shadow-neoSm space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#151515] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#D94F4F] uppercase tracking-wider block">
                    [TELEPHONY SIMULATION: HexFence Mock Telephony Service]
                  </span>
                  <h4 className="font-heading font-black text-lg text-[#151515]">
                    Live Interactive Voice Call Simulator
                  </h4>
                </div>
                <span className="px-2 py-0.5 bg-[#FAF9F6] border border-gray-300 text-[10px] font-bold text-gray-700">
                  Rate Limit: 30s Cooldown
                </span>
              </div>

              <p className="text-gray-700 font-sans text-xs font-medium leading-relaxed">
                Experience the exact emergency voice message dispatched when an attack occurs. Click any scenario below to synthesize speech in your browser:
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => triggerVoiceSimulation("CONFIRMED_BLOCKED_ON_CHAIN", "en")}
                  className="px-4 py-2.5 bg-[#D94F4F] text-white border-2 border-[#151515] shadow-neoSm font-bold uppercase hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>🔊</span>
                  <span>Simulate On-Chain Block (English)</span>
                </button>

                <button
                  onClick={() => triggerVoiceSimulation("CONFIRMED_BLOCKED_ON_CHAIN", "hi")}
                  className="px-4 py-2.5 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neoSm font-bold uppercase hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>🔊</span>
                  <span>Simulate On-Chain Block (हिंदी)</span>
                </button>

                <button
                  onClick={() => triggerVoiceSimulation("ATTEMPTED_TX", "en")}
                  className="px-4 py-2.5 bg-white text-[#151515] border-2 border-[#151515] shadow-neoSm font-bold uppercase hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span>Simulate Draft Attempt Warning</span>
                </button>
              </div>

              {/* Distinction Banner */}
              <div className="bg-[#F4F2EC] p-3 border border-[#151515] text-[11px] space-y-1">
                <div>
                  <strong className="text-[#D94F4F] uppercase">Confirmed Block Script:</strong> &ldquo;HexFence Security Alert. A confirmed blocked lookalike transaction was intercepted by your Safe Guard on Sepolia. No funds left your Safe.&rdquo;
                </div>
                <div className="text-gray-600">
                  <strong className="text-gray-800 uppercase">Attempt Warning Script:</strong> &ldquo;HexFence Security Warning. A suspicious vanity lookalike recipient was detected in your Safe transaction draft. Please abort.&rdquo;
                </div>
              </div>
            </div>

            {/* Call History / Event Logs Table */}
            <div className="border-2 border-[#151515] p-5 bg-[#FAF9F6] shadow-neoSm space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                <strong className="text-[#151515] font-black uppercase">Recent Emergency Call Dispatch Logs</strong>
                <span className="text-gray-500 text-[10px]">{ivrLogs.length} Records</span>
              </div>

              <div className="space-y-2">
                {ivrLogs.map((log) => (
                  <div key={log.id} className="bg-white p-3 border border-[#151515] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-neoSm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-[#151515]">{log.id}</strong>
                        <span className="text-[10px] text-gray-500">• {log.time}</span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold uppercase border ${
                            log.status === "DISPATCHED"
                              ? "bg-[#C6F36B] text-[#151515] border-[#151515]"
                              : log.status === "RATE_LIMITED"
                              ? "bg-[#D97706] text-white border-[#D97706]"
                              : "bg-[#151515] text-[#C6F36B] border-[#151515]"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-700 font-medium">{log.note}</div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 shrink-0">{log.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Call Simulator Modal */}
          {activeCallModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-[#F4F2EC] border-4 border-[#151515] shadow-neo max-w-lg w-full p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b-2 border-[#151515] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#D94F4F] rounded-full animate-ping"></span>
                    <strong className="font-mono text-xs font-black uppercase text-[#D94F4F]">
                      INCOMING EMERGENCY CALL SIMULATION
                    </strong>
                  </div>
                  <span className="font-mono text-[10px] bg-white border border-[#151515] px-2 py-0.5 font-bold">
                    {activeCallModal.callId}
                  </span>
                </div>

                <div className="bg-white border-2 border-[#151515] p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-gray-500 text-[10px]">
                    <span>DISPATCH TARGET: {activeCallModal.destinationPhone}</span>
                    <span>LANGUAGE: {activeCallModal.lang.toUpperCase()}</span>
                  </div>
                  <div className="text-sm font-bold text-[#151515] border-t border-gray-200 pt-2 leading-relaxed">
                    &ldquo;{activeCallModal.script}&rdquo;
                  </div>
                </div>

                <div className="bg-[#151515] text-[#C6F36B] p-3 font-mono text-[11px] flex items-center justify-between">
                  <span>AUDIO SYNTHESIS: PLAYING IN BROWSER</span>
                  <span className="text-white text-[10px]">NON-BLOCKING ASYNC</span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && "speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                      }
                      setActiveCallModal(null);
                    }}
                    className="px-6 py-2 bg-[#D94F4F] text-white border-2 border-[#151515] font-mono text-xs font-black uppercase shadow-neoSm hover:bg-[#c03c3c] transition-colors"
                  >
                    Hang Up & Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 7: PROFILE PLACEHOLDER
         ========================================================================= */}
      {activeTab === "profile" && (
        <div className="bg-white border-3 border-[#151515] shadow-neo p-6 md:p-8 max-w-2xl space-y-6">
          <div className="border-b-2 border-[#151515] pb-4">
            <span className="bg-[#ECEAE3] text-[#151515] border border-[#151515] font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
              DEVELOPMENT PLACEHOLDER
            </span>
            <h3 className="font-heading font-black text-2xl text-[#151515] mt-1">
              Operator Profile
            </h3>
          </div>

          <div className="bg-[#F4F2EC] border-2 border-[#151515] p-5 font-mono text-xs space-y-3">
            <div>
              <span className="text-[#151515]/60 text-[10px] uppercase font-bold block">OPERATOR ID:</span>
              <span className="font-bold text-sm text-[#151515]">operator_0x9812_demo</span>
            </div>
            <div>
              <span className="text-[#151515]/60 text-[10px] uppercase font-bold block">ASSIGNED PERMISSION LEVEL:</span>
              <span className="font-black text-xs px-2 py-0.5 bg-[#C6F36B] border border-[#151515] inline-block mt-0.5">
                USER (Individual / DeFi Operator)
              </span>
            </div>
            <div>
              <span className="text-[#151515]/60 text-[10px] uppercase font-bold block">CONNECTED RPC GATEWAY:</span>
              <span>Ethereum Sepolia / Alchemy Gateway</span>
            </div>
          </div>

          <p className="text-xs font-mono text-[#151515]/70">
            Note: User credentials and persistent database identities will be connected via Prisma ORM in Phase 5.
          </p>
        </div>
      )}
    </div>
  );
}

