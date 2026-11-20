import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyProductOverrides } from "@/lib/cloudStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const compatibility = searchParams.get("compatibility");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort"); // price-asc, price-desc, newest
    const featured = searchParams.get("featured");

    const where: any = {};

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (compatibility && compatibility !== "all") {
      where.compatibility = { contains: compatibility };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { salePrice: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { salePrice: "desc" };
    } else if (sort === "name-asc") {
      orderBy = { name: "asc" };
    }

    const [rawProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
        },
      }),
      prisma.productCategory.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    const products = await applyProductOverrides(rawProducts);

    return NextResponse.json({ products, categories });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
