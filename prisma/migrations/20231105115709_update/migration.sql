/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_agent` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" ADD COLUMN     "user_agent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username";
