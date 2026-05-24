import { PDFParse } from "pdf-parse";

import { AppError } from "../../utils/appError.js";

const normalizeResumeText = (text: string): string => {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const extractResumeText = async (buffer: Buffer): Promise<string> => {
  try {
    const MIN_RESUME_TEXT_LENGTH = 100;
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    const rawText = normalizeResumeText(result.text);

    if (!rawText) {
      throw new AppError("Could not extract text from resume PDF", 400);
    }

    if (!rawText) {
      throw new AppError("Could not extract text from resume PDF", 400);
    }

    if (rawText.length < MIN_RESUME_TEXT_LENGTH) {
      throw new AppError(
        "Resume PDF does not contain enough extractable text. Please upload a text-based PDF.",
        400,
      );
    }

    return rawText;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to parse resume PDF", 400);
  }
};
