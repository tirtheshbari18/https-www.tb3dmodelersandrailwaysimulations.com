import React from "react";
import { prisma } from "@/lib/prisma";
import { applyProductOverrides } from "@/lib/cloudStore";
import CoachesClient from "./CoachesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "LHB Coaches | TB PRO Indian Railways Simulation",
  description:
    "Explore authentic Indian Railways LHB coaching stock for Open Rails and MSTS. AC First Class, AC 2-Tier, AC 3-Tier, Sleeper, Chair Car, and Vistadome coaches crafted with engineering precision.",
};

export default async function CoachesPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: { not: "ARCHIVED" },
      },
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
  ]);

  const activeProducts = await applyProductOverrides(products);

  // Filter products relevant to LHB coaching stock (excluding any archived/VG/WHR products)
  const coachProducts = activeProducts.filter((p) => {
    if (p.status === "ARCHIVED" || p.name.includes("VG ") || p.name.includes("VG-") || p.name.includes("WHR") || p.id === "prod-whr") return false;
    const catSlug = p.category?.slug?.toLowerCase() || "";
    const prodName = p.name?.toLowerCase() || "";
    return (
      catSlug.includes("coach") ||
      catSlug.includes("chair") ||
      catSlug.includes("sleeper") ||
      catSlug.includes("lhb") ||
      prodName.includes("lhb") ||
      prodName.includes("coach")
    );
  });

  return (
    <CoachesClient
      initialCoaches={coachProducts.length > 0 ? coachProducts : activeProducts}
      categories={categories}
    />
  );
}
