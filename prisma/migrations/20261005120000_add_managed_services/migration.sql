CREATE TYPE "ManagedServiceType" AS ENUM (
  'MANAGED_IT',
  'CLOUD',
  'SOFTWARE_SUPPORT',
  'AI_SUPPORT',
  'WEBSITE',
  'NETWORK',
  'INFRASTRUCTURE',
  'CUSTOM'
);

CREATE TYPE "ManagedServiceStatus" AS ENUM (
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'ENDED',
  'CANCELLED'
);

CREATE TYPE "ManagedServiceSla" AS ENUM (
  'BASIC',
  'STANDARD',
  'PRIORITY',
  'PREMIUM'
);

CREATE TYPE "ManagedServiceBillingFrequency" AS ENUM (
  'MONTHLY',
  'QUARTERLY',
  'ANNUALLY'
);

CREATE TABLE "managed_services" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "projectId" TEXT,
  "contractId" TEXT,
  "serviceNumber" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" "ManagedServiceType" NOT NULL,
  "status" "ManagedServiceStatus" NOT NULL DEFAULT 'DRAFT',
  "sla" "ManagedServiceSla" NOT NULL DEFAULT 'STANDARD',
  "recurringFee" DECIMAL(15,2),
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "billingFrequency" "ManagedServiceBillingFrequency" NOT NULL DEFAULT 'MONTHLY',
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "serviceManagerId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "managed_services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "managed_services_serviceNumber_key"
ON "managed_services"("serviceNumber");

CREATE INDEX "managed_services_organizationId_idx"
ON "managed_services"("organizationId");

CREATE INDEX "managed_services_projectId_idx"
ON "managed_services"("projectId");

CREATE INDEX "managed_services_contractId_idx"
ON "managed_services"("contractId");

CREATE INDEX "managed_services_type_idx"
ON "managed_services"("type");

CREATE INDEX "managed_services_status_idx"
ON "managed_services"("status");

CREATE INDEX "managed_services_serviceManagerId_idx"
ON "managed_services"("serviceManagerId");

CREATE INDEX "managed_services_startDate_idx"
ON "managed_services"("startDate");

CREATE INDEX "managed_services_endDate_idx"
ON "managed_services"("endDate");

CREATE INDEX "managed_services_createdAt_idx"
ON "managed_services"("createdAt");

ALTER TABLE "managed_services"
ADD CONSTRAINT "managed_services_organizationId_fkey"
FOREIGN KEY ("organizationId")
REFERENCES "organizations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "managed_services"
ADD CONSTRAINT "managed_services_projectId_fkey"
FOREIGN KEY ("projectId")
REFERENCES "projects"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "managed_services"
ADD CONSTRAINT "managed_services_contractId_fkey"
FOREIGN KEY ("contractId")
REFERENCES "contracts"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "managed_services"
ADD CONSTRAINT "managed_services_serviceManagerId_fkey"
FOREIGN KEY ("serviceManagerId")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;