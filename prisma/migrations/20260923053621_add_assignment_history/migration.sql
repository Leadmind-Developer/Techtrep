-- CreateTable
CREATE TABLE "lead_assignments" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "assignedToUserId" TEXT NOT NULL,
    "assignedByUserId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_assignments" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "assignedToUserId" TEXT NOT NULL,
    "assignedByUserId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_assignments_leadId_idx" ON "lead_assignments"("leadId");

-- CreateIndex
CREATE INDEX "lead_assignments_assignedToUserId_idx" ON "lead_assignments"("assignedToUserId");

-- CreateIndex
CREATE INDEX "lead_assignments_assignedByUserId_idx" ON "lead_assignments"("assignedByUserId");

-- CreateIndex
CREATE INDEX "lead_assignments_assignedAt_idx" ON "lead_assignments"("assignedAt");

-- CreateIndex
CREATE INDEX "lead_assignments_unassignedAt_idx" ON "lead_assignments"("unassignedAt");

-- CreateIndex
CREATE INDEX "opportunity_assignments_opportunityId_idx" ON "opportunity_assignments"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_assignments_assignedToUserId_idx" ON "opportunity_assignments"("assignedToUserId");

-- CreateIndex
CREATE INDEX "opportunity_assignments_assignedByUserId_idx" ON "opportunity_assignments"("assignedByUserId");

-- CreateIndex
CREATE INDEX "opportunity_assignments_assignedAt_idx" ON "opportunity_assignments"("assignedAt");

-- CreateIndex
CREATE INDEX "opportunity_assignments_unassignedAt_idx" ON "opportunity_assignments"("unassignedAt");

-- AddForeignKey
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_assignments" ADD CONSTRAINT "opportunity_assignments_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_assignments" ADD CONSTRAINT "opportunity_assignments_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_assignments" ADD CONSTRAINT "opportunity_assignments_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "lead_assignments_one_active"
ON "lead_assignments" ("leadId")
WHERE "unassignedAt" IS NULL;

CREATE UNIQUE INDEX "opportunity_assignments_one_active"
ON "opportunity_assignments" ("opportunityId")
WHERE "unassignedAt" IS NULL;