import type { Request, Response, NextFunction } from "express";

import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

import {
  deleteProfile as deleteProfileService,
  getProfile as getProfileService,
  upsertProfile as upsertProfileService,
  updateProfileAvatar,
  deleteProfileAvatar,
} from "./profile.service.js";
import type { UpsertProfileInput } from "./profile.validation.js";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const profile = await getProfileService(userId);

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

export const upsertProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const input = req.validated!.body as UpsertProfileInput;

  const profile = await upsertProfileService(userId, input);

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

export const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  await deleteProfileService(userId);

  res.status(204).send();
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Avatar image is required", 400);
  }

  const profile = await updateProfileAvatar(req.user!.id, req.file);

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

export const deleteAvatar = catchAsync(async (req: Request, res: Response) => {
  const profile = await deleteProfileAvatar(req.user!.id);

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});
