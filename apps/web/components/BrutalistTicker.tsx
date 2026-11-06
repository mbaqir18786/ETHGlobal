import React from "react";

export default function BrutalistTicker() {
  const tickerItems = [
    "ETH ADDRESS-POISONING DEFENSE",
    "ARKIV DECENTRALIZED EVIDENCE LAYER",
    "GNOSIS SAFE GUARD ON-CHAIN INTERCEPTOR",
    "CHROME MV3 LOCAL RECIPIENT GUARDIAN",
    "HAMMING COLLISION ENTROPY MATRIX",
    "ZERO-VALUE ERC20 TRANSFER SHIELD",
    "COMMUNITY THREAT FORENSICS",
  ];

  return (
    <div className="w-full bg-[#151515] text-[#C6F36B] border-y-2 border-[#151515] py-2.5 overflow-hidden select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 font-mono text-xs md:text-sm font-bold tracking-widest uppercase">
            <span>{item}</span>
            <span className="w-2 h-2 bg-[#C6F36B] inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
