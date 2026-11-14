-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "AgencyRole" AS ENUM ('OWNER', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('DRAFT', 'READY', 'SENT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ItineraryItemType" AS ENUM ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'MEAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PriceCategory" AS ENUM ('ACCOMMODATION', 'TRANSPORT', 'ACTIVITIES', 'MEALS', 'GUIDE', 'OTHER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legalName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "currencyCode" TEXT NOT NULL DEFAULT 'LKR',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Colombo',
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "AgencyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyMember" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AgencyRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "nationality" TEXT,
    "notes" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "referenceCode" TEXT,
    "title" TEXT NOT NULL,
    "destination" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "status" "ItineraryStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "inclusions" TEXT,
    "exclusions" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" DATE,
    "title" TEXT,
    "description" TEXT,
    "accommodation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryItem" (
    "id" TEXT NOT NULL,
    "itineraryDayId" TEXT NOT NULL,
    "type" "ItineraryItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "supplierName" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryPriceItem" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "itineraryItemId" TEXT,
    "category" "PriceCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "unitSellingPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currencyCode" TEXT NOT NULL DEFAULT 'LKR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryPriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sourceItineraryId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" DATE NOT NULL,
    "dueDate" DATE,
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
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "paymentTerms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "category" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoicePayment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentDate" DATE NOT NULL,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_platformRole_idx" ON "User"("platformRole");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_slug_key" ON "Agency"("slug");

-- CreateIndex
CREATE INDEX "Agency_status_idx" ON "Agency"("status");

-- CreateIndex
CREATE INDEX "Agency_name_idx" ON "Agency"("name");

-- CreateIndex
CREATE INDEX "AgencyMember_userId_idx" ON "AgencyMember"("userId");

-- CreateIndex
CREATE INDEX "AgencyMember_agencyId_role_idx" ON "AgencyMember"("agencyId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "AgencyMember_agencyId_userId_key" ON "AgencyMember"("agencyId", "userId");

-- CreateIndex
CREATE INDEX "Customer_agencyId_idx" ON "Customer"("agencyId");

-- CreateIndex
CREATE INDEX "Customer_agencyId_email_idx" ON "Customer"("agencyId", "email");

-- CreateIndex
CREATE INDEX "Customer_agencyId_phone_idx" ON "Customer"("agencyId", "phone");

-- CreateIndex
CREATE INDEX "Customer_createdById_idx" ON "Customer"("createdById");

-- CreateIndex
CREATE INDEX "Itinerary_agencyId_status_idx" ON "Itinerary"("agencyId", "status");

-- CreateIndex
CREATE INDEX "Itinerary_customerId_idx" ON "Itinerary"("customerId");

-- CreateIndex
CREATE INDEX "Itinerary_startDate_idx" ON "Itinerary"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_agencyId_referenceCode_key" ON "Itinerary"("agencyId", "referenceCode");

-- CreateIndex
CREATE INDEX "ItineraryDay_itineraryId_idx" ON "ItineraryDay"("itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryDay_itineraryId_dayNumber_key" ON "ItineraryDay"("itineraryId", "dayNumber");

-- CreateIndex
CREATE INDEX "ItineraryItem_itineraryDayId_sortOrder_idx" ON "ItineraryItem"("itineraryDayId", "sortOrder");

-- CreateIndex
CREATE INDEX "ItineraryItem_type_idx" ON "ItineraryItem"("type");

-- CreateIndex
CREATE INDEX "ItineraryPriceItem_itineraryId_idx" ON "ItineraryPriceItem"("itineraryId");

-- CreateIndex
CREATE INDEX "ItineraryPriceItem_itineraryItemId_idx" ON "ItineraryPriceItem"("itineraryItemId");

-- CreateIndex
CREATE INDEX "ItineraryPriceItem_itineraryId_category_idx" ON "ItineraryPriceItem"("itineraryId", "category");

-- CreateIndex
CREATE INDEX "Invoice_agencyId_status_idx" ON "Invoice"("agencyId", "status");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Invoice_sourceItineraryId_idx" ON "Invoice"("sourceItineraryId");

-- CreateIndex
CREATE INDEX "Invoice_issueDate_idx" ON "Invoice"("issueDate");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_agencyId_invoiceNumber_key" ON "Invoice"("agencyId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_sortOrder_idx" ON "InvoiceItem"("invoiceId", "sortOrder");

-- CreateIndex
CREATE INDEX "InvoicePayment_invoiceId_idx" ON "InvoicePayment"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoicePayment_paymentDate_idx" ON "InvoicePayment"("paymentDate");

-- AddForeignKey
ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryDay" ADD CONSTRAINT "ItineraryDay_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "ItineraryDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryPriceItem" ADD CONSTRAINT "ItineraryPriceItem_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryPriceItem" ADD CONSTRAINT "ItineraryPriceItem_itineraryItemId_fkey" FOREIGN KEY ("itineraryItemId") REFERENCES "ItineraryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_sourceItineraryId_fkey" FOREIGN KEY ("sourceItineraryId") REFERENCES "Itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoicePayment" ADD CONSTRAINT "InvoicePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
