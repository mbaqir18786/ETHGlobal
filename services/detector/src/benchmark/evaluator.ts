import { PrecisionRecallMetrics, HandLabeledTestCase } from "../types";
import { AddressPoisoningDetector } from "../engine";
import { GROUND_TRUTH_DATASET } from "./groundTruthDataset";

export interface BenchmarkReport {
  timestamp: string;
  detectorVersion: string;
  metrics: PrecisionRecallMetrics;
  deduplicationTest: {
    firstRunFlagged: number;
    secondRunFlagged: number;
    duplicateEvidenceCreated: number;
    deduplicationEfficiency: string;
  };
  falsePositiveAnalysis: Array<{
    caseId: string;
    caseName: string;
    reason: string;
    confidenceScore: number;
    explanation: string;
  }>;
  caseSummaries: Array<{
    id: string;
    name: string;
    category: string;
    expected: boolean;
    detected: boolean;
    confidenceScore: number;
    isCorrect: boolean;
  }>;
}

export class DetectorBenchmarkEvaluator {
  private detector: AddressPoisoningDetector;

  constructor(detector?: AddressPoisoningDetector) {
    this.detector = detector || new AddressPoisoningDetector();
  }

  /**
   * Runs the full 32-case benchmark evaluation
   */
  public runBenchmark(
    dataset: HandLabeledTestCase[] = GROUND_TRUTH_DATASET
  ): BenchmarkReport {
    this.detector.resetDeduplicationCache();

    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    const caseSummaries: BenchmarkReport["caseSummaries"] = [];
    const falsePositiveDetails: PrecisionRecallMetrics["falsePositiveDetails"] = [];

    let maliciousCount = 0;
    let benignCount = 0;

    // Run First Pass
    for (const testCase of dataset) {
      if (testCase.expectedIsMalicious) {
        maliciousCount++;
      } else {
        benignCount++;
      }

      const result = this.detector.evaluate(testCase.input);
      const detected = result.isFlaggedAsPoisoning;
      const expected = testCase.expectedIsMalicious;

      if (expected && detected) {
        tp++;
      } else if (!expected && detected) {
        fp++;
        falsePositiveDetails.push({
          caseId: testCase.id,
          caseName: testCase.name,
          reason: result.detectionReason,
          confidenceScore: result.confidenceScore,
          explanation: `Benign transaction was falsely flagged with score ${result.confidenceScore}/100. ${result.notes}`,
        });
      } else if (!expected && !detected) {
        tn++;
      } else if (expected && !detected) {
        fn++;
      }

      caseSummaries.push({
        id: testCase.id,
        name: testCase.name,
        category: testCase.category,
        expected,
        detected,
        confidenceScore: result.confidenceScore,
        isCorrect: expected === detected,
      });
    }

    const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const accuracy = (tp + tn) / dataset.length;

    // Deduplication Stress Test:
    // Re-run the exact same dataset without resetting cache
    let firstRunFlagged = tp + fp;
    let duplicateEvidenceCreated = 0;
    let secondRunFlagged = 0;

    for (const testCase of dataset) {
      const secondResult = this.detector.evaluate(testCase.input);
      if (secondResult.isFlaggedAsPoisoning) {
        secondRunFlagged++;
        if (!secondResult.isDuplicate) {
          duplicateEvidenceCreated++;
        }
      }
    }

    const metrics: PrecisionRecallMetrics = {
      totalTestCases: dataset.length,
      maliciousCount,
      benignCount,
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
      precision,
      recall,
      f1Score,
      accuracy,
      falsePositiveDetails,
    };

    return {
      timestamp: new Date().toISOString(),
      detectorVersion: "v2.5.0-engine",
      metrics,
      deduplicationTest: {
        firstRunFlagged,
        secondRunFlagged,
        duplicateEvidenceCreated,
        deduplicationEfficiency:
          duplicateEvidenceCreated === 0 ? "100.0% (Zero Duplicates Created)" : "FAILED",
      },
      falsePositiveAnalysis: falsePositiveDetails,
      caseSummaries,
    };
  }

  /**
   * Prints a human-readable benchmark report to stdout
   */
  public printReport(report: BenchmarkReport): void {
    const { metrics, deduplicationTest } = report;

    console.log("================================================================================");
    console.log("📊 HEXFENCE ADDRESS-POISONING DETECTOR // BENCHMARK EVALUATION");
    console.log(`⏱️  Timestamp: ${report.timestamp} | Engine: ${report.detectorVersion}`);
    console.log("================================================================================");
    console.log(`Total Hand-Labeled Cases : ${metrics.totalTestCases}`);
    console.log(`  - Malicious Attacks     : ${metrics.maliciousCount}`);
    console.log(`  - Benign / Edge Cases   : ${metrics.benignCount}`);
    console.log("--------------------------------------------------------------------------------");
    console.log(`Confusion Matrix:`);
    console.log(`  True Positives  (TP)    : ${metrics.truePositives}`);
    console.log(`  False Positives (FP)    : ${metrics.falsePositives}`);
    console.log(`  True Negatives  (TN)    : ${metrics.trueNegatives}`);
    console.log(`  False Negatives (FN)    : ${metrics.falseNegatives}`);
    console.log("--------------------------------------------------------------------------------");
    console.log(`Performance Metrics:`);
    console.log(`  Precision               : ${(metrics.precision * 100).toFixed(2)}%`);
    console.log(`  Recall                  : ${(metrics.recall * 100).toFixed(2)}%`);
    console.log(`  F1-Score                : ${(metrics.f1Score * 100).toFixed(2)}%`);
    console.log(`  Overall Accuracy        : ${(metrics.accuracy * 100).toFixed(2)}%`);
    console.log("--------------------------------------------------------------------------------");
    console.log(`Deduplication Integrity:`);
    console.log(`  First Pass Flagged      : ${deduplicationTest.firstRunFlagged}`);
    console.log(`  Second Pass Duplicate Ev: ${deduplicationTest.duplicateEvidenceCreated}`);
    console.log(`  Efficiency              : ${deduplicationTest.deduplicationEfficiency}`);
    console.log("--------------------------------------------------------------------------------");

    if (metrics.falsePositives === 0) {
      console.log("✅ Zero False Positives: Clean discrimination of legitimate contracts and routers.");
    } else {
      console.log(`⚠️  False Positives Identified (${metrics.falsePositives}):`);
      report.falsePositiveAnalysis.forEach((fp) => {
        console.log(`  - [${fp.caseId}] ${fp.caseName}: Score ${fp.confidenceScore}/100`);
        console.log(`    ${fp.explanation}`);
      });
    }
    console.log("================================================================================\n");
  }
}

