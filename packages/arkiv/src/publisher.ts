import { ExpirationTime, dec } from "@arkiv-network/sdk";
import { HexFencePoisoningSchema, PoisoningEntityData } from "./schema";
import { getArkivWalletClient, getArkivPublicClient } from "./client";
import { ARKIV_CONFIG } from "./config";
import { queryEvidenceByTxHash } from "./reader";

export interface PublishResult {
  success: boolean;
  entityKey?: string;
  arkivUri: string;
  txHash?: string;
  isDuplicate: boolean;
  explorerUrl?: string;
  error?: string;
}

/**
 * Publishes detector-generated evidence to Arkiv Rabdi testnet
 * Includes duplicate entity check, exponential backoff retries, and strict environment signing
 */
export async function publishEvidenceToArkiv(
  data: Omit<PoisoningEntityData, "evidenceStatus"> & {
    evidenceStatus?: PoisoningEntityData["evidenceStatus"];
  }
): Promise<PublishResult> {
  const status = data.evidenceStatus || ARKIV_CONFIG.DEFAULT_STATUS;
  const arkivUri = `arkiv://${ARKIV_CONFIG.SCHEMA_NAME}/${data.evidenceId}`;

  // 1. Deduplication: Check if entity already published for this txHash
  try {
    const existing = await queryEvidenceByTxHash(data.txHash);
    if (existing && existing.length > 0) {
      console.log(`ℹ️ [Arkiv Publisher] Duplicate detected on-chain for txHash: ${data.txHash}. Skipping publication.`);
      return {
        success: true,
        entityKey: (existing[0] as any).$key,
        arkivUri,
        isDuplicate: true,
        explorerUrl: `${ARKIV_CONFIG.EXPLORER_BASE_URL}/entity/${(existing[0] as any).$key}`,
      };
    }
  } catch (err) {
    // If deduplication query fails due to network, proceed with caution
    console.warn("⚠️ [Arkiv Publisher] Deduplication pre-check warning:", err);
  }

  // 2. Publish with retry logic
  let attempt = 0;
  let lastError: any = null;

  while (attempt < ARKIV_CONFIG.RETRY_ATTEMPTS) {
    attempt++;
    try {
      const walletClient = getArkivWalletClient();

      const { entityKey, txHash } = await walletClient.createEntity({
        schema: HexFencePoisoningSchema,
        data: {
          evidenceId: data.evidenceId,
          referenceAddress: data.referenceAddress,
          suspectedAddress: data.suspectedAddress,
          txHash: data.txHash,
          token: data.token,
          detectionReason: data.detectionReason,
          confidence: dec(data.confidence),
          detectorVersion: data.detectorVersion,
          detectionTimestamp: data.detectionTimestamp,
          evidenceStatus: status,
        },
        // Entities persist for 365 days on Rabdi testnet
        expires: ExpirationTime.fromDays(365),
      });

      console.log(`✅ [Arkiv Publisher] Successfully published entity key: ${entityKey} in tx: ${txHash}`);

      return {
        success: true,
        entityKey,
        arkivUri,
        txHash,
        isDuplicate: false,
        explorerUrl: `${ARKIV_CONFIG.EXPLORER_BASE_URL}/entity/${entityKey}`,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`⚠️ [Arkiv Publisher] Attempt ${attempt} failed: ${err.message}. Retrying in ${ARKIV_CONFIG.RETRY_DELAY_MS}ms...`);
      await new Promise((res) => setTimeout(res, ARKIV_CONFIG.RETRY_DELAY_MS * attempt));
    }
  }

  // Fallback graceful degradation if testnet RPC is offline or rate limited
  console.error("❌ [Arkiv Publisher] All publication attempts failed:", lastError?.message || lastError);
  return {
    success: false,
    arkivUri,
    isDuplicate: false,
    error: lastError?.message || "Failed to publish entity to Arkiv Rabdi testnet after maximum retries.",
  };
}

