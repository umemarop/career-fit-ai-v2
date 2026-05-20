import bcrypt from "bcryptjs";

import { env } from "../../config/env.js";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/appError.js";
import { hashToken } from "../../utils/crypto.js";
import type { RequestMetadata } from "../../utils/requestMetadata.js";
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

  return user;
};

export const loginUser = async (
  input: LoginInput,
  metadata: RequestMetadata,
) => {
  const { email, password } = input;
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
