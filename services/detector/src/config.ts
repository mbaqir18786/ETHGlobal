/**
 * HexFence Detection Engine Configuration
 * Core constants, token contract addresses, and heuristic thresholds
 */

export const CONFIG = {
  DETECTOR_VERSION: "v2.5.0-engine",

  // Ethereum Mainnet RPC Configuration
  ETH_RPC_URL: process.env.ETH_RPC_URL || "https://eth.llamarpc.com",
  FALLBACK_RPC_URLS: [
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com/eth",
    "https://ethereum-rpc.publicnode.com",
  ],

  // Monitored Token Contracts on Ethereum Mainnet
  TOKEN_CONTRACTS: {
    USDT: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const,
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
    },
    USDC: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
    },
  },

  // ERC-20 Transfer Event Topic Hash: keccak256("Transfer(address,address,uint256)")
  TRANSFER_EVENT_SIGNATURE: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",

  // Heuristic Thresholds
  THRESHOLDS: {
    // Score required to flag a transaction as suspected poisoning (0 - 100)
    SUSPICION_FLAG_THRESHOLD: 65,

    // Score required for high-confidence multi-vector classification
    HIGH_CONFIDENCE_THRESHOLD: 85,

    // Minimum character collision (prefix + suffix) to evaluate vanity
    MIN_VANITY_COLLISION_LENGTH: 6,

    // High vanity collision threshold (e.g. >= 10 chars is statistical brute-force)
    CRITICAL_VANITY_COLLISION_LENGTH: 12,

    // Post-payment timing window (seconds) where spoof injection is highly suspected (2 hours)
    MAX_SUSPICIOUS_TIMING_WINDOW_SECS: 7200,

    // Immediate reactive injection window (seconds) e.g. < 5 mins
    IMMEDIATE_INJECTION_WINDOW_SECS: 300,

    // Dust value limit in USD equivalent (transfers below this are evaluated as dust)
    MAX_DUST_USD_VALUE: 0.10,
  },

  // Weights for Multi-Signal Composite Confidence Scoring
  WEIGHTS: {
    VANITY_COLLISION: 0.50, // 50% - Primary indicator is lookalike boundary collision
    DUST_PROFILE: 0.30,     // 30% - Zero-value transfer or micro-dust
    TIMING_CORRELATION: 0.20, // 20% - Proximity to legitimate payment
  },
} as const;

