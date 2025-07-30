-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "donorId" INTEGER,
ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "Donor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "memberId" INTEGER,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
