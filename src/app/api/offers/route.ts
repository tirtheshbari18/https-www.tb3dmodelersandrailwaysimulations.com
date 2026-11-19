import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/offers - Public active offers
export async function GET() {
  try {
    const now = new Date();
    const activeOffers = await prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      orderBy: { discountPercent: "desc" },
    });

    return NextResponse.json(activeOffers);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
