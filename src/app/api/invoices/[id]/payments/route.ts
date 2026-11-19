
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parseDate(value: unknown): Date | null {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
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

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
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

    // 2. Get invoice ID.
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required." },
        { status: 400 }
      );
    }

    // 3. Read payment information.
    const body = await request.json();

    const {
      amount,
      paymentDate,
      paymentMethod,
      reference,
      notes,
    } = body;

    const paymentAmount = Number(amount);
    const parsedPaymentDate = parseDate(paymentDate);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0 ||
      paymentAmount > 100000000000
    ) {
      return NextResponse.json(
        { error: "Please enter a valid payment amount." },
        { status: 400 }
      );
    }

    if (!parsedPaymentDate) {
      return NextResponse.json(
        { error: "Please provide a valid payment date." },
        { status: 400 }
      );
    }

    if (
      paymentMethod !== undefined &&
      paymentMethod !== null &&
      (typeof paymentMethod !== "string" ||
        paymentMethod.length > 100)
    ) {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 }
      );
    }

    if (
      reference !== undefined &&
      reference !== null &&
      (typeof reference !== "string" || reference.length > 200)
    ) {
      return NextResponse.json(
        { error: "Invalid payment reference." },
        { status: 400 }
      );
    }

    if (
      notes !== undefined &&
      notes !== null &&
      (typeof notes !== "string" || notes.length > 2000)
    ) {
      return NextResponse.json(
        { error: "Payment notes are too long." },
        { status: 400 }
      );
    }

    const finalAmount = roundMoney(paymentAmount);

    // 4. Find the user's active agency.
    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
        agency: {
          status: "ACTIVE",
        },
      },
      select: {
        agencyId: true,
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

    // 5. Record payment and update invoice in one transaction.
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: {
          id,
          agencyId: membership.agencyId,
        },
      });

      if (!invoice) {
        throw new Error("INVOICE_NOT_FOUND");
      }

      if (
        invoice.status === "DRAFT" ||
        invoice.status === "CANCELLED"
      ) {
        throw new Error("INVOICE_NOT_PAYABLE");
      }

      const currentPaid = Number(invoice.amountPaid);
      const currentBalance = Number(invoice.balanceDue);
      const totalAmount = Number(invoice.totalAmount);

      if (
        finalAmount > currentBalance ||
        currentBalance <= 0
      ) {
        throw new Error("PAYMENT_EXCEEDS_BALANCE");
      }

      const newAmountPaid = roundMoney(
        currentPaid + finalAmount
      );

      const newBalanceDue = roundMoney(
        totalAmount - newAmountPaid
      );

      const newStatus =
        newBalanceDue === 0
          ? "PAID"
          : "PARTIALLY_PAID";

      // Create payment record.
      const payment = await tx.invoicePayment.create({
        data: {
          invoiceId: invoice.id,
          amount: finalAmount,
          paymentDate: parsedPaymentDate,
          paymentMethod: paymentMethod?.trim() || null,
          reference: reference?.trim() || null,
          notes: notes?.trim() || null,
        },
      });

      // Update invoice financial information.
      const updatedInvoice = await tx.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
        include: {
          items: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          payments: {
            orderBy: {
              paymentDate: "desc",
            },
          },
        },
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });

    return NextResponse.json(
      {
        message: "Payment recorded successfully.",
        payment: result.payment,
        invoice: result.invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVOICE_NOT_FOUND") {
        return NextResponse.json(
          { error: "Invoice not found." },
          { status: 404 }
        );
      }

      if (error.message === "INVOICE_NOT_PAYABLE") {
        return NextResponse.json(
          {
            error: "Payments cannot be recorded against draft or cancelled invoices.",
          },
          { status: 400 }
        );
      }

      if (error.message === "PAYMENT_EXCEEDS_BALANCE") {
        return NextResponse.json(
          {
            error: "Payment amount cannot exceed the outstanding balance.",
          },
          { status: 400 }
        );
      }
    }

    console.error("Invoice payment error:", error);

    return NextResponse.json(
      { error: "Something went wrong while recording the payment." },
      { status: 500 }
    );
  }
}
