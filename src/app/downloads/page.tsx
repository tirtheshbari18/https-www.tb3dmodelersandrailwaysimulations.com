import React from "react";
import { prisma } from "@/lib/prisma";
import DownloadsClient from "./DownloadsClient";

export const revalidate = 0;

export default async function DownloadsPage() {
  const [freeFiles, categories] = await Promise.all([
    prisma.productFile.findMany({
      where: { isPublicFree: true },
      include: {
        product: {
          include: {
            category: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return <DownloadsClient freeFiles={freeFiles} categories={categories} />;
}
