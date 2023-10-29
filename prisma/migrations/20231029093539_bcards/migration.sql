-- CreateTable
CREATE TABLE "BCards" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desctiption" TEXT NOT NULL,

    CONSTRAINT "BCards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BCards" ADD CONSTRAINT "BCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
