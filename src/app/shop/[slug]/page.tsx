import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
  });

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
  const product = await prisma.product.findFirst({
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

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 3,
    include: {
      category: true,
      images: { take: 1 },
    },
  });

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
