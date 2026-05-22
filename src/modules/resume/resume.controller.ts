import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { deleteMyResume, getMyResume, upsertResume } from "./resume.service.js";

const resumeUploadDir = path.join("uploads", "resumes");

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Resume file is required", 400);
  }

  await fs.promises.mkdir(resumeUploadDir, { recursive: true });

  const filename = `resume-${req.user!.id}-${Date.now()}.pdf`;
  const filePath = path.join(resumeUploadDir, filename);

  await fs.promises.writeFile(filePath, req.file.buffer);

  const fileUrl = `/uploads/resumes/${filename}`;

  const resume = await upsertResume({
    userId: req.user!.id,
    originalName: req.file.originalname,
    fileUrl,
    mimeType: req.file.mimetype,
    size: req.file.size,
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
