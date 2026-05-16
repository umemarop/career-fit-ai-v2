import { z } from "zod";

const applicationStatusValues = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const createApplicationSchema = z.object({
  body: z
    .object({
      jobAnalysisId: z.string().uuid("Invalid job analysis id").optional(),

      jobTitle: z.string().trim().min(1, "Job title is required").optional(),
      companyName: z.string().trim().min(1).optional(),
      location: z.string().trim().min(1).optional(),
      jobUrl: z.string().url("Invalid job URL").optional(),

      status: z.enum(applicationStatusValues).optional(),

      notes: z.string().trim().min(1).optional(),
      nextStep: z.string().trim().min(1).optional(),
      appliedAt: z.coerce.date().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (!data.jobAnalysisId && !data.jobTitle) {
        ctx.addIssue({
          code: "custom",
          message:
            "Job title is required when creating an application manually",
          path: ["jobTitle"],
        });
      }
    }),
});

export const getMyApplicationsSchema = z.object({
  query: z
    .object({
      status: z.enum(applicationStatusValues).optional(),

      keyword: z.string().trim().min(1).optional(),

      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),

      sort: z
        .enum([
          "latest",
          "oldest",
          "appliedAt_desc",
          "appliedAt_asc",
          "jobTitle_asc",
          "companyName_asc",
        ])
        .optional(),
    })
    .strict(),
});

export const getApplicationByIdSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid application id"),
    })
    .strict(),
});

export const updateApplicationSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid application id"),
    })
    .strict(),

  body: z
    .object({
      jobTitle: z.string().trim().min(1).optional(),
      companyName: z.string().trim().min(1).nullable().optional(),
      location: z.string().trim().min(1).nullable().optional(),
      jobUrl: z.string().url("Invalid job URL").nullable().optional(),

      notes: z.string().trim().min(1).nullable().optional(),
      nextStep: z.string().trim().min(1).nullable().optional(),
      appliedAt: z.coerce.date().nullable().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required to update",
    }),
});

export const updateApplicationStatusSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid application id"),
    })
    .strict(),

  body: z
    .object({
      status: z.enum(applicationStatusValues),
    })
    .strict(),
});

export const deleteApplicationSchema = getApplicationByIdSchema;

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>["body"];

export type GetMyApplicationsQuery = z.infer<
  typeof getMyApplicationsSchema
>["query"];

export type GetApplicationByIdParams = z.infer<
  typeof getApplicationByIdSchema
>["params"];

export type UpdateApplicationParams = z.infer<
  typeof updateApplicationSchema
>["params"];

export type UpdateApplicationInput = z.infer<
  typeof updateApplicationSchema
>["body"];

export type UpdateApplicationStatusParams = z.infer<
  typeof updateApplicationStatusSchema
>["params"];

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>["body"];

export type DeleteApplicationParams = GetApplicationByIdParams;
