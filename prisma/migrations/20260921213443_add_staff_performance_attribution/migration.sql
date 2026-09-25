-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OpportunityStatus" ADD VALUE 'WON';
ALTER TYPE "OpportunityStatus" ADD VALUE 'LOST';

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "createdByUserId" TEXT;

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "createdByUserId" TEXT;

-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "createdByUserId" TEXT;

-- CreateIndex
CREATE INDEX "activities_createdByUserId_idx" ON "activities"("createdByUserId");

-- CreateIndex
CREATE INDEX "leads_createdByUserId_idx" ON "leads"("createdByUserId");

-- CreateIndex
CREATE INDEX "leads_assignedToUserId_idx" ON "leads"("assignedToUserId");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- CreateIndex
CREATE INDEX "opportunities_createdByUserId_idx" ON "opportunities"("createdByUserId");

-- CreateIndex
CREATE INDEX "opportunities_assignedToUserId_idx" ON "opportunities"("assignedToUserId");

-- CreateIndex
CREATE INDEX "opportunities_createdAt_idx" ON "opportunities"("createdAt");

-- CreateIndex
CREATE INDEX "opportunities_closedAt_idx" ON "opportunities"("closedAt");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
