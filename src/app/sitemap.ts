import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vg3dmodelersandrailwaysimulations.com";

  let products: any[] = [];
  let projects: any[] = [];

  try {
    [products, projects] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
  } catch (e) {
    // fallback
  }

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/shop",
    "/downloads",
    "/services",
    "/contact",
    "/terms",
    "/privacy",
    "/eula",
    "/refund-policy",
    "/disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/projects#${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes];
}
