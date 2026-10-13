ALTER TABLE "service_reports"
ADD COLUMN IF NOT EXISTS "publicTokenHash" TEXT;

ALTER TABLE "service_reports"
ADD COLUMN IF NOT EXISTS "publicTokenExpiresAt" TIMESTAMP(3);

ALTER TABLE "service_reports"
ADD COLUMN IF NOT EXISTS "publicTokenRevokedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "service_reports_publicTokenHash_key"
ON "service_reports"("publicTokenHash");
