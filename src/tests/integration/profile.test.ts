import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";
import { createAndLoginTestUser } from "../helpers/auth.helper.js";

const validProfileInput = {
  skills: ["Node.js", "TypeScript"],
  experienceLevel: "JUNIOR",
  workEligibility: "FULL_WORK_RIGHTS",
  location: "Brisbane",
  targetRole: "Backend Developer",
};

describe("Profile Integration Test", () => {
  beforeEach(async () => {
    await prisma.application.deleteMany();
    await prisma.jobAnalysis.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("POST /api/v1/profile", () => {
    it("should create a profile for authenticated user", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-create@example.com",
      );

      const res = await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.profile.skills).toEqual(validProfileInput.skills);
      expect(res.body.data.profile.experienceLevel).toBe("JUNIOR");
      expect(res.body.data.profile.location).toBe("Brisbane");

      const profile = await prisma.profile.findFirst({
        where: {
          location: "Brisbane",
        },
      });

      expect(profile).not.toBeNull();
      expect(profile?.targetRole).toBe("Backend Developer");
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .post("/api/v1/profile")
        .send(validProfileInput);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with invalid input", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-invalid@example.com",
      );

      const res = await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          skills: [],
          experienceLevel: "INVALID_LEVEL",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should fail when profile already exists", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-duplicate@example.com",
      );

      await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      const res = await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/v1/profile", () => {
    it("should get profile for authenticated user", async () => {
      const { token } = await createAndLoginTestUser("profile-get@example.com");

      await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      const res = await request(app)
        .get("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.profile.skills).toEqual(validProfileInput.skills);
      expect(res.body.data.profile.targetRole).toBe("Backend Developer");
    });

    it("should fail when profile does not exist", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-not-found@example.com",
      );

      const res = await request(app)
        .get("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("PATCH /api/v1/profile", () => {
    it("should update profile for authenticated user", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-update@example.com",
      );

      await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      const res = await request(app)
        .patch("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          location: "Sydney",
          targetRole: "Full Stack Developer",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.profile.location).toBe("Sydney");
      expect(res.body.data.profile.targetRole).toBe("Full Stack Developer");

      const profile = await prisma.profile.findFirst({
        where: {
          location: "Sydney",
        },
      });

      expect(profile).not.toBeNull();
      expect(profile?.targetRole).toBe("Full Stack Developer");
    });

    it("should fail when profile does not exist", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-update-not-found@example.com",
      );

      const res = await request(app)
        .patch("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          location: "Melbourne",
        });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("should fail when update body is empty", async () => {
      const { token } = await createAndLoginTestUser(
        "profile-empty-update@example.com",
      );

      await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(validProfileInput);

      const res = await request(app)
        .patch("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });
});
