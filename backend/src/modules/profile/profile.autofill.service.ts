import { generateAIJson } from "../../services/ai.service.js";
import { AppError } from "../../utils/appError.js";

import { AiUsageType } from "../../generated/prisma/enums.js";
import {
  checkAiUsageLimit,
  recordAiUsage,
} from "../../services/ai-usage.service.js";

import {
  getMyResume,
  saveUploadedResume,
  updateResumeParsedJson,
} from "../resume/resume.service.js";

import { buildResumeProfileDraftPrompt } from "../resume/resume.prompt.js";

import {
  resumeProfileDraftSchema,
  type ResumeProfileDraft,
} from "../resume/resume.validation.js";

const validateResumeDraft = (aiResult: unknown): ResumeProfileDraft => {
  const validationResult = resumeProfileDraftSchema.safeParse(aiResult);

  if (!validationResult.success) {
    throw new AppError("AI response validation failed", 500);
  }

  return validationResult.data;
};

const generateDraftFromRawText = async (
  userId: string,
  rawText: string,
): Promise<ResumeProfileDraft> => {
  await checkAiUsageLimit({
    userId,
    type: AiUsageType.RESUME_AUTOFILL,
  });

  const prompt = buildResumeProfileDraftPrompt(rawText);

  const aiResult = await generateAIJson(prompt);

  const profileDraft = validateResumeDraft(aiResult);

  await updateResumeParsedJson(userId, profileDraft);

  await recordAiUsage({
    userId,
    type: AiUsageType.RESUME_AUTOFILL,
  });

  return profileDraft;
};

export const generateProfileDraftFromMyResume = async (
  userId: string,
): Promise<ResumeProfileDraft> => {
  const resume = await getMyResume(userId);

  if (!resume.rawText) {
    throw new AppError("Resume text has not been extracted yet", 400);
  }

  return generateDraftFromRawText(userId, resume.rawText);
};

type GenerateProfileDraftFromUploadedResumeInput = {
  userId: string;
  file: Express.Multer.File;
};

export const generateProfileDraftFromUploadedResume = async ({
  userId,
  file,
}: GenerateProfileDraftFromUploadedResumeInput): Promise<ResumeProfileDraft> => {
  const resume = await saveUploadedResume({
    userId,
    file,
  });

  if (!resume.rawText) {
    throw new AppError("Resume text has not been extracted yet", 400);
  }

  return generateDraftFromRawText(userId, resume.rawText);
};
