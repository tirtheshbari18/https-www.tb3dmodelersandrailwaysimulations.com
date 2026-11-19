import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      paidOrders,
      pendingOrders,
      totalDownloads,
      newEnquiries,
      recentOrders,
      recentActivities
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: "PAID" }, select: { finalAmount: true } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.downloadLog.count(),
      prisma.contactEnquiry.count({ where: { status: "NEW" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalProducts,
        totalOrders,
        successfulPayments: paidOrders.length,
        pendingPayments: pendingOrders,
        totalRevenue,
        totalDownloads,
        newEnquiries,
      },
      recentOrders,
      recentActivities,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard statistics" }, { status: 500 });
  }
}
