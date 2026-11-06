import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encodeFunctionData } from "viem";
import { decodeSafeTransaction } from "../src/engine/decoder";
import {
  evaluateTransaction,
  calculateVanityCollision,
  SEED_APPROVED_PAYEES,
} from "../src/engine/comparator";
import { SEED_ARKIV_ENTITIES } from "../src/engine/snapshot";
import { TRANSLATIONS } from "../src/i18n/translations";
import { ArkivSnapshot } from "../src/types";

describe("Phase 8: HexFence Chrome Extension Suite", () => {
  const mockSnapshot: ArkivSnapshot = {
    version: "test-snapshot-1",
    downloadedAt: new Date().toISOString(),
    totalEntities: SEED_ARKIV_ENTITIES.length,
    entities: SEED_ARKIV_ENTITIES,
  };

  const genuinePayee = "0xd9a1c3788d81257612e2581a6ea0ada244853a91";
  const lookalikePayee = "0xd9a1c3c6f3590059b2e3516a6ea0ada244853a91";
  const benignUnknownPayee = "0x1111111254fb6c44bac0bed2854e76f90643097d";

  // 1. Transaction Decoder Tests
  describe("Decoder: Supported and Unsupported Transaction Formats", () => {
    it("should correctly decode native ETH transfers", () => {
      const decoded = decodeSafeTransaction({
        to: genuinePayee,
        value: "1000000000000000000", // 1 ETH
        data: "0x",
      });

      assert.equal(decoded.isSupported, true);
      assert.equal(decoded.transferType, "NATIVE_ETH");
      assert.equal(decoded.recipient?.toLowerCase(), genuinePayee.toLowerCase());
      assert.match(decoded.amount || "", /1.0000 ETH/);
    });

    it("should correctly decode ERC-20 transfer calls", () => {
      // 0xa9059cbb transfer(address,uint256)
      const data = encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "transfer",
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        args: [lookalikePayee as `0x${string}`, 500000000n],
      });

      const decoded = decodeSafeTransaction({
        to: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
        value: "0",
        data,
      });

      assert.equal(decoded.isSupported, true);
      assert.equal(decoded.transferType, "ERC20_TRANSFER");
      assert.equal(decoded.recipient?.toLowerCase(), lookalikePayee.toLowerCase());
      assert.equal(decoded.tokenSymbol, "USDT");
    });

    it("should correctly flag MultiSend batch calls as UNSUPPORTED", () => {
      const multiSendData = "0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020";
      const decoded = decodeSafeTransaction({
        to: "0x388ED6453673799797C749da45D7574FCD68b30B",
        value: "0",
        data: multiSendData,
      });

      assert.equal(decoded.isSupported, false);
      assert.equal(decoded.transferType, "UNSUPPORTED");
      assert.match(decoded.errorReason || "", /MultiSend/);
    });

    it("should safely mark generic unknown smart contract executions as UNSUPPORTED", () => {
      const genericCall = "0x123456780000000000000000000000000000000000000000000000000000000000000001";
      const decoded = decodeSafeTransaction({
        to: "0x000000000000000000000000000000000000dead",
        value: "0",
        data: genericCall,
      });

      assert.equal(decoded.isSupported, false);
      assert.equal(decoded.transferType, "UNSUPPORTED");
    });
  });

  // 2. Local Comparator & Warning States
  describe("Comparator: Local Evaluation & Warning States", () => {
    it("should evaluate an approved Safe payee as APPROVED_PAYEE", async () => {
      const decoded = decodeSafeTransaction({
        to: genuinePayee,
        value: "1000000000000000000",
        data: "0x",
      });

      const result = await evaluateTransaction(decoded, mockSnapshot, SEED_APPROVED_PAYEES);
      assert.equal(result.state, "APPROVED_PAYEE");
      assert.equal(result.isApproved, true);
      assert.equal(result.genuinePayee?.toLowerCase(), genuinePayee.toLowerCase());
    });

    it("should detect vanity lookalike collision and return SUSPICIOUS_LOOKALIKE", async () => {
      const decoded = decodeSafeTransaction({
        to: lookalikePayee,
        value: "1000000000000000000",
        data: "0x",
      });

      const result = await evaluateTransaction(decoded, mockSnapshot, SEED_APPROVED_PAYEES);
      assert.equal(result.state, "SUSPICIOUS_LOOKALIKE");
      assert.equal(result.isApproved, false);
      assert.equal(result.genuinePayee?.toLowerCase(), genuinePayee.toLowerCase());
      assert.ok(result.matchingPrefix);
      assert.ok(result.matchingSuffix);
      assert.match(result.collisionEntropy || "", /16\^-\(/);
    });

    it("should return NO_MATCHING_EVIDENCE for non-matching address with caution disclaimer", async () => {
      const decoded = decodeSafeTransaction({
        to: benignUnknownPayee,
        value: "500000000000000000",
        data: "0x",
      });

      const result = await evaluateTransaction(decoded, mockSnapshot, SEED_APPROVED_PAYEES);
      assert.equal(result.state, "NO_MATCHING_EVIDENCE");
      assert.equal(result.isApproved, false);
      assert.match(result.disclaimer, /Absence of matching evidence is NOT proof of safety/);
    });

    it("should return CANNOT_VERIFY for unsupported transactions and NEVER award false green", async () => {
      const decoded = decodeSafeTransaction({
        to: "0x388ED6453673799797C749da45D7574FCD68b30B",
        value: "0",
        data: "0x8d80ff0a000000",
      });

      const result = await evaluateTransaction(decoded, mockSnapshot, SEED_APPROVED_PAYEES);
      assert.equal(result.state, "CANNOT_VERIFY");
      assert.equal(result.isApproved, false);
      assert.notEqual(result.state, "APPROVED_PAYEE");
      assert.match(result.disclaimer, /Unknown or unsupported transactions must never receive a false green/);
    });
  });

  // 3. Vanity Collision Math
  describe("Algorithm: Vanity Collision Math", () => {
    it("should detect >= 4-char prefix and >= 4-char suffix collision", () => {
      const collision = calculateVanityCollision(genuinePayee, lookalikePayee);
      assert.equal(collision.isCollision, true);
      assert.equal(collision.prefix, "0xd9a1c3");
      assert.ok(collision.suffix.length >= 4);
      assert.match(collision.entropyNotation, /16\^-\(\d+\)/);
    });

    it("should reject non-colliding random addresses", () => {
      const collision = calculateVanityCollision(genuinePayee, benignUnknownPayee);
      assert.equal(collision.isCollision, false);
    });
  });

  // 4. i18n English and Hindi Translations
  describe("i18n: Language Dictionaries", () => {
    it("should support complete English and Hindi translations for all warning states", () => {
      const states = ["SUSPICIOUS_LOOKALIKE", "APPROVED_PAYEE", "NO_MATCHING_EVIDENCE", "CANNOT_VERIFY"] as const;

      for (const lang of ["en", "hi"] as const) {
        const dict = TRANSLATIONS[lang];
        assert.ok(dict.appName);
        assert.ok(dict.appSubtitle);
        assert.ok(dict.privacyDisclaimer);

        for (const state of states) {
          assert.ok(dict.statusBadge[state], `Missing ${lang} badge for ${state}`);
          assert.ok(dict.statusDescription[state], `Missing ${lang} description for ${state}`);
        }
      }
    });
  });
});
