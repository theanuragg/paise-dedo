/*
  Warnings:

  - Added the required column `creatorId` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tokens" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "x_acc" TEXT;

-- AlterTable
ALTER TABLE "public"."x_users" ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "x_acc" TEXT;

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "tokens_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."x_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
