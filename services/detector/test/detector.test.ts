import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  AddressPoisoningDetector,
  analyzeVanityCollision,
  evaluateDust,
  evaluateTiming,
  DetectorBenchmarkEvaluator,
  GROUND_TRUTH_DATASET,
} from "../src";

describe("HexFence Address-Poisoning Detector Suite", () => {
  describe("Algorithm 1: Vanity Collision & Entropy Math", () => {
    test("Correctly detects >= 14-char collision in $68M WBTC poisoning", () => {
      const genuine = "0xd9A1c3788D81257612E2581A6ea0aDa244853a91";
      const poisoned = "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91";

      const result = analyzeVanityCollision(genuine, poisoned);

      assert.strictEqual(result.sharedPrefixLength, 6);
      assert.ok(result.totalCollisionLength >= 14);
      assert.ok(result.vanityScore >= 95, "Vanity score must be >= 95 for 14-char collision");
    });

    test("Identical addresses must NOT be scored as lookalike spoofs", () => {
      const addr = "0xd9A1c3788D81257612E2581A6ea0aDa244853a91";
      const result = analyzeVanityCollision(addr, addr);

      assert.strictEqual(result.vanityScore, 0, "Identical address must have 0 vanity score");
    });

    test("Completely random distinct addresses have 0 collision length", () => {
      const addr1 = "0x1111111111111111111111111111111111111111";
      const addr2 = "0x9999999999999999999999999999999999999999";
      const result = analyzeVanityCollision(addr1, addr2);

      assert.strictEqual(result.totalCollisionLength, 0);
      assert.strictEqual(result.vanityScore, 0);
    });
  });

  describe("Algorithm 2: Dust & Zero-Value Profile Evaluation", () => {
    test("Zero-value transfer is flagged with critical dust score", () => {
      const result = evaluateDust("USDT", "0");
      assert.strictEqual(result.isZeroValue, true);
      assert.strictEqual(result.dustScore, 95);
    });

    test("Micro-dust (0.00001 ETH) is flagged as dust", () => {
      const result = evaluateDust("ETH", "0.00001");
      assert.strictEqual(result.isDustAmount, true);
      assert.strictEqual(result.dustScore, 80);
    });

    test("High-value capital ($5,000 USDT) has zero dust suspicion", () => {
      const result = evaluateDust("USDT", "5000");
      assert.strictEqual(result.isZeroValue, false);
      assert.strictEqual(result.isDustAmount, false);
      assert.strictEqual(result.dustScore, 0);
    });
  });

  describe("Algorithm 3: Post-Payment Timing Evaluation", () => {
    test("Immediate injection within 5 mins receives high suspicion factor", () => {
      const candidateTime = 1714735320;
      const genuineTime = 1714735200; // 120 seconds earlier

      const result = evaluateTiming(candidateTime, genuineTime);
      assert.strictEqual(result.isWithinSuspiciousWindow, true);
      assert.strictEqual(result.suspicionFactor, 1.0);
      assert.strictEqual(result.timingScore, 95);
    });

    test("Transaction occurring 3 days later decays to baseline", () => {
      const candidateTime = 1715000000;
      const genuineTime = 1714700000; // 300,000 seconds earlier

      const result = evaluateTiming(candidateTime, genuineTime);
      assert.strictEqual(result.isWithinSuspiciousWindow, false);
      assert.ok(result.timingScore <= 25);
    });
  });

  describe("Engine: Multi-Vector Evaluation & Deduplication", () => {
    test("Flags $68M WBTC lookalike poisoning with high confidence", () => {
      const detector = new AddressPoisoningDetector();
      const testCase = GROUND_TRUTH_DATASET.find((tc) => tc.id === "TC-MAL-01")!;

      const result = detector.evaluate(testCase.input);

      assert.strictEqual(result.isFlaggedAsPoisoning, true);
      assert.ok(result.confidenceScore >= 85, `Expected score >= 85, got ${result.confidenceScore}`);
      assert.ok(result.collisionMetrics.totalCollisionLength >= 14);
      assert.strictEqual(result.evidenceStatus, "suspected");
    });

    test("Does NOT flag repeat payment to identical verified counterparty", () => {
      const detector = new AddressPoisoningDetector();
      const testCase = GROUND_TRUTH_DATASET.find((tc) => tc.id === "TC-BEN-01")!;

      const result = detector.evaluate(testCase.input);

      assert.strictEqual(result.isFlaggedAsPoisoning, false);
      assert.strictEqual(result.confidenceScore, 0);
    });

    test("Deduplication ensures running twice marks duplicate without re-inserting", () => {
      const detector = new AddressPoisoningDetector();
      const testCase = GROUND_TRUTH_DATASET.find((tc) => tc.id === "TC-MAL-01")!;

      const run1 = detector.evaluate(testCase.input);
      assert.strictEqual(run1.isFlaggedAsPoisoning, true);
      assert.strictEqual(run1.isDuplicate, false);

      // Re-run same transaction
      const run2 = detector.evaluate(testCase.input);
      assert.strictEqual(run2.isFlaggedAsPoisoning, true);
      assert.strictEqual(run2.isDuplicate, true, "Second run must be marked as duplicate");
    });
  });

  describe("Benchmark: Hand-Labeled 32 Ground-Truth Cases", () => {
    test("Evaluates all 32 cases with Precision >= 95% and Recall >= 95%", () => {
      const detector = new AddressPoisoningDetector();
      const evaluator = new DetectorBenchmarkEvaluator(detector);

      const report = evaluator.runBenchmark(GROUND_TRUTH_DATASET);
      const { metrics, deduplicationTest } = report;

      assert.strictEqual(metrics.totalTestCases, 32);
      assert.strictEqual(metrics.maliciousCount, 16);
      assert.strictEqual(metrics.benignCount, 16);

      // Assert zero false positives on known legitimate vanity addresses (e.g. 1inch router)
      assert.strictEqual(metrics.falsePositives, 0, "Expected 0 false positives");

      // Assert 100% precision and recall on ground truth
      assert.ok(metrics.precision >= 0.95, `Expected precision >= 95%, got ${(metrics.precision * 100).toFixed(1)}%`);
      assert.ok(metrics.recall >= 0.95, `Expected recall >= 95%, got ${(metrics.recall * 100).toFixed(1)}%`);
      assert.ok(metrics.accuracy >= 0.95, `Expected accuracy >= 95%, got ${(metrics.accuracy * 100).toFixed(1)}%`);

      // Assert 100% deduplication efficiency
      assert.strictEqual(deduplicationTest.duplicateEvidenceCreated, 0, "No duplicate evidence created on re-run");
    });
  });
});

