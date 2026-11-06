/**
 * HexFence Chrome Extension Type Definitions
 * Phase 8: Safe Transaction Guard Architecture
 */

export type WarningState =
  | "SUSPICIOUS_LOOKALIKE"
  | "APPROVED_PAYEE"
  | "NO_MATCHING_EVIDENCE"
  | "CANNOT_VERIFY";

export type TransferType =
  | "NATIVE_ETH"
  | "ERC20_TRANSFER"
  | "ERC20_TRANSFER_FROM"
  | "UNSUPPORTED";

export interface DecodedTransaction {
  isSupported: boolean;
  transferType: TransferType;
  recipient?: string;
  tokenSymbol?: string;
  tokenAddress?: string;
  amount?: string;
  rawTo: string;
  rawValue?: string;
  rawData?: string;
  errorReason?: string;
}

export interface EvaluationResult {
  state: WarningState;
  recipient: string;
  isApproved: boolean;
  genuinePayee?: string;
  matchingPrefix?: string;
  matchingSuffix?: string;
  divergentCharacters?: number;
  collisionEntropy?: string;
  detectionReason?: string;
  confidenceScore?: number;
  arkivEntityRef?: string;
  evaluatedAt: string;
  disclaimer: string;
}

export interface ApprovedPayee {
  address: string;
  label: string;
  addedAt: string;
}

export interface ArkivSnapshotEntity {
  evidenceId: string;
  referenceAddress: string;
  suspectedAddress: string;
  txHash: string;
  token: string;
  confidence: number;
  evidenceStatus: "suspected" | "under_review" | "confirmed" | "false_positive";
  sharedPrefix: string;
  sharedSuffix: string;
}

export interface ArkivSnapshot {
  version: string;
  downloadedAt: string;
  totalEntities: number;
  entities: ArkivSnapshotEntity[];
}

export type SupportedLanguage = "en" | "hi";

