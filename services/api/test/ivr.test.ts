import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { ivrNotificationService } from "../src/services/ivrNotificationService";
import { dbConnection } from "../src/db/connection";

describe("Phase 10: Optional IVR / Emergency Voice Alert Suite", () => {
  before(async () => {
    await dbConnection.connect();
  });

  const testUser = "user_test_operator_001";
  const testPhone = "+15550192834";
  const genuinePayee = "0xd9a1c3788d81257612e2581a6ea0ada244853a91";
  const lookalikePayee = "0xd9a1c3c6f3590059b2e3516a6ea0ada244853a91";

  // 1. Phone Verification Workflow
  describe("Requirement 1: Phone Verification Flow", () => {
    it("should issue a 6-digit verification code with 10-minute expiry", () => {
      const res = ivrNotificationService.requestPhoneVerification(testUser, testPhone);
      assert.equal(res.success, true);
      assert.equal(res.isSimulation, true);
      assert.ok(res.simulationMessage);
      assert.equal(res.expiresInSeconds, 600);
    });

    it("should reject an invalid verification code", () => {
      const res = ivrNotificationService.confirmPhoneVerification(testUser, testPhone, "000000");
      assert.equal(res.success, false);
      assert.match(res.error || "", /Invalid verification code/);
    });

    it("should confirm valid verification code and mark phone as verified", () => {
      // Get internal record to simulate user receiving SMS
      const statusBefore = ivrNotificationService.getVerificationStatus(testUser);
      assert.ok(statusBefore);
      assert.equal(statusBefore.isVerified, false);

      const confirmRes = ivrNotificationService.confirmPhoneVerification(
        testUser,
        testPhone,
        statusBefore.verificationCode
      );
      assert.equal(confirmRes.success, true);
      assert.equal(confirmRes.isVerified, true);

      const statusAfter = ivrNotificationService.getVerificationStatus(testUser);
      assert.equal(statusAfter?.isVerified, true);
    });
  });

  // 2. Alert Dispatch & Event Distinction
  describe("Requirement 2: Alert Dispatch & Distinction (Attempted vs Blocked)", () => {
    it("should dispatch a CONFIRMED_BLOCKED_ON_CHAIN alert with explicit on-chain phrasing", async () => {
      const call = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: testUser,
        eventType: "CONFIRMED_BLOCKED_ON_CHAIN",
        txHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
        mimickedAddress: genuinePayee,
        suspectedAddress: lookalikePayee,
        token: "WBTC",
        amount: "1,162",
      });

      assert.equal(call.status, "COMPLETED");
      assert.equal(call.isSimulation, true);
      assert.equal(call.eventType, "CONFIRMED_BLOCKED_ON_CHAIN");
      assert.match(call.callScriptEn, /CONFIRMED BLOCKED ON-CHAIN by your Safe Guard/);
      assert.match(call.callScriptEn, /No funds left your Safe/);
      assert.match(call.callScriptHi, /ऑन-चेन ब्लॉक कर दिया गया है/);
    });

    it("should clearly differentiate ATTEMPTED_TX from confirmed blocked transactions", async () => {
      const user2 = "user_test_operator_002";
      const call = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: user2,
        eventType: "ATTEMPTED_TX",
        txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
        mimickedAddress: genuinePayee,
        suspectedAddress: lookalikePayee,
        token: "USDC",
        amount: "50,000",
      });

      assert.equal(call.eventType, "ATTEMPTED_TX");
      assert.match(call.callScriptEn, /SUSPICIOUS ATTEMPT DETECTED in transaction preparation/);
      assert.match(call.callScriptHi, /तैयारी के दौरान संदिग्ध प्रयास/);
    });
  });

  // 3. Rate Limiting & Cooldown Protection
  describe("Requirement 3: Rate Limiting & Cooldown", () => {
    it("should throttle rapid repeated calls for the same user within cooldown window", async () => {
      // testUser just had a call in the previous test; immediate second call should be rate limited
      const call = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: testUser,
        eventType: "CONFIRMED_BLOCKED_ON_CHAIN",
        txHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
        mimickedAddress: genuinePayee,
        suspectedAddress: lookalikePayee,
      });

      assert.equal(call.status, "RATE_LIMITED");
      assert.match(call.simulationNote, /Rate limited to prevent alert fatigue/);
    });
  });

  // 4. Duplicate-Call Prevention (Deduplication)
  describe("Requirement 4: Duplicate-Call Prevention", () => {
    it("should suppress duplicate calls for the exact same transaction hash", async () => {
      const user3 = "user_test_operator_003";
      const txHash = "0x4444444444444444444444444444444444444444444444444444444444444444";

      // First call succeeds
      const call1 = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: user3,
        eventType: "CONFIRMED_BLOCKED_ON_CHAIN",
        txHash,
        mimickedAddress: genuinePayee,
        suspectedAddress: lookalikePayee,
      });
      assert.equal(call1.status, "COMPLETED");

      // Second call with same txHash is deduplicated
      const call2 = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: user3,
        eventType: "CONFIRMED_BLOCKED_ON_CHAIN",
        txHash,
        mimickedAddress: genuinePayee,
        suspectedAddress: lookalikePayee,
      });
      assert.equal(call2.status, "DEDUPLICATED");
      assert.match(call2.simulationNote, /Suppressed by duplicate-call prevention/);
    });
  });

  // 5. Simulation Transparency Guarantee
  describe("Requirement 5: Simulation Transparency", () => {
    it("should explicitly mark all records with isSimulation: true and provider note", () => {
      const logs = ivrNotificationService.getCallLogs(10);
      assert.ok(logs.length > 0);
      for (const log of logs) {
        assert.equal(log.isSimulation, true);
        assert.ok(log.simulationNote);
      }
    });
  });
});

