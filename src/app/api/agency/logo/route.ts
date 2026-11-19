
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";



const MAX_FILE_SIZE = 2 * 1024 * 1024;

function isValidImage(
  buffer: Buffer,
  mimeType: string
): boolean {
  // PNG signature
  const isPng =
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );

  // JPEG signature
  const isJpeg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  // WebP signature
  const isWebp =
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  return (
    (mimeType === "image/png" && isPng) ||
    (mimeType === "image/jpeg" && isJpeg) ||
    (mimeType === "image/webp" && isWebp)
  );
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    // 2. Find agency membership
    const membership = await prisma.agencyMember.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Agency membership not found." },
        { status: 404 }
      );
    }

    // 3. Check permissions
    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "You do not have permission to upload a logo." },
        { status: 403 }
      );
    }

    // 4. Read uploaded file
    const formData = await request.formData();
    const file = formData.get("logo");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please select an image." },
        { status: 400 }
      );
    }

    // 5. Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Maximum logo size is 2 MB." },
        { status: 400 }
      );
    }

    // 6. Check image content and format
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG and WebP images are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isValidImage(buffer, file.type)) {
      return NextResponse.json(
        { error: "The uploaded file is not a valid image." },
        { status: 400 }
      );
    }

    // 7. Upload to agency-specific Cloudinary folder
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `agency-logos/${membership.agencyId}`,
          public_id: "agency-logo",
          overwrite: true,
          invalidate: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.end(buffer);
    });

    // 8. Save logo URL in the agency database
    await prisma.agency.update({
      where: {
        id: membership.agencyId,
      },
      data: {
        logoUrl: uploadResult.secure_url,
      },
    });

    return NextResponse.json({
      message: "Logo uploaded successfully.",
      logoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Agency logo upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload agency logo." },
      { status: 500 }
    );
  }
}
