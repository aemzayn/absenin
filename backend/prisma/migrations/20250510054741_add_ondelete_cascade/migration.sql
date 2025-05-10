/*
  Warnings:

  - A unique constraint covering the columns `[eventId,memberId]` on the table `EventMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `OrganizationMembership` will be added. If there are existing duplicate values, this will fail.
  - Made the column `organizationId` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "EventMember" DROP CONSTRAINT "EventMember_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventMember" DROP CONSTRAINT "EventMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Qrcode" DROP CONSTRAINT "Qrcode_memberId_fkey";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "EventMember_eventId_idx" ON "EventMember"("eventId");

-- CreateIndex
CREATE INDEX "EventMember_memberId_idx" ON "EventMember"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "EventMember_eventId_memberId_key" ON "EventMember"("eventId", "memberId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_userId_idx" ON "OrganizationMembership"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_organizationId_idx" ON "OrganizationMembership"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_userId_organizationId_key" ON "OrganizationMembership"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qrcode" ADD CONSTRAINT "Qrcode_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMember" ADD CONSTRAINT "EventMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
