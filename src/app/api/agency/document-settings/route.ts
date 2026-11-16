
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Retrieve agency document settings
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

    const settings = await prisma.agencyDocumentSettings.upsert({
      where: {
        agencyId: membership.agencyId,
      },
      update: {},
      create: {
        agencyId: membership.agencyId,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get document settings error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve document settings" },
      { status: 500 }
    );
  }
}

// PUT: Save agency document settings
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
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const colorPattern = /^#[0-9A-Fa-f]{6}$/;

    const colors = [
      body.primaryColor,
      body.secondaryColor,
      body.accentColor,
    ];

    if (
      colors.some(
        (color) =>
          typeof color !== "string" ||
          !colorPattern.test(color)
      )
    ) {
      return NextResponse.json(
        { error: "Please provide valid HEX colours" },
        { status: 400 }
      );
    }

    if (
      typeof body.fontFamily !== "string" ||
      body.fontFamily.trim().length === 0 ||
      body.fontFamily.length > 100
    ) {
      return NextResponse.json(
        { error: "Invalid font family" },
        { status: 400 }
      );
    }

    const settings = await prisma.agencyDocumentSettings.update({
      where: {
        agencyId: membership.agencyId,
      },
      data: {
        primaryColor: body.primaryColor,
        secondaryColor: body.secondaryColor,
        accentColor: body.accentColor,
        fontFamily: body.fontFamily.trim(),
      },
    });

    return NextResponse.json({
      message: "Document settings saved successfully",
      settings,
    });
  } catch (error) {
    console.error("Save document settings error:", error);

    return NextResponse.json(
      { error: "Failed to save document settings" },
      { status: 500 }
    );
  }
}
