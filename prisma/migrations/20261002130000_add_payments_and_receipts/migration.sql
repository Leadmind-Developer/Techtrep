CREATE TYPE "PaymentMethod" AS ENUM (
  'BANK_TRANSFER',
  'CASH',
  'CARD',
  'POS',
  'USSD',
  'MOBILE_MONEY',
  'CHEQUE',
  'OTHER'
);

CREATE TYPE "PaymentStatus" AS ENUM (
  'COMPLETED',
  'VOID',
  'REFUNDED'
);

CREATE TABLE "payments" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "paymentNumber" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "method" "PaymentMethod" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reference" TEXT,
  "notes" TEXT,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "receipts" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "receiptNumber" TEXT NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payments_paymentNumber_key"
ON "payments"("paymentNumber");

CREATE UNIQUE INDEX "receipts_paymentId_key"
ON "receipts"("paymentId");

CREATE UNIQUE INDEX "receipts_receiptNumber_key"
ON "receipts"("receiptNumber");

CREATE INDEX "payments_invoiceId_idx"
ON "payments"("invoiceId");

CREATE INDEX "payments_status_idx"
ON "payments"("status");

CREATE INDEX "payments_paidAt_idx"
ON "payments"("paidAt");

CREATE INDEX "payments_reference_idx"
ON "payments"("reference");

CREATE INDEX "payments_createdByUserId_idx"
ON "payments"("createdByUserId");

CREATE INDEX "payments_createdAt_idx"
ON "payments"("createdAt");

CREATE INDEX "receipts_issuedAt_idx"
ON "receipts"("issuedAt");

ALTER TABLE "payments"
ADD CONSTRAINT "payments_invoiceId_fkey"
FOREIGN KEY ("invoiceId")
REFERENCES "invoices"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "payments"
ADD CONSTRAINT "payments_createdByUserId_fkey"
FOREIGN KEY ("createdByUserId")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "receipts"
ADD CONSTRAINT "receipts_paymentId_fkey"
FOREIGN KEY ("paymentId")
REFERENCES "payments"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;