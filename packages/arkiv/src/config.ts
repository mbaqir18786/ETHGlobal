import dotenv from "dotenv";
dotenv.config();

export const ARKIV_CONFIG = {
  SCHEMA_NAME: "hexfence.poisoning.v1",
  CHAIN_ID: 7794095,
  NETWORK_NAME: "Arkiv Rabdi Testnet",
  RPC_URL: process.env.ARKIV_RPC_URL || "https://rpc.rabdi.db-chain.testnet.arkiv.network",
  ACCESS_KEY: process.env.ARKIV_ACCESS_KEY || "",
  PRIVATE_KEY: process.env.ARKIV_PRIVATE_KEY || process.env.ARKIV_SIGNER_KEY || "",
  EXPLORER_BASE_URL: "https://explorer.rabdi.db-chain.testnet.arkiv.network",
  DEFAULT_STATUS: "suspected" as const,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1500,
};

