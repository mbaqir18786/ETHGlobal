import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

type RequestLocation = "body" | "query" | "params";

/**
 * Generic Express middleware to validate request payload against a Zod schema
 */
export function validate(schema: AnyZodObject, location: RequestLocation = "body") {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dataToValidate = req[location];
      const parsed = await schema.parseAsync(dataToValidate);
      req[location] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          rule: err.code,
        }));

        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed on one or more fields.",
            location,
            details: formattedErrors,
          },
          timestamp: new Date().toISOString(),
          requestId: req.headers["x-request-id"],
        });
        return;
      }

      next(error);
    }
  };
}

