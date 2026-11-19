import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT /api/admin/offers/[id] - Update offer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title.trim() : existing.title,
        description: body.description !== undefined ? body.description?.trim() || null : existing.description,
        discountPercent: body.discountPercent !== undefined ? parseFloat(body.discountPercent) : existing.discountPercent,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existing.endDate,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
        targetType: body.targetType || existing.targetType,
        targetIds: body.targetIds !== undefined ? (body.targetIds ? JSON.stringify(body.targetIds) : null) : existing.targetIds,
        badgeText: body.badgeText !== undefined ? body.badgeText.trim() : existing.badgeText,
      },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "OFFER_UPDATED",
          entity: "OFFER",
          entityId: id,
          details: `Updated offer "${updated.title}" (Active: ${updated.isActive}, ${updated.discountPercent}% off).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully",
      offer: updated,
    });
  } catch (error: any) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update offer" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/offers/[id] - Delete offer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;
    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    await prisma.offer.delete({ where: { id } });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "OFFER_DELETED",
          entity: "OFFER",
          entityId: id,
          details: `Deleted offer "${existing.title}".`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Offer permanently deleted",
    });
  } catch (error: any) {
    console.error("Error deleting offer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete offer" },
      { status: 500 }
    );
  }
}
