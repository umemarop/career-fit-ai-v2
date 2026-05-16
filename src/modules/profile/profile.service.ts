import { prisma } from "../../prisma/client.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "./profile.validation.js";

export const createProfile = async (
  userId: string,
  input: CreateProfileInput,
) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (existingProfile) {
    throw new AppError("Profile already exists for this user", 400);
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      skills: input.skills,
      experienceLevel: input.experienceLevel,
      avatarUrl: input.avatarUrl ?? null,
      workEligibility: input.workEligibility ?? null,
      location: input.location ?? null,
      targetRole: input.targetRole ?? null,
    },
  });
  return profile;
};

export const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  return profile;
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!existingProfile) {
    throw new AppError("Profile not found", 404);
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: removeUndefined(input) as Prisma.ProfileUpdateInput,
  });
  return updatedProfile;
};
