import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const qty = body.stockQuantity !== undefined ? parseInt(body.stockQuantity, 10) : existing.stockQuantity;
    let newStatus = body.status !== undefined ? body.status : existing.status;
    if (qty <= 0 && newStatus === "AVAILABLE") {
      newStatus = "OUT_OF_STOCK";
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        sku: body.sku !== undefined ? body.sku : existing.sku,
        shortDesc: body.shortDesc !== undefined ? body.shortDesc : existing.shortDesc,
        description: body.description !== undefined ? body.description : existing.description,
        specifications: body.specifications !== undefined ? body.specifications : existing.specifications,
        regularPrice: body.regularPrice !== undefined ? parseFloat(body.regularPrice) : existing.regularPrice,
        salePrice: body.salePrice !== undefined ? (body.salePrice !== null && body.salePrice !== "" ? parseFloat(body.salePrice) : null) : existing.salePrice,
        isFree: body.isFree !== undefined ? !!body.isFree : existing.isFree,
        categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
        compatibility: body.compatibility !== undefined ? body.compatibility : existing.compatibility,
        version: body.version !== undefined ? body.version : existing.version,
        fileSize: body.fileSize !== undefined ? body.fileSize : existing.fileSize,
        status: newStatus,
        stockQuantity: qty,
        discountPercent: body.discountPercent !== undefined ? parseFloat(body.discountPercent) : (existing as any).discountPercent || 0,
        isSpecialOffer: body.isSpecialOffer !== undefined ? Boolean(body.isSpecialOffer) : (existing as any).isSpecialOffer || false,
        specialOfferText: body.specialOfferText !== undefined ? body.specialOfferText : (existing as any).specialOfferText || "Special Offer",
        isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : existing.isFeatured,
        isNewArrival: body.isNewArrival !== undefined ? !!body.isNewArrival : existing.isNewArrival,
      },
      include: {
        category: true,
        images: true,
        files: true,
      },
    });

    // Update primary image if provided
    if (body.imageUrl) {
      const primaryImage = existing.images.find((img) => img.isPrimary) || existing.images[0];
      if (primaryImage) {
        await prisma.productImage.update({
          where: { id: primaryImage.id },
          data: { url: body.imageUrl },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: body.imageUrl,
            isPrimary: true,
            order: 0,
          },
        });
      }
    }

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PRODUCT_UPDATED",
          entity: "PRODUCT",
          entityId: id,
          details: `Updated "${updated.name}" (Price: ₹${updated.regularPrice}, Offer: ₹${updated.salePrice || "None"}, Status: ${updated.status}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PRODUCT_DELETED",
          entity: "PRODUCT",
          entityId: id,
          details: `Permanently deleted product "${existing.name}" (SKU: ${existing.sku}).`,
        },
      });
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
