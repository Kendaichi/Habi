/*
  Warnings:

  - You are about to drop the column `available` on the `Listing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'AVAILABLE', 'IN_USE');

-- CreateEnum
CREATE TYPE "RefurbStatus" AS ENUM ('IN_USE', 'AWAITING', 'REFURBISHING');

-- AlterTable
ALTER TABLE "JunkShop" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "available",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "refurbStatus" "RefurbStatus" NOT NULL DEFAULT 'IN_USE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- AddForeignKey
ALTER TABLE "TraceabilityChain" ADD CONSTRAINT "TraceabilityChain_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
