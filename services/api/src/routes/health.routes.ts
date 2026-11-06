import { Router, Request, Response } from "express";
import { dbConnection } from "../db/connection";
import { env } from "../config/env";

const router = Router();

/**
 * GET /api/health
 * System health, database connection status, and service uptime
 */
router.get("/", (_req: Request, res: Response) => {
  const dbHealth = dbConnection.healthCheck();
  const uptimeSeconds = process.uptime();

  const isHealthy = dbHealth.status === "CONNECTED";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "HEALTHY" : "DEGRADED",
    service: "@hexfence/api",
    version: "0.1.0",
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp: new Date().toISOString(),
    database: dbHealth,
    arkivGateway: {
      url: env.ARKIV_GATEWAY_URL,
      status: "CONFIGURED",
    },
  });
});

export default router;
