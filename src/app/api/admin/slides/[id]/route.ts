import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";
import { saveSlideOverride } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.homeSlide.findUnique({
      where: { id: params.id },
    });
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }
    return NextResponse.json({ slide });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch slide" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existing = await prisma.homeSlide.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
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

    const updated = await prisma.homeSlide.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle ? subtitle.trim() : null }),
        ...(description !== undefined && { description: description ? description.trim() : null }),
        ...(image !== undefined && { image: image.trim() }),
        ...(buttonText !== undefined && { buttonText: buttonText ? buttonText.trim() : "View Product Details" }),
        ...(buttonUrl !== undefined && { buttonUrl: buttonUrl ? buttonUrl.trim() : "/shop" }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "UPDATE_HOME_SLIDE",
          entity: "HOME_SLIDE",
          entityId: updated.id,
          details: `Admin ${user.email} updated home slide "${updated.title}"`,
        },
      });
    } catch (e) {}

    try {
      await saveSlideOverride(params.id, {
        title: updated.title,
        subtitle: updated.subtitle,
        description: updated.description,
        image: updated.image,
        buttonText: updated.buttonText,
        buttonUrl: updated.buttonUrl,
        order: updated.order,
        isActive: updated.isActive,
      });
    } catch (cloudErr) {}

    try {
      revalidatePath("/");
    } catch (e) {}

    return NextResponse.json({ slide: updated });
  } catch (error: any) {
    console.error("Update slide error:", error);
    return NextResponse.json({ error: error.message || "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existing = await prisma.homeSlide.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    await prisma.homeSlide.delete({
      where: { id: params.id },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "DELETE_HOME_SLIDE",
          entity: "HOME_SLIDE",
          entityId: params.id,
          details: `Admin ${user.email} deleted home slide "${existing.title}"`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error: any) {
    console.error("Delete slide error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete slide" }, { status: 500 });
  }
}
