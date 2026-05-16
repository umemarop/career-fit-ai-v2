import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "./appError.js";
import { env } from "../config/env.js";
import { type Role } from "../generated/prisma/enums.js";

type TokenPayload = {
  userId: string;
  role: Role;
};

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as JwtExpiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};
