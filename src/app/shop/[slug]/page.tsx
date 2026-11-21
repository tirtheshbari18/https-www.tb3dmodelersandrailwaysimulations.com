import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { applySingleProductOverride, applyProductOverrides } from "@/lib/cloudStore";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SLUG_ALIASES: Record<string, string> = {
  "vg-lhb-chaircar-coaches": "lhb-chair-car-coach",
  "vg-lhb-chair-car": "lhb-chair-car-coach",
  "vg-lhb-coaches": "lhb-chair-car-coach",
  "vg-lhb-vistadome-tourist-coach-pack": "lhb-chair-car-coach",
  "vg-lhb-vistadome-coaches": "lhb-chair-car-coach",
  "vg-lhb-rajdhani-express-complete-rake-pack": "indian-railways-lhb-sleeper-coach",
  "vg-lhb-sleeper-coaches-v2-update": "indian-railways-lhb-sleeper-coach",
  "vg-lhb-humsafar-express-special-livery-pack": "lhb-ac-3-tier-coach",
  "vg-lhb-humsafar-coaches-v2": "lhb-ac-3-tier-coach",
  "vg-bangladesh-railway-lhb-rake-pack": "lhb-first-ac-coach",
  "vg-lhb-bangladesh-coaches": "lhb-first-ac-coach",
  "vg-msts-to-open-rails-physics-and-consist-converter-tool": "open-rails-indian-railways-simulation-assets",
  "vg-indian-railways-route-builder-3d-asset-library-vol-1": "msts-indian-railways-route-assets",
  "whr-route-v2-ahmedabad-update": "msts-indian-railways-route-assets",
  "whr-route": "msts-indian-railways-route-assets",
};

async function resolveProduct(rawSlug: string) {
  const decoded = decodeURIComponent(rawSlug).trim();
  const lower = decoded.toLowerCase();
  const resolvedSlug = SLUG_ALIASES[lower] || decoded;

  // 1. Direct query
  let rawProduct = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: resolvedSlug },
        { id: resolvedSlug },
        { slug: decoded },
        { id: decoded },
        { slug: rawSlug },
        { id: rawSlug },
      ],
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      files: true,
      versions: { orderBy: { releaseDate: "desc" } },
    },
  });

  if (rawProduct) return rawProduct;

  // 2. Fuzzy / fallback query across all products
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      files: true,
      versions: { orderBy: { releaseDate: "desc" } },
    },
  });

  const cleanTarget = lower.replace(/[^a-z0-9]/g, "");
  const matched = allProducts.find((p) => {
    const pSlugClean = p.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const pIdClean = p.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      pSlugClean === cleanTarget ||
      pIdClean === cleanTarget ||
      pSlugClean.includes(cleanTarget) ||
      cleanTarget.includes(pSlugClean)
    );
  });

  return matched || allProducts[0] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const rawProduct = await resolveProduct(params.slug);
  const product = await applySingleProductOverride(rawProduct);

  if (!product) return { title: "Product Details | TB PRO" };

  return {
    title: `${product.name} | TB PRO Indian Railways Simulation`,
    description: product.shortDesc || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const rawProduct = await resolveProduct(params.slug);

  if (!rawProduct) {
    notFound();
  }

  const product = await applySingleProductOverride(rawProduct);

  // Related products
  const rawRelated = await prisma.product.findMany({
    where: {
      categoryId: rawProduct.categoryId,
      id: { not: rawProduct.id },
    },
    take: 3,
    include: {
      category: true,
      images: { take: 1 },
    },
  });

  const relatedProducts = await applyProductOverrides(rawRelated);

  return (
    <ProductDetailClient
      product={product!}
      relatedProducts={relatedProducts}
    />
  );
}
