import { z } from "zod";

export const createGuestJobAnalysisSchema = z.object({
  body: z
    .object({
      jobDescription: z
        .string()
        .trim()
        .min(50, "Job description must be at least 50 characters")
        .max(10000, "Job description must be at most 10000 characters"),
    })
    .strict(),
});

export const createUserJobAnalysisSchema = z.object({
  body: z
    .object({
      jobDescription: z
        .string()
        .trim()
        .min(50, "Job description must be at least 50 characters")
        .max(10000, "Job description must be at most 10000 characters"),
    })
    .strict(),
});

export const getJobAnalysisByIdSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid job analysis id"),
    })
    .strict(),
});

export const getMyJobAnalysesSchema = z.object({
  query: z
    .object({
      recommendation: z
        .enum(["APPLY", "CONSIDER", "NOT_RECOMMENDED"])
        .optional(),
      keyword: z.string().trim().min(1).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
      sort: z.enum(["latest", "fitScore_desc", "fitScore_asc"]).optional(),
    })
    .strict(),
});

export const jobAnalysisResultSchema = z
  .object({
    matchedSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    strengths: z.array(z.string()),
    risks: z.array(z.string()),
    resumeTips: z.array(z.string()),
    actionPlan: z.array(z.string()),
  })
  .strict();

export const guestJobAnalysisAIResponseSchema = z
  .object({
    jobTitle: z.string(),
    companyName: z.string().nullable(),
    location: z.string().nullable(),
    requiredSkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    responsibilities: z.array(z.string()),
    summary: z.string(),
    preparationTips: z.array(z.string()),
    warnings: z.array(z.string()),
  })
  .strict();

export const userJobAnalysisAIResponseSchema = z
  .object({
    jobTitle: z.string(),
    companyName: z.string().nullable(),
    location: z.string().nullable(),
    fitScore: z.number().int().min(0).max(100),
    recommendation: z.enum(["APPLY", "CONSIDER", "NOT_RECOMMENDED"]),
    result: jobAnalysisResultSchema,
  })
  .strict();

export type CreateGuestJobAnalysisInput = z.infer<
  typeof createGuestJobAnalysisSchema
>["body"];

export type CreateUserJobAnalysisInput = z.infer<
  typeof createUserJobAnalysisSchema
>["body"];

export type GetJobAnalysisByIdParams = z.infer<
  typeof getJobAnalysisByIdSchema
>["params"];

export type GetMyJobAnalysesQuery = z.infer<
  typeof getMyJobAnalysesSchema
>["query"];

export type JobAnalysisResultResponse = z.infer<typeof jobAnalysisResultSchema>;

export type GuestJobAnalysisAIResponse = z.infer<
  typeof guestJobAnalysisAIResponseSchema
>;

export type UserJobAnalysisAIResponse = z.infer<
  typeof userJobAnalysisAIResponseSchema
>;
