"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DevRoleSwitcher() {
  const pathname = usePathname();

  const routes = [
    { label: "Public (Site)", href: "/", pattern: /^\/(explorer|how-it-works|docs|threat-intel)?$/ },
    { label: "User Dashboard", href: "/dashboard", pattern: /^\/dashboard/ },
    { label: "Admin Portal", href: "/admin", pattern: /^\/admin/ },
    { label: "Super Admin", href: "/super-admin", pattern: /^\/super-admin/ },
  ];

  return (
    <aside aria-label="Development environment controls" className="bg-[#151515] border-b-2 border-[#151515] text-[#F4F2EC] px-4 py-2 text-xs font-mono select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6F36B] animate-ping" />
          <span className="bg-[#C6F36B] text-[#151515] font-black text-[10px] px-1.5 py-0.2 uppercase">
            DEV NAVIGATION
          </span>
          <span className="text-[11px] text-[#F4F2EC]/70 hidden sm:inline-block">
            No Auth Required • Direct Interface Switching
          </span>
        </div>

        {/* Role / Interface Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {routes.map((r) => {
            const isActive = r.pattern.test(pathname);
            return (
              <Link
                key={r.href}
                href={r.href}
                className={`px-3 py-1 font-mono text-[11px] font-bold border transition-all ${
                  isActive
                    ? "bg-[#C6F36B] text-[#151515] border-[#C6F36B] shadow-neoSm font-black"
                    : "bg-[#262626] text-[#F4F2EC] border-[#404040] hover:bg-white hover:text-[#151515]"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

