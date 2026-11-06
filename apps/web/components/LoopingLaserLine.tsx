"use client";

import React from "react";

interface LoopingLaserLineProps {
  label?: string;
  sublabel?: string;
  theme?: "dark" | "light";
}

export default function LoopingLaserLine({
  label = "SYSTEM_RADAR // ACTIVE_MEMPOOL_BEAM",
  sublabel = "STREAMING ETHEREUM TRANSACTIONS",
  theme = "dark",
}: LoopingLaserLineProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`w-full relative py-2.5 overflow-hidden select-none border-y-2 border-[#151515] ${
        isDark ? "bg-[#151515] text-[#F4F2EC]" : "bg-[#F4F2EC] text-[#151515]"
      }`}
    >
      {/* Central Rail Track */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] ${
          isDark ? "bg-[#252525]" : "bg-gray-300"
        }`}
      />

      {/* Grid tick marks */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none opacity-30">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-[1px] ${isDark ? "bg-[#C6F36B]" : "bg-[#151515]"}`}
          />
        ))}
      </div>

      {/* Fast Gliding Glowing Laser Beam 1 (Acid Lime) */}
      <div className="absolute top-1/2 -translate-y-1/2 h-[3.5px] w-64 bg-gradient-to-r from-transparent via-[#C6F36B] to-transparent animate-laser-loop z-10 filter drop-shadow-[0_0_6px_#C6F36B]" />

      {/* Trailing Secondary Laser Beam 2 (Blue telemetry packet) */}
      <div className="absolute top-1/2 -translate-y-1/2 h-[3px] w-48 bg-gradient-to-r from-transparent via-[#5E7ED8] to-transparent animate-laser-loop-delayed z-10 filter drop-shadow-[0_0_6px_#5E7ED8]" />

      {/* Reverse Subtle Scanning Beam 3 */}
      <div className="absolute top-1/2 -translate-y-1/2 h-[2px] w-36 bg-gradient-to-r from-transparent via-[#D94F4F] to-transparent animate-laser-loop-reverse z-10 filter drop-shadow-[0_0_5px_#D94F4F]" />

      {/* Foreground Telemetry Text HUD */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-mono pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#202020] border border-[#333]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F36B] animate-ping" />
            <span className="text-[10px] font-bold text-[#C6F36B] tracking-wider uppercase">
              {label}
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] text-gray-400 uppercase tracking-widest pl-2 font-medium">
            [PULSE_CH: 0x981A]
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-[10px] tracking-wider uppercase font-medium text-gray-300">
          <span className="flex items-center gap-1.5">
            <span className="text-[#5E7ED8]">●</span> SWEEP: 1.4 GHZ
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C6F36B]">●</span> SCANNING: {sublabel}
          </span>
          <span>•</span>
          <span className="text-[#151515] bg-[#C6F36B] px-2 py-0.5 font-bold">
            STATUS: ARMORED
          </span>
        </div>
      </div>
    </div>
  );
}
