import { PDFParse } from "pdf-parse";

import { AppError } from "../../utils/appError.js";
import { logger } from "../../utils/logger.js";

const normalizeResumeText = (text: string): string => {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const extractResumeText = async (buffer: Buffer): Promise<string> => {
  const MIN_RESUME_TEXT_LENGTH = 100;

  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    const rawText = normalizeResumeText(result.text);

    if (!rawText) {
      logger.warn("Resume PDF text extraction returned empty text", {
        bufferSize: buffer.length,
      });

      throw new AppError("Could not extract text from resume PDF", 400);
    }

    if (rawText.length < MIN_RESUME_TEXT_LENGTH) {
      logger.warn("Resume PDF text extraction returned insufficient text", {
        bufferSize: buffer.length,
        textLength: rawText.length,
        minLength: MIN_RESUME_TEXT_LENGTH,
      });

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

    logger.warn("Resume PDF parsing failed", {
      bufferSize: buffer.length,
      error: error instanceof Error ? error.message : error,
    });

    throw new AppError("Failed to parse resume PDF", 400);
  }
};
