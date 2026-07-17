-- CreateIndex
CREATE INDEX "collections_userId_updatedAt_idx" ON "collections"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "items_userId_isPinned_createdAt_idx" ON "items"("userId", "isPinned", "createdAt");
