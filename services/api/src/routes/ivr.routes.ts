import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { ivrNotificationService } from "../services/ivrNotificationService";

const router = Router();

const requestVerificationSchema = z.object({
  userReference: z.string().min(1),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Phone number must follow international format (e.g. +15550192834 or +919876543210)"),
});

const confirmVerificationSchema = z.object({
  userReference: z.string().min(1),
  phoneNumber: z.string().min(6),
  code: z.string().length(6, "Verification code must be exactly 6 digits"),
});

const dispatchAlertSchema = z.object({
  userReference: z.string().min(1),
  eventType: z.enum(["ATTEMPTED_TX", "CONFIRMED_BLOCKED_ON_CHAIN"]),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid 64-char transaction hash"),
  mimickedAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 40-char Ethereum address"),
  suspectedAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 40-char Ethereum address"),
  token: z.string().optional(),
  amount: z.string().optional(),
  safeAddress: z.string().optional(),
});

/**
 * POST /api/ivr/verify/request
 * Send simulated SMS verification code
 */
router.post(
  "/verify/request",
  validate(requestVerificationSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userReference, phoneNumber } = req.body;
      const result = ivrNotificationService.requestPhoneVerification(userReference, phoneNumber);

      res.status(200).json({
        success: true,
        data: result,
        message: `Simulated verification code dispatched to ${phoneNumber}.`,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/ivr/verify/confirm
 * Confirm 6-digit phone verification code
 */
router.post(
  "/verify/confirm",
  validate(confirmVerificationSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userReference, phoneNumber, code } = req.body;
      const result = ivrNotificationService.confirmPhoneVerification(userReference, phoneNumber, code);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            code: "VERIFICATION_FAILED",
            message: result.error,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
        message: "Phone number successfully verified for emergency IVR voice alerts.",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/ivr/dispatch
 * Asynchronously queue an emergency voice call
 * GUARANTEE: Operates non-blockingly; never delays transaction blocking!
 */
router.post(
  "/dispatch",
  validate(dispatchAlertSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.body;

      // Dispatched asynchronously without blocking caller
      const callRecord = await ivrNotificationService.dispatchEmergencyAlert({
        userReference: payload.userReference,
        eventType: payload.eventType,
        txHash: payload.txHash,
        mimickedAddress: payload.mimickedAddress,
        suspectedAddress: payload.suspectedAddress,
        token: payload.token || "ETH",
        amount: payload.amount || "1.0",
        safeAddress: payload.safeAddress,
      });

      res.status(202).json({
        success: true,
        queued: true,
        callId: callRecord.callId,
        status: callRecord.status,
        data: callRecord,
        isSimulation: true,
        simulationNotice: "This call was simulated asynchronously. Telephony webhook dispatched without blocking transaction execution.",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/ivr/logs
 * Retrieve emergency IVR voice call history and audit records
 */
router.get(
  "/logs",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = ivrNotificationService.getCallLogs(50);
      res.status(200).json({
        success: true,
        count: logs.length,
        isSimulation: true,
        data: logs,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/ivr/status/:user
 * Retrieve phone verification status for a specific user
 */
router.get(
  "/status/:user",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req.params;
      const status = ivrNotificationService.getVerificationStatus(user);

      res.status(200).json({
        success: true,
        userReference: user,
        data: status || {
          userReference: user,
          isVerified: false,
          phoneNumber: null,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

