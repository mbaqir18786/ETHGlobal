import crypto from "crypto";
import { dbConnection } from "../db/connection";

export type SecurityEventType = "ATTEMPTED_TX" | "CONFIRMED_BLOCKED_ON_CHAIN";

export interface PhoneVerificationRecord {
  userReference: string;
  phoneNumber: string;
  verificationCode: string;
  expiresAt: number;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface IVRCallRecord {
  callId: string;
  userReference: string;
  destinationPhone: string;
  eventType: SecurityEventType;
  txHash: string;
  mimickedAddress: string;
  suspectedAddress: string;
  token: string;
  amount: string;
  callScriptEn: string;
  callScriptHi: string;
  status: "QUEUED" | "COMPLETED" | "RATE_LIMITED" | "DEDUPLICATED";
  isSimulation: true;
  simulationNote: string;
  dispatchedAt: string;
  durationSeconds: number;
}

export interface SecurityAlertPayload {
  userReference: string;
  eventType: SecurityEventType;
  txHash: string;
  mimickedAddress: string;
  suspectedAddress: string;
  token?: string;
  amount?: string;
  safeAddress?: string;
}

class IVRNotificationService {
  // In-memory verification store (or backed by persistent store)
  private verifications: Map<string, PhoneVerificationRecord> = new Map();
  // Rate limiting map: userReference -> timestamp of last call
  private lastCallTimestamps: Map<string, number> = new Map();
  // Call history audit logs
  private callLogs: IVRCallRecord[] = [];
  // Deduplication cache: hash -> timestamp
  private dispatchedEventHashes: Set<string> = new Set();

  // Configuration
  private readonly RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute cooldown per user
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

  constructor() {
    // Pre-seed a verified demo number for immediate developer testing
    this.verifications.set("operator_0x9812_demo", {
      userReference: "operator_0x9812_demo",
      phoneNumber: "+1-555-019-2834",
      verificationCode: "779409",
      expiresAt: Date.now() + 86400000,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });
  }

  /**
   * Request phone verification code (OTP simulation)
   */
  public requestPhoneVerification(userReference: string, phoneNumber: string) {
    // Generate clean 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.OTP_EXPIRY_MS;

    const record: PhoneVerificationRecord = {
      userReference,
      phoneNumber,
      verificationCode,
      expiresAt,
      isVerified: false,
    };

    this.verifications.set(userReference, record);

    console.log(
      `📱 [SIMULATION: TELEPHONY SMS] Sent verification OTP '${verificationCode}' to ${phoneNumber} for user ${userReference}. Valid for 10 minutes.`
    );

    return {
      success: true,
      userReference,
      phoneNumber,
      isSimulation: true,
      simulationMessage: `Verification code generated: ${verificationCode} (In production, delivered via SMS provider).`,
      expiresInSeconds: 600,
    };
  }

  /**
   * Confirm phone verification code
   */
  public confirmPhoneVerification(userReference: string, phoneNumber: string, code: string) {
    const record = this.verifications.get(userReference);

    if (!record || record.phoneNumber !== phoneNumber) {
      return {
        success: false,
        error: "No pending verification found for this phone number and user.",
      };
    }

    if (Date.now() > record.expiresAt) {
      return {
        success: false,
        error: "Verification code has expired. Please request a new code.",
      };
    }

    if (record.verificationCode !== code.trim()) {
      return {
        success: false,
        error: "Invalid verification code entered.",
      };
    }

    record.isVerified = true;
    record.verifiedAt = new Date().toISOString();
    this.verifications.set(userReference, record);

    console.log(`✅ [Phone Verification] Phone ${phoneNumber} successfully verified for user ${userReference}.`);

    return {
      success: true,
      userReference,
      phoneNumber,
      isVerified: true,
      verifiedAt: record.verifiedAt,
    };
  }

  /**
   * Retrieve verification status for a user
   */
  public getVerificationStatus(userReference: string): PhoneVerificationRecord | null {
    return this.verifications.get(userReference) || null;
  }

