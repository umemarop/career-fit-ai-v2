import bcrypt from "bcryptjs";

import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/appError.js";
import { generateToken } from "../../utils/jwt.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

export const registerUser = async (input: RegisterInput) => {
  const { email, password } = input;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken({ userId: user.id, role: user.role });
  return { user: safeUser, token };
};

export const getMeUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
