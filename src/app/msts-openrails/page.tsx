import React from "react";
import { prisma } from "@/lib/prisma";
import { applyProductOverrides } from "@/lib/cloudStore";
import MstsOpenRailsClient from "./MstsOpenRailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "MSTS & Open Rails | TB PRO Indian Railways Simulation",
  description:
    "Complete simulation guide and resource center for Microsoft Train Simulator (MSTS) and Open Rails. Featuring Indian Railways routes, WAP-7 electric locomotives, LHB consists, activities, and installation guides.",
};

export default async function MstsOpenRailsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  const activeProducts = await applyProductOverrides(products);

  return <MstsOpenRailsClient compatibleProducts={activeProducts} />;
}
