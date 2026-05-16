import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJSON(fileName: string) {
  const filePath = path.join(__dirname, "data", fileName);
  const fileContents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContents);
}

export async function clearDatabase(): Promise<void> {
  console.log("🧹 Clearing database...");

  await prisma.application.deleteMany();
  await prisma.jobAnalysis.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared");
}

type UserSeed = {
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

async function seedUsers(users: UserSeed[]): Promise<Map<string, string>> {
  const userMap = new Map<string, string>();
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
    userMap.set(user.email, createdUser.id);
  }
  return userMap;
}

type ProfileSeed = {
  userEmail: string;
  avatarUrl?: string;
  skills: string[];
  experienceLevel: "ENTRY" | "JUNIOR" | "MID" | "SENIOR";
  workEligibility?:
    | "FULL_WORK_RIGHTS"
    | "LIMITED_WORK_RIGHTS"
    | "NEEDS_SPONSORSHIP"
    | "NOT_SURE";
  location?: string;
  targetRole?: string;
};

async function seedProfiles(
  profiles: ProfileSeed[],
  userMap: Map<string, string>,
): Promise<void> {
  for (const profile of profiles) {
    const userId = userMap.get(profile.userEmail);

    if (!userId) {
      throw new Error(`User not found for email: ${profile.userEmail}`);
    }

    await prisma.profile.create({
      data: {
        userId,
        avatarUrl: profile.avatarUrl ?? null,
        skills: profile.skills,
        experienceLevel: profile.experienceLevel,
        workEligibility: profile.workEligibility ?? null,
        location: profile.location ?? null,
        targetRole: profile.targetRole ?? null,
      },
    });
  }
}

async function seedJobAnalyses(
  jobAnalyses: any[],
  userMap: Map<string, string>,
) {
  const analysisIds = [];

  for (const job of jobAnalyses) {
    const userId = userMap.get(job.userEmail);
    if (!userId) {
      throw new Error(`User not found for email: ${job.userEmail}`);
    }
    const createdAnalysis = await prisma.jobAnalysis.create({
      data: {
        userId,
        jobTitle: job.jobTitle,
        companyName: job.companyName ?? null,
        location: job.location ?? null,
        jobDescription: job.jobDescription,
        fitScore: job.fitScore,
        recommendation: job.recommendation,
        result: job.result,
      },
    });
    analysisIds.push(createdAnalysis.id);
  }

  return analysisIds;
}

async function seedApplications(
  applications: any[],
  userMap: Map<string, string>,
  analysisIds: string[],
): Promise<void> {
  for (const app of applications) {
    const userId = userMap.get(app.userEmail);

    if (!userId) {
      throw new Error(`User not found for email: ${app.userEmail}`);
    }

    const jobAnalysisId =
      app.jobAnalysisIndex !== undefined
        ? (analysisIds[app.jobAnalysisIndex] ?? null)
        : null;

    await prisma.application.create({
      data: {
        userId,
        jobAnalysisId,
        jobTitle: app.jobTitle,
        companyName: app.companyName ?? null,
        location: app.location ?? null,
        jobUrl: app.jobUrl ?? null,
        status: app.status,
        notes: app.notes ?? null,
        nextStep: app.nextStep ?? null,
        appliedAt: app.appliedAt ? new Date(app.appliedAt) : null,
      },
    });
  }
}

async function main(): Promise<void> {
  try {
    console.log("🌱 Seeding started...");

    const users = await readJSON("users.json");
    const profiles = await readJSON("profiles.json");
    const jobAnalyses = await readJSON("jobAnalyses.json");
    const applications = await readJSON("applications.json");

    await clearDatabase();

    const userMap = await seedUsers(users);
    await seedProfiles(profiles, userMap);

    const analysisIds = await seedJobAnalyses(jobAnalyses, userMap);
    await seedApplications(applications, userMap, analysisIds);

    console.log("✅ Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
