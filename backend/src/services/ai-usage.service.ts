import { AiUsageType } from "../generated/prisma/enums.js";
import { AI_USAGE_LIMITS } from "../constants/aiUsage.constants.js";
import { prisma } from "../prisma/client.js";
import { AppError } from "../utils/appError.js";

type AiUsageIdentity = {
  userId?: string;
  ipAddress?: string;
};

type CheckAiUsageLimitInput = AiUsageIdentity & {
  type: AiUsageType;
};

type RecordAiUsageInput = AiUsageIdentity & {
  type: AiUsageType;
};

const getStartOfToday = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getAiUsageLimit = ({ type, userId }: CheckAiUsageLimitInput): number => {
  if (type === AiUsageType.JOB_ANALYSIS) {
    return userId
      ? AI_USAGE_LIMITS.USER_JOB_ANALYSIS_PER_DAY
      : AI_USAGE_LIMITS.GUEST_JOB_ANALYSIS_PER_DAY;
  }

  if (type === AiUsageType.RESUME_AUTOFILL) {
    return AI_USAGE_LIMITS.USER_RESUME_AUTOFILL_PER_DAY;
  }

  return 0;
};

const buildAiUsageWhere = ({
  userId,
  ipAddress,
  type,
}: CheckAiUsageLimitInput) => {
  const startOfToday = getStartOfToday();

  if (userId) {
    return {
      userId,
      type,
      createdAt: {
        gte: startOfToday,
      },
    };
  }

  return {
    userId: null,
    ipAddress: ipAddress as string,
    type,
    createdAt: {
      gte: startOfToday,
    },
  };
};

export const checkAiUsageLimit = async (input: CheckAiUsageLimitInput) => {
  const { userId, ipAddress } = input;

  if (!userId && !ipAddress) {
    throw new AppError("AI usage identity is required.", 400);
  }

  const limit = getAiUsageLimit(input);

  const usageCount = await prisma.aiUsage.count({
    where: buildAiUsageWhere(input),
  });

  if (usageCount >= limit) {
    throw new AppError(
      "Daily AI usage limit exceeded. Please try again tomorrow.",
      429,
    );
  }

  return {
    limit,
    used: usageCount,
    remaining: limit - usageCount,
  };
};

export const recordAiUsage = async ({
  userId,
  ipAddress,
  type,
}: RecordAiUsageInput) => {
  if (!userId && !ipAddress) {
    throw new AppError("AI usage identity is required.", 400);
  }

  if (userId) {
    return prisma.aiUsage.create({
      data: {
        userId,
        type,
      },
    });
  }

  return prisma.aiUsage.create({
    data: {
      userId: null,
      ipAddress: ipAddress as string,
      type,
    },
  });
};
