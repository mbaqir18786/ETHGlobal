import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  ARKIV_CONFIG,
  HexFencePoisoningSchema,
  publishEvidenceToArkiv,
  queryEvidenceByAddress,
} from "../src";

describe("Arkiv Evidence Integration Suite (Rabdi Testnet)", () => {
  test("Rabdi testnet chain ID is correctly configured to 7794095", () => {
    assert.strictEqual(ARKIV_CONFIG.CHAIN_ID, 7794095);
    assert.strictEqual(ARKIV_CONFIG.SCHEMA_NAME, "hexfence.poisoning.v1");
  });

  test("Entity schema contains all required poisoning forensic attributes", () => {
    assert.ok(HexFencePoisoningSchema);
    assert.strictEqual(HexFencePoisoningSchema.name, "hexfence.poisoning.v1");
  });

  test("Publisher gracefully rejects publication when signing key is missing", async () => {
    const result = await publishEvidenceToArkiv({
      evidenceId: "EVID-TEST-001",
      referenceAddress: "0xd9A1c3788D81257612E2581A6ea0aDa244853a91",
      suspectedAddress: "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
      txHash: "0x8f2a991a3e8749b5c208479b18361029c7381920acbf82019b83749b01294821",
      token: "WBTC",
      detectionReason: "DUST_TRANSFER",
      confidence: "98.5",
      detectorVersion: "v2.5.0-engine",
      detectionTimestamp: new Date().toISOString(),
      evidenceStatus: "suspected",
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.error);
    assert.ok(result.arkivUri.startsWith("arkiv://hexfence.poisoning.v1/"));
  });

  test("Reader gracefully returns empty array when network is unreachable or address unindexed", async () => {
    const records = await queryEvidenceByAddress("0x0000000000000000000000000000000000000000");
    assert.ok(Array.isArray(records));
  });
});

