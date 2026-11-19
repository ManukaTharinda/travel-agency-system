
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get active agency membership
    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
        agency: {
          status: "ACTIVE",
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

    // 3. Get quotation ID
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Quotation ID is required." },
        { status: 400 }
      );
    }

    // 4. Retrieve quotation belonging to this agency
    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        agencyId: membership.agencyId,
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
            status: true,
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found." },
        { status: 404 }
      );
    }

    // 5. Only confirmed quotations can be converted
    if (quotation.status !== "CONFIRMED") {
      return NextResponse.json(
        {
          error: "Only confirmed quotations can be converted into invoices.",
        },
        { status: 400 }
      );
    }

    // 6. Return quotation details
    return NextResponse.json(
      {
        quotation,
        alreadyConverted: Boolean(quotation.invoice),
        existingInvoice: quotation.invoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quotation detail retrieval error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve quotation details." },
      { status: 500 }
    );
  }
}
