import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { prisma } from "../../prisma/client.js";
import {
  manualApplicationInput,
  updateApplicationInput,
  validStatusUpdateInput,
  invalidStatusUpdateInput,
} from "../fixtures/application.fixture.js";

const { app } = await import("../../app.js");
const { createAndLoginTestUser } = await import("../helpers/auth.helper.js");
const { createTestJobAnalysis } =
  await import("../helpers/jobAnalysis.helper.js");

describe("Application Integration Test", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await prisma.application.deleteMany();
    await prisma.jobAnalysis.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("POST /api/v1/applications", () => {
    it("should create manual application", async () => {
      const { user, token } = await createAndLoginTestUser();

      const res = await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .send(manualApplicationInput)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        userId: user.id,
        jobAnalysisId: null,
        jobTitle: manualApplicationInput.jobTitle,
        companyName: manualApplicationInput.companyName,
        location: manualApplicationInput.location,
        jobUrl: manualApplicationInput.jobUrl,
        status: manualApplicationInput.status,
        notes: manualApplicationInput.notes,
        nextStep: manualApplicationInput.nextStep,
      });

      const savedApplication = await prisma.application.findUnique({
        where: { id: res.body.data.id },
      });

      expect(savedApplication).not.toBeNull();
      expect(savedApplication?.userId).toBe(user.id);
    });

    it("should fail when token is missing", async () => {
      const res = await request(app)
        .post("/api/v1/applications")
        .send(manualApplicationInput)
        .expect(401);

      expect(res.body.status).toBe("fail");
    });

    it("should fail when creating manual application without jobTitle", async () => {
      const { token } = await createAndLoginTestUser();

      const res = await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .send({
          companyName: "CareerFit",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
    });

    it("should create application from job analysis", async () => {
      const { user, token } = await createAndLoginTestUser();
      const jobAnalysis = await createTestJobAnalysis(user.id);

      const res = await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobAnalysisId: jobAnalysis.id,
          status: "SAVED",
          notes: "Created from analysis",
        })
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        userId: user.id,
        jobAnalysisId: jobAnalysis.id,
        jobTitle: jobAnalysis.jobTitle,
        companyName: jobAnalysis.companyName,
        location: jobAnalysis.location,
        status: "SAVED",
        notes: "Created from analysis",
      });
    });

    it("should fail when using another user's jobAnalysisId", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      const otherUserJobAnalysis = await createTestJobAnalysis(userB.user.id);

      const res = await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${userA.token}`)
        .send({
          jobAnalysisId: otherUserJobAnalysis.id,
        })
        .expect(404);

      expect(res.body.status).toBe("fail");
    });

    it("should fail when application already exists for job analysis", async () => {
      const { user, token } = await createAndLoginTestUser();
      const jobAnalysis = await createTestJobAnalysis(user.id);

      await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobAnalysisId: jobAnalysis.id,
        })
        .expect(201);

      const res = await request(app)
        .post("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobAnalysisId: jobAnalysis.id,
        })
        .expect(409);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/v1/applications", () => {
    it("should get my applications", async () => {
      const { user, token } = await createAndLoginTestUser();

      await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          companyName: "CareerFit",
          location: "Brisbane",
          jobUrl: "https://example.com/jobs/backend",
          status: "SAVED",
          notes: "Test notes",
          nextStep: "Apply soon",
        },
      });

      const res = await request(app)
        .get("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta).toMatchObject({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      expect(res.body.data[0]).toMatchObject({
        jobTitle: "Backend Developer",
        companyName: "CareerFit",
        location: "Brisbane",
        status: "SAVED",
        nextStep: "Apply soon",
      });
    });

    it("should not return other user's applications", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      await prisma.application.create({
        data: {
          userId: userA.user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      await prisma.application.create({
        data: {
          userId: userB.user.id,
          jobTitle: "Frontend Developer",
          status: "APPLIED",
        },
      });

      const res = await request(app)
        .get("/api/v1/applications")
        .set("Authorization", `Bearer ${userA.token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].jobTitle).toBe("Backend Developer");
    });

    it("should fail when token is missing", async () => {
      const res = await request(app).get("/api/v1/applications").expect(401);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/v1/applications/:id", () => {
    it("should get application detail by id", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          companyName: "CareerFit",
          location: "Brisbane",
          jobUrl: "https://example.com/jobs/backend",
          status: "SAVED",
          notes: "Test notes",
          nextStep: "Apply soon",
        },
      });

      const res = await request(app)
        .get(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        id: application.id,
        userId: user.id,
        jobTitle: "Backend Developer",
        companyName: "CareerFit",
        location: "Brisbane",
        jobUrl: "https://example.com/jobs/backend",
        status: "SAVED",
        notes: "Test notes",
        nextStep: "Apply soon",
      });
    });

    it("should fail when application id is invalid uuid", async () => {
      const { token } = await createAndLoginTestUser();

      const res = await request(app)
        .get("/api/v1/applications/invalid-id")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(res.body.status).toBe("fail");
    });

    it("should return 404 when application does not exist", async () => {
      const { token } = await createAndLoginTestUser();

      const notExistingId = crypto.randomUUID();

      const res = await request(app)
        .get(`/api/v1/applications/${notExistingId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });

    it("should not allow access to another user's application", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: userB.user.id,
          jobTitle: "Frontend Developer",
          status: "APPLIED",
        },
      });

      const res = await request(app)
        .get(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${userA.token}`)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("PATCH /api/v1/applications/:id", () => {
    it("should update application", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      const res = await request(app)
        .patch(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateApplicationInput)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject(updateApplicationInput);

      const updatedApplication = await prisma.application.findUnique({
        where: { id: application.id },
      });

      expect(updatedApplication?.jobTitle).toBe(
        updateApplicationInput.jobTitle,
      );
      expect(updatedApplication?.companyName).toBe(
        updateApplicationInput.companyName,
      );
    });

    it("should fail when update body is empty", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      const res = await request(app)
        .patch(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(res.body.status).toBe("fail");
    });

    it("should not allow updating another user's application", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: userB.user.id,
          jobTitle: "Frontend Developer",
          status: "APPLIED",
        },
      });

      const res = await request(app)
        .patch(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${userA.token}`)
        .send(updateApplicationInput)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("PATCH /api/v1/applications/:id/status", () => {
    it("should update application status", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      const res = await request(app)
        .patch(`/api/v1/applications/${application.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send(validStatusUpdateInput)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe(validStatusUpdateInput.status);

      const updatedApplication = await prisma.application.findUnique({
        where: { id: application.id },
      });

      expect(updatedApplication?.status).toBe(validStatusUpdateInput.status);
    });

    it("should fail when status is invalid", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      const res = await request(app)
        .patch(`/api/v1/applications/${application.id}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidStatusUpdateInput)
        .expect(400);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("DELETE /api/v1/applications/:id", () => {
    it("should delete application with soft delete", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      await request(app)
        .delete(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const deletedApplication = await prisma.application.findUnique({
        where: { id: application.id },
      });

      expect(deletedApplication?.deletedAt).not.toBeNull();
    });

    it("should not show deleted application in list", async () => {
      const { user, token } = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          jobTitle: "Backend Developer",
          status: "SAVED",
        },
      });

      await prisma.application.update({
        where: { id: application.id },
        data: {
          deletedAt: new Date(),
        },
      });

      const res = await request(app)
        .get("/api/v1/applications")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(0);
      expect(res.body.meta.total).toBe(0);
    });

    it("should not allow deleting another user's application", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      const application = await prisma.application.create({
        data: {
          userId: userB.user.id,
          jobTitle: "Frontend Developer",
          status: "APPLIED",
        },
      });

      const res = await request(app)
        .delete(`/api/v1/applications/${application.id}`)
        .set("Authorization", `Bearer ${userA.token}`)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });
  });
});
