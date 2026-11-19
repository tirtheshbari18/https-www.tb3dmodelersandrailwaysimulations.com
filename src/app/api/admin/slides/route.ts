import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET all slides (supports admin or public preview)
export async function GET(req: NextRequest) {
  try {
    const slides = await prisma.homeSlide.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

// POST create slide (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      image,
      buttonText,
      buttonUrl,
      order,
      isActive,
    } = body;

    if (!title || !image) {
      return NextResponse.json(
        { error: "Title and Image are required for a slide" },
        { status: 400 }
      );
    }

    const maxOrderSlide = await prisma.homeSlide.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = order !== undefined ? parseInt(order) : (maxOrderSlide?.order || 0) + 1;

    const newSlide = await prisma.homeSlide.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || null,
        image: image.trim(),
        buttonText: buttonText?.trim() || "View Product Details",
        buttonUrl: buttonUrl?.trim() || "/shop",
        order: nextOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE_HOME_SLIDE",
          entity: "HOME_SLIDE",
          entityId: newSlide.id,
          details: `Admin ${user.email} created home slide "${newSlide.title}"`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ slide: newSlide }, { status: 201 });
  } catch (error: any) {
    console.error("Create slide error:", error);
    return NextResponse.json({ error: error.message || "Failed to create slide" }, { status: 500 });
  }
}
