import { z } from "zod";

const experienceLevelSchema = z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR"]);

const workEligibilitySchema = z.enum([
  "FULL_WORK_RIGHTS",
  "LIMITED_WORK_RIGHTS",
  "NEEDS_SPONSORSHIP",
  "NOT_SURE",
]);

export const createProfileSchema = z.object({
  body: z
    .object({
      avatarUrl: z.string().trim().url().optional(),

      skills: z
        .array(z.string().trim().min(1, "Skill cannot be empty"))
        .min(1, "At least one skill is required"),
      experienceLevel: experienceLevelSchema,
      workEligibility: workEligibilitySchema.optional(),
      location: z.string().trim().min(1, "Location cannot be empty").optional(),
      targetRole: z
        .string()
        .trim()
        .min(1, "Target role cannot be empty")
        .optional(),
    })
    .strict(),
});
export type CreateProfileInput = z.infer<typeof createProfileSchema>["body"];

export const updateProfileSchema = z.object({
  body: z
    .object({
      avatarUrl: z.string().trim().url().optional(),
      skills: z
        .array(z.string().trim().min(1, "Skill cannot be empty"))
        .min(1, "At least one skill is required")
        .optional(),
      experienceLevel: experienceLevelSchema.optional(),
      workEligibility: workEligibilitySchema.optional(),
      location: z.string().trim().min(1, "Location cannot be empty").optional(),
      targetRole: z
        .string()
        .trim()
        .min(1, "Target role cannot be empty")
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
