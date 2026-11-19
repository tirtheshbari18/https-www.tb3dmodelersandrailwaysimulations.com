import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 }
      );
    }

    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json(
        { error: "This coupon code has expired" },
        { status: 400 }
      );
    }

    if (cartTotal && cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ₹${coupon.minPurchase} required to apply this coupon`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        minPurchase: coupon.minPurchase,
      },
    });
  } catch (error: any) {
    console.error("Coupon validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
