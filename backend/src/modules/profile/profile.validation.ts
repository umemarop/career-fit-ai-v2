import { z } from "zod";

const experienceLevelSchema = z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR"]);

const workEligibilitySchema = z.enum([
  "FULL_WORK_RIGHTS",
  "LIMITED_WORK_RIGHTS",
  "NEEDS_SPONSORSHIP",
  "NOT_SURE",
]);

const jobTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
]);

const remotePreferenceSchema = z.enum([
  "REMOTE",
  "HYBRID",
  "ONSITE",
  "FLEXIBLE",
]);

export const upsertProfileSchema = z.object({
  body: z
    .object({
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

      desiredRoles: z
        .array(z.string().trim().min(1, "Desired role cannot be empty"))
        .default([]),

      careerGoals: z
        .string()
        .trim()
        .min(1, "Career goals cannot be empty")
        .optional(),

      preferredJobType: jobTypeSchema.optional(),

      remotePreference: remotePreferenceSchema.optional(),
    })
    .strict(),
});

export type UpsertProfileInput = z.infer<typeof upsertProfileSchema>["body"];
