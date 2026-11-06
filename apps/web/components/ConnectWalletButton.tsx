"use client";

import React, { useState, useEffect } from "react";

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>("Sepolia");
  const [connecting, setConnecting] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            detectNetwork(eth);
          }
        })
        .catch(() => {});

      // Listen for account and network changes
      eth.on?.("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts.length > 0 ? accounts[0] : null);
      });

      eth.on?.("chainChanged", () => {
        detectNetwork(eth);
      });
    }
  }, []);

  const detectNetwork = async (eth: any) => {
    try {
      const chainId = await eth.request({ method: "eth_chainId" });
      if (chainId === "0xaa36a7" || chainId === "11155111") {
        setNetworkName("Sepolia");
      } else if (chainId === "0x1") {
        setNetworkName("Mainnet");
      } else {
        setNetworkName("EVM");
      }
    } catch {
      setNetworkName("Sepolia");
    }
  };

  const handleConnect = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setConnecting(true);
      try {
        const eth = (window as any).ethereum;
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await detectNetwork(eth);
        }
      } catch (err: any) {
        console.warn("User rejected wallet connection:", err.message);
      } finally {
        setConnecting(false);
      }
    } else {
      // If no Web3 provider detected, connect verified demo wallet for instant testing
      const demoAccount = "0xd9A1c3788D81257612E2581A6ea0aDa244853a91";
      setWalletAddress(demoAccount);
      setNetworkName("Sepolia (Demo)");
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-1.5 font-mono text-xs">
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-[#151515] font-bold text-[10px] uppercase shadow-neoSm">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{networkName}</span>
        </span>

        <button
          onClick={handleDisconnect}
          title="Click to disconnect"
          className="px-3 py-1.5 bg-[#151515] text-[#C6F36B] border border-[#151515] shadow-neoSm font-bold uppercase hover:bg-black transition-all flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6F36B]" />
          <span>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <span className="text-[10px] text-gray-400">✕</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="px-3.5 py-1.5 bg-[#C6F36B] text-[#151515] border border-[#151515] shadow-neoSm font-heading text-xs uppercase tracking-wider font-black hover:bg-[#b8e858] hover:-translate-y-0.5 transition-all flex items-center gap-2"
    >
      <span>⚡</span>
      <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
}
