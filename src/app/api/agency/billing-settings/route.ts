
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAgencyAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized", status: 401 as const };
  }

  const membership = await prisma.agencyMember.findFirst({
    where: {
      userId: session.user.id,
      agency: {
        status: "ACTIVE",
      },
    },
    include: {
      agency: true,
    },
  });

  if (!membership) {
    return { error: "Agency membership not found", status: 404 as const };
  }

  return { membership };
}

// GET: Retrieve agency billing settings
export async function GET() {
  try {
    const access = await getAgencyAccess();

    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const settings = await prisma.agencyBillingSettings.upsert({
      where: {
        agencyId: access.membership.agencyId,
      },
      update: {},
      create: {
        agencyId: access.membership.agencyId,
      },
    });

    return NextResponse.json({
      settings: {
        ...settings,
        defaultTaxRate: settings.defaultTaxRate.toString(),
      },
    });
  } catch (error) {
    console.error("GET billing settings error:", error);

    return NextResponse.json(
      { error: "Failed to load billing settings" },
      { status: 500 }
    );
  }
}

// PUT: Update agency billing settings
export async function PUT(request: NextRequest) {
  try {
    const access = await getAgencyAccess();

    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    if (
      access.membership.role !== "OWNER" &&
      access.membership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update billing settings" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const stringFields = [
      "bankName",
      "bankBranch",
      "accountName",
      "accountNumber",
      "swiftCode",
      "paymentInstructions",
      "defaultPaymentTerms",
      "taxRegistrationNumber",
      "quotationTerms",
    ] as const;

    const data: Record<string, string | null | number> = {};

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          typeof body[field] !== "string"
        ) {
          return NextResponse.json(
            { error: `Invalid value for ${field}` },
            { status: 400 }
          );
        }

        data[field] =
          typeof body[field] === "string"
            ? body[field].trim() || null
            : null;
      }
    }

    if (body.defaultTaxRate !== undefined) {
      const taxRate = Number(body.defaultTaxRate);

      if (
        !Number.isFinite(taxRate) ||
        taxRate < 0 ||
        taxRate > 100
      ) {
        return NextResponse.json(
          { error: "Tax rate must be between 0 and 100" },
          { status: 400 }
        );
      }

      data.defaultTaxRate = taxRate;
    }

    if (body.quotationValidityDays !== undefined) {
      const validityDays = Number(body.quotationValidityDays);

      if (
        !Number.isInteger(validityDays) ||
        validityDays < 1 ||
        validityDays > 365
      ) {
        return NextResponse.json(
          { error: "Quotation validity must be between 1 and 365 days" },
          { status: 400 }
        );
      }

      data.quotationValidityDays = validityDays;
    }

    const settings = await prisma.agencyBillingSettings.upsert({
      where: {
        agencyId: access.membership.agencyId,
      },
      update: data,
      create: {
        agencyId: access.membership.agencyId,
        ...data,
      },
    });

    return NextResponse.json({
      message: "Billing settings saved successfully",
      settings: {
        ...settings,
        defaultTaxRate: settings.defaultTaxRate.toString(),
      },
    });
  } catch (error) {
    console.error("PUT billing settings error:", error);

    return NextResponse.json(
      { error: "Failed to save billing settings" },
      { status: 500 }
    );
  }
}
