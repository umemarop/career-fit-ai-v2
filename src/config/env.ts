import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  JWT_EXPIRES_IN: z.string().min(1),

  GEMINI_API_KEY: z.string().min(1),

  CORS_ORIGIN: z.string().default("*"),
});

export const env = envSchema.parse(process.env);
