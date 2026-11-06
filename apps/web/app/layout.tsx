import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DevRoleSwitcher from "../components/DevRoleSwitcher";

export const metadata: Metadata = {
  title: "HexFence — Ethereum Address-Poisoning Defense & Threat Intelligence",
  description: "Enterprise-grade blockchain security platform protecting Ethereum users against vanity address poisoning attacks with Arkiv decentralized evidence, Safe Guard enforcement, and real-time browser protection.",
  keywords: ["ethereum", "security", "address poisoning", "vanity address", "arkiv", "safe guard", "web3 security"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F4F2EC] text-[#151515] selection:bg-[#C6F36B] selection:text-[#151515]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

