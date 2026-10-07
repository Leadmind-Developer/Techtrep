-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM (
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'WAITING',
    'RESOLVED',
    'CLOSED',
    'CANCELLED'
);

-- CreateEnum
CREATE TYPE "ServiceRequestPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "managedServiceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ServiceRequestPriority" NOT NULL DEFAULT 'NORMAL',
    "assignedToId" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_requestNumber_key"
ON "service_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "service_requests_managedServiceId_idx"
ON "service_requests"("managedServiceId");

-- CreateIndex
CREATE INDEX "service_requests_organizationId_idx"
ON "service_requests"("organizationId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx"
ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_priority_idx"
ON "service_requests"("priority");

-- CreateIndex
CREATE INDEX "service_requests_assignedToId_idx"
ON "service_requests"("assignedToId");

-- CreateIndex
CREATE INDEX "service_requests_openedAt_idx"
ON "service_requests"("openedAt");

-- CreateIndex
CREATE INDEX "service_requests_createdAt_idx"
ON "service_requests"("createdAt");

-- AddForeignKey
ALTER TABLE "service_requests"
ADD CONSTRAINT "service_requests_managedServiceId_fkey"
FOREIGN KEY ("managedServiceId")
REFERENCES "managed_services"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests"
ADD CONSTRAINT "service_requests_organizationId_fkey"
FOREIGN KEY ("organizationId")
REFERENCES "organizations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests"
ADD CONSTRAINT "service_requests_assignedToId_fkey"
FOREIGN KEY ("assignedToId")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;