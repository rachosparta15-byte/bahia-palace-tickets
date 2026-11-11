-- CreateTable
CREATE TABLE "OfferCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "productKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "tagline" TEXT,
    "duration" TEXT,
    "includes" TEXT,
    "note" TEXT,
    "price" TEXT,
    "priceNote" TEXT,
    "buttonUrl" TEXT,
    "imageUrl" TEXT,
    "ribbon" TEXT,
    "badge" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferCard_section_productKey_key" ON "OfferCard"("section", "productKey");
