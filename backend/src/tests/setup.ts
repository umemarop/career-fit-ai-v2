import { prisma } from "../prisma/client.js";

beforeEach(async () => {
  await prisma.application.deleteMany();
  await prisma.jobAnalysis.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
