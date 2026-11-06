import { Router, Request, Response, NextFunction } from "express";
import { dbConnection } from "../db/connection";
import { validate } from "../middleware/validate";
import { updateNotificationPreferenceSchema } from "../db/schema";

const router = Router();

/**
 * GET /api/preferences
 * Retrieve notification preferences for a user / wallet address
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.query.user as string;
      if (!user) {
        res.status(400).json({
          success: false,
          error: {
            code: "MISSING_USER_PARAM",
            message: "Query parameter 'user' (wallet address or user reference) is required.",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const store = dbConnection.getStore();
      const preferences = store.getPreferencesByUser(user);

      res.status(200).json({
        success: true,
        data: preferences,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/preferences
 * Update or enable/disable a notification preference
 */
router.put(
  "/",
  validate(updateNotificationPreferenceSchema, "body"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = dbConnection.getStore();
      const payload = req.body;

      const updated = await store.setPreference({
        userReference: payload.userReference,
        notificationType: payload.notificationType,
        enabled: payload.enabled,
        destination: payload.destination,
      });

      await store.logAuditEvent({
        action: "NOTIFICATION_PREFERENCE_UPDATED",
        actorReference: payload.userReference,
        relevantMetadata: {
          notificationType: payload.notificationType,
          enabled: payload.enabled,
        },
        ipAddress: req.ip,
      });

      res.status(200).json({
        success: true,
        message: "Notification preference updated successfully.",
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

