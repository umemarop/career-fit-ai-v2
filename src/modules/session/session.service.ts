import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/appError.js";
import { hashToken } from "../../utils/crypto.js";
import type { RequestMetadata } from "../../utils/requestMetadata.js";

type CreateSessionInput = {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  metadata: RequestMetadata;
};

export const createSession = async ({
  userId,
  refreshToken,
  expiresAt,
  metadata,
}: CreateSessionInput) => {
  const tokenHash = hashToken(refreshToken);

  return prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
      userAgent: metadata.userAgent ?? null,
      ipAddress: metadata.ipAddress ?? null,
      browser: metadata.browser ?? null,
      os: metadata.os ?? null,
      deviceType: metadata.deviceType ?? null,
    },
  });
};

export const findValidSessionByRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: true,
    },
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (session.revokedAt) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Refresh token has expired", 401);
  }

  return session;
};

export const rotateSessionRefreshToken = async (
  sessionId: string,
  newTokenHash: string,
  newExpiresAt: Date,
) => {
  return prisma.refreshToken.update({
    where: { id: sessionId },
    data: {
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
    },
  });
};

export const revokeSessionByRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (session.revokedAt) {
    return session;
  }

  return prisma.refreshToken.update({
    where: { id: session.id },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const revokeSessionById = async (userId: string, sessionId: string) => {
  const session = await prisma.refreshToken.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    select: {
      id: true,
      revokedAt: true,
    },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.revokedAt) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: session.id },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const revokeAllUserSessionsExceptCurrent = async (
  userId: string,
  currentSessionId: string,
): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      id: {
        not: currentSessionId,
      },
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const revokeAllUserSessions = async (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const getUserSessions = async (
  userId: string,
  currentSessionId: string,
) => {
  const sessions = await prisma.refreshToken.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      browser: true,
      os: true,
      deviceType: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return sessions.map((session) => ({
    ...session,
    isCurrent: session.id === currentSessionId,
  }));
};
