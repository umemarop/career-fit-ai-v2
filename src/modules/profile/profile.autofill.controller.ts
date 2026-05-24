import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import {
  generateProfileDraftFromMyResume,
  generateProfileDraftFromUploadedResume,
} from "./profile.autofill.service.js";

export const autofillProfileFromResume = catchAsync(
  async (req: Request, res: Response) => {
    const profileDraft = await generateProfileDraftFromMyResume(req.user!.id);

    res.status(200).json({
      status: "success",
      data: {
        profileDraft,
      },
    });
  },
);

export const autofillProfileFromUploadedResume = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Resume file is required", 400);
    }

    const profileDraft = await generateProfileDraftFromUploadedResume({
      userId: req.user!.id,
      file: req.file,
    });

    res.status(201).json({
      status: "success",
      data: {
        profileDraft,
      },
    });
  },
);
