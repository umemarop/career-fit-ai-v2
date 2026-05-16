import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";
import {
  registerTestUser,
  loginTestUser,
  defaultPassword,
} from "../helpers/auth.helper.js";

describe("Auth Integration Test", () => {
  beforeEach(async () => {
    await prisma.application.deleteMany();
    await prisma.jobAnalysis.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const res = await registerTestUser("test@example.com");

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe("test@example.com");
      expect(res.body.data.user.password).toBeUndefined();

      const user = await prisma.user.findUnique({
        where: { email: "test@example.com" },
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe("test@example.com");
      expect(user?.password).not.toBe(defaultPassword);
    });

    it("should fail when register input is invalid", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "invalid-email",
        password: defaultPassword,
        confirmPassword: defaultPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should fail when email already exists", async () => {
      await registerTestUser("duplicate@example.com");

      const res = await registerTestUser("duplicate@example.com");

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      await registerTestUser("login@example.com");

      const res = await loginTestUser("login@example.com");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe("login@example.com");
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.token).toBeDefined();
    });

    it("should fail login with wrong password", async () => {
      await registerTestUser("wrong-password@example.com");

      const res = await loginTestUser(
        "wrong-password@example.com",
        "WrongPassword123",
      );

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });
    it("should fail when login input is invalid", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "not-an-email",
        password: "",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should get current user with valid token", async () => {
      await registerTestUser("me@example.com");

      const loginRes = await loginTestUser("me@example.com");
      const token = loginRes.body.data.token;

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe("me@example.com");
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });
  });
});
