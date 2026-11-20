import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import TrainboardsClient from "./TrainboardsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrainboardsPage() {
  const rawTrainboards = await prisma.trainboard.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  const trainboards = rawTrainboards.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B2852] text-[#A7D2F7] p-8 text-center text-xs flex items-center justify-center">
          Loading train boards catalog...
        </div>
      }
    >
      <TrainboardsClient initialTrainboards={trainboards} />
    </Suspense>
  );
}
