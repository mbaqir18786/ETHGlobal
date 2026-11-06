import { AddressPoisoningDetector } from "./engine";
import { EthereumMainnetLogScanner } from "./scanner";
import { DetectorBenchmarkEvaluator } from "./benchmark/evaluator";
import { GROUND_TRUTH_DATASET } from "./benchmark/groundTruthDataset";

export * from "./types";
export * from "./config";
export * from "./engine";
export * from "./scanner";
export * from "./algorithms/vanityMatcher";
export * from "./algorithms/dustEvaluator";
export * from "./algorithms/timingEvaluator";
export * from "./benchmark/groundTruthDataset";
export * from "./benchmark/evaluator";

async function main() {
  console.log("🛡️ [HexFence Detector] Initializing Detection Engine & Benchmark...\n");

  const detector = new AddressPoisoningDetector();
  const evaluator = new DetectorBenchmarkEvaluator(detector);

  // 1. Run Ground Truth Benchmark (32 hand-labeled cases)
  const report = evaluator.runBenchmark(GROUND_TRUTH_DATASET);
  evaluator.printReport(report);

  // 2. Demonstrate Ethereum Mainnet RPC Scanning capability
  console.log("📡 [HexFence Detector] Testing Ethereum Mainnet RPC Connection via viem...");
  const scanner = new EthereumMainnetLogScanner();

  try {
    const latestBlock = await scanner.getLatestBlockNumber();
    console.log(`🔗 Current Ethereum Mainnet Block: #${latestBlock}`);
    console.log(`🔎 Polling recent USDT (0xdAC17F...) & USDC (0xA0b869...) transfer logs...`);

    const scanResult = await scanner.scanRecentTransferLogs({
      blockCount: 3,
      tokens: ["USDT", "USDC"],
    });

    console.log(`✅ Scanned blocks ${scanResult.scannedBlocks.from} to ${scanResult.scannedBlocks.to}`);
    console.log(`📥 Total Transfer Logs Analyzed: ${scanResult.totalLogsFound}`);
    console.log(`⚠️ Candidate Zero-Value/Dust Logs Filtered: ${scanResult.suspiciousLogs.length}`);

    if (scanResult.suspiciousLogs.length > 0) {
      console.log(`   Sample Candidate Log: txHash=${scanResult.suspiciousLogs[0].txHash} token=${scanResult.suspiciousLogs[0].token} amount=${scanResult.suspiciousLogs[0].amount}`);
    }
    console.log("\n🚀 Detector engine is active and ready for mempool daemon streaming.\n");
  } catch (err: any) {
    console.warn("ℹ️  Note: RPC call skipped or timed out; offline detection engine fully functional:", err?.message || err);
  }
}

// Auto-run if executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error("💥 Unhandled detector error:", err);
    process.exit(1);
  });
}

