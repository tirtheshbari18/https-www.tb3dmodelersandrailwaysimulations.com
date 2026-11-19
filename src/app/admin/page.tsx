import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("vg_auth_token")?.value;

  if (!token) {
    redirect("/login?redirect=/admin");
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    redirect("/login?redirect=/admin");
  }

  // Fetch initial data
  const [
    products,
    categories,
    projects,
    orders,
    customers,
    enquiries,
    settings,
    trainboards,
  ] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        files: true,
      },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payments: true,
      },
    }),
    prisma.user.findMany({
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
    }),
    prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.websiteSetting.findUnique({
      where: { id: "default" },
    }),
    prisma.trainboard.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminClient
      initialProducts={products}
      categories={categories}
      initialProjects={projects}
      initialOrders={orders}
      initialCustomers={customers}
      initialEnquiries={enquiries}
      initialSettings={settings}
      initialTrainboards={trainboards}
      currentAdmin={payload}
    />
  );
}
