
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ValidatedInvoiceItem {
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

const allowedStatuses = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

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

    if (
      status &&
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid invoice status." },
        { status: 400 }
      );
    }

    // 4. Retrieve invoices belonging only to this agency
    const invoices = await prisma.invoice.findMany({
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
                  invoiceNumber: {
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
        invoiceNumber: true,
        status: true,
        customerName: true,
        customerEmail: true,
        issueDate: true,
        dueDate: true,
        currencyCode: true,
        totalAmount: true,
        amountPaid: true,
        balanceDue: true,
        sourceQuotationId: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

    return NextResponse.json(
      {
        invoices,
        total: invoices.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invoice retrieval error:", error);

    return NextResponse.json(
      { error: "Something went wrong while retrieving invoices." },
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

    // 2. Read request body
    const body = await request.json();

    const {
      customerId,
      quotationId,
      itineraryId,
      issueDate,
      dueDate,
      currencyCode,
      items,
      discount,
      taxRate,
      amountPaid,
      notes,
      paymentTerms,
      action,
    } = body;

    if (
      action !== "DRAFT" &&
      action !== "ISSUE"
    ) {
      return NextResponse.json(
        { error: "Invalid invoice action." },
        { status: 400 }
      );
    }

    if (
      quotationId !== undefined &&
      quotationId !== null &&
      (typeof quotationId !== "string" || !quotationId.trim())
    ) {
      return NextResponse.json(
        { error: "Invalid quotation selection." },
        { status: 400 }
      );
    }

    if (
      !quotationId &&
      (typeof customerId !== "string" || !customerId.trim())
    ) {
      return NextResponse.json(
        { error: "Please select a customer." },
        { status: 400 }
      );
    }

    // 3. Validate invoice dates
    const parsedIssueDate = parseDate(issueDate);
    const parsedDueDate =
      dueDate === null || dueDate === "" || dueDate === undefined
        ? null
        : parseDate(dueDate);

    if (
      !parsedIssueDate ||
      (dueDate && !parsedDueDate) ||
      (parsedDueDate && parsedDueDate < parsedIssueDate)
    ) {
      return NextResponse.json(
        { error: "Please provide valid invoice dates." },
        { status: 400 }
      );
    }

    // 4. Find the user's active agency
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
    const billingSettings = agency.billingSettings;

    // 5. Check whether this invoice comes from a confirmed quotation
    let sourceQuotation = null;

    if (quotationId) {
      sourceQuotation = await prisma.quotation.findFirst({
        where: {
          id: quotationId,
          agencyId: agency.id,
        },
        include: {
          items: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
            },
          },
        },
      });

      if (!sourceQuotation) {
        return NextResponse.json(
          { error: "Quotation not found in your agency." },
          { status: 404 }
        );
      }

      if (sourceQuotation.status !== "CONFIRMED") {
        return NextResponse.json(
          { error: "Only confirmed quotations can be converted into invoices." },
          { status: 400 }
        );
      }

      if (sourceQuotation.invoice) {
        return NextResponse.json(
          {
            error: `An invoice (${sourceQuotation.invoice.invoiceNumber}) has already been created from this quotation.`,
          },
          { status: 409 }
        );
      }

      if (
        customerId &&
        customerId !== sourceQuotation.customerId
      ) {
        return NextResponse.json(
          { error: "The selected customer does not match the quotation." },
          { status: 400 }
        );
      }
    }

    // 6. Find and verify the customer
    const resolvedCustomerId =
      sourceQuotation?.customerId ?? customerId;

    const customer = await prisma.customer.findFirst({
      where: {
        id: resolvedCustomerId,
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

    // 7. Verify the optional itinerary
    let itinerary = null;

    const resolvedItineraryId =
      sourceQuotation?.sourceItineraryId ?? itineraryId ?? null;

    if (resolvedItineraryId) {
      if (typeof resolvedItineraryId !== "string") {
        return NextResponse.json(
          { error: "Invalid itinerary selection." },
          { status: 400 }
        );
      }

      itinerary = await prisma.itinerary.findFirst({
        where: {
          id: resolvedItineraryId,
          agencyId: agency.id,
          customerId: customer.id,
        },
      });

      if (!itinerary) {
        return NextResponse.json(
          {
            error: "The selected itinerary does not belong to this customer.",
          },
          { status: 400 }
        );
      }
    }

    // 8. Validate currency
    const currency = sourceQuotation
      ? sourceQuotation.currencyCode
      : typeof currencyCode === "string"
        ? currencyCode.trim().toUpperCase()
        : "";

    if (!/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json(
        { error: "Please provide a valid three-letter currency code." },
        { status: 400 }
      );
    }

    // 9. Prepare invoice items
    const validatedItems: ValidatedInvoiceItem[] = [];

    if (sourceQuotation) {
      // Copy the confirmed quotation's original items.
      for (const item of sourceQuotation.items) {
        validatedItems.push({
          category: item.category,
          name: item.name,
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
        });
      }
    } else {
      if (
        !Array.isArray(items) ||
        items.length === 0 ||
        items.length > 100
      ) {
        return NextResponse.json(
          { error: "Please add at least one invoice item." },
          { status: 400 }
        );
      }

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
            { error: "One or more invoice items contain invalid values." },
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
    }

    // 10. Calculate financial values on the server
    const subtotal = sourceQuotation
      ? roundMoney(Number(sourceQuotation.subtotal))
      : roundMoney(
          validatedItems.reduce(
            (sum, item) => sum + item.lineTotal,
            0
          )
        );

    const requestedDiscount = sourceQuotation
      ? Number(sourceQuotation.discount)
      : Number(discount ?? 0);

    const requestedTaxRate = Number(taxRate ?? 0);

    if (
      !Number.isFinite(requestedDiscount) ||
      requestedDiscount < 0 ||
      requestedDiscount > subtotal
    ) {
      return NextResponse.json(
        { error: "Discount cannot exceed the subtotal." },
        { status: 400 }
      );
    }

    if (
      !sourceQuotation &&
      (!Number.isFinite(requestedTaxRate) ||
        requestedTaxRate < 0 ||
        requestedTaxRate > 100)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid tax rate." },
        { status: 400 }
      );
    }

    const finalDiscount = roundMoney(requestedDiscount);

    const taxAmount = sourceQuotation
      ? roundMoney(Number(sourceQuotation.tax))
      : roundMoney(
          ((subtotal - finalDiscount) * requestedTaxRate) / 100
        );

    const totalAmount = sourceQuotation
      ? roundMoney(Number(sourceQuotation.totalAmount))
      : roundMoney(subtotal - finalDiscount + taxAmount);

    const finalAmountPaid = Number(amountPaid ?? 0);

    if (
      !Number.isFinite(finalAmountPaid) ||
      finalAmountPaid < 0 ||
      finalAmountPaid > totalAmount
    ) {
      return NextResponse.json(
        { error: "Amount paid must be between zero and the invoice total." },
        { status: 400 }
      );
    }

    const paid = roundMoney(finalAmountPaid);
    const balanceDue = roundMoney(totalAmount - paid);

    const invoiceStatus =
      balanceDue === 0 && totalAmount > 0
        ? "PAID"
        : paid > 0
          ? "PARTIALLY_PAID"
          : action === "ISSUE"
            ? "SENT"
            : "DRAFT";

    // 11. Build agency and customer snapshots
    const agencyAddress = [
      agency.addressLine1,
      agency.addressLine2,
      agency.city,
      agency.postalCode,
      agency.country,
    ]
      .filter(Boolean)
      .join(", ");

    const customerName = [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    // 12. Create invoice in a transaction
    const invoice = await prisma.$transaction(async (tx) => {
      // Atomically increment invoice numbering
      const updatedAgency = await tx.agency.update({
        where: {
          id: agency.id,
        },
        data: {
          nextInvoiceNumber: {
            increment: 1,
          },
        },
        select: {
          invoicePrefix: true,
          nextInvoiceNumber: true,
        },
      });

      const invoiceNumber = `${
        updatedAgency.invoicePrefix
      }-${String(updatedAgency.nextInvoiceNumber - 1).padStart(5, "0")}`;

      const createdInvoice = await tx.invoice.create({
        data: {
          agencyId: agency.id,
          customerId: customer.id,
          sourceItineraryId: itinerary?.id ?? null,
          sourceQuotationId: sourceQuotation?.id ?? null,

          invoiceNumber,
          status: invoiceStatus,

          issueDate: parsedIssueDate,
          dueDate: parsedDueDate,

          // Agency information snapshot
          agencyName: sourceQuotation?.agencyName ?? agency.name,
          agencyEmail: sourceQuotation?.agencyEmail ?? agency.email,
          agencyPhone: sourceQuotation?.agencyPhone ?? agency.phone,
          agencyAddress: sourceQuotation?.agencyAddress ?? (agencyAddress || null),
          agencyLogoUrl: sourceQuotation?.agencyLogoUrl ?? agency.logoUrl,

          // Customer information snapshot
          customerName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: null,

          // Financial information
          currencyCode: currency,
          subtotal,
          discount: finalDiscount,
          tax: taxAmount,
          totalAmount,
          amountPaid: paid,
          balanceDue,

          // Bank details snapshot — invoices only
          bankName: billingSettings?.bankName ?? null,
          bankBranch: billingSettings?.bankBranch ?? null,
          accountName: billingSettings?.accountName ?? null,
          accountNumber: billingSettings?.accountNumber ?? null,
          swiftCode: billingSettings?.swiftCode ?? null,
          paymentInstructions:
            billingSettings?.paymentInstructions ?? null,

          notes: optionalText(notes),
          paymentTerms:
            optionalText(paymentTerms) ??
            billingSettings?.defaultPaymentTerms ??
            null,

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

      return createdInvoice;
    });

    return NextResponse.json(
      {
        message: "Invoice created successfully.",
        invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice creation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the invoice." },
      { status: 500 }
    );
  }
}
