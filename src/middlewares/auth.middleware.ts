import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { verifyAccessToken } from "../utils/token.js";
import { prisma } from "../prisma/client.js";
import { catchAsync } from "../utils/catchAsync.js";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    let token: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        deletedAt: true,
        isEmailVerified: true,
      },
    });
    if (!user || user.deletedAt) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }
    req.user = {
      id: user.id,
      role: user.role,
      sessionId: decoded.sessionId,
      isEmailVerified: user.isEmailVerified,
    };
    next();
  },
);
