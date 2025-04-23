/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "qrCode";

-- CreateTable
CREATE TABLE "Qrcode" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "Qrcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Qrcode_memberId_key" ON "Qrcode"("memberId");

-- AddForeignKey
ALTER TABLE "Qrcode" ADD CONSTRAINT "Qrcode_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
