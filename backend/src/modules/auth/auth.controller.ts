import type { Request, Response, NextFunction } from "express";

import type {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
  getMeUser,
  refreshAccessToken,
  logoutCurrentSession,
  logoutAllSessions,
  logoutOtherSessions,
  resendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
} from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { getRequestMetadata } from "../../utils/requestMetadata.js";
import {
  refreshTokenCookieName,
  refreshTokenCookieOptions,
} from "../../config/cookie.js";

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
    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      status: "success",
      data: {
        user,
        accessToken,
      },
    });
  },
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies?.[refreshTokenCookieName];

  const refreshToken = refreshTokenFromCookie ?? req.body?.refreshToken;

  if (refreshToken) {
    await logoutCurrentSession({
      refreshToken,
    });
  }

  res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);

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

  res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logged out from all devices successfully",
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies?.[refreshTokenCookieName];

  const refreshToken = refreshTokenFromCookie ?? req.body?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token is missing", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshAccessToken({
      refreshToken,
    });

  res.cookie(
    refreshTokenCookieName,
    newRefreshToken,
    refreshTokenCookieOptions,
  );

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
    },
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
export const resendVerificationEmailController = catchAsync(
  async (req: Request, res: Response) => {
    await resendEmailVerification(req.user!.id);

    res.status(200).json({
      status: "success",
      message: "Verification email sent successfully",
    });
  },
);

export const verifyEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const { token } = req.query as VerifyEmailInput;

    await verifyEmail(token);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  },
);

export const forgotPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    await forgotPassword(req.validated?.body as ForgotPasswordInput);

    res.status(200).json({
      status: "success",
      message:
        "If an account with that email exists, a password reset email has been sent.",
    });
  },
);

export const resetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    await resetPassword(req.validated?.body as ResetPasswordInput);

    res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  },
);

export const changePasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = await changePassword(
      req.user!.id,
      req.user!.sessionId,
      req.validated?.body as ChangePasswordInput,
    );

    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  },
);

export const deleteAccountController = catchAsync(
  async (req: Request, res: Response) => {
    await deleteAccount(req.user!.id);

    res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  },
);
