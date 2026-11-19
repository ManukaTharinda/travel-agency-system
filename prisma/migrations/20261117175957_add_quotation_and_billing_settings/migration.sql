/*
  Warnings:

  - A unique constraint covering the columns `[sourceQuotationId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "nextQuotationNumber" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "quotationPrefix" TEXT NOT NULL DEFAULT 'QUO';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankBranch" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "paymentInstructions" TEXT,
ADD COLUMN     "sourceQuotationId" TEXT,
ADD COLUMN     "swiftCode" TEXT;

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sourceItineraryId" TEXT,
    "quotationNumber" TEXT NOT NULL,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" DATE NOT NULL,
    "validUntil" DATE NOT NULL,
    "agencyName" TEXT NOT NULL,
    "agencyEmail" TEXT,
    "agencyPhone" TEXT,
    "agencyAddress" TEXT,
    "agencyLogoUrl" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "currencyCode" TEXT NOT NULL DEFAULT 'LKR',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "termsAndConditions" TEXT,
    "rejectionReason" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "category" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyBillingSettings" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "bankName" TEXT,
    "bankBranch" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "swiftCode" TEXT,
    "paymentInstructions" TEXT,
    "defaultPaymentTerms" TEXT,
    "defaultTaxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "taxRegistrationNumber" TEXT,
    "quotationValidityDays" INTEGER NOT NULL DEFAULT 14,
    "quotationTerms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyBillingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quotation_agencyId_status_idx" ON "Quotation"("agencyId", "status");

-- CreateIndex
CREATE INDEX "Quotation_customerId_idx" ON "Quotation"("customerId");

-- CreateIndex
CREATE INDEX "Quotation_sourceItineraryId_idx" ON "Quotation"("sourceItineraryId");

-- CreateIndex
CREATE INDEX "Quotation_validUntil_idx" ON "Quotation"("validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_agencyId_quotationNumber_key" ON "Quotation"("agencyId", "quotationNumber");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_sortOrder_idx" ON "QuotationItem"("quotationId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AgencyBillingSettings_agencyId_key" ON "AgencyBillingSettings"("agencyId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sourceQuotationId_key" ON "Invoice"("sourceQuotationId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_sourceQuotationId_fkey" FOREIGN KEY ("sourceQuotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_sourceItineraryId_fkey" FOREIGN KEY ("sourceItineraryId") REFERENCES "Itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyBillingSettings" ADD CONSTRAINT "AgencyBillingSettings_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
