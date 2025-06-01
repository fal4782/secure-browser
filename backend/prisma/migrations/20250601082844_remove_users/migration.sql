/*
  Warnings:

  - You are about to drop the column `userId` on the `container_sessions` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "container_sessions" DROP CONSTRAINT "container_sessions_userId_fkey";

-- AlterTable
ALTER TABLE "container_sessions" DROP COLUMN "userId";

-- DropTable
DROP TABLE "users";