  /**
   * Asynchronously dispatches an emergency voice notification
   * CRITICAL GUARANTEE: Never waits for IVR call before blocking transaction!
   */
  public async dispatchEmergencyAlert(payload: SecurityAlertPayload): Promise<IVRCallRecord> {
    const callId = `CALL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const now = Date.now();
    const store = dbConnection.getStore();

    // 1. Check if user has verified phone
    const verification = this.verifications.get(payload.userReference);
    const destinationPhone = verification?.isVerified ? verification.phoneNumber : "+1-555-019-2834 (Demo Fallback)";

    // 2. Duplicate-call prevention (Deduplication)
    const dedupRaw = `${payload.userReference}:${payload.txHash}:${payload.eventType}`;
    const dedupKey = crypto.createHash("sha256").update(dedupRaw).digest("hex");

    if (this.dispatchedEventHashes.has(dedupKey)) {
      console.log(`ℹ️ [IVR Service] Duplicate call suppressed for txHash: ${payload.txHash}.`);
      const record: IVRCallRecord = {
        callId,
        userReference: payload.userReference,
        destinationPhone,
        eventType: payload.eventType,
        txHash: payload.txHash,
        mimickedAddress: payload.mimickedAddress,
        suspectedAddress: payload.suspectedAddress,
        token: payload.token || "ETH",
        amount: payload.amount || "1.0",
        callScriptEn: "Suppressed duplicate call.",
        callScriptHi: "दोहराया गया कॉल दबा दिया गया।",
        status: "DEDUPLICATED",
        isSimulation: true,
        simulationNote: "Suppressed by duplicate-call prevention engine within cooldown window.",
        dispatchedAt: new Date().toISOString(),
        durationSeconds: 0,
      };
      this.callLogs.unshift(record);
      return record;
    }

    // 3. Rate limiting check
    const lastCall = this.lastCallTimestamps.get(payload.userReference) || 0;
    if (now - lastCall < this.RATE_LIMIT_WINDOW_MS) {
      console.warn(`⚠️ [IVR Service] Rate limit active for user ${payload.userReference}. Call queued but suppressed.`);
      const record: IVRCallRecord = {
        callId,
        userReference: payload.userReference,
        destinationPhone,
        eventType: payload.eventType,
        txHash: payload.txHash,
        mimickedAddress: payload.mimickedAddress,
        suspectedAddress: payload.suspectedAddress,
        token: payload.token || "ETH",
        amount: payload.amount || "1.0",
        callScriptEn: "Rate limit active. Voice notification throttled.",
        callScriptHi: "कॉल दर सीमा सक्रिय है।",
        status: "RATE_LIMITED",
        isSimulation: true,
        simulationNote: "Rate limited to prevent alert fatigue (max 1 call per 60 seconds).",
        dispatchedAt: new Date().toISOString(),
        durationSeconds: 0,
      };
      this.callLogs.unshift(record);
      return record;
    }

    // Update rate limit and deduplication state
    this.lastCallTimestamps.set(payload.userReference, now);
    this.dispatchedEventHashes.add(dedupKey);

    // 4. Generate voice scripts with clear distinction between ATTEMPTED vs CONFIRMED BLOCKED
    const isConfirmedBlocked = payload.eventType === "CONFIRMED_BLOCKED_ON_CHAIN";
    const statusTextEn = isConfirmedBlocked
      ? "CONFIRMED BLOCKED ON-CHAIN by your Safe Guard smart contract"
      : "SUSPICIOUS ATTEMPT DETECTED in transaction preparation";
    const statusTextHi = isConfirmedBlocked
      ? "आपके सेफ गार्ड स्मार्ट कॉन्ट्रैक्ट द्वारा ऑन-चेन ब्लॉक कर दिया गया है"
      : "लेनदेन तैयारी के दौरान संदिग्ध प्रयास का पता चला है";

    const callScriptEn = `HexFence Security Alert. A suspicious lookalike transaction was ${statusTextEn}. The recipient address ${payload.suspectedAddress.slice(0, 6)}...${payload.suspectedAddress.slice(-4)} mimicked your approved payee ${payload.mimickedAddress.slice(0, 6)}...${payload.mimickedAddress.slice(-4)}. Amount: ${payload.amount || "1.0"} ${payload.token || "ETH"}. No funds left your Safe. Please inspect your address book.`;

    const callScriptHi = `हेक्सफेंस सुरक्षा चेतावनी। एक संदिग्ध वैनिटी लेनदेन को ${statusTextHi}। प्राप्तकर्ता पते ने आपके स्वीकृत पते की नकल की थी। आपकी निधि पूरी तरह सुरक्षित है।`;

    const record: IVRCallRecord = {
      callId,
      userReference: payload.userReference,
      destinationPhone,
      eventType: payload.eventType,
      txHash: payload.txHash,
      mimickedAddress: payload.mimickedAddress,
      suspectedAddress: payload.suspectedAddress,
      token: payload.token || "ETH",
      amount: payload.amount || "1.0",
      callScriptEn,
      callScriptHi,
      status: "COMPLETED",
      isSimulation: true,
      simulationNote: "SIMULATION ONLY: Simulated automated Twilio IVR voice call. Real audio dispatched via speech synthesizer.",
      dispatchedAt: new Date().toISOString(),
      durationSeconds: 24,
    };

    this.callLogs.unshift(record);

    // Create platform audit log entry
    await store.logAuditEvent({
      action: isConfirmedBlocked ? "SECURITY_ALERT_DISPATCHED" : "TRANSACTION_FLAGGED",
      actorReference: payload.userReference,
      relevantMetadata: {
        callId,
        eventType: payload.eventType,
        destinationPhone,
        isSimulation: true,
        txHash: payload.txHash,
      },
      status: "SUCCESS",
    });

    console.log(
      `📞 [SIMULATION: IVR VOICE CALL] Dispatched alert to ${destinationPhone} [${payload.eventType}]: "${callScriptEn}"`
    );

    return record;
  }

  /**
   * Retrieve call logs
   */
  public getCallLogs(limit: number = 20): IVRCallRecord[] {
    return this.callLogs.slice(0, limit);
  }
}

export const ivrNotificationService = new IVRNotificationService();

