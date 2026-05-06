-- AlterTable
ALTER TABLE "Room" ADD COLUMN "sceneData" JSONB;

-- AlterTable
ALTER TABLE "RoomScan" ADD COLUMN "analysis" JSONB,
ADD COLUMN "roomId" TEXT;

-- Backfill existing rows with generated room records so the new relation can be required.
WITH inserted_rooms AS (
    INSERT INTO "Room" ("id", "userId", "imageUrl", "generationStatus", "roomTheme", "createdAt", "updatedAt", "sceneData")
    SELECT
        CONCAT('roomscan-', "id"),
        "buyerId",
        "imageUrl",
        'COMPLETED'::"Room3DGenerationStatus",
        'Legacy Room',
        "createdAt",
        "createdAt",
        NULL
    FROM "RoomScan"
    ON CONFLICT ("id") DO NOTHING
    RETURNING "id"
)
UPDATE "RoomScan"
SET "roomId" = CONCAT('roomscan-', "id")
WHERE "roomId" IS NULL;

ALTER TABLE "RoomScan"
ALTER COLUMN "roomId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoomScan_roomId_key" ON "RoomScan"("roomId");

-- CreateIndex
CREATE INDEX "RoomScan_buyerId_idx" ON "RoomScan"("buyerId");

-- AddForeignKey
ALTER TABLE "RoomScan"
ADD CONSTRAINT "RoomScan_roomId_fkey"
FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
