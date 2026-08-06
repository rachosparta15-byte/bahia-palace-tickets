-- CreateTable
CREATE TABLE "GuideActivation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideActivation_tokenId_deviceId_key" ON "GuideActivation"("tokenId", "deviceId");

-- CreateIndex
CREATE INDEX "GuideActivation_bookingId_idx" ON "GuideActivation"("bookingId");

-- CreateIndex
CREATE INDEX "GuideActivation_reference_idx" ON "GuideActivation"("reference");
