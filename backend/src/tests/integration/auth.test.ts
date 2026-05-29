import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";
import {
  createTestUser,
  createUserAndLogin,
  defaultTestPassword,
} from "../helpers/auth.helper.js";

describe("Auth API", () => {
  describe("POST /api/v2/auth/register", () => {
    it("should register a new user", async () => {
      const email = "register@example.com";

      const res = await request(app).post("/api/v2/auth/register").send({
        email,
        password: defaultTestPassword,
        confirmPassword: defaultTestPassword,
      });

      expect(res.status).toBe(201);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe(email);
      expect(user?.isEmailVerified).toBe(false);
      expect(user?.emailVerifiedAt).toBeNull();
      expect(user?.password).not.toBe(defaultTestPassword);
    });

    it("should reject duplicate email registration", async () => {
      const email = "duplicate@example.com";

      await createTestUser({
        email,
        password: defaultTestPassword,
      });

      const res = await request(app).post("/api/v2/auth/register").send({
        email,
        password: defaultTestPassword,
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v2/auth/login", () => {
    it("should login a registered user without email verification", async () => {
      const { email, password } = await createTestUser();

      const res = await request(app).post("/api/v2/auth/login").send({
        email,
        password,
      });

      expect(res.status).toBe(200);

      const accessToken = res.body?.data?.accessToken ?? res.body?.accessToken;

      expect(accessToken).toBeDefined();
    });

    it("should reject login with wrong password", async () => {
      const { email } = await createTestUser();

      const res = await request(app).post("/api/v2/auth/login").send({
        email,
        password: "WrongPassword123!",
      });

      expect(res.status).toBe(401);
    });

    it("should reject login with non-existing email", async () => {
      const res = await request(app).post("/api/v2/auth/login").send({
        email: "notfound@example.com",
        password: defaultTestPassword,
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v2/auth/me", () => {
    it("should reject request without access token", async () => {
      const res = await request(app).get("/api/v2/auth/me");

      expect(res.status).toBe(401);
    });

    it("should return current user with valid access token", async () => {
      const { authHeader, email } = await createUserAndLogin();

      const res = await request(app).get("/api/v2/auth/me").set(authHeader);

      expect(res.status).toBe(200);

      const userEmail = res.body?.data?.user?.email ?? res.body?.user?.email;

      expect(userEmail).toBe(email);
    });
  });
});
