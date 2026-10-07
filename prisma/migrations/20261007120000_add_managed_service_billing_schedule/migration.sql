ALTER TABLE "managed_services"
ADD COLUMN "billingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "nextBillingDate" TIMESTAMP(3);

CREATE INDEX "managed_services_nextBillingDate_idx"
ON "managed_services" ("nextBillingDate");