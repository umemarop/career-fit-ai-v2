import { prisma } from "../../prisma/client.js";

import { AppError } from "../../utils/appError.js";

import type { UpsertProfileInput } from "./profile.validation.js";

export const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  return profile;
};

export const upsertProfile = async (
  userId: string,
  input: UpsertProfileInput,
) => {
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      skills: input.skills,
      experienceLevel: input.experienceLevel,
      workEligibility: input.workEligibility ?? null,
      location: input.location ?? null,
      targetRole: input.targetRole ?? null,
      desiredRoles: input.desiredRoles,
      careerGoals: input.careerGoals ?? null,
      preferredJobType: input.preferredJobType ?? null,
      remotePreference: input.remotePreference ?? null,
    },
    update: {
      skills: input.skills,
      experienceLevel: input.experienceLevel,
      workEligibility: input.workEligibility ?? null,
      location: input.location ?? null,
      targetRole: input.targetRole ?? null,
      desiredRoles: input.desiredRoles,
      careerGoals: input.careerGoals ?? null,
      preferredJobType: input.preferredJobType ?? null,
      remotePreference: input.remotePreference ?? null,
    },
  });

  return profile;
};

export const deleteProfile = async (userId: string) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError("Profile not found", 404);
  }

  await prisma.profile.delete({
    where: { userId },
  });
};

export const updateProfileAvatar = async (
  userId: string,
  avatarUrl: string,
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return prisma.profile.update({
    where: { userId },
    data: {
      avatarUrl,
    },
  });
};

export const deleteProfileAvatar = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return prisma.profile.update({
    where: { userId },
    data: {
      avatarUrl: null,
    },
  });
};
