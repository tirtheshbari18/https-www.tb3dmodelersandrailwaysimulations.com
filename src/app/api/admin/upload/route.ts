import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 15MB" },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "image/gif",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format. Please upload JPG, PNG, WEBP, AVIF or SVG." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and filename
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(originalName) || ".png";
    const baseName = path.basename(originalName, ext).slice(0, 30);
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    // Log upload in AuditLog
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "IMAGE_UPLOAD",
          entity: "MEDIA",
          details: `Uploaded ${file.name} (${Math.round(file.size / 1024)} KB) -> ${publicUrl}`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
