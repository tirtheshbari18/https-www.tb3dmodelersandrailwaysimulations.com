import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    const [
      totalCustomers,
      totalProducts,
      totalCoaches,
      totalTrainboards,
      availableProducts,
      outOfStockProducts,
      activeOffers,
      totalOrders,
      paidOrders,
      pendingOrders,
      totalDownloads,
      newEnquiries,
      recentOrders,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({
        where: {
          OR: [
            { category: { name: { contains: "Coach" } } },
            { name: { contains: "Coach" } },
            { name: { contains: "COACHES" } },
          ],
        },
      }),
      prisma.trainboard.count(),
      prisma.product.count({ where: { status: "AVAILABLE" } }),
      prisma.product.count({ where: { status: "OUT_OF_STOCK" } }),
      prisma.offer.count({ where: { isActive: true } }),
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
        take: 12,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalProducts,
        totalCoaches,
        totalTrainboards,
        availableProducts,
        outOfStockProducts,
        activeOffers,
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
