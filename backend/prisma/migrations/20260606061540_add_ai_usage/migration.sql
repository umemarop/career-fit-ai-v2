-- CreateEnum
CREATE TYPE "AiUsageType" AS ENUM ('JOB_ANALYSIS', 'RESUME_AUTOFILL');

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "type" "AiUsageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiUsage_userId_type_createdAt_idx" ON "AiUsage"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_ipAddress_type_createdAt_idx" ON "AiUsage"("ipAddress", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_createdAt_idx" ON "AiUsage"("createdAt");

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
