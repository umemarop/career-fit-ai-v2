import type { Request, Response, NextFunction } from "express";

import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
  getMeUser,
  refreshAccessToken,
  logoutCurrentSession,
  logoutAllSessions,
  logoutOtherSessions,
} from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { getRequestMetadata } from "../../utils/requestMetadata.js";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await registerUser(req.validated?.body as RegisterInput);

    res.status(201).json({
      status: "success",
      data: { user },
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const metadata = getRequestMetadata(req);

    const { user, accessToken, refreshToken } = await loginUser(
      req.validated?.body as LoginInput,
      metadata,
    );

    res.status(200).json({
      status: "success",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  },
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  const input: LogoutInput = req.body;

  await logoutCurrentSession(input);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const logoutOthers = catchAsync(async (req, res) => {
  await logoutOtherSessions(req.user!.id, req.user!.sessionId);

  res.status(200).json({
    status: "success",
    message: "Logged out from all other sessions",
  });
});

export const logoutAll = catchAsync(async (req: Request, res: Response) => {
  await logoutAllSessions(req.user!.id);

  res.status(200).json({
    status: "success",
    message: "Logged out from all devices successfully",
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as RefreshTokenInput;

  const result = await refreshAccessToken(input);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await getMeUser(req.user.id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  },
);
