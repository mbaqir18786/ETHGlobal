/**
 * HexFence Detection Engine Types
 * Phase 5 Detection Specification
 */

export type DetectionReason =
  | "ZERO_VALUE_SPOOF"
  | "DUST_LOOKALIKE_TRANSFER"
  | "POST_PAYMENT_TIMING_INJECTION"
  | "HIGH_ENTROPY_VANITY_COLLISION"
  | "MULTI_VECTOR_POISONING";

export type EvidenceStatus = "suspected" | "under_review" | "confirmed" | "false_positive";

export interface TransactionPayload {
  txHash: string;
  fromAddress: string;
  toAddress: string;
  token: string;
  tokenContractAddress?: string;
  amount: string; // Decimal string e.g. "0.00005" or "0"
  blockNumber: number;
  blockTimestamp: number; // Unix timestamp in seconds
}

export interface ReferenceCounterparty {
  address: string;
  label?: string;
  historicalTxCount: number;
  lastGenuinePaymentTimestamp: number; // Unix timestamp in seconds
  lastGenuineTxHash?: string;
}

export interface DetectionInput {
  candidateTx: TransactionPayload;
  victimWalletAddress: string;
  recentCounterparties: ReferenceCounterparty[];
}

export interface VanityCollisionMetrics {
  sharedPrefix: string;
  sharedPrefixLength: number;
  sharedSuffix: string;
  sharedSuffixLength: number;
  totalCollisionLength: number;
  divergentMiddleLength: number;
  collisionProbability: string; // e.g. "16^-14"
  hammingDistance: number;
}

export interface TimingMetrics {
  timeDeltaSeconds: number;
  isWithinSuspiciousWindow: boolean; // e.g. < 120 minutes after genuine payment
  suspicionFactor: number; // 0 to 1
}

export interface DustMetrics {
  isZeroValue: boolean;
  isDustAmount: boolean;
  rawAmount: string;
  estimatedUsdValue: number;
}

export interface DetectionResult {
  evidenceId: string;
  referenceAddress: string;
  suspectedLookalikeAddress: string;
  suspectedAddress: string; // Alias for seamless integration
  txHash: string;
  token: string;
  detectionReason: DetectionReason;
  confidenceScore: number; // 0 to 100
  detectorVersion: string; // e.g. "v2.5.0-engine"
  detectionTimestamp: string; // ISO 8601
  evidenceStatus: EvidenceStatus;
  collisionMetrics: VanityCollisionMetrics;
  timingMetrics: TimingMetrics;
  dustMetrics: DustMetrics;
  isFlaggedAsPoisoning: boolean;
  isDuplicate?: boolean;
  notes: string;
}

export interface HandLabeledTestCase {
  id: string;
  name: string;
  category: "MALICIOUS_POISONING" | "BENIGN_TRANSFER" | "EDGE_CASE";
  expectedIsMalicious: boolean;
  input: DetectionInput;
  groundTruthNotes: string;
}

export interface PrecisionRecallMetrics {
  totalTestCases: number;
  maliciousCount: number;
  benignCount: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precision: number; // TP / (TP + FP)
  recall: number; // TP / (TP + FN)
  f1Score: number; // 2 * (P * R) / (P + R)
  accuracy: number;
  falsePositiveDetails: Array<{
    caseId: string;
    caseName: string;
    reason: string;
    confidenceScore: number;
    explanation: string;
  }>;
}
