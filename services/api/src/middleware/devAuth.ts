import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface DevAuthenticatedRequest extends Request {
  devAdminActor?: string;
}

/**
 * Development-Only Administrative Access Middleware
 *
 * IMPORTANT SECURITY NOTICE:
 * Authentication has not yet been implemented (scheduled for later phase).
 * This middleware provides clearly marked, temporary development access for testing
 * administrative review and audit endpoints.
 * It is strictly forbidden from running unrestricted in production.
 */
export function devAdminGuard(
  req: DevAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  // Hard block in production environments
  if (env.NODE_ENV === "production") {
    res.status(403).json({
      success: false,
      error: {
        code: "DEV_ADMIN_DISABLED_IN_PRODUCTION",
        message:
          "Development administrative bypass is strictly disabled in production. Real production authentication is pending Phase 5 implementation.",
      },
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"],
    });
    return;
  }

  const devHeader = req.headers["x-hexfence-dev-admin"];
  const authHeader = req.headers["authorization"];
  const devQuery = req.query.devAdmin;

  const isDevAdminAuthorized =
    devHeader === "true" ||
    devQuery === "true" ||
    authHeader === `Bearer ${env.DEV_ADMIN_TOKEN}`;

  if (!isDevAdminAuthorized) {
    res.status(403).json({
      success: false,
      error: {
        code: "DEV_ADMIN_ACCESS_REQUIRED",
        message:
          "Development-only administrative endpoint. To access during testing, provide header 'x-hexfence-dev-admin: true' or 'Authorization: Bearer <DEV_ADMIN_TOKEN>'.",
        notice:
          "This is a development testing guard, not production security. Production authentication will be integrated in subsequent phases.",
      },
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"],
    });
    return;
  }

  // Log explicit security audit warning for every development administrative access
  console.warn(
    `⚠️  [DEV_ADMIN_ACCESS] Development administrative bypass exercised on ${req.method} ${req.originalUrl} by client IP: ${req.ip}`
  );

  req.devAdminActor = (req.headers["x-hexfence-actor"] as string) || "dev-admin";
  next();
}

