import { prisma } from "../prisma/client.js";
import { RETENTION_DAYS } from "../constants/retention.constants.js";
import { daysAgo } from "../utils/date.js";

export const cleanupExpiredAuthTokens = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.AUTH_TOKEN);

  const result = await prisma.authToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: cutoff } },
        { usedAt: { lt: cutoff } },
        { revokedAt: { lt: cutoff } },
      ],
    },
  });

  return result.count;
};

export const cleanupExpiredRefreshTokens = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.REFRESH_TOKEN);

  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: cutoff } }, { revokedAt: { lt: cutoff } }],
    },
  });

  return result.count;
};

export const cleanupSoftDeletedApplications = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.SOFT_DELETED_APPLICATION);

  const result = await prisma.application.deleteMany({
    where: {
      deletedAt: { lt: cutoff },
    },
  });

  return result.count;
};

export const cleanupSoftDeletedJobAnalyses = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.SOFT_DELETED_JOB_ANALYSIS);

  const result = await prisma.jobAnalysis.deleteMany({
    where: {
      deletedAt: { lt: cutoff },
    },
  });

  return result.count;
};

export const cleanupOldAiUsages = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.AI_USAGE);

  const result = await prisma.aiUsage.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });

  return result.count;
};

export const cleanupSoftDeletedUsers = async () => {
  const cutoff = daysAgo(RETENTION_DAYS.SOFT_DELETED_USER);

  const result = await prisma.user.deleteMany({
    where: {
      deletedAt: { lt: cutoff },
    },
  });

  return result.count;
};

export const runCleanup = async () => {
  const authTokensDeleted = await cleanupExpiredAuthTokens();
  const refreshTokensDeleted = await cleanupExpiredRefreshTokens();
  const aiUsagesDeleted = await cleanupOldAiUsages();
  const applicationsDeleted = await cleanupSoftDeletedApplications();
  const jobAnalysesDeleted = await cleanupSoftDeletedJobAnalyses();
  const usersDeleted = await cleanupSoftDeletedUsers();

  return {
    authTokensDeleted,
    refreshTokensDeleted,
    aiUsagesDeleted,
    applicationsDeleted,
    jobAnalysesDeleted,
    usersDeleted,
  };
};
