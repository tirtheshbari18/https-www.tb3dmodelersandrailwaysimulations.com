import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        address: true,
        address2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        approvedAt: true,
        approvedBy: true,
        rejectedAt: true,
        rejectionReason: true,
        suspendedAt: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            entitlements: true,
          },
        },
      },
    });

    const counts = {
      all: await prisma.user.count(),
      pending: await prisma.user.count({ where: { status: "PENDING_APPROVAL" } }),
      approved: await prisma.user.count({ where: { status: "APPROVED" } }),
      rejected: await prisma.user.count({ where: { status: "REJECTED" } }),
      suspended: await prisma.user.count({ where: { status: "SUSPENDED" } }),
    };

    return NextResponse.json({ users, counts });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user list" },
      { status: 500 }
    );
  }
}
