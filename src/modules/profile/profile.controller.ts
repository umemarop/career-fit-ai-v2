import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createProfile as createProfileService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
} from "./profile.service.js";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "./profile.validation.js";

export const createProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const input = req.validated!.body as CreateProfileInput;

  const profile = await createProfileService(userId, input);

  res.status(201).json({
    status: "success",
    data: {
      profile,
    },
  });
});

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

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const input = req.validated!.body as UpdateProfileInput;

  const profile = await updateProfileService(userId, input);

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});
