import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";
import { applyTrainboardOverrides } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const rawTrainboards = await prisma.trainboard.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    const trainboards = await applyTrainboardOverrides(rawTrainboards);
    return NextResponse.json({ trainboards });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch trainboards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    if (!name || !zone) {
      return NextResponse.json({ error: "Name and Zone are required" }, { status: 400 });
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

    const calculatedZoneName = zoneName || defaultZoneNames[zone.toUpperCase()] || `${zone.toUpperCase()} Zone`;
    const cleanName = name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`;

    const newTb = await prisma.trainboard.create({
      data: {
        name: cleanName,
        zone: zone.toUpperCase(),
        zoneName: calculatedZoneName,
        size: size || "2.5 MB",
        downloadUrl: downloadUrl || `/downloads/trainboards/${zone.toUpperCase()}/${cleanName}`,
        description: description?.trim() || null,
        image: image || null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        specifications: specifications || null,
        regularPrice: body.regularPrice !== undefined ? parseFloat(body.regularPrice) : 0,
        salePrice: body.salePrice !== undefined && body.salePrice !== null && body.salePrice !== "" ? parseFloat(body.salePrice) : null,
        category: body.category?.trim() || "Trainboards",
        discountPercent: body.discountPercent !== undefined ? parseFloat(body.discountPercent) : 0,
        isSpecialOffer: body.isSpecialOffer !== undefined ? Boolean(body.isSpecialOffer) : false,
        status: status || "AVAILABLE",
      },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "TRAINBOARD_CREATED",
          entity: "TRAINBOARD",
          entityId: newTb.id,
          details: `Created trainboard "${newTb.name}" for ${newTb.zone} (${newTb.size}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, trainboard: newTb });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create trainboard" }, { status: 500 });
  }
}
