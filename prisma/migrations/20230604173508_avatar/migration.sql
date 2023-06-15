/*
  Warnings:

  - You are about to drop the column `avata` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "avata",
ADD COLUMN     "avata_url" TEXT;
