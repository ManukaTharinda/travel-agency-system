
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Authenticate user.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Find active agency membership.
    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
        agency: {
          status: "ACTIVE",
        },
      },
      include: {
        agency: {
          include: {
            billingSettings: true,
            documentSettings: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No active agency membership found." },
        { status: 403 }
      );
    }

    const agency = membership.agency;

    // 3. Load active customers.
    const customers = await prisma.customer.findMany({
      where: {
        agencyId: agency.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        nationality: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    // 4. Load existing itineraries.
    const itineraries = await prisma.itinerary.findMany({
      where: {
        agencyId: agency.id,
      },
      select: {
        id: true,
        title: true,
        referenceCode: true,
        destination: true,
        customerId: true,
        startDate: true,
        endDate: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    });

    // 5. Prepare agency information.
    const agencyAddress = [
      agency.addressLine1,
      agency.addressLine2,
      agency.city,
      agency.postalCode,
      agency.country,
    ]
      .filter(Boolean)
      .join(", ");

    const billingSettings = agency.billingSettings;

    // 6. Return invoice form options.
    return NextResponse.json(
      {
        customers,
        itineraries,

        agency: {
          id: agency.id,
          name: agency.name,
          legalName: agency.legalName,
          email: agency.email,
          phone: agency.phone,
          website: agency.website,
          address: agencyAddress,
          logoUrl:
            agency.documentSettings?.logoUrl || agency.logoUrl,
          currencyCode: agency.currencyCode,
          invoicePrefix: agency.invoicePrefix,
          nextInvoiceNumber: agency.nextInvoiceNumber,
        },

        billingSettings: billingSettings
          ? {
              bankName: billingSettings.bankName,
              bankBranch: billingSettings.bankBranch,
              accountName: billingSettings.accountName,
              accountNumber: billingSettings.accountNumber,
              swiftCode: billingSettings.swiftCode,
              paymentInstructions:
                billingSettings.paymentInstructions,
              defaultPaymentTerms:
                billingSettings.defaultPaymentTerms,
              defaultTaxRate: Number(
                billingSettings.defaultTaxRate
              ),
              taxRegistrationNumber:
                billingSettings.taxRegistrationNumber,
            }
          : {
              bankName: null,
              bankBranch: null,
              accountName: null,
              accountNumber: null,
              swiftCode: null,
              paymentInstructions: null,
              defaultPaymentTerms: null,
              defaultTaxRate: 0,
              taxRegistrationNumber: null,
            },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invoice form options error:", error);

    return NextResponse.json(
      { error: "Failed to load invoice form information." },
      { status: 500 }
    );
  }
}
