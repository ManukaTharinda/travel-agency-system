
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

    // 3. Find the user's active agency membership.
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

    // 4. Retrieve invoice with agency isolation.
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        agencyId: membership.agencyId,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
          },
        },

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

        sourceItinerary: {
          select: {
            id: true,
            referenceCode: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
          },
        },

        sourceQuotation: {
          select: {
            id: true,
            quotationNumber: true,
            status: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    // 5. Return invoice details.
    return NextResponse.json(
      {
        invoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invoice details retrieval error:", error);

    return NextResponse.json(
      { error: "Something went wrong while retrieving invoice details." },
      { status: 500 }
    );
  }
}
