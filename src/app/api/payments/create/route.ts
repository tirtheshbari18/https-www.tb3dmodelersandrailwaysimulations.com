import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderId, gateway } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(order.finalAmount * 100);

    // Razorpay Integration Payload
    if (gateway === "RAZORPAY") {
      const razorpayKeyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_vg_railway_sim_key";
      const rzpOrderId = `rzp_ord_${Date.now()}_${order.id.slice(0, 8)}`;

      return NextResponse.json({
        gateway: "RAZORPAY",
        key: razorpayKeyId,
        amount: amountInPaise,
        currency: "INR",
        name: "VG-3D Modelers & Railway Simulations",
        description: `Order #${order.orderNumber} - Railway Simulator Add-ons`,
        image: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=200",
        order_id: rzpOrderId,
        prefill: {
          name: order.customerName,
          email: order.customerEmail,
          contact: order.customerPhone || "",
        },
        theme: {
          color: "#D21312",
        },
      });
    }

    // Stripe Integration Payload
    if (gateway === "STRIPE") {
      return NextResponse.json({
        gateway: "STRIPE",
        clientSecret: `pi_test_${order.id}_secret_${Date.now()}`,
        amount: amountInPaise,
        currency: "inr",
        publishableKey:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
          "pk_test_vg_simulations_demo_key",
      });
    }

    // Simulator / Instant Verification Payload
    return NextResponse.json({
      gateway: "SIMULATOR",
      amount: order.finalAmount,
      currency: "INR",
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
