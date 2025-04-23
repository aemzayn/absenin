/*
  Warnings:

  - Added the required column `qrCode` to the `Qrcode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Qrcode" ADD COLUMN     "qrCode" TEXT NOT NULL;
