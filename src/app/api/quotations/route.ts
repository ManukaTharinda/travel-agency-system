
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ValidatedQuotationItem {
  category: string | null;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Find the user's active agency
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

    // 3. Read search and filter parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    const allowedStatuses = [
      "DRAFT",
      "SENT",
      "CONFIRMED",
      "REJECTED",
      "EXPIRED",
      "CANCELLED",
    ] as const;

    if (
      status &&
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid quotation status." },
        { status: 400 }
      );
    }

    // 4. Retrieve quotations belonging only to this agency
    const quotations = await prisma.quotation.findMany({
      where: {
        agencyId: membership.agency.id,

        ...(status
          ? {
              status: status as (typeof allowedStatuses)[number],
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  quotationNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  customerName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  customerEmail: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      select: {
        id: true,
        quotationNumber: true,
        status: true,
        customerName: true,
        customerEmail: true,
        issueDate: true,
        validUntil: true,
        currencyCode: true,
        totalAmount: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

    // 5. Return quotation records
    return NextResponse.json(
      {
        quotations,
        total: quotations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quotation retrieval error:", error);

    return NextResponse.json(
      { error: "Something went wrong while retrieving quotations." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Read and validate the request body
    const body = await request.json();

    const {
      customerId,
      itineraryId,
      issueDate,
      validUntil,
      currencyCode,
      items,
      discount,
      taxRate,
      notes,
      terms,
    } = body;

    if (
      typeof customerId !== "string" ||
      !customerId.trim() ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 100
    ) {
      return NextResponse.json(
        { error: "Please select a customer and add at least one item." },
        { status: 400 }
      );
    }

    const parsedIssueDate = parseDate(issueDate);
    const parsedValidUntil = parseDate(validUntil);

    if (
      !parsedIssueDate ||
      !parsedValidUntil ||
      parsedValidUntil < parsedIssueDate
    ) {
      return NextResponse.json(
        { error: "Please provide valid quotation dates." },
        { status: 400 }
      );
    }

    const currency =
      typeof currencyCode === "string" ? currencyCode.trim().toUpperCase() : "";

    if (!/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json(
        { error: "Please provide a valid three-letter currency code." },
        { status: 400 }
      );
    }

    const requestedDiscount = Number(discount ?? 0);
    const requestedTaxRate = Number(taxRate ?? 0);

    if (
      !Number.isFinite(requestedDiscount) ||
      !Number.isFinite(requestedTaxRate) ||
      requestedDiscount < 0 ||
      requestedTaxRate < 0 ||
      requestedTaxRate > 100
    ) {
      return NextResponse.json(
        { error: "Invalid discount or tax rate." },
        { status: 400 }
      );
    }

    // 3. Validate all quotation items
     const validatedItems: ValidatedQuotationItem[] = [];

    for (const item of items) {
      const name = optionalText(item?.name);
      const quantity = Number(item?.quantity);
      const unitPrice = Number(item?.unitPrice);

      if (
        !name ||
        name.length > 200 ||
        !Number.isFinite(quantity) ||
        !Number.isFinite(unitPrice) ||
        quantity <= 0 ||
        quantity > 1000000 ||
        unitPrice < 0 ||
        unitPrice > 1000000000
      ) {
        return NextResponse.json(
          { error: "One or more quotation items contain invalid values." },
          { status: 400 }
        );
      }

      validatedItems.push({
        category: optionalText(item?.category),
        name,
        description: optionalText(item?.description),
        quantity,
        unitPrice,
        lineTotal: roundMoney(quantity * unitPrice),
      });
    }

    // 4. Find the user's active agency membership
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

    // 5. Verify that the customer belongs to this agency
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        agencyId: agency.id,
        status: "ACTIVE",
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found in your agency." },
        { status: 404 }
      );
    }

    // 6. Verify the optional itinerary
    let itinerary = null;

    if (itineraryId) {
      if (typeof itineraryId !== "string") {
        return NextResponse.json(
          { error: "Invalid itinerary selection." },
          { status: 400 }
        );
      }

      itinerary = await prisma.itinerary.findFirst({
        where: {
          id: itineraryId,
          agencyId: agency.id,
          customerId: customer.id,
        },
      });

      if (!itinerary) {
        return NextResponse.json(
          { error: "The selected itinerary does not belong to this customer." },
          { status: 400 }
        );
      }
    }

    // 7. Calculate all financial values on the server
    const subtotal = roundMoney(
      validatedItems.reduce((sum, item) => sum + item.lineTotal, 0)
    );

    if (requestedDiscount > subtotal) {
      return NextResponse.json(
        { error: "Discount cannot exceed the subtotal." },
        { status: 400 }
      );
    }

    const finalDiscount = roundMoney(requestedDiscount);
    const taxableAmount = roundMoney(subtotal - finalDiscount);
    const taxAmount = roundMoney(
      (taxableAmount * requestedTaxRate) / 100
    );
    const totalAmount = roundMoney(taxableAmount + taxAmount);

    // 8. Create the quotation in a transaction
    const quotation = await prisma.$transaction(async (tx) => {
      // Increment numbering atomically to avoid duplicate numbers
      const updatedAgency = await tx.agency.update({
        where: {
          id: agency.id,
        },
        data: {
          nextQuotationNumber: {
            increment: 1,
          },
        },
        select: {
          quotationPrefix: true,
          nextQuotationNumber: true,
        },
      });

      const quotationNumber = `${
        updatedAgency.quotationPrefix
      }-${String(updatedAgency.nextQuotationNumber - 1).padStart(5, "0")}`;

      const agencyAddress = [
        agency.addressLine1,
        agency.addressLine2,
        agency.city,
        agency.postalCode,
        agency.country,
      ]
        .filter(Boolean)
        .join(", ");

      const createdQuotation = await tx.quotation.create({
        data: {
          agencyId: agency.id,
          customerId: customer.id,
          sourceItineraryId: itinerary?.id ?? null,

          quotationNumber,
          status: "DRAFT",

          issueDate: parsedIssueDate,
          validUntil: parsedValidUntil,

          // Agency information snapshot
          agencyName: agency.name,
          agencyEmail: agency.email,
          agencyPhone: agency.phone,
          agencyAddress: agencyAddress || null,
          agencyLogoUrl: agency.logoUrl,

          // Customer information snapshot
          customerName: [
            customer.firstName,
            customer.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: null,

          // Financial information
          currencyCode: currency,
          subtotal,
          discount: finalDiscount,
          tax: taxAmount,
          totalAmount,

          notes: optionalText(notes),
          termsAndConditions: optionalText(terms),

          items: {
            create: validatedItems.map((item, index) => ({
              category: item.category,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
              sortOrder: index,
            })),
          },
        },
        include: {
          items: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return createdQuotation;
    });

    return NextResponse.json(
      {
        message: "Quotation created successfully.",
        quotation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quotation creation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the quotation." },
      { status: 500 }
    );
  }
}
