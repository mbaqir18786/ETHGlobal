import { Router, Response, NextFunction } from "express";
import { dbConnection } from "../db/connection";
import { devAdminGuard, DevAuthenticatedRequest } from "../middleware/devAuth";
import { validate } from "../middleware/validate";
import { updateEvidenceStatusSchema, getAuditLogsQuerySchema } from "../db/schema";
import { EvidenceStatus, ReviewStatus } from "../db/models";

const router = Router();

// Apply development-only administrative guard to all /api/admin/* endpoints
router.use(devAdminGuard);

/**
 * GET /api/admin/evidence
 * Administrative threat evidence triage list
 */
router.get(
  "/evidence",
  async (req: DevAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const status = req.query.status as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const { total, data } = store.queryEvidence({
        status,
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        data,
        pagination: { total, limit, offset },
        devNotice: "DEVELOPMENT ACCESS ONLY: This endpoint is unauthenticated for UI testing.",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/evidence/:id
 * Administrative update to evidence status (e.g. mark False Positive or Confirm)
 */
router.patch(
  "/evidence/:id",
  validate(updateEvidenceStatusSchema, "body"),
  async (req: DevAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, reviewNotes, reviewerId } = req.body;
      const actor = req.devAdminActor || reviewerId || "dev-admin";

      const store = dbConnection.getStore();
      const updated = await store.updateEvidenceStatus(
        id,
        status as EvidenceStatus,
        actor,
        reviewNotes
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          error: {
            code: "EVIDENCE_NOT_FOUND",
            message: `Threat evidence with ID '${id}' not found.`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await store.logAuditEvent({
        action: "EVIDENCE_STATUS_UPDATED",
        actorReference: actor,
        relevantMetadata: {
          evidenceId: id,
          newStatus: status,
          reviewNotes,
        },
        ipAddress: req.ip,
      });

      res.status(200).json({
        success: true,
        message: `Threat evidence status successfully updated to '${status}'.`,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/reports/:id
 * Administrative review for community reports
 */
router.patch(
  "/reports/:id",
  async (req: DevAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, resolutionNotes } = req.body;
      const actor = req.devAdminActor || "dev-admin";

      if (!status) {
        res.status(400).json({
          success: false,
          error: { code: "MISSING_STATUS", message: "Review status is required." },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const store = dbConnection.getStore();
      const updated = await store.updateReportStatus(
        id,
        status as ReviewStatus,
        actor,
        resolutionNotes || "Status updated by admin"
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          error: { code: "REPORT_NOT_FOUND", message: `Report '${id}' not found.` },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await store.logAuditEvent({
        action: "REPORT_STATUS_UPDATED",
        actorReference: actor,
        relevantMetadata: { reportId: id, newStatus: status, resolutionNotes },
        ipAddress: req.ip,
      });

      res.status(200).json({
        success: true,
        message: `Community report '${id}' set to '${status}'.`,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/admin/audit-logs
 * Retrieve system operational audit trail
 */
router.get(
  "/audit-logs",
  validate(getAuditLogsQuerySchema, "query"),
  async (req: DevAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const { action, actor, limit, offset } = req.query as any;

      const { total, data } = store.queryAuditLogs({
        action,
        actor,
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        data,
        pagination: { total, limit, offset, hasMore: offset + data.length < total },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

