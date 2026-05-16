import request from "supertest";

export const defaultPassword = "Password123";

export const createUniqueTestEmail = () => {
  return `test-${crypto.randomUUID()}@example.com`;
};

const getApp = async () => {
  const { app } = await import("../../app.js");
  return app;
};

export const registerTestUser = async (email = createUniqueTestEmail()) => {
  const app = await getApp();

  return request(app).post("/api/v1/auth/register").send({
    email,
    password: defaultPassword,
    confirmPassword: defaultPassword,
  });
};

export const loginTestUser = async (
  email: string,
  password = defaultPassword,
) => {
  const app = await getApp();

  return request(app).post("/api/v1/auth/login").send({
    email,
    password,
  });
};

export const createAndLoginTestUser = async (
  email = createUniqueTestEmail(),
) => {
  await registerTestUser(email);

  const loginRes = await loginTestUser(email);

  return {
    token: loginRes.body.data.token,
    user: loginRes.body.data.user,
  };
};
