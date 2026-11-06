import { Router, Request, Response, NextFunction } from "express";
import { dbConnection } from "../db/connection";
import { ethAddressSchema } from "../db/schema";
import { AddressInvestigationResponse } from "../db/models";

const router = Router();

/**
 * Common investigation handler for both /:address and ?address=
 */
async function handleInvestigation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawAddress = (req.params.address || req.query.address) as string;

    const validation = ethAddressSchema.safeParse(rawAddress);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ETHEREUM_ADDRESS",
          message: validation.error.errors[0]?.message || "Invalid Ethereum address format.",
          address: rawAddress || null,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const address = validation.data;
    const store = dbConnection.getStore();

    // Query matched evidence and community reports
    const evidenceList = store.findEvidenceByAddress(address);
    const associatedReports = store.findReportsByAddress(address);

    const hasMatchingEvidence = evidenceList.length > 0;
    const totalAssociatedLookalikes = evidenceList.reduce(
      (acc, item) => (item.suspectedAddress.toLowerCase() === address.toLowerCase() ? acc + 1 : acc),
      0
    );

    // Log the investigation event to the internal audit log
    await store.logAuditEvent({
      action: "ADDRESS_INVESTIGATED",
      actorReference: (req.headers["x-hexfence-actor"] as string) || "anonymous-explorer",
      relevantMetadata: {
        address,
        hasMatchingEvidence,
        matchedEvidenceCount: evidenceList.length,
        associatedReportsCount: associatedReports.length,
      },
      ipAddress: req.ip,
    });

    const responsePayload: AddressInvestigationResponse = {
      address,
      isFormatValid: true,
      status: "AUDIT_COMPLETED",
      hasMatchingEvidence,
      totalAssociatedLookalikes,
      evidenceList,
      associatedReports,
      investigatedAt: new Date().toISOString(),
      disclaimer:
        "CRITICAL NOTICE: The absence of indexed threat evidence does NOT guarantee that an address is safe. Adversaries generate new lookalikes on-demand. Always verify all 42 characters before initiating high-value transactions.",
    };

    res.status(200).json({
      success: true,
      data: responsePayload,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// Support both query param and URL path syntax
router.get("/:address", handleInvestigation);
router.get("/", handleInvestigation);

export default router;

