-- DropIndex
DROP INDEX "AuthToken_type_idx";

-- DropIndex
DROP INDEX "AuthToken_userId_idx";

-- DropIndex
DROP INDEX "RefreshToken_revokedAt_idx";

-- DropIndex
DROP INDEX "RefreshToken_tokenHash_idx";

-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- CreateIndex
CREATE INDEX "Application_userId_deletedAt_createdAt_idx" ON "Application"("userId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Application_userId_deletedAt_status_idx" ON "Application"("userId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "Application_userId_deletedAt_appliedAt_idx" ON "Application"("userId", "deletedAt", "appliedAt");

-- CreateIndex
CREATE INDEX "JobAnalysis_userId_deletedAt_createdAt_idx" ON "JobAnalysis"("userId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "JobAnalysis_userId_deletedAt_recommendation_idx" ON "JobAnalysis"("userId", "deletedAt", "recommendation");

-- CreateIndex
CREATE INDEX "JobAnalysis_userId_deletedAt_fitScore_idx" ON "JobAnalysis"("userId", "deletedAt", "fitScore");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revokedAt_idx" ON "RefreshToken"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_createdAt_idx" ON "RefreshToken"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isEmailVerified_idx" ON "User"("isEmailVerified");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
