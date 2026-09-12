-- AlterTable
ALTER TABLE "ProcessDefinition" ADD COLUMN "catalogCode" TEXT;
ALTER TABLE "ProcessDefinition" ADD COLUMN "hub" TEXT NOT NULL DEFAULT 'other';
ALTER TABLE "ProcessDefinition" ADD COLUMN "family" TEXT;
ALTER TABLE "ProcessDefinition" ADD COLUMN "wizardKind" TEXT NOT NULL DEFAULT 'dynamic';
ALTER TABLE "ProcessDefinition" ADD COLUMN "fieldsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "ProcessDefinition" ADD COLUMN "routeJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "ProcessDefinition" ADD COLUMN "driveFileId" TEXT;
ALTER TABLE "ProcessDefinition" ADD COLUMN "sourceFolder" TEXT;
ALTER TABLE "ProcessDefinition" ADD COLUMN "nomenclatura" TEXT;

-- AlterTable
ALTER TABLE "Case" ADD COLUMN "docPath" TEXT;

-- CreateTable
CREATE TABLE "HandbookEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titleBg" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryBg" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "driveFileId" TEXT,
    "path" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "HandbookEntry_slug_key" ON "HandbookEntry"("slug");
