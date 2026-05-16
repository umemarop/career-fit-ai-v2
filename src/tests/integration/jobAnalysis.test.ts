import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { prisma } from "../../prisma/client.js";
import {
  validJobDescription,
  mockGuestJobAnalysisAIResponse,
  mockUserJobAnalysisAIResponse,
  invalidAIResponse,
} from "../fixtures/jobAnalysis.fixture.js";

const mockedGenerateAIJson = jest.fn<() => Promise<unknown>>();

jest.unstable_mockModule("../../services/ai.service.js", () => ({
  generateAIJson: mockedGenerateAIJson,
}));

const { app } = await import("../../app.js");
const { createAndLoginTestUser } = await import("../helpers/auth.helper.js");
const { createTestProfile } = await import("../helpers/profile.helper.js");

describe("JobAnalysis Integration Test", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await prisma.jobAnalysis.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("POST /api/v1/job-analysis/guest", () => {
    it("should analyze job description for guest user", async () => {
      mockedGenerateAIJson.mockResolvedValue(mockGuestJobAnalysisAIResponse);

      const res = await request(app)
        .post("/api/v1/job-analysis/guest")
        .send({
          jobDescription: validJobDescription,
        })
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual(mockGuestJobAnalysisAIResponse);

      expect(mockedGenerateAIJson).toHaveBeenCalledTimes(1);
    });

    it("should fail when guest jobDescription is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/job-analysis/guest")
        .send({
          jobDescription: "too short",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(mockedGenerateAIJson).not.toHaveBeenCalled();
    });

    it("should fail when guest AI response format is invalid", async () => {
      mockedGenerateAIJson.mockResolvedValue(invalidAIResponse);

      const res = await request(app)
        .post("/api/v1/job-analysis/guest")
        .send({
          jobDescription: validJobDescription,
        })
        .expect(500);

      expect(res.body.status).toBe("error");
      expect(mockedGenerateAIJson).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/v1/job-analysis", () => {
    it("should analyze and save job analysis for authenticated user", async () => {
      const { user, token } = await createAndLoginTestUser();

      await createTestProfile(user.id);

      mockedGenerateAIJson.mockResolvedValue(mockUserJobAnalysisAIResponse);

      const res = await request(app)
        .post("/api/v1/job-analysis")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobDescription: validJobDescription,
        })
        .expect(201);

      expect(res.body.status).toBe("success");

      expect(res.body.data).toMatchObject({
        userId: user.id,
        jobDescription: validJobDescription.trim(),
        jobTitle: mockUserJobAnalysisAIResponse.jobTitle,
        companyName: mockUserJobAnalysisAIResponse.companyName,
        location: mockUserJobAnalysisAIResponse.location,
        fitScore: mockUserJobAnalysisAIResponse.fitScore,
        recommendation: mockUserJobAnalysisAIResponse.recommendation,
        result: mockUserJobAnalysisAIResponse.result,
      });

      expect(mockedGenerateAIJson).toHaveBeenCalledTimes(1);

      const savedAnalysis = await prisma.jobAnalysis.findUnique({
        where: {
          id: res.body.data.id,
        },
      });

      expect(savedAnalysis).not.toBeNull();
      expect(savedAnalysis?.userId).toBe(user.id);
      expect(savedAnalysis?.fitScore).toBe(82);
      expect(savedAnalysis?.recommendation).toBe("APPLY");
    });

    it("should fail when token is missing", async () => {
      const res = await request(app)
        .post("/api/v1/job-analysis")
        .send({
          jobDescription: validJobDescription,
        })
        .expect(401);

      expect(res.body.status).toBe("fail");
      expect(mockedGenerateAIJson).not.toHaveBeenCalled();
    });

    it("should fail when jobDescription is invalid", async () => {
      const { token } = await createAndLoginTestUser();

      const res = await request(app)
        .post("/api/v1/job-analysis")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobDescription: "too short",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(mockedGenerateAIJson).not.toHaveBeenCalled();
    });

    it("should fail when user profile does not exist", async () => {
      const { token } = await createAndLoginTestUser();

      const res = await request(app)
        .post("/api/v1/job-analysis")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobDescription: validJobDescription,
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(mockedGenerateAIJson).not.toHaveBeenCalled();
    });

    it("should fail when user AI response format is invalid", async () => {
      const { user, token } = await createAndLoginTestUser();

      await createTestProfile(user.id);

      mockedGenerateAIJson.mockResolvedValue(invalidAIResponse);

      const res = await request(app)
        .post("/api/v1/job-analysis")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobDescription: validJobDescription,
        })
        .expect(500);

      expect(res.body.status).toBe("error");
      expect(mockedGenerateAIJson).toHaveBeenCalledTimes(1);

      const count = await prisma.jobAnalysis.count({
        where: {
          userId: user.id,
        },
      });

      expect(count).toBe(0);
    });
  });

  describe("GET /api/v1/job-analysis", () => {
    it("should get my job analyses", async () => {
      const { user, token } = await createAndLoginTestUser();

      await prisma.jobAnalysis.create({
        data: {
          userId: user.id,
          jobDescription: validJobDescription.trim(),
          jobTitle: "Backend Developer",
          companyName: null,
          location: "Brisbane",
          fitScore: 82,
          recommendation: "APPLY",
          result: mockUserJobAnalysisAIResponse.result,
        },
      });

      const res = await request(app)
        .get("/api/v1/job-analysis")
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
        companyName: null,
        location: "Brisbane",
        fitScore: 82,
        recommendation: "APPLY",
      });
    });

    it("should not return other user's job analyses", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      await prisma.jobAnalysis.create({
        data: {
          userId: userA.user.id,
          jobDescription: validJobDescription.trim(),
          jobTitle: "Backend Developer",
          companyName: null,
          location: "Brisbane",
          fitScore: 82,
          recommendation: "APPLY",
          result: mockUserJobAnalysisAIResponse.result,
        },
      });

      await prisma.jobAnalysis.create({
        data: {
          userId: userB.user.id,
          jobDescription: validJobDescription.trim(),
          jobTitle: "Frontend Developer",
          companyName: null,
          location: "Sydney",
          fitScore: 65,
          recommendation: "CONSIDER",
          result: mockUserJobAnalysisAIResponse.result,
        },
      });

      const res = await request(app)
        .get("/api/v1/job-analysis")
        .set("Authorization", `Bearer ${userA.token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].jobTitle).toBe("Backend Developer");
    });

    it("should fail when token is missing", async () => {
      const res = await request(app).get("/api/v1/job-analysis").expect(401);

      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/v1/job-analysis/:id", () => {
    it("should get job analysis detail by id", async () => {
      const { user, token } = await createAndLoginTestUser();

      const analysis = await prisma.jobAnalysis.create({
        data: {
          userId: user.id,
          jobDescription: validJobDescription.trim(),
          jobTitle: "Backend Developer",
          companyName: null,
          location: "Brisbane",
          fitScore: 82,
          recommendation: "APPLY",
          result: mockUserJobAnalysisAIResponse.result,
        },
      });

      const res = await request(app)
        .get(`/api/v1/job-analysis/${analysis.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        id: analysis.id,
        jobTitle: "Backend Developer",
        companyName: null,
        location: "Brisbane",
        jobDescription: validJobDescription.trim(),
        fitScore: 82,
        recommendation: "APPLY",
        result: mockUserJobAnalysisAIResponse.result,
      });
    });

    it("should fail when job analysis id is invalid uuid", async () => {
      const { token } = await createAndLoginTestUser();

      const res = await request(app)
        .get("/api/v1/job-analysis/invalid-id")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(res.body.status).toBe("fail");
    });

    it("should return 404 when job analysis does not exist", async () => {
      const { token } = await createAndLoginTestUser();

      const notExistingId = crypto.randomUUID();

      const res = await request(app)
        .get(`/api/v1/job-analysis/${notExistingId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });

    it("should not allow access to other user's job analysis", async () => {
      const userA = await createAndLoginTestUser();
      const userB = await createAndLoginTestUser();

      const analysis = await prisma.jobAnalysis.create({
        data: {
          userId: userB.user.id,
          jobDescription: validJobDescription.trim(),
          jobTitle: "Frontend Developer",
          companyName: null,
          location: "Sydney",
          fitScore: 65,
          recommendation: "CONSIDER",
          result: mockUserJobAnalysisAIResponse.result,
        },
      });

      const res = await request(app)
        .get(`/api/v1/job-analysis/${analysis.id}`)
        .set("Authorization", `Bearer ${userA.token}`)
        .expect(404);

      expect(res.body.status).toBe("fail");
    });
  });
});
