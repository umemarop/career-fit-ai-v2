import { prisma } from "../../prisma/client.js";

export const createTestJobAnalysis = async (userId: string) => {
  return prisma.jobAnalysis.create({
    data: {
      userId,
      jobDescription:
        "Backend developer role with Node.js and PostgreSQL experience.",

      jobTitle: "Backend Developer",
      companyName: "CareerFit",
      location: "Brisbane",

      fitScore: 82,
      recommendation: "APPLY",

      result: {
        matchedSkills: ["Node.js", "PostgreSQL"],
        missingSkills: ["AWS"],
        strengths: ["Backend API development"],
        risks: ["Limited cloud experience"],
        resumeTips: ["Highlight backend projects"],
        actionPlan: ["Prepare API project examples"],
      },
    },
  });
};
