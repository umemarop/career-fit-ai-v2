import { gemini } from "../config/gemini.js";
import { AppError } from "../utils/appError.js";

const MAX_AI_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 500;

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const parseAIJson = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AppError("AI response is not valid JSON", 500);
  }
};

const generateAIJsonOnce = async (prompt: string): Promise<unknown> => {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text;

  if (!text) {
    throw new AppError("AI response is empty", 500);
  }

  return parseAIJson(text);
};

export const generateAIJson = async (prompt: string): Promise<unknown> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
    try {
      return await generateAIJsonOnce(prompt);
    } catch (error) {
      lastError = error;

      console.warn(
        `[AI RETRY] Attempt ${attempt} failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );

      if (attempt === MAX_AI_ATTEMPTS) {
        break;
      }

      await delay(BASE_RETRY_DELAY_MS * attempt);
    }
  }

  if (lastError instanceof AppError) {
    throw lastError;
  }

  throw new AppError("AI request failed", 500);
};
