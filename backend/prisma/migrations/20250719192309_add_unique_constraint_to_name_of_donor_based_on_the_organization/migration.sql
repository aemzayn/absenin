/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Donor_name_organizationId_key" ON "Donor"("name", "organizationId");

-- CreateIndex
CREATE INDEX "Member_organizationId_idx" ON "Member"("organizationId");

-- CreateIndex
CREATE INDEX "Member_donorId_idx" ON "Member"("donorId");

-- CreateIndex
CREATE INDEX "Member_memberNo_idx" ON "Member"("memberNo");

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_organizationId_key" ON "Member"("name", "organizationId");
