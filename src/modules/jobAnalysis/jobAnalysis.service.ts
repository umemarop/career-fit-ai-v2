import {
  buildGuestAnalysisPrompt,
  buildUserAnalysisPrompt,
} from "./jobAnalysis.prompt.js";
import {
  guestJobAnalysisAIResponseSchema,
  userJobAnalysisAIResponseSchema,
} from "./jobAnalysis.validation.js";
import type {
  GuestJobAnalysisAIResponse,
  GetMyJobAnalysesQuery,
} from "./jobAnalysis.validation.js";
import type {
  JobAnalysisListItemResponse,
  JobAnalysisDetailResponse,
} from "./jobAnalysis.types.js";
import { generateAIJson } from "../../services/ai.service.js";
import { AppError } from "../../utils/appError.js";
import { prisma } from "../../prisma/client.js";

import type { Prisma, Recommendation } from "../../generated/prisma/client.js";

interface AnalyzeGuestJobInput {
  jobDescription: string;
}

interface AnalyzeJobForUserInput {
  userId: string;
  jobDescription: string;
}

export const analyzeGuestJob = async ({
  jobDescription,
}: AnalyzeGuestJobInput): Promise<GuestJobAnalysisAIResponse> => {
  const prompt = buildGuestAnalysisPrompt({ jobDescription });
  const aiResponse = await generateAIJson(prompt);
  const parsed = guestJobAnalysisAIResponseSchema.safeParse(aiResponse);
  if (!parsed.success) {
    throw new AppError("AI response format is invalid", 500);
  }
  return parsed.data;
};

export const analyzeJobForUser = async ({
  userId,
  jobDescription,
}: AnalyzeJobForUserInput) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      skills: true,
      experienceLevel: true,
      workEligibility: true,
      location: true,
      targetRole: true,
    },
  });

  if (!profile) {
    throw new AppError("Profile is required before analyzing jobs", 400);
  }
  const prompt = buildUserAnalysisPrompt({
    jobDescription,
    profile,
  });
  const aiResponse = await generateAIJson(prompt);
  const parsed = userJobAnalysisAIResponseSchema.safeParse(aiResponse);
  if (!parsed.success) {
    throw new AppError("AI response format is invalid", 500);
  }
  const analysis = await prisma.jobAnalysis.create({
    data: {
      userId,
      jobDescription,
      jobTitle: parsed.data.jobTitle,
      companyName: parsed.data.companyName,
      location: parsed.data.location,
      fitScore: parsed.data.fitScore,
      recommendation: parsed.data.recommendation as Recommendation,
      result: parsed.data.result,
    },
  });
  return analysis;
};

interface GetMyJobAnalysesResult {
  analyses: JobAnalysisListItemResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getMyJobAnalyses = async (
  userId: string,
  query: GetMyJobAnalysesQuery,
): Promise<GetMyJobAnalysesResult> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;
  const where: Prisma.JobAnalysisWhereInput = {
    userId,
    deletedAt: null,
  };

  if (query.recommendation) {
    where.recommendation = query.recommendation;
  }

  if (query.keyword) {
    where.OR = [
      {
        jobTitle: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
      {
        location: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
      {
        jobDescription: {
          contains: query.keyword,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy: Prisma.JobAnalysisOrderByWithRelationInput =
    query.sort === "fitScore_desc"
      ? { fitScore: "desc" }
      : query.sort === "fitScore_asc"
        ? { fitScore: "asc" }
        : { createdAt: "desc" };

  const [analyses, total] = await Promise.all([
    prisma.jobAnalysis.findMany({
      where,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        location: true,
        fitScore: true,
        recommendation: true,
        createdAt: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.jobAnalysis.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    analyses,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getJobAnalysisById = async (
  userId: string,
  analysisId: string,
): Promise<JobAnalysisDetailResponse> => {
  const analysis = await prisma.jobAnalysis.findFirst({
    where: {
      id: analysisId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      location: true,
      jobDescription: true,
      fitScore: true,
      recommendation: true,
      result: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!analysis) {
    throw new AppError("Job analysis not found", 404);
  }

  return analysis as JobAnalysisDetailResponse;
};
