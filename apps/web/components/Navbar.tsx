"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Address Explorer", href: "/explorer" },
    { label: "Threat Intel", href: "/threat-intel" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F4F2EC]/95 border-b-2 border-[#151515] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#151515] border border-[#151515] shadow-neoSm flex items-center justify-center font-heading font-black text-xl text-[#C6F36B] group-hover:-translate-y-0.5 transition-all">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 stroke-[#C6F36B] stroke-[2.4]"
              >
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tighter text-[#151515]">
                  HEXFENCE
                </span>
                <span className="px-1.5 py-0.2 bg-[#FAF9F6] text-[#151515] border border-[#151515] font-mono text-[9px] font-bold uppercase tracking-wider">
                  ETH SHIELD
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase -mt-0.5 font-semibold">
                Address-Poisoning Defense
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 font-heading text-xs uppercase tracking-wider font-bold border transition-all ${
                    isActive
                      ? "bg-[#151515] text-[#C6F36B] border-[#151515] shadow-neoSm"
                      : "border-transparent text-[#151515] hover:border-[#151515] hover:bg-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/explorer"
              className="px-3.5 py-1.5 bg-white text-[#151515] border border-[#151515] shadow-neoSm font-heading text-xs uppercase tracking-wider font-bold hover:bg-[#FAF9F6] transition-all"
            >
              Search Address 🔍
            </Link>
            <button
              onClick={() => setExtensionModalOpen(true)}
              className="px-3.5 py-1.5 bg-white text-[#151515] border border-[#151515] shadow-neoSm font-heading text-xs uppercase tracking-wider font-bold hover:bg-[#FAF9F6] transition-all"
            >
              Get Extension 🛡️
            </button>
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-[#151515] bg-white shadow-neoSm text-[#151515] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-[#151515] bg-[#FAF9F6] p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 font-mono text-xs font-bold uppercase border ${
                  pathname === link.href
                    ? "bg-[#151515] text-[#C6F36B] border-[#151515]"
                    : "bg-white text-[#151515] border-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <ConnectWalletButton />
              <Link
                href="/explorer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 bg-white text-[#151515] border border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm"
              >
                Search Address 🔍
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setExtensionModalOpen(true);
                }}
                className="w-full text-center px-4 py-2 bg-[#151515] text-[#C6F36B] border border-[#151515] font-mono text-xs font-bold uppercase shadow-neoSm"
              >
                Get Extension 🛡️
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Extension Modal */}
      {extensionModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#151515]/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#151515] shadow-neo max-w-lg w-full p-6 relative">
            <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#151515] text-[#C6F36B] border border-[#151515] flex items-center justify-center font-bold text-xl shadow-neoSm">
                  🛡️
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-[#151515]">
                    HexFence Chrome Extension
                  </h3>
                  <p className="text-xs font-mono text-gray-500 font-bold">
                    Manifest V3 • Real-Time Client Protection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExtensionModalOpen(false)}
                className="border border-[#151515] w-7 h-7 flex items-center justify-center bg-white font-bold hover:bg-[#D94F4F] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-4 leading-relaxed font-sans font-medium">
              The HexFence Chrome Extension actively analyzes addresses pasted into your dApps (Uniswap, Etherscan, Safe Web App) and highlights lookalike prefix/suffix spoofing before you sign.
            </p>

            <div className="bg-[#FAF9F6] border border-gray-300 p-4 mb-5 font-mono text-xs space-y-1">
              <div className="text-[#151515] font-bold mb-1">LOCAL SETUP INSTRUCTIONS:</div>
              <div>1. Extension source is located in <code className="bg-white px-1 font-bold border border-gray-200">apps/extension</code></div>
              <div>2. Open <code className="bg-white px-1 font-bold border border-gray-200">chrome://extensions</code> in Chrome</div>
              <div>3. Enable Developer Mode and select <strong>Load unpacked</strong></div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setExtensionModalOpen(false)}
                className="px-5 py-2 border border-[#151515] bg-[#151515] text-[#C6F36B] font-heading font-black text-xs shadow-neoSm uppercase"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
