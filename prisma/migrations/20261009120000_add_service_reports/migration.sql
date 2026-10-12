CREATE TYPE "ServiceReportStatus" AS ENUM (
  'DRAFT',
  'FINALIZED'
);

CREATE TABLE "service_reports" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "managedServiceId" TEXT NOT NULL,
  "preparedById" TEXT,
  "reportNumber" TEXT NOT NULL,
  "reportingPeriodStart" TIMESTAMP(3) NOT NULL,
  "reportingPeriodEnd" TIMESTAMP(3) NOT NULL,
  "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" "ServiceReportStatus" NOT NULL DEFAULT 'DRAFT',
  "finalizedAt" TIMESTAMP(3),
  "executiveSummary" TEXT,
  "workPerformed" TEXT,
  "incidentSummary" TEXT,
  "recommendations" TEXT,
  "nextSteps" TEXT,
  "totalRequests" INTEGER NOT NULL DEFAULT 0,
  "resolvedRequests" INTEGER NOT NULL DEFAULT 0,
  "openRequests" INTEGER NOT NULL DEFAULT 0,
  "urgentRequests" INTEGER NOT NULL DEFAULT 0,
  "slaEligibleRequests" INTEGER NOT NULL DEFAULT 0,
  "slaMetRequests" INTEGER NOT NULL DEFAULT 0,
  "slaBreachedRequests" INTEGER NOT NULL DEFAULT 0,
  "slaComplianceRate" DECIMAL(5, 2),
  "billingCurrency" TEXT NOT NULL DEFAULT 'NGN',
  "totalInvoiced" DECIMAL(15, 2) NOT NULL DEFAULT 0,
  "totalPaid" DECIMAL(15, 2) NOT NULL DEFAULT 0,
  "totalOutstanding" DECIMAL(15, 2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "service_reports_pkey"
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "service_reports_reportNumber_key"
ON "service_reports"("reportNumber");

CREATE UNIQUE INDEX
"service_reports_managedServiceId_reportingPeriodStart_reportingPeriodEnd_key"
ON "service_reports"(
  "managedServiceId",
  "reportingPeriodStart",
  "reportingPeriodEnd"
);

CREATE INDEX "service_reports_organizationId_reportDate_idx"
ON "service_reports"("organizationId", "reportDate");

CREATE INDEX "service_reports_managedServiceId_reportingPeriodStart_idx"
ON "service_reports"("managedServiceId", "reportingPeriodStart");

CREATE INDEX "service_reports_status_idx"
ON "service_reports"("status");

CREATE INDEX "service_reports_preparedById_idx"
ON "service_reports"("preparedById");


ALTER TABLE "service_reports"
ADD CONSTRAINT "service_reports_organizationId_fkey"
FOREIGN KEY ("organizationId")
REFERENCES "organizations"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "service_reports"
ADD CONSTRAINT "service_reports_managedServiceId_fkey"
FOREIGN KEY ("managedServiceId")
REFERENCES "managed_services"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "service_reports"
ADD CONSTRAINT "service_reports_preparedById_fkey"
FOREIGN KEY ("preparedById")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;