import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

// Import Route Handlers
import healthRoutes from "./routes/health.routes";
import investigateRoutes from "./routes/investigate.routes";
import evidenceRoutes from "./routes/evidence.routes";
import reportsRoutes from "./routes/reports.routes";
import adminRoutes from "./routes/admin.routes";
import preferencesRoutes from "./routes/preferences.routes";
import ivrRoutes from "./routes/ivr.routes";

export function createApp(): Application {
  const app = express();

  // Security & Body Parsers
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-hexfence-dev-admin", "x-hexfence-actor", "x-request-id"],
    })
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Custom Structured Request Logger
  app.use(requestLogger);

  // Mount API Endpoints
  app.use("/api/health", healthRoutes);
  app.use("/api/investigate", investigateRoutes);
  app.use("/api/evidence", evidenceRoutes);
  app.use("/api/reports", reportsRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/preferences", preferencesRoutes);
  app.use("/api/ivr", ivrRoutes);

  // OpenAPI Specification Endpoint
  app.get("/api/docs", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const spec = require("./docs/openapi.json");
      res.status(200).json(spec);
    } catch {
      res.status(200).json({
        message: "HexFence Core API - OpenAPI 3.0 Documentation",
        docsPath: "/services/api/README.md",
      });
    }
  });

  // Base API Info
  app.get("/api", (_req: Request, res: Response) => {
    res.status(200).json({
      name: "HexFence Threat Intelligence & Defense API",
      version: "0.1.0",
      description: "Backend API for Ethereum Address-Poisoning Defense & Arkiv Evidence Ingestion",
      endpoints: {
        investigation: "/api/investigate?address=0x...",
        evidence: "/api/evidence",
        communityReports: "/api/reports",
        falsePositiveDispute: "/api/reports/false-positive",
        adminEvidenceReview: "/api/admin/evidence",
        adminAuditLogs: "/api/admin/audit-logs",
        preferences: "/api/preferences",
        health: "/api/health",
        documentation: "/api/docs",
      },
    });
  });

  // Catch-all 404 Route
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Endpoint '${req.method} ${req.originalUrl}' does not exist on HexFence API.`,
      },
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"],
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
