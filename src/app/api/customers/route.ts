
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Retrieve customers belonging to the active agency.
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
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status");

    const customers = await prisma.customer.findMany({
      where: {
        agencyId: membership.agencyId,

        ...(status === "ACTIVE" || status === "ARCHIVED"
          ? { status }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  phone: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);

    return NextResponse.json(
      { error: "Failed to load customers." },
      { status: 500 }
    );
  }
}

// POST: Create a new customer.
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

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const nationality =
      typeof body.nationality === "string"
        ? body.nationality.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    if (!firstName) {
      return NextResponse.json(
        { error: "Customer first name is required." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        agencyId: membership.agencyId,
        firstName,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        nationality: nationality || null,
        notes: notes || null,
        status: "ACTIVE",
        createdById: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Customer created successfully.",
        customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer error:", error);

    return NextResponse.json(
      { error: "Failed to create customer." },
      { status: 500 }
    );
  }
}
