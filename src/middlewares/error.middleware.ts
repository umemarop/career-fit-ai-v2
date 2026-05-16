import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

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

  if (env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    return;
  }

  sendErrorProd(err, res);
};
