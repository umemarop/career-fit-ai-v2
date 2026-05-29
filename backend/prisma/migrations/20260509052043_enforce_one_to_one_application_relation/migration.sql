/*
  Warnings:

  - A unique constraint covering the columns `[jobAnalysisId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_jobAnalysisId_key" ON "Application"("jobAnalysisId");
