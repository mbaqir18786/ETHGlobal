import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

/**
 * Centralized enterprise error handler
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "APP_ERROR");

  console.error(`💥 [API Error] ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    requestId: req.headers["x-request-id"],
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || "An unexpected internal server error occurred.",
      details: err.details || null,
      ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"],
  });
}
