"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountTotal,
    finalTotal,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidating(true);
    setCouponMsg(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.coupon) {
        applyCoupon(data.coupon);
        setCouponMsg({ text: `Coupon "${data.coupon.code}" applied!`, isError: false });
        setCouponCode("");
      } else {
        setCouponMsg({ text: data.error || "Invalid coupon code", isError: true });
      }
    } catch (err: any) {
      setCouponMsg({ text: "Failed to validate coupon", isError: true });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#041229] pb-20 font-futura">
      {/* Header Banner */}
      <div className="py-12 bg-gray-50 border-b border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#041229] tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">Review your selected railway simulation add-ons</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-lg border border-gray-200 p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-sm">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-normal text-[#041229]">Your cart is currently empty</h2>
            <p className="text-xs text-gray-600 mt-2 mb-6">
              Browse our premier Linke Hofmann Busch (LHB) coaches, Vistadome observation carriages, and route scenery packs to begin your train simulation adventure.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#041229] hover:bg-black text-white text-xs font-semibold shadow transition-colors"
            >
              Browse Simulation Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="font-semibold text-[#041229] text-base">
                    Cart Items ({items.length})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-16 rounded object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                        />
                        <div>
                          <span className="text-[10px] text-gray-500 font-semibold uppercase">
                            {item.categoryName || "Simulation Addon"}
                          </span>
                          <h4 className="font-medium text-sm text-[#041229] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            SKU: {item.sku} • {item.compatibility || "Open Rails / MSTS"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                        <div className="text-right">
                          <p className="text-base font-bold text-[#041229]">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Coupon */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
                <h3 className="font-semibold text-base text-[#041229] pb-3 border-b border-gray-200">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#041229]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-emerald-700">
                      <span className="flex items-center gap-1">
                        Coupon ({coupon.code})
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:underline ml-1"
                        >
                          [Remove]
                        </button>
                      </span>
                      <span>-{formatCurrency(discountTotal)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-bold text-[#041229]">
                    <span>Total Amount</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. RAILWAY10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs text-[#041229] uppercase focus:outline-none focus:border-[#041229]"
                    />
                    <button
                      type="submit"
                      disabled={isValidating || !couponCode.trim()}
                      className="px-4 py-2 bg-[#041229] hover:bg-black text-white text-xs font-semibold rounded disabled:opacity-50"
                    >
                      {isValidating ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponMsg && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        couponMsg.isError ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </form>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-3 rounded-full bg-[#38D300] hover:bg-green-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
