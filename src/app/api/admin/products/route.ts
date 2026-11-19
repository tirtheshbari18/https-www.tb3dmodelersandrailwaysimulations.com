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

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        files: true,
      },
    });

    const categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ products, categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch admin products" }, { status: 500 });
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
      name,
      sku,
      shortDesc,
      description,
      regularPrice,
      salePrice,
      isFree,
      categoryId,
      compatibility,
      version,
      fileSize,
      status,
      stockQuantity,
      specifications,
      isFeatured,
      isNewArrival,
      imageUrl,
      fileName,
    } = body;

    if (!name || regularPrice === undefined || !categoryId) {
      return NextResponse.json({ error: "Name, price and category are required" }, { status: 400 });
    }

    const slug = slugify(name) + "-" + Math.floor(Math.random() * 1000);
    const skuCode = sku || `VG-${Date.now().toString().slice(-6)}`;

    const qty = stockQuantity !== undefined ? parseInt(stockQuantity, 10) : 999;
    const finalStatus = qty <= 0 ? "OUT_OF_STOCK" : (status || "AVAILABLE");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: skuCode,
        shortDesc: shortDesc || "",
        description: description || "",
        regularPrice: parseFloat(regularPrice),
        salePrice: salePrice !== null && salePrice !== undefined && salePrice !== "" ? parseFloat(salePrice) : null,
        isFree: !!isFree,
        categoryId,
        compatibility: compatibility || "Open Rails / MSTS",
        version: version || "v1.0",
        fileSize: fileSize || "100 MB",
        status: finalStatus,
        stockQuantity: qty,
        specifications: specifications || null,
        isFeatured: !!isFeatured,
        isNewArrival: !!isNewArrival,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  alt: name,
                  isPrimary: true,
                  order: 0,
                },
              ],
            }
          : undefined,
        files: fileName
          ? {
              create: [
                {
                  name: fileName,
                  fileName: fileName,
                  fileFormat: "ZIP",
                  fileSize: fileSize || "100 MB",
                  version: version || "v1.0",
                  storagePath: `/downloads/files/${fileName}`,
                  isPublicFree: !!isFree,
                },
              ],
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        files: true,
      },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PRODUCT_CREATED",
          entity: "PRODUCT",
          entityId: product.id,
          details: `Created coach/product "${product.name}" (SKU: ${product.sku}, Price: ₹${product.regularPrice}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin product create error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
