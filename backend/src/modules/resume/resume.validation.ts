import { z } from "zod";

import { JobType, RemotePreference } from "../../generated/prisma/enums.js";

export const resumeProfileDraftSchema = z.object({
  skills: z.array(z.string().trim().min(1)),

  experienceLevel: z
    .enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"])
    .nullable(),

  workEligibility: z.string().trim().min(1).nullable(),

  location: z.string().trim().min(1).nullable(),

  targetRole: z.string().trim().min(1).nullable(),

  desiredRoles: z.array(z.string().trim().min(1)),

  careerGoals: z.string().trim().min(1).nullable(),

  preferredJobType: z.nativeEnum(JobType).nullable(),

  remotePreference: z.nativeEnum(RemotePreference).nullable(),
});

export type ResumeProfileDraft = z.infer<typeof resumeProfileDraftSchema>;
