import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  JWT_EXPIRES_IN: z.string().min(1),

  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().default(30),

  GEMINI_API_KEY: z.string().min(1),

  CLIENT_URL: z.string().min(1).default("http://localhost:5173"),

  API_URL: z.string().min(1).default("http://localhost:3000/api/v2"),

  EMAIL_VERIFICATION_EXPIRES_MINUTES: z.coerce.number().positive(),

  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce.number().positive(),

  RESEND_API_KEY: z.string().min(1),

  EMAIL_FROM: z.string().min(1),
});

export const env = envSchema.parse(process.env);
