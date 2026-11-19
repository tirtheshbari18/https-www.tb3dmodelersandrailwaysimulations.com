import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const slides = await prisma.homeSlide.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}
