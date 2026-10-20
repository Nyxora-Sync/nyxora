-- Indexes for the showcase filters, comment threads, and profile/community counts.

-- DropIndex
DROP INDEX "Comment_parentId_idx";

-- DropIndex
DROP INDEX "Comment_targetType_targetId_createdAt_idx";

-- CreateIndex
CREATE INDEX "Comment_targetType_targetId_parentId_createdAt_idx" ON "Comment"("targetType", "targetId", "parentId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_parentId_createdAt_idx" ON "Comment"("parentId", "createdAt");

-- CreateIndex
CREATE INDEX "Project_userId_createdAt_idx" ON "Project"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Project_track_createdAt_idx" ON "Project"("track", "createdAt");

-- CreateIndex
CREATE INDEX "Project_track_upvotes_createdAt_idx" ON "Project"("track", "upvotes", "createdAt");

-- CreateIndex
CREATE INDEX "Project_upvotes_createdAt_idx" ON "Project"("upvotes", "createdAt");

-- CreateIndex
CREATE INDEX "UserProgress_completed_idx" ON "UserProgress"("completed");

-- CreateIndex
CREATE INDEX "UserProgress_userId_completed_idx" ON "UserProgress"("userId", "completed");
