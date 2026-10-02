-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'VOID'
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key"
ON "invoices"("invoiceNumber");

CREATE INDEX "invoices_contractId_idx"
ON "invoices"("contractId");

CREATE INDEX "invoices_status_idx"
ON "invoices"("status");

CREATE INDEX "invoices_issuedAt_idx"
ON "invoices"("issuedAt");

CREATE INDEX "invoices_dueDate_idx"
ON "invoices"("dueDate");

CREATE INDEX "invoices_createdAt_idx"
ON "invoices"("createdAt");

-- AddForeignKey
ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_contractId_fkey"
FOREIGN KEY ("contractId")
REFERENCES "contracts"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;