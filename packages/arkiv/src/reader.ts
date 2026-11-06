import { eq, or } from "@arkiv-network/sdk";
import { getArkivPublicClient } from "./client";
import { HexFencePoisoningSchema } from "./schema";

export async function queryEvidenceByAddress(address: string) {
  try {
    const client = getArkivPublicClient();
    const formattedAddr = address.toLowerCase() as `0x${string}`;

    const records = await client
      .select()
      .from(HexFencePoisoningSchema)
      .where(
        or(
          eq("suspectedAddress", formattedAddr),
          eq("referenceAddress", formattedAddr)
        )
      )
      .fetch();

    return records;
  } catch (err) {
    console.warn(`⚠️ [Arkiv Reader] Failed to query records for address ${address}:`, err);
    return [];
  }
}

export async function queryEvidenceByTxHash(txHash: string) {
  try {
    const client = getArkivPublicClient();

    const records = await client
      .select()
      .from(HexFencePoisoningSchema)
      .where(eq("txHash", txHash))
      .fetch();

    return records;
  } catch (err) {
    console.warn(`⚠️ [Arkiv Reader] Failed to query records for txHash ${txHash}:`, err);
    return [];
  }
}

export async function fetchAllArkivEvidence(limit: number = 50) {
  try {
    const client = getArkivPublicClient();

    const records = await client
      .select()
      .from(HexFencePoisoningSchema)
      .fetch();

    return records.slice(0, limit);
  } catch (err) {
    console.warn("⚠️ [Arkiv Reader] Failed to fetch all Arkiv evidence records:", err);
    return [];
  }
}

