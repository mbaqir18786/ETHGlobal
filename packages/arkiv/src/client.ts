import { createPublicClient, createWalletClient } from "@arkiv-network/sdk";
import { rabdi } from "@arkiv-network/sdk/chains";
import { http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ARKIV_CONFIG } from "./config";

export function getArkivPublicClient() {
  const chain = rabdi({ accessKey: ARKIV_CONFIG.ACCESS_KEY });
  return createPublicClient({
    chain,
    transport: http(ARKIV_CONFIG.RPC_URL),
  });
}

export function getArkivWalletClient(customPrivateKey?: string) {
  const privateKey = customPrivateKey || ARKIV_CONFIG.PRIVATE_KEY;

  if (!privateKey || !privateKey.startsWith("0x")) {
    throw new Error(
      "ARKIV_PRIVATE_KEY is not configured in environment variables. Secure signing key required to publish evidence to Arkiv."
    );
  }

  const chain = rabdi({ accessKey: ARKIV_CONFIG.ACCESS_KEY });
  const account = privateKeyToAccount(privateKey as Hex);

  return createWalletClient({
    chain,
    transport: http(ARKIV_CONFIG.RPC_URL),
    account,
  });
}

