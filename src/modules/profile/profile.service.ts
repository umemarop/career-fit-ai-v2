import { prisma } from "../../prisma/client.js";

import { AppError } from "../../utils/appError.js";

import type { UpsertProfileInput } from "./profile.validation.js";
import {
  deleteLocalFileByUrl,
  saveAvatar,
} from "../../services/storage.service.js";

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
  const oldAvatarUrl = existingProfile.avatarUrl;

  await prisma.profile.delete({
    where: { userId },
  });

  await deleteLocalFileByUrl(oldAvatarUrl);
};

export const updateProfileAvatar = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const oldAvatarUrl = profile.avatarUrl;

  const avatar = await saveAvatar(userId, file);

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: {
      avatarUrl: avatar.url,
    },
  });

  await deleteLocalFileByUrl(oldAvatarUrl);
  return updatedProfile;
};

export const deleteProfileAvatar = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const oldAvatarUrl = profile.avatarUrl;

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: {
      avatarUrl: null,
    },
  });
  await deleteLocalFileByUrl(oldAvatarUrl);
  return updatedProfile;
};
