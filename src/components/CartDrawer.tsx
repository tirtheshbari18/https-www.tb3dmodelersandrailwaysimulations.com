"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";

export default function CartDrawer() {
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
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
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
        setCouponMsg({ text: `Coupon applied: ${data.coupon.code}`, isError: false });
        setCouponCode("");
      } else {
        setCouponMsg({ text: data.error || "Invalid coupon", isError: true });
      }
    } catch (err: any) {
      setCouponMsg({ text: "Failed to apply coupon", isError: true });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-futura">
      <div
        className="absolute inset-0 bg-black/60 transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#38D300]" />
              <h2 className="text-base font-semibold text-[#041229]">Your Shopping Cart</h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs font-semibold text-[#041229]">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#041229]">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Explore our premier LHB coaches and routes to begin your journey.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/shop");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#041229] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Browse Shop
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover bg-white border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-medium text-[#041229] line-clamp-1 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-[#041229] mt-1">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#041229]">{formatCurrency(subtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon ({coupon.code})</span>
                    <span>-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#041229] pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/cart");
                  }}
                  className="py-2.5 px-3 rounded-full border border-gray-300 text-xs font-semibold text-[#041229] hover:bg-white text-center transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/checkout");
                  }}
                  className="py-2.5 px-3 rounded-full bg-[#38D300] hover:bg-green-400 text-black text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
