import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import {
  deleteMyResume,
  getMyResume,
  saveUploadedResume,
} from "./resume.service.js";

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Resume file is required", 400);
  }

  const resume = await saveUploadedResume({
    userId: req.user!.id,
    file: req.file,
  });

  res.status(201).json({
    status: "success",
    data: {
      resume,
    },
  });
});

export const getResumeMe = catchAsync(async (req: Request, res: Response) => {
  const resume = await getMyResume(req.user!.id);

  res.status(200).json({
    status: "success",
    data: {
      resume,
    },
  });
});

export const deleteResume = catchAsync(async (req: Request, res: Response) => {
  await deleteMyResume(req.user!.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
