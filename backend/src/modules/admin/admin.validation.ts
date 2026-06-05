import { z } from "zod";
import { PAGINATION_DEFAULTS } from "../../constants/pagination.constants.js";
const roleValues = ["USER", "ADMIN"] as const;
const userStatusValues = ["ACTIVE", "DISABLED"] as const;

export const getAdminUsersSchema = z.object({
  query: z
    .object({
      keyword: z.string().trim().min(1).optional(),

      role: z.enum(roleValues).optional(),

      verified: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),

      status: z.enum(userStatusValues).optional(),

      page: z.coerce.number().int().min(1).optional(),

      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(PAGINATION_DEFAULTS.MAX_LIMIT)
        .optional(),

      sort: z
        .enum([
          "latest",
          "oldest",
          "email_asc",
          "email_desc",
          "role_asc",
          "role_desc",
        ])
        .optional(),
    })
    .strict(),
});

export const getAdminUserByIdSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid user id"),
    })
    .strict(),
});

export const updateAdminUserRoleSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid user id"),
    })
    .strict(),

  body: z
    .object({
      role: z.enum(roleValues),
    })
    .strict(),
});

export const updateAdminUserStatusSchema = z.object({
  params: z
    .object({
      id: z.string().uuid("Invalid user id"),
    })
    .strict(),

  body: z
    .object({
      status: z.enum(userStatusValues),
    })
    .strict(),
});

export type GetAdminUsersQuery = z.infer<typeof getAdminUsersSchema>["query"];

export type GetAdminUserByIdParams = z.infer<
  typeof getAdminUserByIdSchema
>["params"];

export type UpdateAdminUserRoleParams = z.infer<
  typeof updateAdminUserRoleSchema
>["params"];

export type UpdateAdminUserRoleInput = z.infer<
  typeof updateAdminUserRoleSchema
>["body"];

export type UpdateAdminUserStatusParams = z.infer<
  typeof updateAdminUserStatusSchema
>["params"];

export type UpdateAdminUserStatusInput = z.infer<
  typeof updateAdminUserStatusSchema
>["body"];
