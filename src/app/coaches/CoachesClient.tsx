"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Eye, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Info, 
  SlidersHorizontal,
  Gauge,
  Zap,
  Wrench
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";
import QuickViewModal from "@/components/QuickViewModal";

interface CoachesClientProps {
  initialCoaches: any[];
  categories: any[];
}

export default function CoachesClient({ initialCoaches, categories }: CoachesClientProps) {
  const { addToCart, isInCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Coach category classification filter
  const filterTabs = [
    { id: "all", label: "All LHB Coaches" },
    { id: "sleeper", label: "Sleeper Class (SL)" },
    { id: "chaircar", label: "AC Chair Car (CC)" },
    { id: "3tier", label: "AC 3-Tier (3A)" },
    { id: "vistadome", label: "Vistadome (EV)" },
    { id: "general", label: "General Second (GS)" },
  ];

  const filteredCoaches = initialCoaches.filter((coach) => {
    if (selectedCategory === "all") return true;
    const name = coach.name.toLowerCase();
    const cat = (coach.category?.name || "").toLowerCase();

    if (selectedCategory === "sleeper") {
      return name.includes("sleeper") || cat.includes("sleeper");
    }
    if (selectedCategory === "chaircar") {
      return name.includes("chaircar") || name.includes("chair car") || name.includes("executive") || cat.includes("chair");
    }
    if (selectedCategory === "3tier") {
      return name.includes("3tier") || name.includes("3-tier") || name.includes("3 tier") || cat.includes("3-tier");
    }
    if (selectedCategory === "vistadome") {
      return name.includes("vistadome") || cat.includes("vistadome");
    }
    if (selectedCategory === "general") {
      return name.includes("general") || name.includes("second") || name.includes("gs") || cat.includes("general");
    }
    return true;
  });

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen font-josefin pb-20">
      {/* 1. Dedicated LHB Hero Section */}
      <div className="relative w-full bg-[#101D35] text-white py-16 sm:py-24 border-b border-[#174EA6]/30 overflow-hidden">
        {/* Background Subtle Gradient & Train Accent */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/assets/tbpro/hero_lhb_train.jpg"
            alt="TB PRO LHB Train"
            className="w-full h-full object-cover filter blur-sm"
          />
        </div>

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Column: Heading and Details */}
            <div className="lg:w-7/12 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174EA6]/50 border border-[#00B8D9]/40 text-[#00B8D9] text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AUTHENTIC INDIAN RAILWAYS COACHING STOCK</span>
              </div>

              <h1 className="font-josefin text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Linke Hofmann Busch <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-blue-300">
                  (LHB) Coaches
                </span>
              </h1>

              <p className="font-josefin text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Experience engineering perfection with TB PRO&apos;s hyper-realistic LHB fleet. Meticulously modeled after Indian Railways specifications featuring authentic FIAT bogies, axle-mounted disc brakes, operational night lighting, and true-to-life physics for Open Rails &amp; MSTS.
              </p>

              {/* Engineering Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-[#00B8D9] text-xs font-bold uppercase">
                    <Gauge className="w-4 h-4" />
                    <span>Speed Rating</span>
                  </div>
                  <div className="text-white text-lg font-bold mt-1">160 – 200 km/h</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-[#00B8D9] text-xs font-bold uppercase">
                    <Zap className="w-4 h-4" />
                    <span>Suspension</span>
                  </div>
                  <div className="text-white text-lg font-bold mt-1">FIAT Air Spring</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-[#00B8D9] text-xs font-bold uppercase">
                    <Wrench className="w-4 h-4" />
                    <span>Shell Build</span>
                  </div>
                  <div className="text-white text-lg font-bold mt-1">Stainless Steel</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Coach Showcase */}
            <div className="lg:w-5/12 w-full">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#00B8D9]/40 shadow-2xl bg-[#0B1527] group">
                <img
                  src="/assets/tbpro/lhb_ac_first.jpg"
                  alt="TB PRO LHB AC First Class Coach"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#101D35] via-[#101D35]/80 to-transparent p-4 sm:p-5">
                  <span className="text-[11px] font-bold text-[#00B8D9] uppercase tracking-wider block">
                    Featured Coach Specimen
                  </span>
                  <div className="text-white font-bold text-lg sm:text-xl">
                    LHB AC 1st Class (H1 / 1A)
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Sealed panoramic tinted windows &bull; Centre Buffer Coupler (CBC)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Category Filter Bar */}
      <div className="sticky top-[69px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 flex-nowrap min-w-max">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#174EA6]" />
              Filter Fleet:
            </span>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`font-josefin text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === tab.id
                    ? "bg-[#174EA6] text-white shadow-md border border-[#00B8D9]/40"
                    : "bg-[#F4F7FB] text-[#172033] hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 hidden md:block whitespace-nowrap">
            Showing <strong className="text-[#101D35]">{filteredCoaches.length}</strong> available coach types
          </div>
        </div>
      </div>

      {/* 3. LHB Coaches Product Grid */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCoaches.map((coach) => {
            const currentPrice = coach.salePrice ?? coach.regularPrice;
            const hasDiscount = coach.regularPrice > currentPrice;
            const isOutOfStock = coach.status === "OUT_OF_STOCK" || (coach.stockQuantity !== undefined && coach.stockQuantity <= 0);
            const isComingSoon = coach.status === "COMING_SOON";

            const primaryImg =
              coach.images && coach.images.length > 0
                ? (typeof coach.images[0] === "string" ? coach.images[0] : coach.images[0].url)
                : (coach.image || coach.imageUrl || "/assets/tbpro/lhb_chaircar.png");

            return (
              <div
                key={coach.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#174EA6]/40 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] bg-[#F4F7FB] overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={primaryImg}
                    alt={coach.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-left Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {coach.isSpecialOffer && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF6B00] text-white shadow-sm uppercase tracking-wider">
                        {coach.specialOfferText || "Special Offer"}
                      </span>
                    )}
                    {isComingSoon && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#16A34A] text-white shadow-sm uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DC2626] text-white shadow-sm uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Quick View Floating Action */}
                  <button
                    onClick={() => setQuickViewProduct(coach)}
                    aria-label={`Quick view ${coach.name}`}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-[#174EA6] hover:text-white text-[#172033] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Category & Compatibility */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold text-[#174EA6] uppercase tracking-wider">
                        {coach.category?.name || "LHB Coach"}
                      </span>
                      <span className="bg-[#F4F7FB] px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200">
                        {coach.compatibility || "Open Rails / MSTS"}
                      </span>
                    </div>

                    {/* Coach Title */}
                    <Link
                      href={`/shop/${coach.slug || coach.id}`}
                      className="font-josefin font-bold text-lg text-[#101D35] group-hover:text-[#174EA6] transition-colors line-clamp-2 leading-snug"
                    >
                      {coach.name}
                    </Link>

                    {/* Coach Specs Preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {coach.shortDesc || coach.description || "Authentic Indian Railways Linke Hofmann Busch (LHB) rolling stock with FIAT bogies and night lighting."}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#101D35]">
                          {formatCurrency(currentPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-slate-400 line-through">
                            {formatCurrency(coach.regularPrice)}
                          </span>
                        )}
                      </div>

                      {hasDiscount && (
                        <span className="text-xs font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {Math.round(((coach.regularPrice - currentPrice) / coach.regularPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Two-button action bar: View Contents + Add to Cart */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setQuickViewProduct(coach)}
                        className="py-2.5 px-3 rounded-xl bg-[#F4F7FB] hover:bg-[#174EA6] hover:text-white text-[#174EA6] text-xs font-bold transition-all border border-gray-200 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Contents</span>
                      </button>

                      <button
                        onClick={() => {
                          addToCart({
                            id: coach.id,
                            productId: coach.id,
                            name: coach.name,
                            price: currentPrice,
                            regularPrice: coach.regularPrice,
                            image: primaryImg,
                            sku: coach.sku || coach.id,
                            categoryName: coach.category?.name,
                            compatibility: coach.compatibility,
                            isFree: coach.isFree || currentPrice === 0,
                          });
                        }}
                        disabled={isOutOfStock || isComingSoon || isInCart(coach.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          isInCart(coach.id)
                            ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                            : isOutOfStock || isComingSoon
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-[#101D35] hover:bg-[#174EA6] text-white"
                        }`}
                      >
                        {isInCart(coach.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 text-[#00B8D9]" />
                            <span>Add To Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
