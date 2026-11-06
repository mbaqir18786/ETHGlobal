import { Router, Request, Response, NextFunction } from "express";
import { dbConnection } from "../db/connection";
import { validate } from "../middleware/validate";
import {
  createCommunityReportSchema,
  createFalsePositiveReportSchema,
} from "../db/schema";

const router = Router();

/**
 * POST /api/reports
 * Submit a community suspicious vanity address report
 */
router.post(
  "/",
  validate(createCommunityReportSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const payload = req.body;

      const report = await store.createCommunityReport({
        submittedAddress: payload.submittedAddress,
        relatedAddress: payload.relatedAddress,
        txHash: payload.txHash,
        tokenContract: payload.tokenContract || "ETH",
        description: payload.description,
        supportingEvidence: payload.supportingEvidence,
        isFalsePositiveDispute: false,
      });

      await store.logAuditEvent({
        action: "COMMUNITY_REPORT_SUBMITTED",
        actorReference: (req.headers["x-hexfence-actor"] as string) || "community-reporter",
        relevantMetadata: {
          reportId: report.id,
          submittedAddress: report.submittedAddress,
          relatedAddress: report.relatedAddress,
          txHash: report.txHash,
        },
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: "Community report submitted successfully. It has been queued for analyst triage.",
        data: report,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/reports/false-positive
 * Submit a dispute against an address flagged as malicious
 */
router.post(
  "/false-positive",
  validate(createFalsePositiveReportSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const payload = req.body;

      const disputeReport = await store.createCommunityReport({
        submittedAddress: payload.address,
        description: `[FALSE POSITIVE DISPUTE]: ${payload.reason}`,
        supportingEvidence: payload.evidenceReference || payload.contactEmail || "False-positive review requested",
        isFalsePositiveDispute: true,
      });

      await store.logAuditEvent({
        action: "FALSE_POSITIVE_DISPUTED",
        actorReference: payload.contactEmail || (req.headers["x-hexfence-actor"] as string) || "address-owner",
        relevantMetadata: {
          reportId: disputeReport.id,
          address: payload.address,
          reason: payload.reason,
        },
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: "False-positive dispute submitted. Security analysts will review within 24 hours.",
        data: disputeReport,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/reports
 * Query submitted reports and their current review status
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const status = req.query.status as any;
      const isDispute = req.query.isDispute === "true" ? true : req.query.isDispute === "false" ? false : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const { total, data } = store.queryReports({
        status,
        isDispute,
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        data,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + data.length < total,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/reports/:id
 * Retrieve a specific report's status and analyst resolution notes
 */
router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const store = dbConnection.getStore();

      const report = store.findReportById(id);
      if (!report) {
        res.status(404).json({
          success: false,
          error: {
            code: "REPORT_NOT_FOUND",
            message: `Report with ID '${id}' was not found.`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

