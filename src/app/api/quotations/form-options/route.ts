
import { NextRequest, NextResponse } from "next/server";


import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user
 const session = await auth.api.getSession({
  headers: request.headers,
});

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Find the user's active agency membership
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

    const agencyId = membership.agencyId;

    // 3. Retrieve active customers
    const customers = await prisma.customer.findMany({
      where: {
        agencyId,
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

    // 4. Retrieve itineraries belonging to this agency
    const itineraries = await prisma.itinerary.findMany({
      where: {
        agencyId,
      },
      select: {
        id: true,
        customerId: true,
        referenceCode: true,
        title: true,
        destination: true,
        startDate: true,
        endDate: true,
        adults: true,
        children: true,
        infants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    });

    // 5. Return form options
    return NextResponse.json(
      {
        customers,
        itineraries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quotation form options error:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading quotation form options." },
      { status: 500 }
    );
  }
}
