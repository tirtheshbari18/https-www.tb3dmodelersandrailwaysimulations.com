import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySingleProductOverride, applyProductOverrides } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

const SLUG_ALIASES: Record<string, string> = {
  "vg-lhb-chaircar-coaches": "vg-lhb-coaches",
  "vg-lhb-chair-car": "vg-lhb-coaches",
  "vg-lhb-vistadome-tourist-coach-pack": "vg-lhb-vistadome-coaches",
  "vg-lhb-rajdhani-express-complete-rake-pack": "vg-lhb-sleeper-coaches-v2-update",
  "vg-lhb-humsafar-express-special-livery-pack": "vg-lhb-humsafar-coaches-v2",
  "vg-bangladesh-railway-lhb-rake-pack": "vg-lhb-bangladesh-coaches",
  "vg-msts-to-open-rails-physics-and-consist-converter-tool": "whr-route-v2-ahmedabad-update",
  "vg-indian-railways-route-builder-3d-asset-library-vol-1": "whr-route-v2-ahmedabad-update",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const decoded = decodeURIComponent(id).trim();
    const lower = decoded.toLowerCase();
    const resolvedSlug = SLUG_ALIASES[lower] || decoded;

    let rawProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { id: resolvedSlug },
          { slug: resolvedSlug },
          { id: decoded },
          { slug: decoded },
          { id: id },
          { slug: id },
        ],
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        files: true,
        versions: { orderBy: { releaseDate: "desc" } },
      },
    });

    if (!rawProduct) {
      const allProducts = await prisma.product.findMany({
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          files: true,
          versions: { orderBy: { releaseDate: "desc" } },
        },
      });

      const cleanTarget = lower.replace(/[^a-z0-9]/g, "");
      const matched = allProducts.find((p) => {
        const pSlugClean = p.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
        const pIdClean = p.id.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          pSlugClean === cleanTarget ||
          pIdClean === cleanTarget ||
          pSlugClean.includes(cleanTarget) ||
          cleanTarget.includes(pSlugClean)
        );
      });

      rawProduct = matched || allProducts[0] || null;
    }

    if (!rawProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = await applySingleProductOverride(rawProduct);

    // Related products in same category
    const rawRelated = await prisma.product.findMany({
      where: {
        categoryId: rawProduct.categoryId,
        id: { not: rawProduct.id },
      },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    const relatedProducts = await applyProductOverrides(rawRelated);

    return NextResponse.json({ product, relatedProducts });
  } catch (error: any) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
