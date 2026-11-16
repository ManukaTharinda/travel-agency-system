-- CreateTable
CREATE TABLE "AgencyDocumentSettings" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#2563EB',
    "secondaryColor" TEXT NOT NULL DEFAULT '#0F172A',
    "accentColor" TEXT NOT NULL DEFAULT '#F59E0B',
    "fontFamily" TEXT NOT NULL DEFAULT 'Arial',
    "logoUrl" TEXT,
    "headerImageUrl" TEXT,
    "footerImageUrl" TEXT,
    "itineraryTemplateId" TEXT,
    "itineraryShowLogo" BOOLEAN NOT NULL DEFAULT true,
    "itineraryShowFooter" BOOLEAN NOT NULL DEFAULT true,
    "invoiceTemplateId" TEXT,
    "invoiceShowLogo" BOOLEAN NOT NULL DEFAULT true,
    "invoiceShowFooter" BOOLEAN NOT NULL DEFAULT true,
    "footerText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyDocumentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgencyDocumentSettings_agencyId_key" ON "AgencyDocumentSettings"("agencyId");

-- AddForeignKey
ALTER TABLE "AgencyDocumentSettings" ADD CONSTRAINT "AgencyDocumentSettings_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
