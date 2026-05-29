import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../prisma/client.js";
import { createVerifiedUserAndLogin } from "../helpers/auth.helper.js";

const createApplicationPayload = {
  jobTitle: "Backend Developer",
  companyName: "CareerFit",
  location: "Brisbane, Australia",
  jobUrl: "https://example.com/jobs/backend-developer",
  status: "SAVED",
  notes: "Initial saved application",
  nextStep: "Review job description",
};

const updateApplicationPayload = {
  jobTitle: "Software Engineer",
  companyName: "CareerFit AI",
  location: "Sydney, Australia",
  jobUrl: "https://example.com/jobs/software-engineer",
  notes: "Updated application notes",
  nextStep: "Prepare resume",
};

describe("Application API", () => {
  describe("GET /api/v2/applications", () => {
    it("should reject request without access token", async () => {
      const res = await request(app).get("/api/v2/applications");

      expect(res.status).toBe(401);
    });

    it("should return current user's applications", async () => {
      const { authHeader } = await createVerifiedUserAndLogin();

      await request(app)
        .post("/api/v2/applications")
        .set(authHeader)
        .send(createApplicationPayload);

      const res = await request(app)
        .get("/api/v2/applications")
        .set(authHeader);

      expect(res.status).toBe(200);

      const applications =
        res.body?.data?.applications ??
        res.body?.applications ??
        res.body?.data ??
        [];

      expect(Array.isArray(applications)).toBe(true);
      expect(applications.length).toBeGreaterThanOrEqual(1);
      expect(applications[0].jobTitle).toBe(createApplicationPayload.jobTitle);
    });
  });

  describe("POST /api/v2/applications", () => {
    it("should create an application for verified user", async () => {
      const { authHeader, email } = await createVerifiedUserAndLogin();

      const res = await request(app)
        .post("/api/v2/applications")
        .set(authHeader)
        .send(createApplicationPayload);

      expect(res.status).toBe(201);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      const application = await prisma.application.findFirst({
        where: {
          userId: user!.id,
          jobTitle: createApplicationPayload.jobTitle,
        },
      });

      expect(application).not.toBeNull();
      expect(application?.jobTitle).toBe(createApplicationPayload.jobTitle);
      expect(application?.companyName).toBe(
        createApplicationPayload.companyName,
      );
      expect(application?.status).toBe(createApplicationPayload.status);
    });
  });

  describe("PATCH /api/v2/applications/:id", () => {
    it("should update current user's application", async () => {
      const { authHeader } = await createVerifiedUserAndLogin();

      const createRes = await request(app)
        .post("/api/v2/applications")
        .set(authHeader)
        .send(createApplicationPayload);

      const application =
        createRes.body?.data?.application ??
        createRes.body?.application ??
        createRes.body?.data;

      const res = await request(app)
        .patch(`/api/v2/applications/${application.id}`)
        .set(authHeader)
        .send(updateApplicationPayload);

      expect(res.status).toBe(200);

      const updated =
        res.body?.data?.application ?? res.body?.application ?? res.body?.data;

      expect(updated.jobTitle).toBe(updateApplicationPayload.jobTitle);
      expect(updated.companyName).toBe(updateApplicationPayload.companyName);
      expect(updated.location).toBe(updateApplicationPayload.location);
      expect(updated.notes).toBe(updateApplicationPayload.notes);
    });
  });

  describe("DELETE /api/v2/applications/:id", () => {
    it("should delete current user's application", async () => {
      const { authHeader } = await createVerifiedUserAndLogin();

      const createRes = await request(app)
        .post("/api/v2/applications")
        .set(authHeader)
        .send(createApplicationPayload);

      const application =
        createRes.body?.data?.application ??
        createRes.body?.application ??
        createRes.body?.data;

      const deleteRes = await request(app)
        .delete(`/api/v2/applications/${application.id}`)
        .set(authHeader);

      expect(deleteRes.status).toBe(204);

      const deletedApplication = await prisma.application.findUnique({
        where: { id: application.id },
      });

      expect(deletedApplication?.deletedAt).not.toBeNull();
    });
  });
});
