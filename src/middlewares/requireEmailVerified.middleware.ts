import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new AppError("You are not logged in", 401));
  }

  if (!req.user.isEmailVerified) {
    return next(new AppError("Email verification required", 403));
  }

  next();
};
