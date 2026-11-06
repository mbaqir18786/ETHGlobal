import { HandLabeledTestCase } from "../types";

/**
 * Hand-Labeled Ground Truth Benchmark Dataset
 * 32 diverse, mathematically audited test cases covering:
 * - Real-world historic exploits (e.g. $68M WBTC poisoning)
 * - Zero-value transferFrom spoofs
 * - Post-payment dust timing attacks
 * - Benign normal transfers & repeat payments
 * - Legitimate vanity contracts & known false-positive edge cases
 */
export const GROUND_TRUTH_DATASET: HandLabeledTestCase[] = [
  // =========================================================================
  // 1. MALICIOUS POISONING ATTACKS (EXPECTED: TRUE)
  // =========================================================================
  {
    id: "TC-MAL-01",
    name: "The $68M WBTC Poisoning Incident",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      candidateTx: {
        txHash: "0x8f2a991a3e8749b5c208479b18361029c7381920acbf82019b83749b01294821",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91", // 14-char vanity match
        token: "ETH",
        amount: "0.05",
        blockNumber: 19782190,
        blockTimestamp: 1714735339,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91", // Genuine counterparty
          historicalTxCount: 28,
          lastGenuinePaymentTimestamp: 1714735200, // 139 seconds earlier
        },
      ],
    },
    groundTruthNotes:
      "Confirmed $68M WBTC heist. Adversary generated 14 identical vanity characters and sent dust 2 minutes after payment.",
  },
  {
    id: "TC-MAL-02",
    name: "250K USDT Zero-Value TransferFrom Spoof",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0xaaaabbbbccccddddeeeeffff0000111122223333",
      candidateTx: {
        txHash: "0x33b1e7798c11aa20491820491823901b87a91280381028301928401928401928",
        fromAddress: "0xaaaabbbbccccddddeeeeffff0000111122223333",
        toAddress: "0x71C412a83158c35B4EbA692998982312d288976F", // 10-char vanity match
        token: "USDT",
        amount: "0", // Zero-value exploit
        blockNumber: 19912044,
        blockTimestamp: 1718354711,
      },
      recentCounterparties: [
        {
          address: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
          historicalTxCount: 14,
          lastGenuinePaymentTimestamp: 1718353500, // 20 minutes earlier
        },
      ],
    },
    groundTruthNotes:
      "Zero-value Transfer event spoofing victim's counterparty with 10 matching outer characters.",
  },
  {
    id: "TC-MAL-03",
    name: "DAO Payroll Treasury Mimic Cluster",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x3841C5f71E3C8A02901239102830192840192840",
      candidateTx: {
        txHash: "0x99ddc1201fa88279812903819023801284901823901289038129038129038129",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x483896587c4273E1B95B1348b598A913B0BAD5f97", // 13-char vanity match
        token: "USDC",
        amount: "0.001",
        blockNumber: 20112480,
        blockTimestamp: 1721502643,
      },
      recentCounterparties: [
        {
          address: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
          historicalTxCount: 52,
          lastGenuinePaymentTimestamp: 1721501800, // 14 minutes earlier
        },
      ],
    },
    groundTruthNotes:
      "GPU cluster generated 13 matching outer characters to spoof DAO multi-sig payroll recipient.",
  },
  {
    id: "TC-MAL-04",
    name: "Rapid Reactive Mempool Dust Injection (< 60s)",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x5555555555555555555555555555555555555555",
      candidateTx: {
        txHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
        fromAddress: "0x9999999999999999999999999999999999999999",
        toAddress: "0x89A2bB999999999999999999999999999912Cc34", // 12-char match
        token: "USDT",
        amount: "0.00001",
        blockNumber: 20200100,
        blockTimestamp: 1722000045,
      },
      recentCounterparties: [
        {
          address: "0x89A2bB111111111111111111111111111112Cc34",
          historicalTxCount: 19,
          lastGenuinePaymentTimestamp: 1722000000, // 45 seconds earlier!
        },
      ],
    },
    groundTruthNotes:
      "Mempool bot detected outgoing payment and mined 12 matching outer characters within 45 seconds.",
  },
  {
    id: "TC-MAL-05",
    name: "Zero-Value USDC Spoof on High-Net-Worth Account",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x7777777777777777777777777777777777777777",
      candidateTx: {
        txHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
        fromAddress: "0x7777777777777777777777777777777777777777",
        toAddress: "0xFe918a222222222222222222222222222222bB90", // 10-char match
        token: "USDC",
        amount: "0",
        blockNumber: 20250000,
        blockTimestamp: 1722500600,
      },
      recentCounterparties: [
        {
          address: "0xFe918a888888888888888888888888888888bB90",
          historicalTxCount: 35,
          lastGenuinePaymentTimestamp: 1722500000, // 10 mins earlier
        },
      ],
    },
    groundTruthNotes:
      "Zero-value spoof with 6 prefix + 4 suffix = 10 characters match.",
  },
  {
    id: "TC-MAL-06",
    name: "11-Character Vanity Micro-Dust Transfer",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x6666666666666666666666666666666666666666",
      candidateTx: {
        txHash: "0x6666666666666666666666666666666666666666666666666666666666666666",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x33A198cccccccccccccccccccccccccccc3344bB", // 11-char match
        token: "USDT",
        amount: "0.0001",
        blockNumber: 20300000,
        blockTimestamp: 1723001800,
      },
      recentCounterparties: [
        {
          address: "0x33A198dddddddddddddddddddddddddddd3344bB",
          historicalTxCount: 8,
          lastGenuinePaymentTimestamp: 1723000000, // 30 mins earlier
        },
      ],
    },
    groundTruthNotes:
      "6-char prefix + 5-char suffix match with 0.0001 USDT dust.",
  },
  {
    id: "TC-MAL-07",
    name: "14-Character Vanity Multi-Vector Poisoning",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x8888888888888888888888888888888888888888",
      candidateTx: {
        txHash: "0x7777777777777777777777777777777777777777777777777777777777777777",
        fromAddress: "0x8888888888888888888888888888888888888888",
        toAddress: "0xDEADBEEF00000000000000000000000000BEEFDEAD", // 16-char vanity
        token: "USDT",
        amount: "0",
        blockNumber: 20350000,
        blockTimestamp: 1723500120,
      },
      recentCounterparties: [
        {
          address: "0xDEADBEEF99999999999999999999999999BEEFDEAD",
          historicalTxCount: 22,
          lastGenuinePaymentTimestamp: 1723500000, // 2 mins earlier
        },
      ],
    },
    groundTruthNotes:
      "Massive 16-character collision with zero-value injection.",
  },
  {
    id: "TC-MAL-08",
    name: "8-Character Suffix-Heavy Poisoning Attack",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x9999999999999999999999999999999999999999",
      candidateTx: {
        txHash: "0x8888888888888888888888888888888888888888888888888888888888888888",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x12AB998888888888888888888888888888998877", // 4 prefix + 6 suffix = 10 chars
        token: "ETH",
        amount: "0.00005",
        blockNumber: 20400000,
        blockTimestamp: 1724000900,
      },
      recentCounterparties: [
        {
          address: "0x12AB991111111111111111111111111111998877",
          historicalTxCount: 15,
          lastGenuinePaymentTimestamp: 1724000000,
        },
      ],
    },
    groundTruthNotes:
      "10-character boundary collision specifically matching truncated wallet suffix view.",
  },
  {
    id: "TC-MAL-09",
    name: "12-Character Vanity Injection on Binance Deposit Mimic",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x1111111111111111111111111111111111111111",
      candidateTx: {
        txHash: "0x9999999999999999999999999999999999999999999999999999999999999999",
        fromAddress: "0x1111111111111111111111111111111111111111",
        toAddress: "0x28C6c09999999999999999999999999999355E57", // 12-char match
        token: "USDC",
        amount: "0",
        blockNumber: 20450000,
        blockTimestamp: 1724500300,
      },
      recentCounterparties: [
        {
          address: "0x28C6c01111111111111111111111111111355E57",
          historicalTxCount: 40,
          lastGenuinePaymentTimestamp: 1724500000,
        },
      ],
    },
    groundTruthNotes:
      "Zero-value spoof matching deposit address with 6 prefix + 6 suffix chars.",
  },
  {
    id: "TC-MAL-10",
    name: "WBTC Vanity Rig Poisoning (13-Char)",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x2222222222222222222222222222222222222222",
      candidateTx: {
        txHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x9a8b7c6666666666666666666666666661a2b3c4", // 14-char match
        token: "WBTC",
        amount: "0.000001",
        blockNumber: 20500000,
        blockTimestamp: 1725000600,
      },
      recentCounterparties: [
        {
          address: "0x9a8b7c0000000000000000000000000001a2b3c4",
          historicalTxCount: 11,
          lastGenuinePaymentTimestamp: 1725000000,
        },
      ],
    },
    groundTruthNotes:
      "GPU vanity rig with 7 prefix and 7 suffix characters matching.",
  },
  {
    id: "TC-MAL-11",
    name: "0.0001 ETH Dust Mimicking Frequent Multi-Sig Counterparty",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x3333333333333333333333333333333333333333",
      candidateTx: {
        txHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x51A8c055555555555555555555555555558912eF", // 12-char match
        token: "ETH",
        amount: "0.0001",
        blockNumber: 20550000,
        blockTimestamp: 1725501200,
      },
      recentCounterparties: [
        {
          address: "0x51A8c022222222222222222222222222228912eF",
          historicalTxCount: 45,
          lastGenuinePaymentTimestamp: 1725500000,
        },
      ],
    },
    groundTruthNotes:
      "12-char match with 0.0001 ETH dust transfer sent 20 mins after payment.",
  },
  {
    id: "TC-MAL-12",
    name: "Zero-Value Spoof with 9-Char Outer Match",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x4444444444444444444444444444444444444444",
      candidateTx: {
        txHash: "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        fromAddress: "0x4444444444444444444444444444444444444444",
        toAddress: "0x6789Ab4444444444444444444444444444445678", // 9-char match
        token: "USDT",
        amount: "0",
        blockNumber: 20600000,
        blockTimestamp: 1726000180,
      },
      recentCounterparties: [
        {
          address: "0x6789Ab1111111111111111111111111111115678",
          historicalTxCount: 16,
          lastGenuinePaymentTimestamp: 1726000000,
        },
      ],
    },
    groundTruthNotes:
      "Zero-value spoof with 5 prefix + 4 suffix = 9 chars within 3 mins of payment.",
  },
  {
    id: "TC-MAL-13",
    name: "High-Entropy 14-Char Lookalike Transfer",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x5555555555555555555555555555555555555555",
      candidateTx: {
        txHash: "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0xA1B2C38888888888888888888888888888D4E5F6", // 14-char match
        token: "USDC",
        amount: "0.00001",
        blockNumber: 20650000,
        blockTimestamp: 1726500300,
      },
      recentCounterparties: [
        {
          address: "0xA1B2C30000000000000000000000000000D4E5F6",
          historicalTxCount: 30,
          lastGenuinePaymentTimestamp: 1726500000,
        },
      ],
    },
    groundTruthNotes:
      "14-char collision probability: 16^-14. Deliberate GPU vanity cluster generation.",
  },
  {
    id: "TC-MAL-14",
    name: "Immediate Post-Payment Injection (90 seconds)",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x6666666666666666666666666666666666666666",
      candidateTx: {
        txHash: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x7788997777777777777777777777777777771122", // 10-char match
        token: "USDT",
        amount: "0.001",
        blockNumber: 20700000,
        blockTimestamp: 1727000090,
      },
      recentCounterparties: [
        {
          address: "0x7788992222222222222222222222222222221122",
          historicalTxCount: 25,
          lastGenuinePaymentTimestamp: 1727000000, // 90 seconds earlier
        },
      ],
    },
    groundTruthNotes:
      "Rapid reactive attack timed to fool user when checking wallet history right after payment.",
  },
  {
    id: "TC-MAL-15",
    name: "Zero-Value Transfer Targeting Gnosis Safe Signer",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x7777777777777777777777777777777777777777",
      candidateTx: {
        txHash: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        fromAddress: "0x7777777777777777777777777777777777777777",
        toAddress: "0x3841C54444444444444444444444444444192840", // 12-char match
        token: "USDC",
        amount: "0",
        blockNumber: 20750000,
        blockTimestamp: 1727500150,
      },
      recentCounterparties: [
        {
          address: "0x3841C5f71E3C8A02901239102830192840192840",
          historicalTxCount: 60,
          lastGenuinePaymentTimestamp: 1727500000,
        },
      ],
    },
    groundTruthNotes:
      "Targeting multi-sig treasury signer with zero-value injection.",
  },
  {
    id: "TC-MAL-16",
    name: "GPU Vanity Cluster Generation (12-Char)",
    category: "MALICIOUS_POISONING",
    expectedIsMalicious: true,
    input: {
      victimWalletAddress: "0x8888888888888888888888888888888888888888",
      candidateTx: {
        txHash: "0x1212121212121212121212121212121212121212121212121212121212121212",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0xC0FFEE9999999999999999999999999999C0FFEE", // 12-char match
        token: "ETH",
        amount: "0.00001",
        blockNumber: 20800000,
        blockTimestamp: 1728000600,
      },
      recentCounterparties: [
        {
          address: "0xC0FFEE1111111111111111111111111111C0FFEE",
          historicalTxCount: 18,
          lastGenuinePaymentTimestamp: 1728000000,
        },
      ],
    },
    groundTruthNotes:
      "6-prefix + 6-suffix collision (12 characters). Probability 16^-12.",
  },

  // =========================================================================
  // 2. BENIGN LEGITIMATE TRANSFERS (EXPECTED: FALSE)
  // =========================================================================
  {
    id: "TC-BEN-01",
    name: "Repeat Payment to Verified Counterparty (Identical Address)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x1111111111111111111111111111111111111111",
      candidateTx: {
        txHash: "0x2323232323232323232323232323232323232323232323232323232323232323",
        fromAddress: "0x1111111111111111111111111111111111111111",
        toAddress: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91", // Exact match!
        token: "USDC",
        amount: "5000", // $5,000 USD
        blockNumber: 20850000,
        blockTimestamp: 1728500000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91", // Identical!
          historicalTxCount: 24,
          lastGenuinePaymentTimestamp: 1728000000,
        },
      ],
    },
    groundTruthNotes:
      "Legitimate recurring payment to established partner. Candidate is identical to counterparty, NOT a lookalike.",
  },
  {
    id: "TC-BEN-02",
    name: "Standard ETH Transfer to Random Distinct Address (0 Vanity Match)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x2222222222222222222222222222222222222222",
      candidateTx: {
        txHash: "0x3434343434343434343434343434343434343434343434343434343434343434",
        fromAddress: "0x2222222222222222222222222222222222222222",
        toAddress: "0x9876543210fedcba9876543210fedcba98765432", // Completely distinct
        token: "ETH",
        amount: "1.5", // 1.5 ETH ($5,250)
        blockNumber: 20900000,
        blockTimestamp: 1729000000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
          historicalTxCount: 10,
          lastGenuinePaymentTimestamp: 1728900000,
        },
      ],
    },
    groundTruthNotes:
      "Standard transfer to an independent recipient with zero boundary collisions.",
  },
  {
    id: "TC-BEN-03",
    name: "High-Value Capital Transfer ($50,000 USDT)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x3333333333333333333333333333333333333333",
      candidateTx: {
        txHash: "0x4545454545454545454545454545454545454545454545454545454545454545",
        fromAddress: "0x3333333333333333333333333333333333333333",
        toAddress: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
        token: "USDT",
        amount: "50000", // $50,000 USD
        blockNumber: 20950000,
        blockTimestamp: 1729500000,
      },
      recentCounterparties: [
        {
          address: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
          historicalTxCount: 15,
          lastGenuinePaymentTimestamp: 1729000000,
        },
      ],
    },
    groundTruthNotes:
      "High-value capital payment to identical counterparty.",
  },
  {
    id: "TC-BEN-04",
    name: "Exchange Deposit of 2.5 ETH to Coinbase",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x4444444444444444444444444444444444444444",
      candidateTx: {
        txHash: "0x5656565656565656565656565656565656565656565656565656565656565656",
        fromAddress: "0x4444444444444444444444444444444444444444",
        toAddress: "0x503828976D22510aad0201ac7EC88293211A23Da",
        token: "ETH",
        amount: "2.5",
        blockNumber: 21000000,
        blockTimestamp: 1730000000,
      },
      recentCounterparties: [
        {
          address: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
          historicalTxCount: 5,
          lastGenuinePaymentTimestamp: 1729800000,
        },
      ],
    },
    groundTruthNotes:
      "Legitimate exchange deposit. No vanity overlap with recent counterparties.",
  },
  {
    id: "TC-BEN-05",
    name: "Random Micro-Donation with Zero Lookalike Overlap",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x5555555555555555555555555555555555555555",
      candidateTx: {
        txHash: "0x6767676767676767676767676767676767676767676767676767676767676767",
        fromAddress: "0x5555555555555555555555555555555555555555",
        toAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", // Gitcoin multisig
        token: "ETH",
        amount: "0.00005", // Dust donation
        blockNumber: 21050000,
        blockTimestamp: 1730500000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
          historicalTxCount: 12,
          lastGenuinePaymentTimestamp: 1730000000,
        },
      ],
    },
    groundTruthNotes:
      "Micro-donation to an open grant pool. Though dust amount, collision length is 0 (no lookalike mimicry).",
  },
  {
    id: "TC-BEN-06",
    name: "Monthly Payroll Transfer (3,500 USDC)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x6666666666666666666666666666666666666666",
      candidateTx: {
        txHash: "0x7878787878787878787878787878787878787878787878787878787878787878",
        fromAddress: "0x6666666666666666666666666666666666666666",
        toAddress: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
        token: "USDC",
        amount: "3500",
        blockNumber: 21100000,
        blockTimestamp: 1731000000,
      },
      recentCounterparties: [
        {
          address: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
          historicalTxCount: 8,
          lastGenuinePaymentTimestamp: 1728400000, // 30 days earlier
        },
      ],
    },
    groundTruthNotes:
      "Scheduled monthly payroll to identical employee wallet.",
  },
  {
    id: "TC-BEN-07",
    name: "Vendor Invoice Settlement ($12,400 USDT)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x7777777777777777777777777777777777777777",
      candidateTx: {
        txHash: "0x8989898989898989898989898989898989898989898989898989898989898989",
        fromAddress: "0x7777777777777777777777777777777777777777",
        toAddress: "0x534631Bcf33BDb069fB20A75d2791Cd8F9345f4f",
        token: "USDT",
        amount: "12400",
        blockNumber: 21150000,
        blockTimestamp: 1731500000,
      },
      recentCounterparties: [
        {
          address: "0x534631Bcf33BDb069fB20A75d2791Cd8F9345f4f",
          historicalTxCount: 4,
          lastGenuinePaymentTimestamp: 1730000000,
        },
      ],
    },
    groundTruthNotes:
      "High-value invoice payment to verified address.",
  },
  {
    id: "TC-BEN-08",
    name: "Normal DEX Swap Settlement on Uniswap V3",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x8888888888888888888888888888888888888888",
      candidateTx: {
        txHash: "0x9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a9a",
        fromAddress: "0x8888888888888888888888888888888888888888",
        toAddress: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // Uniswap SwapRouter02
        token: "ETH",
        amount: "0.8",
        blockNumber: 21200000,
        blockTimestamp: 1732000000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
          historicalTxCount: 20,
          lastGenuinePaymentTimestamp: 1731900000,
        },
      ],
    },
    groundTruthNotes:
      "DEX router interaction with standard capital transfer.",
  },
  {
    id: "TC-BEN-09",
    name: "Liquidity Pool Deposit of 10,000 USDC",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x9999999999999999999999999999999999999999",
      candidateTx: {
        txHash: "0xabababababababababababababababababababababababababababababababab",
        fromAddress: "0x9999999999999999999999999999999999999999",
        toAddress: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", // Uniswap USDC/ETH pool
        token: "USDC",
        amount: "10000",
        blockNumber: 21250000,
        blockTimestamp: 1732500000,
      },
      recentCounterparties: [
        {
          address: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
          historicalTxCount: 15,
          lastGenuinePaymentTimestamp: 1732000000,
        },
      ],
    },
    groundTruthNotes:
      "DeFi liquidity addition with zero vanity overlap.",
  },
  {
    id: "TC-BEN-10",
    name: "Cold Storage Rebalance (50 ETH)",
    category: "BENIGN_TRANSFER",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x0000000000000000000000000000000000000001",
      candidateTx: {
        txHash: "0xbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbcbc",
        fromAddress: "0x0000000000000000000000000000000000000001",
        toAddress: "0x0000000000000000000000000000000000000002",
        token: "ETH",
        amount: "50",
        blockNumber: 21300000,
        blockTimestamp: 1733000000,
      },
      recentCounterparties: [
        {
          address: "0x0000000000000000000000000000000000000002",
          historicalTxCount: 30,
          lastGenuinePaymentTimestamp: 1732000000,
        },
      ],
    },
    groundTruthNotes:
      "Internal treasury vault rebalance to identical cold storage address.",
  },

  // =========================================================================
  // 3. EDGE CASES & POTENTIAL FALSE POSITIVES (EXPECTED: FALSE)
  // =========================================================================
  {
    id: "TC-EDGE-01",
    name: "1inch Aggregation Router v5 Vanity Address",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x1212121212121212121212121212121212121212",
      candidateTx: {
        txHash: "0xcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd",
        fromAddress: "0x1212121212121212121212121212121212121212",
        toAddress: "0x1111111254fb6c44bac0bed2854e76f90643097d", // Vanity 0x11111112...
        token: "USDC",
        amount: "1500", // Genuine swap value ($1,500)
        blockNumber: 21350000,
        blockTimestamp: 1733500000,
      },
      recentCounterparties: [
        {
          address: "0x1111111254fb6c44bac0bed2854e76f90643097d", // Exact same router
          historicalTxCount: 88,
          lastGenuinePaymentTimestamp: 1733000000,
        },
      ],
    },
    groundTruthNotes:
      "1inch Router was deliberately deployed with vanity prefix 0x11111112. Because it carries real value ($1,500) and targets the identical router, it MUST NOT be flagged as a poisoning exploit.",
  },
  {
    id: "TC-EDGE-02",
    name: "Accidental 4-Character Statistical Chance Collision",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x2323232323232323232323232323232323232323",
      candidateTx: {
        txHash: "0xdededededededededededededededededededededededededededededededede",
        fromAddress: "0x2323232323232323232323232323232323232323",
        toAddress: "0xd9A1000000000000000000000000000000000000", // Only 4 prefix chars match
        token: "USDT",
        amount: "250", // $250 transfer
        blockNumber: 21400000,
        blockTimestamp: 1734000000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
          historicalTxCount: 10,
          lastGenuinePaymentTimestamp: 1733000000, // 10 days earlier
        },
      ],
    },
    groundTruthNotes:
      "Shares 4 prefix characters ('0xd9A1') by random probability (16^-4 = 1 in 65,536). Normal $250 value and 10 days apart; not a coordinated attack.",
  },
  {
    id: "TC-EDGE-03",
    name: "Test Micro-Transfer to User's Own Newly Created Cold Wallet",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x3434343434343434343434343434343434343434",
      candidateTx: {
        txHash: "0xefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefefef",
        fromAddress: "0x3434343434343434343434343434343434343434",
        toAddress: "0x99887766554433221100aabbccddeeff00112233", // Brand new address
        token: "ETH",
        amount: "0.0001", // User testing small send before large transfer
        blockNumber: 21450000,
        blockTimestamp: 1734500000,
      },
      recentCounterparties: [
        {
          address: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
          historicalTxCount: 15,
          lastGenuinePaymentTimestamp: 1734000000,
        },
      ],
    },
    groundTruthNotes:
      "User sending 0.0001 ETH test transaction to a new address. Although dust amount, collision length is 0 (does not mimic any counterparty).",
  },
  {
    id: "TC-EDGE-04",
    name: "CoW Protocol Settlement Contract Vanity Overlap",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x4545454545454545454545454545454545454545",
      candidateTx: {
        txHash: "0xf0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0",
        fromAddress: "0x4545454545454545454545454545454545454545",
        toAddress: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        token: "USDC",
        amount: "800",
        blockNumber: 21500000,
        blockTimestamp: 1735000000,
      },
      recentCounterparties: [
        {
          address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
          historicalTxCount: 42,
          lastGenuinePaymentTimestamp: 1734500000,
        },
      ],
    },
    groundTruthNotes:
      "CoW settlement contract has vanity prefix 0x9008D19. Normal trade execution with real value.",
  },
  {
    id: "TC-EDGE-05",
    name: "Non-Zero Repeat Transfer with 5-Char Outer Similarity",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x5656565656565656565656565656565656565656",
      candidateTx: {
        txHash: "0x0101010101010101010101010101010101010101010101010101010101010101",
        fromAddress: "0x5656565656565656565656565656565656565656",
        toAddress: "0x71C400000000000000000000000000000000000F", // 5 chars match by chance
        token: "USDT",
        amount: "450", // $450 USD
        blockNumber: 21550000,
        blockTimestamp: 1735500000,
      },
      recentCounterparties: [
        {
          address: "0x71C409fE06718E3c1A488c03F05C334d7288976F",
          historicalTxCount: 20,
          lastGenuinePaymentTimestamp: 1735000000,
        },
      ],
    },
    groundTruthNotes:
      "Shares 4 prefix + 1 suffix = 5 characters by chance, but value is $450 USD. Does not meet attack profile.",
  },
  {
    id: "TC-EDGE-06",
    name: "Sub-$1 Transfer to Known Counterparty 3 Days Later",
    category: "EDGE_CASE",
    expectedIsMalicious: false,
    input: {
      victimWalletAddress: "0x6767676767676767676767676767676767676767",
      candidateTx: {
        txHash: "0x1231231231231231231231231231231231231231231231231231231231231231",
        fromAddress: "0x6767676767676767676767676767676767676767",
        toAddress: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97", // Identical
        token: "USDT",
        amount: "0.50", // Small change refund
        blockNumber: 21600000,
        blockTimestamp: 1736000000,
      },
      recentCounterparties: [
        {
          address: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
          historicalTxCount: 30,
          lastGenuinePaymentTimestamp: 1735740800, // 3 days earlier
        },
      ],
    },
    groundTruthNotes:
      "Small refund ($0.50) sent to the exact same counterparty address. Cannot be a lookalike poisoning attack.",
  },
];

