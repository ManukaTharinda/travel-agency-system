
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Itinerary ID is required." },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.findFirst({
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
        days: {
          orderBy: {
            dayNumber: "asc",
          },
          include: {
            items: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
        priceItems: true,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      itinerary,
    });
  } catch (error) {
    console.error("Get itinerary details error:", error);

    return NextResponse.json(
      { error: "Failed to load itinerary details." },
      { status: 500 }
    );
  }
}

// UPDATE ITINERARY
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Authenticate user.
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Find active agency membership.
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Itinerary ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check that the itinerary belongs to this agency.
    const existingItinerary = await prisma.itinerary.findFirst({
      where: {
        id,
        agencyId: membership.agencyId,
      },
      select: {
        id: true,
      },
    });

    if (!existingItinerary) {
      return NextResponse.json(
        { error: "Itinerary not found." },
        { status: 404 }
      );
    }

    // Validate required fields when supplied.
    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || !body.title.trim())
    ) {
      return NextResponse.json(
        { error: "A valid itinerary title is required." },
        { status: 400 }
      );
    }

    if (
      body.customerId !== undefined &&
      (typeof body.customerId !== "string" || !body.customerId)
    ) {
      return NextResponse.json(
        { error: "A valid customer is required." },
        { status: 400 }
      );
    }

    // Ensure the selected customer belongs to the same agency.
    if (body.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: body.customerId,
          agencyId: membership.agencyId,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Selected customer was not found or is inactive." },
          { status: 400 }
        );
      }
    }

    // Validate dates when supplied.
    const startDate =
      body.startDate !== undefined
        ? new Date(body.startDate)
        : undefined;

    const endDate =
      body.endDate !== undefined
        ? new Date(body.endDate)
        : undefined;

    if (
      (startDate && Number.isNaN(startDate.getTime())) ||
      (endDate && Number.isNaN(endDate.getTime()))
    ) {
      return NextResponse.json(
        { error: "Please provide valid travel dates." },
        { status: 400 }
      );
    }

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return NextResponse.json(
        { error: "End date cannot be before start date." },
        { status: 400 }
      );
    }

    // Prepare the main itinerary updates.
    const updateData: any = {};

    if (body.customerId !== undefined) {
      updateData.customerId = body.customerId;
    }

    if (body.referenceCode !== undefined) {
      updateData.referenceCode = body.referenceCode || null;
    }

    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }

    if (body.destination !== undefined) {
      updateData.destination = body.destination || null;
    }

    if (startDate) {
      updateData.startDate = startDate;
    }

    if (endDate) {
      updateData.endDate = endDate;
    }

    if (body.adults !== undefined) {
      updateData.adults = Number(body.adults);
    }

    if (body.children !== undefined) {
      updateData.children = Number(body.children);
    }

    if (body.infants !== undefined) {
      updateData.infants = Number(body.infants);
    }

    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }

    if (body.inclusions !== undefined) {
      updateData.inclusions = body.inclusions || null;
    }

    if (body.exclusions !== undefined) {
      updateData.exclusions = body.exclusions || null;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes || null;
    }

    // Validate guest numbers.
    for (const field of ["adults", "children", "infants"] as const) {
      if (body[field] !== undefined) {
        const value = Number(body[field]);

        if (!Number.isInteger(value) || value < 0) {
          return NextResponse.json(
            { error: `Invalid ${field} guest count.` },
            { status: 400 }
          );
        }
      }
    }

    // Update itinerary and daily schedule in one transaction.
    const updatedItinerary = await prisma.$transaction(async (tx) => {
      // Replace daily itinerary only when days are provided.
      if (body.days !== undefined) {
        if (!Array.isArray(body.days)) {
          throw new Error("INVALID_DAYS");
        }

        // Remove existing activities first.
        await tx.itineraryItem.deleteMany({
  where: {
    itineraryDayId: {
      in: (
        await tx.itineraryDay.findMany({
          where: {
            itineraryId: id,
          },
          select: {
            id: true,
          },
        })
      ).map((day) => day.id),
    },
  },
});
        // Remove existing days.
        await tx.itineraryDay.deleteMany({
          where: {
            itineraryId: id,
          },
        });

        // Create the updated days and activities.
        updateData.days = {
          create: body.days.map((day: any, index: number) => ({
            dayNumber: Number(day.dayNumber ?? index + 1),
            date: day.date ? new Date(day.date) : null,
            title: day.title || null,
            description: day.description || null,
            accommodation: day.accommodation || null,
            items: {
              create: Array.isArray(day.items)
                ? day.items.map((item: any, itemIndex: number) => ({
                    type: item.type || "OTHER",
                    title: item.title || "Activity",
                    description: item.description || null,
                    location: item.location || null,
                    startTime: item.startTime || null,
                    endTime: item.endTime || null,
                    supplierName: item.supplierName || null,
                    sortOrder: item.sortOrder ?? itemIndex,
                  }))
                : [],
            },
          })),
        };
      }

      return tx.itinerary.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          customer: true,
          days: {
            orderBy: {
              dayNumber: "asc",
            },
            include: {
              items: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
          priceItems: true,
        },
      });
    });

    return NextResponse.json({
      message: "Itinerary updated successfully.",
      itinerary: updatedItinerary,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_DAYS") {
      return NextResponse.json(
        { error: "Invalid daily itinerary data." },
        { status: 400 }
      );
    }

    console.error("Update itinerary error:", error);

    return NextResponse.json(
      { error: "Failed to update itinerary." },
      { status: 500 }
    );
  }
}
