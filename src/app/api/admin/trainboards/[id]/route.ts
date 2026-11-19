import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, zone, zoneName, size, downloadUrl } = body;

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
      },
    });

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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.trainboard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Trainboard deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete trainboard" }, { status: 500 });
  }
}
