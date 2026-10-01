-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM (
  'DRAFT',
  'SENT',
  'SIGNED',
  'ACTIVE',
  'EXPIRED',
  'TERMINATED'
);

-- CreateTable
CREATE TABLE "contracts" (
  "id" TEXT NOT NULL,
  "proposalId" TEXT NOT NULL,
  "contractNumber" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
  "amount" DECIMAL(15,2),
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "signedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_proposalId_key"
ON "contracts"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contractNumber_key"
ON "contracts"("contractNumber");

-- CreateIndex
CREATE INDEX "contracts_status_idx"
ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_startDate_idx"
ON "contracts"("startDate");

-- CreateIndex
CREATE INDEX "contracts_endDate_idx"
ON "contracts"("endDate");

-- CreateIndex
CREATE INDEX "contracts_createdAt_idx"
ON "contracts"("createdAt");

-- AddForeignKey
ALTER TABLE "contracts"
ADD CONSTRAINT "contracts_proposalId_fkey"
FOREIGN KEY ("proposalId")
REFERENCES "proposals"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;