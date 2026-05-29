import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError.js";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (issue.code === "invalid_type") {
          errors[field] = `${field} is required`;
        } else {
          errors[field] = issue.message;
        }
      });

      return next(new AppError("Validation failed", 400, errors));
    }

    const data = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    req.validated = {
      body: data.body,
      params: data.params,
      query: data.query,
    };

    next();
  };
