import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const trainboards = await prisma.trainboard.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ trainboards });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch trainboards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, zone, zoneName, size, downloadUrl } = body;

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

    const newTb = await prisma.trainboard.create({
      data: {
        name: name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`,
        zone: zone.toUpperCase(),
        zoneName: calculatedZoneName,
        size: size || "2.5 MB",
        downloadUrl: downloadUrl || `/downloads/trainboards/${zone.toUpperCase()}/${name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`}`,
      },
    });

    return NextResponse.json({ success: true, trainboard: newTb });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create trainboard" }, { status: 500 });
  }
}
