import { env } from "./env.js";

export const refreshTokenCookieName = "refreshToken";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v2/auth",
};
