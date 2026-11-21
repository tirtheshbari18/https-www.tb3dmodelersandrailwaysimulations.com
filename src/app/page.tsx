import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { applyProductOverrides, applySlideOverrides } from "@/lib/cloudStore";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Dynamic server component

export default async function HomePage() {
  // Fetch dynamic content from Prisma
  const [
    featuredProducts,
    newArrivals,
    categories,
    projects,
    services,
    settings,
    homeSlides,
  ] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: { not: "ARCHIVED" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.product.findMany({
      where: {
        status: { not: "ARCHIVED" },
        isNewArrival: true,
      },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      take: 6,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.websiteSetting.findUnique({
      where: { id: "default" },
    }),
    prisma.homeSlide.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const [activeFeatured, activeSlides] = await Promise.all([
    applyProductOverrides(featuredProducts),
    applySlideOverrides(homeSlides),
  ]);

  const cleanFeatured = activeFeatured.filter(
    (p) =>
      p.status !== "ARCHIVED" &&
      !p.name.includes("VG ") &&
      !p.name.includes("VG-") &&
      !p.slug.startsWith("vg-")
  );

  return (
    <HomeClient
      featuredProducts={cleanFeatured}
      newArrivals={newArrivals.filter((p) => p.status !== "ARCHIVED")}
      categories={categories}
      projects={projects}
      services={services}
      settings={settings}
      homeSlides={activeSlides}
    />
  );
}
