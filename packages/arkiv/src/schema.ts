import { defineSchema, addr, str, dec } from "@arkiv-network/sdk/schema";
import { ARKIV_CONFIG } from "./config";

/**
 * HexFence Address-Poisoning Evidence Entity Schema on Arkiv Protocol
 * Schema ID: hexfence.poisoning.v1
 */
export const HexFencePoisoningSchema = defineSchema(ARKIV_CONFIG.SCHEMA_NAME, {
  evidenceId: str().indexed(),
  referenceAddress: addr().indexed(),
  suspectedAddress: addr().indexed(),
  txHash: str().indexed(),
  token: str().indexed(),
  detectionReason: str(),
  confidence: dec().indexed(),
  detectorVersion: str(),
  detectionTimestamp: str(),
  evidenceStatus: str().indexed(),
});

export type PoisoningEntityData = {
  evidenceId: string;
  referenceAddress: `0x${string}`;
  suspectedAddress: `0x${string}`;
  txHash: string;
  token: string;
  detectionReason: string;
  confidence: string; // Decimal string e.g. "95.5"
  detectorVersion: string;
  detectionTimestamp: string;
  evidenceStatus: "suspected" | "under_review" | "confirmed" | "false_positive";
};

