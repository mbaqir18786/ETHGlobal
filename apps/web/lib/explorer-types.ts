export type EvidenceStatus =
  | "Suspected"
  | "Under Review"
  | "Confirmed by Review"
  | "False Positive";

export type DetectionReason =
  | "Dust Transfer"
  | "Zero-Value Transfer"
  | "GPU Vanity Collision"
  | "High Hamming Similarity";

export interface AddressRelationship {
  genuineAddress: string;
  suspectedAddress: string;
  sharedPrefix: string;
  sharedSuffix: string;
  divergentCharacters: number;
  txHash: string;
  blockNumber: number;
  token: string;
  amount: string;
}

export interface EvidenceRecord {
  id: string;
  investigatedAddress: string;
  roleInIncident: "SUSPECTED_LOOKALIKE" | "TARGET_VICTIM" | "GENUINE_RECIPIENT";
  relationship: AddressRelationship;
  status: EvidenceStatus;
  detectionTimestamp: string;
  isoDate: string;
  detectorVersion: string;
  arkivEvidenceId: string;
  detectionReason: DetectionReason;
  etherscanTxUrl: string;
  etherscanAddressUrl: string;
  investigationNotes: string;
  confidenceScore: number;
}

export interface AddressInvestigationResult {
  address: string;
  isValid: boolean;
  searchedAt: string;
  hasMatchingEvidence: boolean;
  totalAssociatedLookalikes: number;
  evidenceList: EvidenceRecord[];
}

