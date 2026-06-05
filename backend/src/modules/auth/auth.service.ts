import bcrypt from "bcryptjs";

import { env } from "../../config/env.js";
import { AuthTokenType } from "../../generated/prisma/enums.js";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/appError.js";
import { hashToken } from "../../utils/crypto.js";
import { eventBus } from "../../events/eventBus.js";
import {
  exchangeCodeForGoogleTokens,
  verifyGoogleIdToken,
} from "./google-oauth.service.js";
import {
  createEmailVerificationToken,
  verifyAuthToken,
  createPasswordResetToken,
} from "../auth-token/authToken.service.js";
import type { RequestMetadata } from "../../utils/requestMetadata.js";
import { logger } from "../../utils/logger.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import {
  createSession,
  findValidSessionByRefreshToken,
  rotateSessionRefreshToken,
  revokeSessionByRefreshToken,
  revokeAllUserSessions,
  revokeAllUserSessionsExceptCurrent,
} from "../session/session.service.js";
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "./auth.validation.js";

const getRefreshTokenExpiresAt = () => {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS);

  return expiresAt;
};

export const registerUser = async (input: RegisterInput) => {
  const { email, password } = input;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const verificationToken = await createEmailVerificationToken(user.id);

  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  logger.info("Email verification event emitted", {
    userId: user.id,
    email: user.email,
  });

  eventBus.emit("auth.emailVerificationRequested", {
    userId: user.id,
    email: user.email,
    name: null,
    verificationUrl,
  });

  return user;
};

export const loginUser = async (
  input: LoginInput,
  metadata: RequestMetadata,
) => {
  const { email, password } = input;
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      deletedAt: null,
    },
  });

  if (!user) {
    logger.warn("Login failed: user not found or deleted", {
      email: normalizedEmail,
    });
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.password) {
    throw new AppError(
      "This account uses Google login. Please continue with Google.",
      401,
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.warn("Login failed: invalid password", {
      userId: user.id,
      email: user.email,
    });
    throw new AppError("Invalid email or password", 401);
  }

  const refreshToken = generateRefreshToken();

  const session = await createSession({
    userId: user.id,
    refreshToken,
    expiresAt: getRefreshTokenExpiresAt(),
    metadata,
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    sessionId: session.id,
  });

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const loginWithGoogle = async (
  code: string,
  metadata: RequestMetadata,
) => {
  const googleTokens = await exchangeCodeForGoogleTokens(code);

  if (!googleTokens.id_token) {
    throw new AppError("Google ID token is missing", 401);
  }

  const googleUser = await verifyGoogleIdToken(googleTokens.id_token);

  if (!googleUser.emailVerified) {
    throw new AppError("Google email is not verified", 401);
  }

  let user = await prisma.user.findUnique({
    where: {
      googleId: googleUser.googleId,
    },
  });

  if (user?.deletedAt) {
    throw new AppError("This account has been disabled", 403);
  }

  if (!user) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: googleUser.email.toLowerCase(),
      },
    });

    if (existingUserByEmail?.deletedAt) {
      throw new AppError("This account has been disabled", 403);
    }

    if (existingUserByEmail) {
      user = await prisma.user.update({
        where: {
          id: existingUserByEmail.id,
        },
        data: {
          googleId: googleUser.googleId,
          isEmailVerified: true,
          emailVerifiedAt: existingUserByEmail.emailVerifiedAt ?? new Date(),
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          password: null,
          googleId: googleUser.googleId,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
    }
  }

  const refreshToken = generateRefreshToken();

  const session = await createSession({
    userId: user.id,
    refreshToken,
    expiresAt: getRefreshTokenExpiresAt(),
    metadata,
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    sessionId: session.id,
  });

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const logoutCurrentSession = async (
  input: LogoutInput,
): Promise<void> => {
  await revokeSessionByRefreshToken(input.refreshToken);
};

export const logoutOtherSessions = async (
  userId: string,
  currentSessionId: string,
): Promise<void> => {
  await revokeAllUserSessionsExceptCurrent(userId, currentSessionId);
};

export const logoutAllSessions = async (userId: string): Promise<void> => {
  await revokeAllUserSessions(userId);
};

export const refreshAccessToken = async (input: RefreshTokenInput) => {
  const session = await findValidSessionByRefreshToken(input.refreshToken);

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashToken(newRefreshToken);
  const newRefreshTokenExpiresAt = getRefreshTokenExpiresAt();

  await rotateSessionRefreshToken(
    session.id,
    newRefreshTokenHash,
    newRefreshTokenExpiresAt,
  );

  const accessToken = generateAccessToken({
    userId: session.userId,
    role: session.user.role,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const getMeUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,

      isEmailVerified: true,
      emailVerifiedAt: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const resendEmailVerification = async (
  userId: string,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  const verificationToken = await createEmailVerificationToken(user.id);

  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  logger.info("Email verification resend event emitted", {
    userId: user.id,
    email: user.email,
  });

  eventBus.emit("auth.emailVerificationRequested", {
    userId: user.id,
    email: user.email,
    name: null,
    verificationUrl,
  });
};

export const verifyEmail = async (token: string) => {
  const authToken = await verifyAuthToken(
    token,
    AuthTokenType.EMAIL_VERIFICATION,
  );

  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: authToken.userId,
      },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: now,
      },
    }),

    prisma.authToken.update({
      where: {
        id: authToken.id,
      },
      data: {
        usedAt: now,
      },
    }),
  ]);
};

export const forgotPassword = async (
  input: ForgotPasswordInput,
): Promise<void> => {
  const normalizedEmail = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    logger.warn("Password reset requested for non-existing email", {
      email: normalizedEmail,
    });

    return;
  }

  const resetToken = await createPasswordResetToken(user.id);

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

  logger.info("Password reset event emitted", {
    userId: user.id,
    email: user.email,
  });

  eventBus.emit("auth.passwordResetRequested", {
    userId: user.id,
    email: user.email,
    name: null,
    resetUrl,
  });
};

export const resetPassword = async (
  input: ResetPasswordInput,
): Promise<void> => {
  const authToken = await verifyAuthToken(
    input.token,
    AuthTokenType.PASSWORD_RESET,
  );
  const hashedPassword = await bcrypt.hash(input.password, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: authToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tx.authToken.update({
      where: {
        id: authToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId: authToken.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  });
};

export const changePassword = async (
  userId: string,
  currentSessionId: string,
  input: ChangePasswordInput,
): Promise<{ refreshToken: string }> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError(
      "This account does not have a password. Please reset your password first.",
      400,
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    input.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    logger.warn("Change password failed: incorrect current password", {
      userId: user.id,
    });

    throw new AppError("Current password is incorrect", 400);
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const newRefreshToken = generateRefreshToken();

  const newRefreshTokenHash = hashToken(newRefreshToken);

  const newRefreshTokenExpiresAt = getRefreshTokenExpiresAt();

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    }),

    prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        id: {
          not: currentSessionId,
        },
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),

    prisma.refreshToken.update({
      where: {
        id: currentSessionId,
      },
      data: {
        tokenHash: newRefreshTokenHash,
        expiresAt: newRefreshTokenExpiresAt,
      },
    }),
  ]);

  return {
    refreshToken: newRefreshToken,
  };
};

export const deleteAccount = async (userId: string): Promise<void> => {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.deletedAt) {
      throw new AppError("Account is already deleted", 400);
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: now,
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });

    await tx.authToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });
  });

  logger.info("Account soft deleted", {
    userId,
  });
};
