
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ITEM_TYPES = [
  "ACCOMMODATION",
  "ACTIVITY",
  "TRANSPORT",
  "MEAL",
  "OTHER",
] as const;

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function optionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

// GET: List itineraries belonging to the active agency.
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");

    const itineraries = await prisma.itinerary.findMany({
      where: {
        agencyId: membership.agencyId,
        ...(status &&
        ["DRAFT", "READY", "SENT", "CONFIRMED", "CANCELLED"].includes(status)
          ? { status: status as
              | "DRAFT"
              | "READY"
              | "SENT"
              | "CONFIRMED"
              | "CANCELLED" }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                {
                  destination: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  referenceCode: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  customer: {
                    firstName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  customer: {
                    lastName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
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
        _count: {
          select: {
            days: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({
      itineraries,
    });
  } catch (error) {
    console.error("Get itineraries error:", error);

    return NextResponse.json(
      { error: "Failed to load itineraries." },
      { status: 500 }
    );
  }
}

// POST: Create a new itinerary with its daily activities.
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const {
      customerId,
      referenceCode,
      title,
      destination,
      startDate,
      endDate,
      adults,
      children,
      infants,
      description,
      inclusions,
      exclusions,
      notes,
      days,
    } = body;

    // Validate required information.
    if (
      typeof customerId !== "string" ||
      !customerId.trim() ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        { error: "Customer and itinerary title are required." },
        { status: 400 }
      );
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (!parsedStartDate || !parsedEndDate) {
      return NextResponse.json(
        { error: "Please provide valid travel dates." },
        { status: 400 }
      );
    }

    if (parsedEndDate < parsedStartDate) {
      return NextResponse.json(
        { error: "End date cannot be before start date." },
        { status: 400 }
      );
    }

    const guestCounts = {
      adults: adults ?? 1,
      children: children ?? 0,
      infants: infants ?? 0,
    };

    if (
      !Number.isInteger(guestCounts.adults) ||
      !Number.isInteger(guestCounts.children) ||
      !Number.isInteger(guestCounts.infants) ||
      guestCounts.adults < 1 ||
      guestCounts.children < 0 ||
      guestCounts.infants < 0
    ) {
      return NextResponse.json(
        { error: "Please provide valid guest numbers." },
        { status: 400 }
      );
    }

    // Verify that the customer belongs to this agency.
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        agencyId: membership.agencyId,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "The selected customer was not found." },
        { status: 404 }
      );
    }

    // Validate daily itinerary information.
    if (days !== undefined && !Array.isArray(days)) {
      return NextResponse.json(
        { error: "Invalid itinerary days." },
        { status: 400 }
      );
    }

    const itineraryDays = days ?? [];

    const usedDayNumbers = new Set<number>();

    for (const day of itineraryDays) {
      if (
        !Number.isInteger(day.dayNumber) ||
        day.dayNumber < 1 ||
        usedDayNumbers.has(day.dayNumber)
      ) {
        return NextResponse.json(
          { error: "Each itinerary day must have a unique positive day number." },
          { status: 400 }
        );
      }

      usedDayNumbers.add(day.dayNumber);

      if (day.items !== undefined && !Array.isArray(day.items)) {
        return NextResponse.json(
          { error: `Invalid activities for day ${day.dayNumber}.` },
          { status: 400 }
        );
      }

      for (const item of day.items ?? []) {
        if (
          typeof item.title !== "string" ||
          !item.title.trim() ||
          !ITEM_TYPES.includes(item.type)
        ) {
          return NextResponse.json(
            {
              error: `Each activity on day ${day.dayNumber} needs a title and valid type.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Create the itinerary and all its days and activities together.
    const itinerary = await prisma.itinerary.create({
      data: {
        agencyId: membership.agencyId,
        customerId: customer.id,

        referenceCode: optionalString(referenceCode),
        title: title.trim(),
        destination: optionalString(destination),

        startDate: parsedStartDate,
        endDate: parsedEndDate,

        adults: guestCounts.adults,
        children: guestCounts.children,
        infants: guestCounts.infants,

        description: optionalString(description),
        inclusions: optionalString(inclusions),
        exclusions: optionalString(exclusions),
        notes: optionalString(notes),

        status: "DRAFT",

        days: {
          create: itineraryDays.map((day: {
            dayNumber: number;
            date?: string;
            title?: string;
            description?: string;
            accommodation?: string;
            items?: Array<{
              type: string;
              title: string;
              description?: string;
              location?: string;
              startTime?: string;
              endTime?: string;
              supplierName?: string;
            }>;
          }) => {
            const dayDate =
              parseDate(day.date) ??
              new Date(
                parsedStartDate.getTime() +
                  (day.dayNumber - 1) * 24 * 60 * 60 * 1000
              );

            return {
              dayNumber: day.dayNumber,
              date: dayDate,
              title: optionalString(day.title),
              description: optionalString(day.description),
              accommodation: optionalString(day.accommodation),

              items: {
                create: (day.items ?? []).map((item, index) => ({
                  type: item.type as
                    | "ACCOMMODATION"
                    | "ACTIVITY"
                    | "TRANSPORT"
                    | "MEAL"
                    | "OTHER",
                  title: item.title.trim(),
                  description: optionalString(item.description),
                  location: optionalString(item.location),
                  startTime: optionalString(item.startTime),
                  endTime: optionalString(item.endTime),
                  supplierName: optionalString(item.supplierName),
                  sortOrder: index,
                })),
              },
            };
          }),
        },
      },
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
      },
    });

    return NextResponse.json(
      {
        message: "Itinerary created successfully.",
        itinerary,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create itinerary error:", error);

    return NextResponse.json(
      { error: "Failed to create itinerary." },
      { status: 500 }
    );
  }
}
