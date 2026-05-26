import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";

type CreateTestUserInput = {
  email?: string;
  password?: string;
};

export const defaultTestPassword = "Password123!";

const createUniqueEmail = () => {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
};

export const createTestUser = async (input: CreateTestUserInput = {}) => {
  const email = input.email ?? createUniqueEmail();
  const password = input.password ?? defaultTestPassword;

  const res = await request(app).post("/api/v2/auth/register").send({
    email,
    password,
    confirmPassword: password,
  });

  return {
    res,
    email,
    password,
  };
};

export const verifyTestUserEmail = async (email: string) => {
  return prisma.user.update({
    where: { email },
    data: {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
};

export const loginTestUser = async (email: string, password: string) => {
  const res = await request(app).post("/api/v2/auth/login").send({
    email,
    password,
  });

  const accessToken = res.body?.data?.accessToken ?? res.body?.accessToken;

  return {
    res,
    accessToken,
    authHeader: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const createUserAndLogin = async (input: CreateTestUserInput = {}) => {
  const created = await createTestUser(input);

  const loggedIn = await loginTestUser(created.email, created.password);

  return {
    ...created,
    ...loggedIn,
  };
};

export const createVerifiedUserAndLogin = async (
  input: CreateTestUserInput = {},
) => {
  const created = await createTestUser(input);

  await verifyTestUserEmail(created.email);

  const loggedIn = await loginTestUser(created.email, created.password);

  return {
    ...created,
    ...loggedIn,
  };
};
