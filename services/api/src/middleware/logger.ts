import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime();
  const requestId = (req.headers["x-request-id"] as string) || `req_${crypto.randomBytes(4).toString("hex")}`;
  req.headers["x-request-id"] = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const statusCode = res.statusCode;

    const color =
      statusCode >= 500
        ? "\x1b[31m" // Red
        : statusCode >= 400
        ? "\x1b[33m" // Yellow
        : statusCode >= 300
        ? "\x1b[36m" // Cyan
        : "\x1b[32m"; // Green
    const reset = "\x1b[0m";

    console.log(
      `[${new Date().toISOString()}] ${color}${req.method} ${req.originalUrl} ${statusCode}${reset} - ${timeInMs}ms (id: ${requestId})`
    );
  });

  next();
}

