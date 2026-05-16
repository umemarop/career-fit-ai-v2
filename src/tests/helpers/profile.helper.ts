import { prisma } from "../../prisma/client.js";

export const createTestProfile = async (userId: string) => {
  return prisma.profile.create({
    data: {
      userId,
      skills: ["JavaScript", "TypeScript", "Node.js", "PostgreSQL"],
      experienceLevel: "JUNIOR",
      workEligibility: "FULL_WORK_RIGHTS",
      location: "Brisbane",
      targetRole: "Backend Developer",
    },
  });
};
