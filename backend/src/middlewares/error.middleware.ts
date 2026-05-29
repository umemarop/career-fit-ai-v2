import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

type ErrorWithStatus = Error & {
  statusCode?: number;
  status?: "fail" | "error";
  isOperational?: boolean;
  errors?: Record<string, string>;
};

const sendErrorDev = (err: ErrorWithStatus, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
    ...(err.errors && { errors: err.errors }),
    stack: err.stack,
  });
};

const sendErrorProd = (err: ErrorWithStatus, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message || "Something went wrong",
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export const errorController = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  const shouldLogAsError = err.statusCode >= 500 || !err.isOperational;

  const logMeta = {
    message: err.message,
    statusCode: err.statusCode,
    status: err.status,
    isOperational: err.isOperational,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    stack:
      env.NODE_ENV !== "production" && shouldLogAsError ? err.stack : undefined,
  };

  if (shouldLogAsError) {
    logger.error("Request failed", logMeta);
  } else {
    logger.warn("Request failed", logMeta);
  }

  if (env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    return;
  }

  sendErrorProd(err, res);
};
