import React from "react";
import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export const revalidate = 0;

export const metadata = {
  title: "Professional Railway 3D & CAD Services | VG-3D Modelers",
  description:
    "Engineering Design, 3D Modelling, Product Design, Simulator Physics, 4K Visualization, and Installation Support for train simulators.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return <ServicesClient services={services} />;
}
