import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { applyProductOverrides } from "@/lib/cloudStore";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const [rawProducts, categories] = await Promise.all([
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
      where: {
        slug: {
          in: ["lhb-coaches", "locomotives", "trainboards", "routes-scenery", "simulation-assets"],
        },
      },
      orderBy: { order: "asc" },
    }),
  ]);

  const allProducts = await applyProductOverrides(rawProducts);
  // Defense-in-depth: Ensure no archived, VG-branded, or WHR products appear in the public Shop
  const products = allProducts.filter(
    (p) =>
      p.status !== "ARCHIVED" &&
      !p.name.includes("VG ") &&
      !p.name.includes("VG-") &&
      !p.slug.startsWith("vg-") &&
      !p.name.includes("WHR") &&
      !p.slug.includes("whr") &&
      p.id !== "prod-whr"
  );

  return (
    <Suspense fallback={<div className="min-h-screen bg-railway-darkest text-slate-400 p-8 text-center text-xs">Loading shop add-ons...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
