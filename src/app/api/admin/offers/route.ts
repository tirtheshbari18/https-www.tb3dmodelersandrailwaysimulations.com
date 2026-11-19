import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/offers - List all offers
export async function GET(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(offers);
  } catch (error: any) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// POST /api/admin/offers - Create new offer
export async function POST(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      discountPercent,
      startDate,
      endDate,
      isActive,
      targetType,
      targetIds,
      badgeText,
    } = body;

    if (!title || discountPercent === undefined || discountPercent === null) {
      return NextResponse.json(
        { error: "Title and discount percentage are required" },
        { status: 400 }
      );
    }

    const newOffer = await prisma.offer.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        discountPercent: parseFloat(discountPercent) || 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== false,
        targetType: targetType || "ALL",
        targetIds: targetIds ? JSON.stringify(targetIds) : null,
        badgeText: badgeText?.trim() || "SPECIAL OFFER",
      },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "OFFER_CREATED",
          entity: "OFFER",
          entityId: newOffer.id,
          details: `Created offer "${newOffer.title}" with ${newOffer.discountPercent}% discount.`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Offer created successfully",
      offer: newOffer,
    });
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create offer" },
      { status: 500 }
    );
  }
}
