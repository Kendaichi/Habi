-- AlterTable
ALTER TABLE "Room"
ADD COLUMN "generationProvider" TEXT,
ADD COLUMN "externalJobId" TEXT,
ADD COLUMN "worldAssetUrl" TEXT,
ADD COLUMN "worldAssetFormat" TEXT,
ADD COLUMN "previewImageUrl" TEXT,
ADD COLUMN "providerStatus" TEXT,
ADD COLUMN "providerError" TEXT,
ADD COLUMN "providerPayload" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Room_externalJobId_key" ON "Room"("externalJobId");
