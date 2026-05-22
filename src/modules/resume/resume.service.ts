import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../prisma/client.js";

type UpsertResumeInput = {
  userId: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
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

      rawText: null,
      parsedJson: Prisma.JsonNull,
    },

    update: {
      originalName: input.originalName,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType,
      size: input.size,

      // 새 Resume 업로드 시 기존 AI 결과 초기화
      rawText: null,
      parsedJson: Prisma.JsonNull,
    },
  });

  return resume;
};

export const getMyResume = async (userId: string) => {
  const resume = await prisma.resume.findUnique({
    where: {
      userId,
    },
  });

  return resume;
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
