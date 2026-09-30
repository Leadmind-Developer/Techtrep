ALTER TABLE "proposals"
ADD COLUMN "publicToken" TEXT;

ALTER TABLE "proposals"
ADD COLUMN "publicTokenCreatedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "proposals_publicToken_key"
ON "proposals"("publicToken");
