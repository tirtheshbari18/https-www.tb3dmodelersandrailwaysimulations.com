import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { applySingleProductOverride, applyProductOverrides } from "@/lib/cloudStore";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const rawProduct = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
  });

  const product = await applySingleProductOverride(rawProduct);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | VG-3D Modelers & Railway Simulations`,
    description: product.shortDesc || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const rawProduct = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      files: true,
      versions: { orderBy: { releaseDate: "desc" } },
    },
  });

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
