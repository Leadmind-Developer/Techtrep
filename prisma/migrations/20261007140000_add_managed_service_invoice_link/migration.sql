ALTER TABLE "invoices"
ADD COLUMN "billingPeriodEnd" TIMESTAMP(3),
ADD COLUMN "billingPeriodStart" TIMESTAMP(3),
ADD COLUMN "managedServiceId" TEXT;

CREATE INDEX "invoices_managedServiceId_idx"
ON "invoices"("managedServiceId");

CREATE INDEX "invoices_billingPeriodStart_idx"
ON "invoices"("billingPeriodStart");

CREATE UNIQUE INDEX "invoices_managedServiceId_billingPeriodStart_key"
ON "invoices"("managedServiceId", "billingPeriodStart");

ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_managedServiceId_fkey"
FOREIGN KEY ("managedServiceId")
REFERENCES "managed_services"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;