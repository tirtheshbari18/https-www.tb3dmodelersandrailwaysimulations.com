import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";
import { saveTrainboardOverride } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      name,
      zone,
      zoneName,
      size,
      downloadUrl,
      description,
      image,
      displayOrder,
      specifications,
      status,
    } = body;

    const existing = await prisma.trainboard.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Trainboard not found" }, { status: 404 });
    }

    const defaultZoneNames: Record<string, string> = {
      WR: "Western Railway",
      CR: "Central Railway",
      ECoR: "East Coast Railway",
      NR: "Northern Railway",
      SR: "Southern Railway",
      ER: "Eastern Railway",
      NCR: "North Central Railway",
      NER: "North Eastern Railway",
      NWR: "North Western Railway",
      SECR: "South East Central Railway",
      SER: "South Eastern Railway",
      SWR: "South Western Railway",
      WCR: "West Central Railway",
    };

    const targetZone = zone ? zone.toUpperCase() : undefined;
    const calculatedZoneName = zoneName || (targetZone ? defaultZoneNames[targetZone] : undefined);

    const updated = await prisma.trainboard.update({
      where: { id },
      data: {
        ...(name && { name: name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip` }),
        ...(targetZone && { zone: targetZone }),
        ...(calculatedZoneName && { zoneName: calculatedZoneName }),
        ...(size && { size }),
        ...(downloadUrl && { downloadUrl }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(image !== undefined && { image }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(specifications !== undefined && { specifications }),
        ...(body.regularPrice !== undefined && { regularPrice: parseFloat(body.regularPrice) }),
        ...(body.salePrice !== undefined && { salePrice: body.salePrice !== null && body.salePrice !== "" ? parseFloat(body.salePrice) : null }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.discountPercent !== undefined && { discountPercent: parseFloat(body.discountPercent) }),
        ...(body.isSpecialOffer !== undefined && { isSpecialOffer: Boolean(body.isSpecialOffer) }),
        ...(status && { status }),
      },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "TRAINBOARD_UPDATED",
          entity: "TRAINBOARD",
          entityId: id,
          details: `Updated trainboard "${updated.name}" (${updated.zone}, Size: ${updated.size}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    try {
      await saveTrainboardOverride(id, {
        name: updated.name,
        regularPrice: updated.regularPrice,
        salePrice: updated.salePrice,
        status: updated.status,
        discountPercent: (updated as any).discountPercent,
        isSpecialOffer: (updated as any).isSpecialOffer,
        ...(updated.image && { image: updated.image }),
      });
    } catch (cloudErr) {}

    try {
      revalidatePath("/trainboards");
    } catch (e) {}

    return NextResponse.json({ success: true, trainboard: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update trainboard" }, { status: 500 });
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

    const { id } = params;
    const existing = await prisma.trainboard.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Trainboard not found" }, { status: 404 });
    }

    await prisma.trainboard.delete({
      where: { id },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "TRAINBOARD_DELETED",
          entity: "TRAINBOARD",
          entityId: id,
          details: `Permanently deleted trainboard "${existing.name}" (${existing.zone}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, message: "Trainboard deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete trainboard" }, { status: 500 });
  }
}
