
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Verify the logged-in user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // 2. Read agency information
    const body = await request.json();

    const agencyName =
      typeof body.agencyName === "string"
        ? body.agencyName.trim()
        : "";

    const businessEmail =
      typeof body.businessEmail === "string"
        ? body.businessEmail.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    if (agencyName.length < 2 || agencyName.length > 100) {
      return NextResponse.json(
        { message: "Agency name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (
      businessEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid business email." },
        { status: 400 }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        { message: "Phone number is too long." },
        { status: 400 }
      );
    }
    
// Prevent users from creating multiple agencies
const existingMembership = await prisma.agencyMember.findFirst({
  where: {
    userId: session.user.id,
  },
});

if (existingMembership) {
  return NextResponse.json(
    { message: "You already belong to an agency." },
    { status: 409 }
  );
}
    // 3. Generate a unique agency slug
    const baseSlug =
      agencyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "agency";

    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    // 4. Create agency and OWNER membership together
    const agency = await prisma.$transaction(async (tx) => {
      const newAgency = await tx.agency.create({
        data: {
          name: agencyName,
          slug,
          email: businessEmail,
          phone: phone || null,
        },
      });

      await tx.agencyMember.create({
        data: {
          agencyId: newAgency.id,
          userId: session.user.id,
          role: "OWNER",
        },
      });

      return newAgency;
    });

    return NextResponse.json(
      {
        message: "Agency created successfully.",
        agency: {
          id: agency.id,
          name: agency.name,
          slug: agency.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Agency registration error:", error);

    return NextResponse.json(
      { message: "Unable to create agency." },
      { status: 500 }
    );
  }
}
