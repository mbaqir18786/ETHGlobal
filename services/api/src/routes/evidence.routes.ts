import { Router, Request, Response, NextFunction } from "express";
import { dbConnection } from "../db/connection";
import { validate } from "../middleware/validate";
import { getEvidenceQuerySchema } from "../db/schema";
import {
  publishEvidenceToArkiv,
  queryEvidenceByAddress,
  fetchAllArkivEvidence,
} from "@hexfence/arkiv";
import { z } from "zod";
import { DetectionReason, EvidenceStatus } from "../db/models";

const router = Router();

const publishEvidenceSchema = z.object({
  evidenceId: z.string().optional(),
  referenceAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  suspectedAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  token: z.string().min(1),
  detectionReason: z.string().min(1),
  confidence: z.number().min(0).max(100),
  detectorVersion: z.string().default("1.0.0"),
  evidenceStatus: z.enum(["SUSPECTED", "UNDER_REVIEW", "CONFIRMED_BY_REVIEW", "FALSE_POSITIVE"]).default("SUSPECTED"),
});

/**
 * GET /api/evidence
 * Query threat evidence records with status, token, and reason filters
 */
router.get(
  "/",
  validate(getEvidenceQuerySchema, "query"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const filters = req.query as any;

      const { total, data } = store.queryEvidence({
        address: filters.address,
        status: filters.status,
        token: filters.token,
        reason: filters.reason,
        limit: filters.limit,
        offset: filters.offset,
      });

      res.status(200).json({
        success: true,
        data,
        pagination: {
          total,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: filters.offset + data.length < total,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/evidence/arkiv/recent
 * Query live evidence entities directly from Arkiv Rabdi Testnet
 */
router.get(
  "/arkiv/recent",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const entities = await fetchAllArkivEvidence(limit);

      res.status(200).json({
        success: true,
        source: "arkiv-rabdi-testnet",
        chainId: 7794095,
        count: entities.length,
        data: entities,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/evidence/arkiv/address/:address
 * Query on-chain Arkiv records for a specific address
 */
router.get(
  "/arkiv/address/:address",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { address } = req.params;
      const entities = await queryEvidenceByAddress(address);

      res.status(200).json({
        success: true,
        source: "arkiv-rabdi-testnet",
        chainId: 7794095,
        address,
        count: entities.length,
        data: entities,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/evidence/publish
 * Publish detector-generated evidence to Arkiv Rabdi Testnet
 */
router.post(
  "/publish",
  validate(publishEvidenceSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const body = req.body;

      const evidenceId = body.evidenceId || `EVID-${Date.now().toString().slice(-4)}`;

      // Publish to Arkiv network
      const arkivResult = await publishEvidenceToArkiv({
        evidenceId,
        referenceAddress: body.referenceAddress as `0x${string}`,
        suspectedAddress: body.suspectedAddress as `0x${string}`,
        txHash: body.txHash,
        token: body.token,
        detectionReason: body.detectionReason,
        confidence: body.confidence.toString(),
        detectorVersion: body.detectorVersion,
        detectionTimestamp: new Date().toISOString(),
        evidenceStatus: body.evidenceStatus.toLowerCase() as any,
      });

      // Save or update local store evidence record with the Arkiv reference
      const localRecord = await store.createEvidence({
        id: evidenceId,
        suspectedAddress: body.suspectedAddress,
        referenceAddress: body.referenceAddress,
        txHash: body.txHash,
        tokenContract: body.token,
        detectionReason: body.detectionReason as DetectionReason,
        confidenceScore: body.confidence,
        detectorVersion: body.detectorVersion,
        evidenceStatus: body.evidenceStatus as EvidenceStatus,
        arkivEntityReference: arkivResult.arkivUri,
        sharedPrefix: body.referenceAddress.slice(0, 6),
        sharedSuffix: body.referenceAddress.slice(-6),
        divergentLength: 42 - 12,
        investigationNotes: `Automated detection published to Arkiv testnet. Entity Key: ${arkivResult.entityKey || "pending"}`,
      });

      // Create audit log entry
      await store.logAuditEvent({
        action: "EVIDENCE_REVIEWED",
        actorReference: "system-detector-worker",
        relevantMetadata: {
          evidenceId: localRecord.id,
          arkivUri: arkivResult.arkivUri,
          entityKey: arkivResult.entityKey,
          isDuplicate: arkivResult.isDuplicate,
          txHash: body.txHash,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          evidence: localRecord,
          arkiv: arkivResult,
        },
        message: arkivResult.isDuplicate
          ? "Evidence entity already exists on Arkiv; deduplicated on-chain."
          : "Evidence entity successfully published to Arkiv Rabdi testnet.",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/evidence/:id
 * Retrieve a specific evidence record and Arkiv proof reference
 */
router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const store = dbConnection.getStore();

      const record = store.findEvidenceById(id);
      if (!record) {
        res.status(404).json({
          success: false,
          error: {
            code: "EVIDENCE_NOT_FOUND",
            message: `Threat evidence record with ID '${id}' was not found.`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: record,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
