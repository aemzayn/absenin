/*
  Warnings:

  - A unique constraint covering the columns `[memberNo,organizationId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberNo` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "organizationId" INTEGER;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "memberNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberNo_organizationId_key" ON "Member"("memberNo", "organizationId");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
