import { AuthTokenType } from "../../generated/prisma/enums.js";
import { env } from "../../config/env.js";
import { prisma } from "../../prisma/client.js";
import {
  generateAuthTokenPair,
  getExpiresAt,
  hashAuthToken,
} from "../../utils/authToken.js";
import { AppError } from "../../utils/appError.js";

export const revokeActiveAuthTokens = async (
  userId: string,
  type: AuthTokenType,
) => {
  await prisma.authToken.updateMany({
    where: {
      userId,
      type,
      usedAt: null,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const createEmailVerificationToken = async (
  userId: string,
): Promise<string> => {
  const { rawToken, tokenHash } = generateAuthTokenPair();

  await revokeActiveAuthTokens(userId, AuthTokenType.EMAIL_VERIFICATION);

  await prisma.authToken.create({
    data: {
      userId,
      type: AuthTokenType.EMAIL_VERIFICATION,
      tokenHash,
      expiresAt: getExpiresAt(env.EMAIL_VERIFICATION_EXPIRES_MINUTES),
    },
  });

  return rawToken;
};

export const createPasswordResetToken = async (
  userId: string,
): Promise<string> => {
  const { rawToken, tokenHash } = generateAuthTokenPair();

  await revokeActiveAuthTokens(userId, AuthTokenType.PASSWORD_RESET);

  await prisma.authToken.create({
    data: {
      userId,
      type: AuthTokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt: getExpiresAt(env.PASSWORD_RESET_EXPIRES_MINUTES),
    },
  });

  return rawToken;
};

export const verifyAuthToken = async (
  rawToken: string,
  type: AuthTokenType,
) => {
  const tokenHash = hashAuthToken(rawToken);

  const authToken = await prisma.authToken.findFirst({
    where: {
      tokenHash,
      type,
      usedAt: null,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!authToken) {
    throw new AppError("Invalid or expired token", 400);
  }

  return authToken;
};

export const markAuthTokenAsUsed = async (tokenId: string) => {
  return prisma.authToken.update({
    where: {
      id: tokenId,
    },
    data: {
      usedAt: new Date(),
    },
  });
};
