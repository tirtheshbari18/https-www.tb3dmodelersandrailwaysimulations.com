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
    <div className="fixed inset-0 z-50 overflow-hidden font-josefin">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#174EA6]/30 flex items-center justify-between bg-[#101D35] text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#174EA6] text-[#00B8D9] flex items-center justify-center font-bold border border-[#00B8D9]/40">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">TB PRO Cart</h2>
                <span className="text-[11px] text-[#00B8D9]">
                  {items.length} {items.length === 1 ? "asset" : "assets"} ready
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F4F7FB]">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-[#174EA6]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#101D35]">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Explore our premier LHB coaches and routes to begin your simulation journey.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/shop");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174EA6] hover:bg-[#101D35] text-white text-xs font-semibold transition-all shadow-md"
                >
                  Browse Simulator Shop
                  <ArrowRight className="w-4 h-4 text-[#00B8D9]" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3.5 rounded-xl bg-white border border-gray-200 items-center justify-between shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-contain bg-[#F4F7FB] border border-gray-100 flex-shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-[#101D35] line-clamp-1 leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {item.categoryName || "LHB Coach"}
                    </span>
                    <p className="text-xs font-bold text-[#174EA6] mt-1">
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
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#172033]">{formatCurrency(subtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Coupon ({coupon.code})</span>
                    <span>-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#101D35] pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#174EA6]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/cart");
                  }}
                  className="py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-[#101D35] hover:bg-gray-50 text-center transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/checkout");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#00B8D9] hover:from-[#101D35] hover:to-[#174EA6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
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
