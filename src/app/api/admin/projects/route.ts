import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      projectNo,
      title,
      subtitle,
      description,
      fullContent,
      mainImage,
      status,
      compatibility,
      order,
      isPublished,
    } = body;

    const slug = slugify(title);

    const project = await prisma.project.create({
      data: {
        projectNo: projectNo || "08",
        title,
        slug,
        subtitle: subtitle || "",
        description: description || "",
        fullContent: fullContent || "",
        mainImage: mainImage || "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1000",
        status: status || "COMPLETED",
        compatibility: compatibility || "Open Rails / MSTS",
        order: parseInt(order) || 0,
        isPublished: isPublished !== undefined ? !!isPublished : true,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
