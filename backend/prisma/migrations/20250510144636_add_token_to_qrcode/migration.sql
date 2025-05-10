/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Qrcode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Qrcode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Qrcode" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Qrcode_token_key" ON "Qrcode"("token");

-- CreateIndex
CREATE INDEX "Qrcode_token_idx" ON "Qrcode"("token");
