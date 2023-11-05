/*
  Warnings:

  - You are about to drop the `BCards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BCards" DROP CONSTRAINT "BCards_userId_fkey";

-- DropTable
DROP TABLE "BCards";

-- CreateTable
CREATE TABLE "bcards" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bcards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bcards" ADD CONSTRAINT "bcards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
