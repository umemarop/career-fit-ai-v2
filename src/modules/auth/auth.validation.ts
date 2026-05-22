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
      refreshToken: z.string().optional(),
    })
    .strict()
    .optional(),
});

export type RefreshTokenInput = {
  refreshToken: string;
};
export const logoutSchema = refreshTokenSchema;
export type LogoutInput = RefreshTokenInput;

export const verifyEmailSchema = z.object({
  query: z
    .object({
      token: z.string().min(1, "Verification token is required"),
    })
    .strict(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["query"];

export const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email format"),
    })
    .strict(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(1, "Reset token is required"),
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

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
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

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
