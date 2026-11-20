import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySlideOverrides } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const rawSlides = await prisma.homeSlide.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const slides = await applySlideOverrides(rawSlides);
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}
