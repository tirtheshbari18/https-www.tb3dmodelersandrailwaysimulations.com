import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;
    const user = await getUserFromRequest(req);

    const file = await prisma.productFile.findUnique({
      where: { id: fileId },
      include: { product: true },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    let entitlementId: string | null = null;

    // Check Access Permission:
    // If NOT public free, user MUST be logged in and hold an active entitlement or be an ADMIN
    if (!file.isPublicFree) {
      if (!user) {
        return NextResponse.json(
          { error: "Authentication required to download this premium asset" },
          { status: 401 }
        );
      }

      if (user.role !== "ADMIN") {
        const entitlement = await prisma.downloadEntitlement.findFirst({
          where: {
            userId: user.id,
            productFileId: file.id,
            isActive: true,
          },
        });

        if (!entitlement) {
          return NextResponse.json(
            {
              error:
                "Access Denied: You have not purchased this simulator add-on or your entitlement has expired.",
            },
            { status: 403 }
          );
        }

        if (entitlement.downloadCount >= entitlement.maxDownloads) {
          return NextResponse.json(
            {
              error: `Download limit reached (${entitlement.maxDownloads} downloads). Please contact support to reset your limit.`,
            },
            { status: 403 }
          );
        }

        // Increment download count
        await prisma.downloadEntitlement.update({
          where: { id: entitlement.id },
          data: {
            downloadCount: { increment: 1 },
          },
        });

        entitlementId = entitlement.id;
      }
    }

    // Log the download
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    await prisma.downloadLog.create({
      data: {
        fileId: file.id,
        userId: user ? user.id : null,
        entitlementId: entitlementId,
        ipAddress: ipAddress.slice(0, 45),
        userAgent: userAgent.slice(0, 255),
      },
    });

    // Locate the physical file on disk
    const filePath = path.join(
      process.cwd(),
      "public",
      "downloads",
      "files",
      file.fileName
    );

    if (!fs.existsSync(filePath)) {
      // Fallback sample file
      const samplePath = path.join(
        process.cwd(),
        "public",
        "downloads",
        "files",
        "README_SAMPLE.txt"
      );
      if (fs.existsSync(samplePath)) {
        const fileBuffer = fs.readFileSync(samplePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${file.fileName}"`,
          },
        });
      }
      return NextResponse.json(
        { error: "File asset temporarily unavailable on storage server" },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Set correct MIME type based on format
    let contentType = "application/octet-stream";
    const ext = file.fileFormat.toLowerCase();
    if (ext === "zip") contentType = "application/zip";
    else if (ext === "rar") contentType = "application/x-rar-compressed";
    else if (ext === "7z") contentType = "application/x-7z-compressed";
    else if (ext === "pdf") contentType = "application/pdf";
    else if (ext === "txt") contentType = "text/plain";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Secure download error:", error);
    return NextResponse.json(
      { error: "Internal error processing download request" },
      { status: 500 }
    );
  }
}
