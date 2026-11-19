"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";
import QuickViewModal from "@/components/QuickViewModal";

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Fallback catalog if DB not connected
  const fallbackProducts = [
    {
      id: "prod-whr",
      slug: "whr-route-v2-ahmedabad-update",
      name: "WHR Route (V2 Ahmedabad Update)",
      badge: "V2.0",
      image: "/assets/products/whr_route_v2.png",
      regularPrice: 1200,
      salePrice: 1000,
      compatibility: "Open Rails",
      categoryName: "Railway Routes",
      status: "AVAILABLE",
    },
    {
      id: "prod-academy",
      slug: "vg-lhb-vg-academy-livery-sleeper-coaches",
      name: "VG LHB VG ACADEMY LIVERY SLEEPER COACHES",
      badge: "New Arrival",
      image: "/assets/products/vg_academy_sleeper.avif",
      regularPrice: 1000,
      salePrice: 800,
      compatibility: "Open Rails / MSTS",
      categoryName: "Sleeper Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-humsafar",
      slug: "vg-lhb-humsafar-coaches-v2",
      name: "VG LHB HUMSAFAR COACHES V2",
      badge: "V2.0",
      image: "/assets/products/humsafar_v2.avif",
      regularPrice: 600,
      salePrice: 500,
      compatibility: "Open Rails / MSTS",
      categoryName: "Humsafar Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-sleeper",
      slug: "vg-lhb-sleeper-coaches-v2-update",
      name: "VG LHB SLEEPER COACHES V2",
      badge: "V2.0",
      image: "/assets/products/sleeper_v2.avif",
      regularPrice: 1200,
      salePrice: 1000,
      compatibility: "Open Rails / MSTS",
      categoryName: "Sleeper Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-tricolour",
      slug: "vg-lhb-indian-tricolour-coaches",
      name: "VG LHB INDIAN TRICOLOUR COACHES",
      badge: "New Arrival",
      image: "/assets/products/indian_tricolour.avif",
      regularPrice: 200,
      salePrice: 100,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-amrit",
      slug: "vg-lhb-amrit-bharat-coaches",
      name: "VG LHB AMRIT BHARAT COACHES",
      badge: "V1.0",
      image: "/assets/products/amrit_bharat.png",
      regularPrice: 500,
      salePrice: 300,
      compatibility: "Open Rails / MSTS",
      categoryName: "LHB Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-bangladesh",
      slug: "vg-lhb-bangladesh-coaches",
      name: "VG LHB BANGLADESH COACHES",
      badge: "V1.0",
      image: "/assets/products/bangladesh_coaches.png",
      regularPrice: 500,
      salePrice: 200,
      compatibility: "Open Rails / MSTS",
      categoryName: "Bangladesh Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-pnb",
      slug: "vg-lhb-pnb-livery-chaircar-coaches",
      name: "VG LHB PNB LIVERY CHAIRCAR COACHES",
      badge: "V1.0",
      image: "/assets/products/pnb_livery.png",
      regularPrice: 500,
      salePrice: 200,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-vistadome-livery",
      slug: "vg-lhb-vistadome-livery-coaches",
      name: "VG LHB VISTADOME LIVERY COACHES",
      badge: "V1.0",
      image: "/assets/products/vistadome_livery.png",
      regularPrice: 300,
      salePrice: 200,
      compatibility: "Open Rails / MSTS",
      categoryName: "Vistadome Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-vistadome-std",
      slug: "vg-lhb-vistadome-coaches",
      name: "VG LHB VISTADOME COACHES",
      badge: "V2.0",
      image: "/assets/products/vistadome_standard.png",
      regularPrice: 600,
      salePrice: 500,
      compatibility: "Open Rails / MSTS",
      categoryName: "Vistadome Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-chaircar-std",
      slug: "vg-lhb-coaches",
      name: "VG LHB CHAIRCAR COACHES",
      badge: "V2.0",
      image: "/assets/products/chaircar_standard.png",
      regularPrice: 600,
      salePrice: 500,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
    },
    {
      id: "prod-maitree",
      slug: "vg-br-lhb-maitree-v1-5",
      name: "VG BR LHB MAITREE EXPRESS PACK",
      badge: "V1.5",
      image: "/assets/projects/05_vg_lhb_bangladesh.png",
      regularPrice: 400,
      salePrice: 250,
      compatibility: "Open Rails / MSTS",
      categoryName: "International Coaches",
      status: "AVAILABLE",
    },
  ];

  // Dynamic products from database
  const shopProducts: any[] =
    initialProducts && initialProducts.length > 0
      ? initialProducts.map((p) => {
          const hasOffer = p.salePrice !== null && p.salePrice !== undefined && p.salePrice < p.regularPrice;
          const isOutOfStock = p.status === "OUT_OF_STOCK";
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            badge: isOutOfStock
              ? "Out of Stock"
              : hasOffer
              ? "Special Offer"
              : p.isNewArrival
              ? "New Arrival"
              : p.version || "V1.0",
            image: p.images?.[0]?.url || "/assets/products/chaircar_standard.png",
            regularPrice: p.regularPrice,
            salePrice: p.salePrice,
            compatibility: p.compatibility || "Open Rails / MSTS",
            categoryName: p.category?.name || "LHB Coaches",
            status: p.status,
            isOutOfStock,
          };
        })
      : fallbackProducts;

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (prod.isOutOfStock || prod.status === "OUT_OF_STOCK") return;
    addToCart({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      price: prod.salePrice !== undefined ? prod.salePrice : prod.regularPrice,
      regularPrice: prod.regularPrice,
      image: prod.image,
      sku: prod.id.toUpperCase(),
      categoryName: prod.categoryName,
      compatibility: prod.compatibility,
      isFree: prod.salePrice === 0 || prod.regularPrice === 0,
    });
  };

  return (
    <div className="w-full bg-white text-[#101C32] pb-24">
      {/* 1. Header Sub-Bar */}
      <div className="w-full bg-[#F5F6F8] border-b border-gray-200 py-3 px-4 text-center">
        <p className="font-josefin text-[15px] sm:text-[16px] text-[#0B2852] font-medium">
          Please click on the product for more details and instant digital simulator downloads.
        </p>
      </div>

      {/* 2. Orange Announcement Marquee */}
      <div className="w-full bg-[#FF6600] text-white py-2 overflow-hidden select-none border-b border-[#E65C00] shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-4 font-josefin text-[14px] sm:text-[15px] font-semibold tracking-wide">
              <span>What&apos;s New? - VG LHB VG ACADEMY LIVERY SLEEPER COACHES</span>
              <span className="text-[#39FF00] font-bold text-lg mx-3">»»</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Products Grid (4 Columns, max-w-[1080px]) */}
      <div className="max-w-[1080px] mx-auto px-4 pt-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="font-josefin text-2xl sm:text-3xl font-light text-[#0B2852]">
              Official Simulator Catalog
            </h1>
            <p className="font-josefin text-xs sm:text-sm text-gray-500 mt-0.5">
              Browse {shopProducts.length} high-fidelity rolling stock and route add-ons
            </p>
          </div>
          <span className="text-xs font-semibold bg-[#A7D2F7]/40 text-[#0B2852] px-3.5 py-1 rounded-full">
            All Items In Stock
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopProducts.map((prod: any) => {
            const added = isInCart(prod.id);
            const isFree = prod.salePrice === 0 && prod.regularPrice === 0;
            const isOutOfStock = prod.status === "OUT_OF_STOCK" || Boolean(prod.isOutOfStock);

            return (
              <div
                key={prod.id}
                className="group relative flex flex-col bg-white border border-gray-200 hover:border-[#0B2852] hover:shadow-xl transition-all duration-300 rounded-xl p-3"
              >
                {/* Poster Image Container */}
                <Link
                  href={`/shop/${prod.slug}`}
                  className="relative aspect-square w-full bg-[#F5F6F8] overflow-hidden flex items-center justify-center rounded-lg border border-gray-100"
                >
                  {/* Badge top-left */}
                  {prod.badge && (
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-bold font-josefin uppercase rounded-full z-10 shadow-sm ${
                        isOutOfStock
                          ? "bg-rose-600 text-white"
                          : isFree
                          ? "bg-[#39FF00] text-[#101C32]"
                          : prod.badge === "Special Offer"
                          ? "bg-[#FF6600] text-white"
                          : prod.badge === "New Arrival"
                          ? "bg-[#0B2852] text-white border border-[#39FF00]"
                          : "bg-[#0B2852] text-white"
                      }`}
                    >
                      {prod.badge}
                    </span>
                  )}

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-[#0B2852]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    {isOutOfStock ? (
                      <span className="px-4 py-2 rounded-full bg-rose-700 text-white text-xs font-josefin font-bold shadow-lg">
                        Out of Stock
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className="px-4 py-2 rounded-full bg-[#39FF00] text-[#101C32] text-xs font-josefin font-bold hover:bg-white flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                      >
                        {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        {added ? "In Cart" : isFree ? "Get Free" : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </Link>

                {/* Product Meta */}
                <div className="pt-3 pb-1 flex flex-col flex-grow">
                  <span className="text-[11px] text-gray-500 font-josefin uppercase tracking-wider mb-1">
                    {prod.categoryName}
                  </span>
                  <Link
                    href={`/shop/${prod.slug}`}
                    className="font-josefin font-semibold text-[15px] sm:text-[16px] leading-snug text-[#0B2852] hover:text-[#FF6600] line-clamp-2 transition-colors"
                  >
                    {prod.name}
                  </Link>

                  {/* Price Row */}
                  <div className="mt-3 flex items-center justify-between font-josefin">
                    <div className="flex items-center gap-2">
                      {isFree ? (
                        <span className="text-[#39FF00] bg-[#0B2852] px-2.5 py-0.5 rounded-full font-bold text-xs">
                          FREE
                        </span>
                      ) : prod.regularPrice > prod.salePrice ? (
                        <>
                          <span className="line-through text-gray-400 text-xs">
                            ₹{prod.regularPrice.toFixed(2)}
                          </span>
                          <span className="text-[#101C32] font-bold text-[16px]">
                            ₹{prod.salePrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#101C32] font-bold text-[16px]">
                          ₹{prod.regularPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {prod.compatibility}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
