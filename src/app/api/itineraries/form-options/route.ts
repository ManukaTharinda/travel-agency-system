
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user.
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Find the user's active agency.
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
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No active agency membership found." },
        { status: 403 }
      );
    }

    // Load active customers and agency settings.
    const [customers, agency] = await Promise.all([
      prisma.customer.findMany({
        where: {
          agencyId: membership.agencyId,
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
      }),

      prisma.agency.findUnique({
        where: {
          id: membership.agencyId,
        },
        select: {
          id: true,
          name: true,
          legalName: true,
          email: true,
          phone: true,
          website: true,
          logoUrl: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          postalCode: true,
          country: true,
          currencyCode: true,
          documentSettings: {
            select: {
              primaryColor: true,
              secondaryColor: true,
              accentColor: true,
              fontFamily: true,
              logoUrl: true,
              headerImageUrl: true,
              footerImageUrl: true,
              itineraryTemplateId: true,
              itineraryShowLogo: true,
              itineraryShowFooter: true,
              footerText: true,
            },
          },
        },
      }),
    ]);

    if (!agency) {
      return NextResponse.json(
        { error: "Agency information not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customers,
      agency,
    });
  } catch (error) {
    console.error("Itinerary form options error:", error);

    return NextResponse.json(
      { error: "Failed to load itinerary form options." },
      { status: 500 }
    );
  }
}
