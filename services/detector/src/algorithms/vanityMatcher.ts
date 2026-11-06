import { VanityCollisionMetrics } from "../types";

/**
 * Calculates prefix and suffix hex collisions and mathematical entropy
 */
export function analyzeVanityCollision(
  referenceAddress: string,
  candidateAddress: string
): VanityCollisionMetrics & { vanityScore: number } {
  const ref = referenceAddress.toLowerCase().replace(/^0x/, "");
  const cand = candidateAddress.toLowerCase().replace(/^0x/, "");

  // If identical, not a lookalike (same address!)
  if (ref === cand) {
    return {
      sharedPrefix: `0x${ref.slice(0, 4)}`,
      sharedPrefixLength: 40,
      sharedSuffix: "",
      sharedSuffixLength: 0,
      totalCollisionLength: 40,
      divergentMiddleLength: 0,
      collisionProbability: "1.0",
      hammingDistance: 0,
      vanityScore: 0, // Identical address is not a lookalike spoof!
    };
  }

  // Calculate matching prefix
  let prefixLen = 0;
  while (prefixLen < ref.length && ref[prefixLen] === cand[prefixLen]) {
    prefixLen++;
  }

  // Calculate matching suffix
  let suffixLen = 0;
  while (
    suffixLen < ref.length - prefixLen &&
    ref[ref.length - 1 - suffixLen] === cand[cand.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  const totalCollision = prefixLen + suffixLen;
  const divergentLength = Math.max(0, 40 - totalCollision);

  // Calculate Hamming Distance
  let hamming = 0;
  for (let i = 0; i < Math.min(ref.length, cand.length); i++) {
    if (ref[i] !== cand[i]) {
      hamming++;
    }
  }

  // Collision probability: 16^-(prefixLen + suffixLen)
  const collisionProbability = totalCollision > 0 ? `16^-${totalCollision}` : "1.0";

  // Score evaluation:
  // Legitimate addresses almost never share >= 6 characters by chance (16^-6 = 1 in 16.7M)
  // Lookalikes typically share 8 to 16 characters (e.g. 4 prefix + 4 suffix = 8 chars, 6+6=12, 7+7=14)
  let vanityScore = 0;

  if (totalCollision >= 14) {
    vanityScore = 98; // Extreme GPU vanity rig (e.g. $68M WBTC heist was 14 chars)
  } else if (totalCollision >= 12) {
    vanityScore = 90; // High vanity match (6 prefix + 6 suffix)
  } else if (totalCollision >= 10) {
    vanityScore = 80; // Significant vanity collision (e.g. 5 prefix + 5 suffix)
  } else if (totalCollision >= 8) {
    vanityScore = 65; // Moderate vanity collision (4 prefix + 4 suffix)
  } else if (totalCollision >= 6) {
    vanityScore = 35; // Weak collision (unlikely to be deliberate lookalike alone)
  } else {
    vanityScore = 0;
  }

  // Suffix matching is especially suspicious in crypto because wallet truncation shows ...suffix
  if (suffixLen >= 4 && prefixLen >= 4) {
    vanityScore = Math.min(100, vanityScore + 10);
  }

  return {
    sharedPrefix: `0x${cand.slice(0, prefixLen)}`,
    sharedPrefixLength: prefixLen,
    sharedSuffix: cand.slice(cand.length - suffixLen),
    sharedSuffixLength: suffixLen,
    totalCollisionLength: totalCollision,
    divergentMiddleLength: divergentLength,
    collisionProbability,
    hammingDistance: hamming,
    vanityScore,
  };
}
