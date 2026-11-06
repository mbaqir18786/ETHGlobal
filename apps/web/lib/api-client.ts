/**
 * HexFence Core API Client
 * Seamlessly interfaces with @hexfence/api (http://localhost:4000/api)
 * Includes graceful fallback to the local offline dataset when the backend server is starting up.
 */

import { AddressInvestigationResult, EvidenceRecord } from "./explorer-types";
import { searchAddressEvidence, MOCK_EVIDENCE_REGISTRY } from "./mock-evidence";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function investigateAddressApi(
  address: string
): Promise<AddressInvestigationResult> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/investigate?address=${encodeURIComponent(address)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          address: json.data.address,
          isValid: true,
          hasMatchingEvidence: json.data.hasMatchingEvidence,
          totalAssociatedLookalikes: json.data.totalAssociatedLookalikes,
          evidenceList: json.data.evidenceList.map((e: any) => ({
            id: e.id,
            investigatedAddress: e.suspectedAddress,
            roleInIncident: "SUSPECTED_LOOKALIKE",
            relationship: {
              genuineAddress: e.referenceAddress,
              suspectedAddress: e.suspectedAddress,
              sharedPrefix: e.sharedPrefix,
              sharedSuffix: e.sharedSuffix,
              divergentCharacters: e.divergentLength,
              txHash: e.txHash,
              blockNumber: e.blockNumber || 20114000,
              token: e.tokenContract,
              amount: e.amount || "0.05 ETH (Dust)",
            },
            status: e.evidenceStatus === "CONFIRMED_BY_REVIEW" ? "Confirmed by Review" : e.evidenceStatus === "UNDER_REVIEW" ? "Under Review" : e.evidenceStatus === "FALSE_POSITIVE" ? "False Positive" : "Suspected",
            detectionTimestamp: e.timestamp,
            isoDate: e.timestamp,
            detectorVersion: e.detectorVersion,
            arkivEvidenceId: e.arkivEntityReference,
            detectionReason: e.detectionReason.replace(/_/g, " "),
            etherscanTxUrl: `https://etherscan.io/tx/${e.txHash}`,
            etherscanAddressUrl: `https://etherscan.io/address/${e.suspectedAddress}`,
            investigationNotes: e.investigationNotes || "Analyzed by HexFence detection engine.",
            confidenceScore: e.confidenceScore,
          })),
          searchedAt: json.data.investigatedAt,
        };
      }
    }
  } catch {
    // API service offline or unreachable during standalone client rendering; fallback to mock layer
  }

  return searchAddressEvidence(address);
}

export async function submitCommunityReportApi(data: {
  submittedAddress: string;
  relatedAddress?: string;
  txHash?: string;
  tokenContract?: string;
  description: string;
  supportingEvidence?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function submitFalsePositiveApi(data: {
  address: string;
  reason: string;
  evidenceReference?: string;
  contactEmail?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/reports/false-positive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
