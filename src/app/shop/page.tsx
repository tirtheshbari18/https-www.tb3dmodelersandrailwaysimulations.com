import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";

export const revalidate = 0;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
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
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-railway-darkest text-slate-400 p-8 text-center text-xs">Loading shop add-ons...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
