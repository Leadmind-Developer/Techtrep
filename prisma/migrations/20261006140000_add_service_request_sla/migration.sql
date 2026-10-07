ALTER TABLE "service_requests"
ADD COLUMN "firstResponseDueAt" TIMESTAMP(3),
ADD COLUMN "resolutionDueAt" TIMESTAMP(3);
