
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Retrieve the logged-in user's agency profile
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No agency found" },
        { status: 404 }
      );
    }

    const agency = await prisma.agency.findUnique({
      where: {
        id: membership.agencyId,
      },
    });

    if (!agency) {
      return NextResponse.json(
        { error: "Agency not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ agency });
  } catch (error) {
    console.error("Get agency profile error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve agency profile" },
      { status: 500 }
    );
  }
}

// PUT: Update the logged-in user's agency profile
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No agency found" },
        { status: 404 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "You do not have permission to edit this profile" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const requiredString = (value: unknown) =>
      typeof value === "string" && value.trim().length > 0;

    const optionalString = (value: unknown) =>
      value === null ||
      value === undefined ||
      typeof value === "string";

    // Validate required fields
    if (!requiredString(body.name)) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Validate optional fields
    const optionalFields = [
      "legalName",
      "description",
      "email",
      "phone",
      "website",
      "logoUrl",
      "facebookUrl",
      "instagramUrl",
      "tiktokUrl",
      "linkedinUrl",
      "addressLine1",
      "addressLine2",
      "city",
      "postalCode",
      "country",
    ];

    for (const field of optionalFields) {
      if (!optionalString(body[field])) {
        return NextResponse.json(
          { error: `Invalid value for ${field}` },
          { status: 400 }
        );
      }
    }

    const agency = await prisma.agency.update({
      where: {
        id: membership.agencyId,
      },
      data: {
        name: body.name.trim(),
        legalName: body.legalName?.trim() || null,
        description: body.description?.trim() || null,

        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        website: body.website?.trim() || null,
        logoUrl: body.logoUrl?.trim() || null,

        facebookUrl: body.facebookUrl?.trim() || null,
        instagramUrl: body.instagramUrl?.trim() || null,
        tiktokUrl: body.tiktokUrl?.trim() || null,
        linkedinUrl: body.linkedinUrl?.trim() || null,

        addressLine1: body.addressLine1?.trim() || null,
        addressLine2: body.addressLine2?.trim() || null,
        city: body.city?.trim() || null,
        postalCode: body.postalCode?.trim() || null,
        country: body.country?.trim() || null,
      },
    });

    return NextResponse.json({
      message: "Agency profile updated successfully",
      agency,
    });
  } catch (error) {
    console.error("Update agency profile error:", error);

    return NextResponse.json(
      { error: "Failed to update agency profile" },
      { status: 500 }
    );
  }
}
