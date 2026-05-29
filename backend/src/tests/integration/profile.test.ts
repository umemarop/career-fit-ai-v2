import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";
import { createVerifiedUserAndLogin } from "../helpers/auth.helper.js";

const createProfilePayload = {
  skills: ["JavaScript", "TypeScript", "Node.js"],
  experienceLevel: "JUNIOR",
  workEligibility: "FULL_WORK_RIGHTS",
  location: "Brisbane, Australia",
  targetRole: "Backend Developer",
  desiredRoles: ["Backend Developer", "Full Stack Developer"],
  careerGoals: "Build production-ready backend systems",
  preferredJobType: "FULL_TIME",
  remotePreference: "HYBRID",
};

const updateProfilePayload = {
  skills: ["TypeScript", "Express", "Prisma"],
  experienceLevel: "MID",
  workEligibility: "FULL_WORK_RIGHTS",
  location: "Sydney, Australia",
  targetRole: "Software Engineer",
  desiredRoles: ["Software Engineer"],
  careerGoals: "Grow into a strong backend engineer",
  preferredJobType: "FULL_TIME",
  remotePreference: "REMOTE",
};

describe("Profile API", () => {
  describe("GET /api/v2/profile/me", () => {
    it("should reject request without access token", async () => {
      const res = await request(app).get("/api/v2/profile/me");

      expect(res.status).toBe(401);
    });

    it("should return current user's profile", async () => {
      const { authHeader } = await createVerifiedUserAndLogin();

      await request(app)
        .put("/api/v2/profile")
        .set(authHeader)
        .send(createProfilePayload);

      const res = await request(app).get("/api/v2/profile/me").set(authHeader);

      expect(res.status).toBe(200);

      const profile = res.body?.data?.profile ?? res.body?.profile;

      expect(profile).toBeDefined();
      expect(profile.targetRole).toBe(createProfilePayload.targetRole);
      expect(profile.experienceLevel).toBe(
        createProfilePayload.experienceLevel,
      );
      expect(profile.skills).toEqual(createProfilePayload.skills);
    });
  });

  describe("PUT /api/v2/profile", () => {
    it("should create a profile for verified user", async () => {
      const { authHeader, email } = await createVerifiedUserAndLogin();

      const res = await request(app)
        .put("/api/v2/profile")
        .set(authHeader)
        .send(createProfilePayload);

      expect(res.status).toBe(200);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      const profile = await prisma.profile.findUnique({
        where: { userId: user!.id },
      });

      expect(profile).not.toBeNull();
      expect(profile?.targetRole).toBe(createProfilePayload.targetRole);
      expect(profile?.experienceLevel).toBe(
        createProfilePayload.experienceLevel,
      );
      expect(profile?.skills).toEqual(createProfilePayload.skills);
    });

    it("should update existing profile for verified user", async () => {
      const { authHeader, email } = await createVerifiedUserAndLogin();

      await request(app)
        .put("/api/v2/profile")
        .set(authHeader)
        .send(createProfilePayload);

      const res = await request(app)
        .put("/api/v2/profile")
        .set(authHeader)
        .send(updateProfilePayload);

      expect(res.status).toBe(200);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      const profile = await prisma.profile.findUnique({
        where: { userId: user!.id },
      });

      expect(profile).not.toBeNull();
      expect(profile?.targetRole).toBe(updateProfilePayload.targetRole);
      expect(profile?.experienceLevel).toBe(
        updateProfilePayload.experienceLevel,
      );
      expect(profile?.skills).toEqual(updateProfilePayload.skills);
      expect(profile?.location).toBe(updateProfilePayload.location);
    });
  });

  describe("DELETE /api/v2/profile", () => {
    it("should delete current user's profile", async () => {
      const { authHeader, email } = await createVerifiedUserAndLogin();

      await request(app)
        .put("/api/v2/profile")
        .set(authHeader)
        .send(createProfilePayload);

      const deleteRes = await request(app)
        .delete("/api/v2/profile")
        .set(authHeader);

      expect(deleteRes.status).toBe(204);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      const profile = await prisma.profile.findUnique({
        where: { userId: user!.id },
      });

      expect(profile).toBeNull();
    });
  });
});
