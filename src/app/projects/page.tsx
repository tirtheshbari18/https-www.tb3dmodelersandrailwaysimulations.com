import React from "react";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 0;

export default async function ProjectsPage() {
  const [projects, products] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.product.findMany({
      take: 6,
      include: {
        category: true,
        images: { take: 1 },
      },
    }),
  ]);

  return <ProjectsClient projects={projects} products={products} />;
}
