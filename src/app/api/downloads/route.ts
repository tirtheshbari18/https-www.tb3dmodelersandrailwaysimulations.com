import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // all, free, purchased

    // 1. Fetch all Public Free Files
    const freeFiles = await prisma.productFile.findMany({
      where: { isPublicFree: true },
      include: {
        product: {
          include: {
            category: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch User Entitlements if authenticated
    let userEntitlements: any[] = [];
    if (user) {
      userEntitlements = await prisma.downloadEntitlement.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          productFile: true,
          product: {
            include: {
              category: true,
              images: { take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      isAuthenticated: !!user,
      freeFiles,
      userEntitlements,
    });
  } catch (error: any) {
    console.error("Downloads list error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve downloads" },
      { status: 500 }
    );
  }
}
