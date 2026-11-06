import { TimingMetrics } from "../types";

/**
 * Evaluates temporal proximity between genuine payment and suspicious transaction
 */
export function evaluateTiming(
  candidateTimestamp: number,
  lastGenuinePaymentTimestamp: number
): TimingMetrics & { timingScore: number } {
  // If no genuine payment recorded, neutral timing
  if (!lastGenuinePaymentTimestamp || lastGenuinePaymentTimestamp <= 0) {
    return {
      timeDeltaSeconds: -1,
      isWithinSuspiciousWindow: false,
      suspicionFactor: 0,
      timingScore: 25, // Baseline unlinked transaction score
    };
  }

  const deltaSeconds = candidateTimestamp - lastGenuinePaymentTimestamp;

  // If candidate occurred before genuine payment, delta is negative or irrelevant
  if (deltaSeconds < 0) {
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: false,
      suspicionFactor: 0,
      timingScore: 10,
    };
  }

  // Suspicious window definitions:
  // Adversaries listen to mempool and inject within 30 seconds - 2 hours of payment
  if (deltaSeconds <= 300) {
    // Within 5 minutes of payment: Immediate reactive injection
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: true,
      suspicionFactor: 1.0,
      timingScore: 95,
    };
  } else if (deltaSeconds <= 3600) {
    // Within 1 hour: Very high timing correlation
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: true,
      suspicionFactor: 0.85,
      timingScore: 85,
    };
  } else if (deltaSeconds <= 7200) {
    // Within 2 hours: Moderate timing correlation
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: true,
      suspicionFactor: 0.6,
      timingScore: 65,
    };
  } else if (deltaSeconds <= 86400) {
    // Within 24 hours: Low timing correlation
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: false,
      suspicionFactor: 0.25,
      timingScore: 40,
    };
  } else {
    // More than a day later: Timing factor decays to baseline
    return {
      timeDeltaSeconds: deltaSeconds,
      isWithinSuspiciousWindow: false,
      suspicionFactor: 0.05,
      timingScore: 15,
    };
  }
}
