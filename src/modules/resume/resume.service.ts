import fs from "fs";
import path from "path";

import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../prisma/client.js";

import { AppError } from "../../utils/appError.js";
import { extractResumeText } from "./resume.parser.js";
import type { ResumeProfileDraft } from "./resume.validation.js";

const resumeUploadDir = path.join("uploads", "resumes");

type UpsertResumeInput = {
  userId: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  rawText?: string | null;
};

type SaveUploadedResumeInput = {
  userId: string;
  file: Express.Multer.File;
};

export const upsertResume = async (input: UpsertResumeInput) => {
  const resume = await prisma.resume.upsert({
    where: {
      userId: input.userId,
    },

    create: {
      userId: input.userId,

      originalName: input.originalName,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType,
      size: input.size,

      rawText: input.rawText ?? null,
      parsedJson: Prisma.JsonNull,
    },

    update: {
      originalName: input.originalName,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType,
      size: input.size,

      // 새 Resume 업로드 시 기존 AI 결과 초기화
      rawText: input.rawText ?? null,
      parsedJson: Prisma.JsonNull,
    },
  });

  return resume;
};

export const saveUploadedResume = async ({
  userId,
  file,
}: SaveUploadedResumeInput) => {
  await fs.promises.mkdir(resumeUploadDir, { recursive: true });

  const filename = `resume-${userId}-${Date.now()}.pdf`;
  const filePath = path.join(resumeUploadDir, filename);
  const pdfBuffer = file.buffer;

  await fs.promises.writeFile(filePath, pdfBuffer);

  const rawText = await extractResumeText(pdfBuffer);

  const fileUrl = `/uploads/resumes/${filename}`;

  return upsertResume({
    userId,
    originalName: file.originalname,
    fileUrl,
    mimeType: file.mimetype,
    size: file.size,
    rawText,
  });
};

export const getMyResume = async (userId: string) => {
  const resume = await prisma.resume.findUnique({
    where: {
      userId,
    },
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  return resume;
};

export const updateResumeParsedJson = async (
  userId: string,
  parsedJson: ResumeProfileDraft,
) => {
  return prisma.resume.update({
    where: {
      userId,
    },
    data: {
      parsedJson,
    },
  });
};

export const deleteMyResume = async (userId: string) => {
  const resume = await prisma.resume.findUnique({
    where: {
      userId,
    },
  });

  if (!resume) {
    return null;
  }

  await prisma.resume.delete({
    where: {
      userId,
    },
  });

  return null;
};
