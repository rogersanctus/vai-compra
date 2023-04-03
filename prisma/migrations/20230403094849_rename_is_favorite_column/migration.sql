/*
  Warnings:

  - You are about to drop the column `is_favorite` on the `ProductUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductUser" RENAME COLUMN "is_favorite" TO "is_favourite";
