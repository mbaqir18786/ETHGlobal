"use client";

import React, { useState } from "react";
import Link from "next/link";

type RoleType = "USER" | "ADMIN" | "SUPER_ADMIN";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const roleDetails = {
    USER: {
      title: "Individual / DeFi Operator",
      access: "Personal monitored wallets, address investigation, browser extension sync, and community alert feeds.",
      badgeColor: "bg-[#C6F36B] text-[#151515]",
    },
    ADMIN: {
      title: "Security Officer / DAO Signer",
      access: "Safe Guard configuration, high-value treasury alerts, webhook routing, and incident verification queues.",
      badgeColor: "bg-[#6B8CFF] text-[#F4F2EC]",
    },
    SUPER_ADMIN: {
      title: "Platform Governor",
      access: "Arkiv publication key management, global risk threshold calibration, and user authorization administration.",
      badgeColor: "bg-[#D94F4F] text-white",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      {/* Notice Card */}
      <div className="bg-[#ECEAE3] border-2 border-[#151515] p-4 mb-8 font-mono text-xs flex items-start gap-3 shadow-neoSm">
        <div className="w-5 h-5 bg-[#D9A441] border border-[#151515] flex items-center justify-center font-bold text-xs shrink-0">
          !
        </div>
        <div>
          <strong className="text-[#151515] font-bold">Phase 1 Placeholder: </strong>
          Authentication and backend database sessions will be connected in <strong>Phase 5</strong>. The form below provides a design and role preview.
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white border-2 border-[#151515] shadow-neoLg p-8">
        <div className="border-b-2 border-[#151515] pb-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-[#C6F36B] border border-[#151515]" />
            <span className="font-mono text-xs text-[#151515]/70 uppercase font-bold">
              HexFence Security Portal
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#151515]">
            Sign In to HexFence
          </h1>
        </div>

        {/* Role Preview Selector */}
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold text-[#151515] mb-2 uppercase">
            Preview Target Account Role:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["USER", "ADMIN", "SUPER_ADMIN"] as RoleType[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectedRole(role);
                  setSubmitted(false);
                }}
                className={`py-2 px-2 text-[11px] font-mono font-bold border-2 border-[#151515] transition-all ${
                  selectedRole === role
                    ? "bg-[#151515] text-[#C6F36B] shadow-neoSm font-black"
                    : "bg-[#F4F2EC] text-[#151515] hover:bg-white"
                }`}
              >
                {role.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="mt-3 p-3 bg-[#F4F2EC] border border-[#151515] text-xs font-sans">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${roleDetails[selectedRole].badgeColor}`}>
                {selectedRole}
              </span>
              <span className="font-bold text-[#151515]">
                {roleDetails[selectedRole].title}
              </span>
            </div>
            <p className="text-[#151515]/70 text-[11px] leading-relaxed">
              {roleDetails[selectedRole].access}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-[#C6F36B]/20 border-2 border-[#398B60] p-5 text-center font-mono text-xs space-y-3">
            <div className="text-xl">🛡️</div>
            <div className="font-bold text-[#151515]">
              Role Profile Simulated: {selectedRole}
            </div>
            <p className="text-[#151515]/80 text-[11px]">
              Credentials validated for UI demonstration. In Phase 5, this will issue a secure JWT signed by the HexFence backend API.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-1.5 bg-[#151515] text-[#C6F36B] border border-[#151515] font-bold"
            >
              Reset Form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#151515] font-bold mb-1 uppercase">
                Email / Operator ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@treasury.eth"
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs text-[#151515] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#151515] font-bold mb-1 uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-[#F4F2EC] border-2 border-[#151515] text-xs text-[#151515] focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#151515] text-[#C6F36B] border-2 border-[#151515] shadow-neo font-heading font-bold text-sm hover:-translate-y-0.5 hover:shadow-neoLg transition-all mt-2"
            >
              Sign In (Preview Simulation)
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t-2 border-[#151515]/10 flex items-center justify-between text-xs font-mono">
          <Link href="/" className="text-[#151515] hover:underline font-bold">
            ← Return to Homepage
          </Link>
          <Link href="/explorer" className="text-[#6B8CFF] hover:underline font-bold">
            Explore Threats →
          </Link>
        </div>
      </div>
    </div>
  );
}

