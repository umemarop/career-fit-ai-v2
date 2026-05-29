import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { type Role } from "../generated/prisma/enums.js";
import { env } from "../config/env.js";
import { AppError } from "./appError.js";

type AccessTokenPayload = {
  userId: string;
  role: Role;
  sessionId: string;
};

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  console.log("JWT_EXPIRES_IN:", env.JWT_EXPIRES_IN);
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as JwtExpiresIn,
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};
