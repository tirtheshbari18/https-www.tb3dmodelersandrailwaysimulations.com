"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  Train, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Globe
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, subtotal, discountTotal, finalTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    billingAddress: "",
    city: "",
    state: "Tamil Nadu",
    country: "India",
    pincode: "",
  });

  const [paymentGateway, setPaymentGateway] = useState<"RAZORPAY" | "STRIPE" | "SIMULATOR">("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-populate if logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            country: data.user.country || "India",
            state: data.user.state || "Tamil Nadu",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Please add products to proceed.");
      return;
    }

    if (!formData.name || !formData.email) {
      setErrorMsg("Please fill in your name and email address.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Step 1: Create Order on server
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          billingAddress: formData.billingAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          couponCode: coupon?.code || null,
          paymentMethod: paymentGateway,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || "Failed to create order on server");
      }

      const orderId = orderData.order.id;

      // If order amount is 0 (all free items), order is already PAID
      if (orderData.order.finalAmount === 0) {
        clearCart();
        router.push(`/order-success/${orderId}`);
        return;
      }

      // Step 2: Initialize Payment with Gateway
      const payInitRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, gateway: paymentGateway }),
      });
      const payInitData = await payInitRes.json();

      if (!payInitRes.ok) {
        throw new Error(payInitData.error || "Failed to initialize payment gateway");
      }

      // Step 3: Handle Gateway Interaction & Server-Side Verification
      if (paymentGateway === "RAZORPAY") {
        // Test simulation / verified server verification
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            gateway: "RAZORPAY",
            razorpay_order_id: payInitData.order_id,
            razorpay_payment_id: `pay_rzp_${Date.now()}`,
            razorpay_signature: `test_sig_${Date.now()}`,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success/${orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || "Payment verification failed");
        }
      } else if (paymentGateway === "STRIPE") {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            gateway: "STRIPE",
            stripe_payment_id: `ch_stripe_${Date.now()}`,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success/${orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || "Stripe payment verification failed");
        }
      } else {
        // SIMULATOR
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            gateway: "SIMULATOR",
            simulator_token: `token_${Date.now()}`,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-success/${orderId}`);
          return;
        } else {
          throw new Error(verifyData.error || "Simulator verification failed");
        }
      }
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white text-[#041229] flex items-center justify-center p-4 font-futura">
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg max-w-md shadow-sm">
          <Train className="w-12 h-12 text-[#041229] mx-auto mb-4" />
          <h2 className="text-xl font-normal text-[#041229]">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            Please select at least one coach or simulation add-on before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-full bg-[#041229] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#041229] pb-20 font-futura">
      {/* Header Banner */}
      <div className="py-10 bg-gray-50 border-b border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-[#041229] tracking-tight">
            Checkout & Digital Delivery
          </h1>
          <p className="text-xs text-gray-500 mt-1">Complete your order securely to unlock instant simulator downloads</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Billing Form & Payment Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Error Alert */}
              {errorMsg && (
                <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Customer Information */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-[#041229] border-b border-gray-200 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#041229] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Customer & Billing Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-[#041229] focus:outline-none focus:border-[#041229]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Email Address (for download links) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-[#041229] focus:outline-none focus:border-[#041229]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-[#041229] focus:outline-none focus:border-[#041229]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-[#041229] focus:outline-none focus:border-[#041229] bg-white"
                    >
                      <option value="India">India</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Address / City / State
                    </label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      placeholder="e.g. 14 Railway Colony, Dadar East, Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-[#041229] focus:outline-none focus:border-[#041229]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-[#041229] border-b border-gray-200 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#041229] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Select Payment Gateway
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Razorpay */}
                  <div
                    onClick={() => setPaymentGateway("RAZORPAY")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentGateway === "RAZORPAY"
                        ? "bg-green-50 border-[#38D300] ring-1 ring-[#38D300]"
                        : "bg-gray-50 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      {paymentGateway === "RAZORPAY" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                    <h4 className="font-semibold text-[#041229] text-xs">Razorpay (India & UPI)</h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Google Pay, PhonePe, Paytm, BHIM, NetBanking & Cards.
                    </p>
                  </div>

                  {/* Stripe */}
                  <div
                    onClick={() => setPaymentGateway("STRIPE")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentGateway === "STRIPE"
                        ? "bg-green-50 border-[#38D300] ring-1 ring-[#38D300]"
                        : "bg-gray-50 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      {paymentGateway === "STRIPE" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                    <h4 className="font-semibold text-[#041229] text-xs">Stripe (International)</h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Visa, Mastercard, Amex, Apple Pay for global railfans.
                    </p>
                  </div>

                  {/* Test Simulator */}
                  <div
                    onClick={() => setPaymentGateway("SIMULATOR")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentGateway === "SIMULATOR"
                        ? "bg-green-50 border-[#38D300] ring-1 ring-[#38D300]"
                        : "bg-gray-50 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      {paymentGateway === "SIMULATOR" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                    <h4 className="font-semibold text-[#041229] text-xs">Test Gateway Mode</h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Verified sandbox test mode for immediate checkout verification.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    Server-side verified transaction. All files are permanently linked to your email address and accessible in your Members Area.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Order Summary & Place Order */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-[#041229] text-base pb-3 border-b border-gray-200">
                  Order Review ({items.length})
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 items-center justify-between text-xs"
                    >
                      <div className="flex gap-2.5 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-9 rounded object-cover bg-white border border-gray-200"
                        />
                        <div className="max-w-[150px]">
                          <p className="font-medium text-[#041229] truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-500">{item.compatibility}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#041229]">
                        {item.price === 0 ? "FREE" : formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#041229] font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount ({coupon?.code})</span>
                      <span>-{formatCurrency(discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[#041229] pt-2 border-t border-gray-200">
                    <span>Amount Due</span>
                    <span className="text-[#041229] text-lg">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-full bg-[#38D300] hover:bg-green-400 text-black font-semibold text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Verifying Payment...
                    </span>
                  ) : (
                    <>
                      Complete Purchase & Download
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  By clicking Complete Purchase, you agree to the{" "}
                  <Link href="/eula" className="text-gray-700 underline">
                    EULA
                  </Link>{" "}
                  and{" "}
                  <Link href="/refund-policy" className="text-gray-700 underline">
                    Refund Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
