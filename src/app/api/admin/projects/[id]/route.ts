import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        projectNo: body.projectNo,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        fullContent: body.fullContent,
        mainImage: body.mainImage,
        status: body.status,
        compatibility: body.compatibility,
        order: parseInt(body.order) || 0,
        isPublished: body.isPublished !== undefined ? !!body.isPublished : true,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
