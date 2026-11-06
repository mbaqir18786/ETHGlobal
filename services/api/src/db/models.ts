/**
 * HexFence Core Data Models
 * Specifications derived from Phase 4 Backend & Database Foundation
 */

export type ReviewStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "CONFIRMED"
  | "REJECTED"
  | "FALSE_POSITIVE";

export type EvidenceStatus =
  | "SUSPECTED"
  | "UNDER_REVIEW"
  | "CONFIRMED_BY_REVIEW"
  | "FALSE_POSITIVE";

export type DetectionReason =
  | "DUST_TRANSFER"
  | "ZERO_VALUE_TRANSFER"
  | "GPU_VANITY_COLLISION"
  | "HIGH_HAMMING_SIMILARITY"
  | "COMMUNITY_REPORT";

export type NotificationType =
  | "EMAIL"
  | "IVR_PHONE"
  | "BROWSER_PUSH"
  | "WEBHOOK";

/**
 * Community-submitted suspect vanity report
 */
export interface CommunityReport {
  id: string; // Report ID (e.g. REP-9812)
  submittedAddress: string; // The suspected lookalike or target wallet
  relatedAddress?: string; // The genuine counterparty address being mimicked
  txHash?: string; // Triggering transaction hash
  tokenContract?: string; // Token contract or asset symbol (e.g. USDT, WBTC)
  description: string; // User description / context
  supportingEvidence?: string; // Link, screenshot reference, or transaction details
  submissionTimestamp: string; // ISO 8601 string
  reviewStatus: ReviewStatus; // Review state
  reviewedAt?: string; // When an analyst reviewed the submission
  reviewedBy?: string; // Reviewer identifier (e.g. "dev-admin")
  resolutionNotes?: string; // Administrative triage notes
  isFalsePositiveDispute?: boolean; // Flagged as false-positive dispute
}

/**
 * Immutable forensic threat evidence anchored to Arkiv Protocol
 */
export interface ThreatEvidence {
  id: string; // Evidence ID (e.g. EVID-1029)
  suspectedAddress: string; // Lookalike poisoner address
  referenceAddress: string; // Legitimate reference counterparty
  txHash: string; // On-chain triggering transaction hash
  blockNumber?: number; // Ethereum block number
  tokenContract: string; // Token symbol or contract address
  amount?: string; // Transferred value (e.g. "0.0001 ETH")
  detectionReason: DetectionReason; // Heuristic reason
  confidenceScore: number; // 0 - 100
  detectorVersion: string; // e.g. "v2.4.2-heuristic"
  timestamp: string; // ISO 8601 string
  evidenceStatus: EvidenceStatus; // Verification state
  arkivEntityReference: string; // Arkiv protocol receipt URI (e.g. arkiv://...)
  sharedPrefix: string; // Overlapping leading characters
  sharedSuffix: string; // Overlapping trailing characters
  divergentLength: number; // Count of mismatched characters
  investigationNotes?: string; // Analyst explanation
}

/**
 * Platform operational and security audit log
 */
export interface AuditLog {
  id: string; // Event ID (e.g. EVT-3921)
  action: string; // Action performed (e.g. "EVIDENCE_STATUS_UPDATED")
  actorReference: string; // Actor who triggered the action (e.g. "dev-admin")
  timestamp: string; // ISO 8601 string
  relevantMetadata: Record<string, unknown>; // Contextual metadata
  ipAddress?: string; // Source IP (if available)
  status: "SUCCESS" | "FAILED" | "WARNING";
}

/**
 * User threat alerts & IVR notification preferences
 */
export interface NotificationPreference {
  id: string; // Preference ID (e.g. PREF-001)
  userReference: string; // Wallet address or operator account
  notificationType: NotificationType;
  enabled: boolean;
  destination: string; // Email, phone number (+E.164), or webhook URL
  updatedAt: string; // ISO 8601 string
}

/**
 * Address Investigation Composite Response
 */
export interface AddressInvestigationResponse {
  address: string;
  isFormatValid: boolean;
  status: "AUDIT_COMPLETED" | "INVALID_FORMAT";
  hasMatchingEvidence: boolean;
  totalAssociatedLookalikes: number;
  evidenceList: ThreatEvidence[];
  associatedReports: CommunityReport[];
  investigatedAt: string;
  disclaimer: string;
}

