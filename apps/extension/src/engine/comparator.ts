import {
  DecodedTransaction,
  EvaluationResult,
  ApprovedPayee,
  ArkivSnapshot,
} from "../types";

const PAYEES_STORAGE_KEY = "hexfence_approved_payees";

// Default seed approved payees for test and development on Sepolia
export const SEED_APPROVED_PAYEES: ApprovedPayee[] = [
  {
    address: "0xd9a1c3788d81257612e2581a6ea0ada244853a91",
    label: "Treasury Primary Counterparty",
    addedAt: "2026-05-01T10:00:00Z",
  },
  {
    address: "0x28c6c06298d514db089934071355e5743bf21d60",
    label: "OTC Liquidity Partner",
    addedAt: "2026-05-15T14:30:00Z",
  },
];

/**
 * Loads approved Safe payees from chrome.storage.local
 */
export async function getLocalApprovedPayees(): Promise<ApprovedPayee[]> {
  try {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      const res = await chrome.storage.local.get(PAYEES_STORAGE_KEY);
      if (res && res[PAYEES_STORAGE_KEY]) {
        return res[PAYEES_STORAGE_KEY] as ApprovedPayee[];
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to load payees from storage, using defaults:", err);
  }

  return SEED_APPROVED_PAYEES;
}

/**
 * Saves approved Safe payees to chrome.storage.local
 */
export async function saveApprovedPayees(payees: ApprovedPayee[]): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [PAYEES_STORAGE_KEY]: payees });
  }
}

/**
 * Calculates prefix and suffix vanity collisions between two 42-char addresses
 */
export function calculateVanityCollision(
  addrA: string,
  addrB: string
): {
  isCollision: boolean;
  prefix: string;
  suffix: string;
  divergentCount: number;
  entropyNotation: string;
} {
  const a = addrA.toLowerCase();
  const b = addrB.toLowerCase();

  if (a === b) {
    return {
      isCollision: false,
      prefix: "",
      suffix: "",
      divergentCount: 0,
      entropyNotation: "N/A",
    };
  }

  // 1. Calculate prefix match length (excluding 0x)
  let prefixLen = 0;
  for (let i = 2; i < 42; i++) {
    if (a[i] === b[i]) {
      prefixLen++;
    } else {
      break;
    }
  }

  // 2. Calculate suffix match length
  let suffixLen = 0;
  for (let i = 41; i >= 2; i--) {
    if (a[i] === b[i]) {
      suffixLen++;
    } else {
      break;
    }
  }

  const prefix = a.slice(0, 2 + prefixLen);
  const suffix = a.slice(42 - suffixLen);
  const totalMatchChars = prefixLen + suffixLen;
  const divergentCount = Math.max(0, 40 - totalMatchChars);

  // A vanity poisoning attack deliberately brute-forces >= 4 prefix chars AND >= 4 suffix chars
  // (Total >= 8 chars = 32 collision bits = 1 in 4.29 billion probability)
  const isCollision = prefixLen >= 4 && suffixLen >= 4;

  return {
    isCollision,
    prefix,
    suffix,
    divergentCount,
    entropyNotation: `16^-(${totalMatchChars})`,
  };
}

/**
 * Core Local Transaction Evaluator
 * Operates 100% on-device; never leaks recipient to external servers.
 */
