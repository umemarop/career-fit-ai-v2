import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter"),
      confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});
export type RegisterInput = z.infer<typeof registerSchema>["body"];

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

export const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1, "Refresh token is required"),
    })
    .strict(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];

export const logoutSchema = refreshTokenSchema;

export type LogoutInput = RefreshTokenInput;
