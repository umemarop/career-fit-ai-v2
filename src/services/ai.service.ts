import { gemini } from "../config/gemini.js";
import { AppError } from "../utils/appError.js";

export const generateAIJson = async (prompt: string): Promise<unknown> => {
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
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new AppError("AI response is not valid JSON", 500);
  }
};