export async function evaluateTransaction(
  decoded: DecodedTransaction,
  snapshot: ArkivSnapshot,
  approvedPayees?: ApprovedPayee[]
): Promise<EvaluationResult> {
  const payees = approvedPayees || (await getLocalApprovedPayees());
  const evaluatedAt = new Date().toISOString();

  // 1. Unrecognized or unsupported transaction format
  // Critical Security Rule: Never assign a false green safety result to unsupported formats!
  if (!decoded.isSupported || !decoded.recipient) {
    return {
      state: "CANNOT_VERIFY",
      recipient: decoded.rawTo,
      isApproved: false,
      detectionReason: decoded.errorReason || "Unsupported contract transaction or MultiSend batch format.",
      evaluatedAt,
      disclaimer: "Unknown or unsupported transactions must never receive a false green safety result.",
    };
  }

  const recipient = decoded.recipient.toLowerCase();

  // 2. Check if recipient is an explicitly approved payee
  const approvedMatch = payees.find((p) => p.address.toLowerCase() === recipient);
  if (approvedMatch) {
    return {
      state: "APPROVED_PAYEE",
      recipient,
      isApproved: true,
      genuinePayee: approvedMatch.address,
      detectionReason: `Matched approved Safe payee label: '${approvedMatch.label}'.`,
      evaluatedAt,
      disclaimer: "Address is verified in your local Safe payee whitelist.",
    };
  }

  // 3. Check for vanity lookalike collision against all approved payees
  for (const payee of payees) {
    const collision = calculateVanityCollision(recipient, payee.address);
    if (collision.isCollision) {
      return {
        state: "SUSPICIOUS_LOOKALIKE",
        recipient,
        isApproved: false,
        genuinePayee: payee.address,
        matchingPrefix: collision.prefix,
        matchingSuffix: collision.suffix,
        divergentCharacters: collision.divergentCount,
        collisionEntropy: collision.entropyNotation,
        detectionReason: `Vanity lookalike collision with approved payee '${payee.label}'. Mimicking prefix (${collision.prefix}) and suffix (${collision.suffix}).`,
        confidenceScore: 98.5,
        evaluatedAt,
        disclaimer: "CRITICAL: Do NOT copy addresses from transaction logs or recent counterparties.",
      };
    }
  }

  // 4. Check against locally cached Arkiv evidence snapshot
  for (const entity of snapshot.entities) {
    // Exact match with known suspected poisoner address
    if (entity.suspectedAddress.toLowerCase() === recipient) {
      return {
        state: "SUSPICIOUS_LOOKALIKE",
        recipient,
        isApproved: false,
        genuinePayee: entity.referenceAddress,
        matchingPrefix: entity.sharedPrefix,
        matchingSuffix: entity.sharedSuffix,
        collisionEntropy: "16^-(14) [GPU BRUTE]",
        detectionReason: `Known address-poisoning entity in Arkiv registry (Incident ${entity.evidenceId}, Token: ${entity.token}).`,
        confidenceScore: entity.confidence,
        arkivEntityRef: `arkiv://hexfence.poisoning.v1/${entity.evidenceId}`,
        evaluatedAt,
        disclaimer: "CRITICAL: Address identified as an attacker vanity in audited on-chain Arkiv records.",
      };
    }

    // Collision check against known reference counterparty
    const collision = calculateVanityCollision(recipient, entity.referenceAddress);
    if (collision.isCollision) {
      return {
        state: "SUSPICIOUS_LOOKALIKE",
        recipient,
        isApproved: false,
        genuinePayee: entity.referenceAddress,
        matchingPrefix: collision.prefix,
        matchingSuffix: collision.suffix,
        divergentCharacters: collision.divergentCount,
        collisionEntropy: collision.entropyNotation,
        detectionReason: `Vanity lookalike mimicking counterparty in Arkiv record ${entity.evidenceId}.`,
        confidenceScore: 94.0,
        arkivEntityRef: `arkiv://hexfence.poisoning.v1/${entity.evidenceId}`,
        evaluatedAt,
        disclaimer: "CRITICAL: Vanity characters collide with counterparty from previous poisoning attempt.",
      };
    }
  }

  // 5. No matching evidence found
  return {
    state: "NO_MATCHING_EVIDENCE",
    recipient,
    isApproved: false,
    detectionReason: "Recipient is not an approved payee and does not match any indexed threat evidence.",
    evaluatedAt,
    disclaimer: "Absence of matching evidence is NOT proof of safety. Adversaries generate vanity addresses dynamically. Verify all 42 characters manually.",
  };
}
