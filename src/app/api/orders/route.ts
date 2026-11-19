import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      billingAddress,
      city,
      state,
      country,
      pincode,
      couponCode,
      paymentMethod,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    // Verify products and calculate price from database
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: "One or more products in your cart are no longer available" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItemsData = dbProducts.map((p) => {
      const price = p.salePrice ?? p.regularPrice;
      subtotal += price;
      return {
        productId: p.id,
        productName: p.name,
        price,
        quantity: 1,
      };
    });

    // Validate coupon if applied
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.isActive && subtotal >= coupon.minPurchase) {
        if (coupon.discountPercent) {
          discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
        } else if (coupon.discountAmount) {
          discountAmount = Math.min(subtotal, coupon.discountAmount);
        }
      }
    }

    const finalAmount = Math.max(0, subtotal - discountAmount);
    const orderNumber = `VG-ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.id : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone || null,
        billingAddress: billingAddress || null,
        city: city || null,
        state: state || null,
        country: country || "India",
        pincode: pincode || null,
        totalAmount: subtotal,
        discountAmount,
        finalAmount,
        status: finalAmount === 0 ? "PAID" : "PENDING",
        paymentMethod: paymentMethod || "RAZORPAY",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // If order total is 0 (all items free), grant download entitlement right away
    if (finalAmount === 0) {
      for (const item of order.items) {
        const files = await prisma.productFile.findMany({
          where: { productId: item.productId },
        });
        for (const file of files) {
          if (user) {
            await prisma.downloadEntitlement.create({
              data: {
                userId: user.id,
                productId: item.productId,
                productFileId: file.id,
                orderId: order.id,
                maxDownloads: 10,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: user.id }, { customerEmail: user.email }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}
