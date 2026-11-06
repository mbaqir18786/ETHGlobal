import crypto from "crypto";
import {
  DetectionInput,
  DetectionResult,
  DetectionReason,
  EvidenceStatus,
  VanityCollisionMetrics,
  TimingMetrics,
  DustMetrics,
} from "./types";
import { CONFIG } from "./config";
import { analyzeVanityCollision } from "./algorithms/vanityMatcher";
import { evaluateDust } from "./algorithms/dustEvaluator";
import { evaluateTiming } from "./algorithms/timingEvaluator";

export class AddressPoisoningDetector {
  private readonly version: string = CONFIG.DETECTOR_VERSION;
  private readonly processedEvidenceHashes: Set<string> = new Set();

  constructor(customVersion?: string) {
    if (customVersion) {
      this.version = customVersion;
    }
  }

  /**
   * Generates a deterministic hash for deduplication
   * Unique identity = SHA-256(refAddress:suspectedAddress:txHash)
   */
  public generateDeduplicationKey(
    referenceAddress: string,
    suspectedAddress: string,
    txHash: string
  ): string {
    const raw = `${referenceAddress.toLowerCase()}:${suspectedAddress.toLowerCase()}:${txHash.toLowerCase()}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  /**
   * Evaluates a candidate transaction against recent counterparties
   */
  public evaluate(input: DetectionInput): DetectionResult {
    const { candidateTx, recentCounterparties } = input;
    const candidateAddress = candidateTx.toAddress;

    // Evaluate dust/value profile of the candidate transaction
    const dustEvaluation = evaluateDust(candidateTx.token, candidateTx.amount);

    // If no recent counterparties available, evaluate candidate in isolation
    if (!recentCounterparties || recentCounterparties.length === 0) {
      return this.buildNeutralResult(candidateTx, dustEvaluation);
    }

    // Compare candidate against all recent counterparties to find closest mimicry
    let bestMatch = {
      referenceAddress: recentCounterparties[0].address,
      collision: analyzeVanityCollision(recentCounterparties[0].address, candidateAddress),
      timing: evaluateTiming(
        candidateTx.blockTimestamp,
        recentCounterparties[0].lastGenuinePaymentTimestamp
      ),
      compositeScore: 0,
    };

    for (const counterparty of recentCounterparties) {
      // Analyze vanity characters
      const collision = analyzeVanityCollision(counterparty.address, candidateAddress);

      // Analyze post-payment timing
      const timing = evaluateTiming(
        candidateTx.blockTimestamp,
        counterparty.lastGenuinePaymentTimestamp
      );

      // Calculate weighted multi-vector confidence score
      // Only compute vanity score if addresses are not identical
      const vanityComponent = collision.vanityScore * CONFIG.WEIGHTS.VANITY_COLLISION;
      const dustComponent = dustEvaluation.dustScore * CONFIG.WEIGHTS.DUST_PROFILE;
      const timingComponent = timing.timingScore * CONFIG.WEIGHTS.TIMING_CORRELATION;

      let score = Math.round(vanityComponent + dustComponent + timingComponent);

      // Multi-signal synergy boost:
      // If BOTH high vanity match (>= 10 chars) AND zero-value transfer, confidence reaches critical
      if (collision.totalCollisionLength >= 10 && dustEvaluation.isZeroValue) {
        score = Math.min(100, score + 10);
      }

      // If immediate post-payment injection (< 5 mins) with vanity match, boost score
      if (timing.isWithinSuspiciousWindow && timing.timeDeltaSeconds <= 300 && collision.totalCollisionLength >= 8) {
        score = Math.min(100, score + 10);
      }

      // Safeguard: Identical address is a legitimate repeat transfer, NOT lookalike poisoning
      if (counterparty.address.toLowerCase() === candidateAddress.toLowerCase()) {
        score = 0;
      }

      // Safeguard: Transfers with high real value ($500+) cannot be classified as zero-value/dust attacks unless extreme vanity match (>= 12 chars)
      if (dustEvaluation.estimatedUsdValue > 500 && collision.totalCollisionLength < 12) {
        score = Math.min(25, score);
      }

      if (score > bestMatch.compositeScore || counterparty === recentCounterparties[0]) {
        bestMatch = {
          referenceAddress: counterparty.address,
          collision,
          timing,
          compositeScore: score,
        };
      }
    }

    // Determine primary detection reason
    const reason = this.determineDetectionReason(
      bestMatch.collision,
      dustEvaluation,
      bestMatch.timing
    );

    const isFlaggedAsPoisoning =
      bestMatch.compositeScore >= CONFIG.THRESHOLDS.SUSPICION_FLAG_THRESHOLD &&
      bestMatch.collision.totalCollisionLength >= CONFIG.THRESHOLDS.MIN_VANITY_COLLISION_LENGTH;

    // Check for deduplication
    const dedupKey = this.generateDeduplicationKey(
      bestMatch.referenceAddress,
      candidateAddress,
      candidateTx.txHash
    );

    const isDuplicate = this.processedEvidenceHashes.has(dedupKey);
    if (isFlaggedAsPoisoning && !isDuplicate) {
      this.processedEvidenceHashes.add(dedupKey);
    }

    const evidenceId = `EVID-${dedupKey.slice(0, 8).toUpperCase()}`;

    // Notes explaining detection rationale
    const notes = isFlaggedAsPoisoning
      ? `Flagged lookalike poisoning: shares ${bestMatch.collision.sharedPrefixLength} prefix and ${bestMatch.collision.sharedSuffixLength} suffix chars with genuine counterparty ${bestMatch.referenceAddress}. Vector: ${dustEvaluation.isZeroValue ? "zero-value transfer" : "dust transfer"}.`
      : `Transaction evaluated as normal/benign. Confidence score: ${bestMatch.compositeScore}/100.`;

    return {
      evidenceId,
      referenceAddress: bestMatch.referenceAddress,
      suspectedLookalikeAddress: candidateAddress,
      suspectedAddress: candidateAddress,
      txHash: candidateTx.txHash,
      token: candidateTx.token,
      detectionReason: reason,
      confidenceScore: bestMatch.compositeScore,
      detectorVersion: this.version,
      detectionTimestamp: new Date().toISOString(),
      evidenceStatus: "suspected" as EvidenceStatus,
      collisionMetrics: bestMatch.collision,
      timingMetrics: bestMatch.timing,
      dustMetrics: dustEvaluation,
      isFlaggedAsPoisoning,
      isDuplicate,
      notes,
    };
  }

  /**
   * Evaluates multiple transactions in batch and removes duplicates
   */
  public evaluateBatch(inputs: DetectionInput[]): DetectionResult[] {
    return inputs.map((input) => this.evaluate(input));
  }

  /**
   * Resets the deduplication cache (useful for clean benchmark runs)
   */
  public resetDeduplicationCache(): void {
    this.processedEvidenceHashes.clear();
  }

  /**
   * Returns current deduplication cache size
   */
  public getDeduplicationCacheSize(): number {
    return this.processedEvidenceHashes.size;
  }

  private determineDetectionReason(
    collision: VanityCollisionMetrics,
    dust: DustMetrics,
    timing: TimingMetrics
  ): DetectionReason {
    if (dust.isZeroValue && collision.totalCollisionLength >= 8) {
      return "ZERO_VALUE_SPOOF";
    }
    if (dust.isDustAmount && collision.totalCollisionLength >= 8) {
      return "DUST_LOOKALIKE_TRANSFER";
    }
    if (timing.isWithinSuspiciousWindow && collision.totalCollisionLength >= 8) {
      return "POST_PAYMENT_TIMING_INJECTION";
    }
    if (collision.totalCollisionLength >= CONFIG.THRESHOLDS.CRITICAL_VANITY_COLLISION_LENGTH) {
      return "HIGH_ENTROPY_VANITY_COLLISION";
    }
    return "MULTI_VECTOR_POISONING";
  }

  private buildNeutralResult(
    candidateTx: any,
    dustEvaluation: DustMetrics & { dustScore: number }
  ): DetectionResult {
    const dedupKey = this.generateDeduplicationKey(
      "0x0000000000000000000000000000000000000000",
      candidateTx.toAddress,
      candidateTx.txHash
    );

    return {
      evidenceId: `EVID-${dedupKey.slice(0, 8).toUpperCase()}`,
      referenceAddress: "N/A",
      suspectedLookalikeAddress: candidateTx.toAddress,
      suspectedAddress: candidateTx.toAddress,
      txHash: candidateTx.txHash,
      token: candidateTx.token,
      detectionReason: dustEvaluation.isZeroValue ? "ZERO_VALUE_SPOOF" : "DUST_LOOKALIKE_TRANSFER",
      confidenceScore: dustEvaluation.isZeroValue ? 30 : 10,
      detectorVersion: this.version,
      detectionTimestamp: new Date().toISOString(),
      evidenceStatus: "suspected",
      collisionMetrics: {
        sharedPrefix: "",
        sharedPrefixLength: 0,
        sharedSuffix: "",
        sharedSuffixLength: 0,
        totalCollisionLength: 0,
        divergentMiddleLength: 40,
        collisionProbability: "1.0",
        hammingDistance: 40,
      },
      timingMetrics: {
        timeDeltaSeconds: -1,
        isWithinSuspiciousWindow: false,
        suspicionFactor: 0,
      },
      dustMetrics: dustEvaluation,
      isFlaggedAsPoisoning: false,
      isDuplicate: false,
      notes: "No historical counterparties provided for collision comparison.",
    };
  }
}

