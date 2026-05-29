/*
  Warnings:

  - You are about to drop the column `analysisId` on the `Application` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_analysisId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "analysisId",
ADD COLUMN     "jobAnalysisId" TEXT,
ADD COLUMN     "nextStep" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobAnalysisId_fkey" FOREIGN KEY ("jobAnalysisId") REFERENCES "JobAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
