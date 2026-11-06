export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface AddressRiskAssessment {
  candidateAddress: string;
  mimickedAddress?: string;
  prefixMatch: string;
  suffixMatch: string;
  divergenceLength: number;
  threatScore: number;
  classification: "SAFE" | "SUSPICIOUS" | "CRITICAL_POISONED";
  isDustTransaction: boolean;
  isZeroValueTransfer: boolean;
  checkedAt: string;
}

export interface ArkivEvidenceProof {
  proofId: string;
  threatType: string;
  attackerVanityAddress: string;
  mimickedCounterparty: string;
  confidenceScore: number;
  targetedAsset: string;
  firstDetectedAt: string;
  signature: string;
  publisherKey: string;
}

