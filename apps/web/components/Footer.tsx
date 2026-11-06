import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#151515] text-white border-t-2 border-[#151515] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-800 pb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#252525] border border-gray-700 flex items-center justify-center font-heading font-black text-sm text-[#C6F36B]">
                HF
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white">
                HEXFENCE
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
              Enterprise-grade blockchain security infrastructure engineered to detect, expose, and neutralize Ethereum address-poisoning attacks.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 bg-[#252525] text-gray-300 font-mono text-[9px] font-bold uppercase border border-gray-700">
                ETHEREUM
              </span>
              <span className="px-2 py-0.5 bg-[#252525] text-[#5E7ED8] font-mono text-[9px] font-bold uppercase border border-gray-700">
                ARKIV PROTOCOL
              </span>
              <span className="px-2 py-0.5 bg-[#252525] text-[#C6F36B] font-mono text-[9px] font-bold uppercase border border-gray-700">
                SAFE GUARD
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#C6F36B]">
              PLATFORM
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <Link href="/" className="hover:text-[#C6F36B] transition-colors">
                  Home (Live Lab)
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-[#C6F36B] transition-colors">
                  Address Explorer
                </Link>
              </li>
              <li>
                <Link href="/threat-intel" className="hover:text-[#C6F36B] transition-colors">
                  Threat Intelligence
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#C6F36B] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#C6F36B]">
              DEFENSE STACK
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <Link href="/how-it-works" className="hover:text-[#C6F36B] transition-colors">
                  Heuristic Collision Scorer
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-[#C6F36B] transition-colors">
                  Arkiv Public Proof Receipts
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#C6F36B] transition-colors">
                  Gnosis Safe Guard Revert
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Chrome Manifest V3 Extension</span>
              </li>
            </ul>
          </div>

          {/* Open Intelligence */}
          <div className="space-y-2.5 font-mono text-xs">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#C6F36B]">
              COMMUNITY FORENSICS
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <a
                  href="https://arkiv.network"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C6F36B] transition-colors flex items-center gap-1.5"
                >
                  <span>Arkiv Protocol Gateway</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-[#C6F36B] transition-colors">
                  Submit Suspect Address
                </Link>
              </li>
              <li>
                <a
                  href="https://etherscan.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C6F36B] transition-colors flex items-center gap-1.5"
                >
                  <span>Etherscan Verifier</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-gray-500 font-mono">
          <p>
            © {new Date().getFullYear()} HexFence Platform • Ethereum Capital Defense
          </p>
          <p className="max-w-xl text-left md:text-right">
            Disclaimer: HexFence heuristic detection is analytical intelligence. Never authorize transactions without verifying complete 42-character address strings.
          </p>
        </div>
      </div>
    </footer>
  );
}
