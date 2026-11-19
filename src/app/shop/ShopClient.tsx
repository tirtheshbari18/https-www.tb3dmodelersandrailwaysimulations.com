"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check } from "lucide-react";
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

  // Exact 11 products matching the original shop page
  const shopProducts = [
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
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      price: prod.salePrice || prod.regularPrice,
      regularPrice: prod.regularPrice,
      image: prod.image,
      sku: prod.id.toUpperCase(),
      categoryName: prod.categoryName,
      compatibility: prod.compatibility,
      isFree: prod.salePrice === 0 || prod.regularPrice === 0,
    });
  };

  return (
    <div className="w-full bg-white text-[#041229] pb-20">
      {/* 1. Header Ticker Sub-Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-2.5 px-4 text-center">
        <p className="font-futuraBook text-[15px] sm:text-[16px] leading-[20.8px] text-[#041229]">
          Please click on the product for more details.
        </p>
      </div>

      {/* 2. Marquee Ticker: "What's New? - VG LHB VG ACADEMY LIVERY SLEEPER COACHES" */}
      <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[#d32f2f] font-futuraLight text-[14px] sm:text-[15px] font-bold mx-4"
            >
              What&apos;s New? - VG LHB VG ACADEMY LIVERY SLEEPER COACHES&nbsp;&nbsp;»»&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* 3. Products Grid (4 Columns, max-w-[980px]) */}
      <div className="max-w-[980px] mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {shopProducts.map((prod) => {
            const added = isInCart(prod.id);
            return (
              <div
                key={prod.id}
                className="group relative flex flex-col bg-white border border-transparent hover:border-gray-200 transition-all rounded p-2"
              >
                {/* Poster Image Container */}
                <Link
                  href={`/shop/${prod.slug}`}
                  className="relative aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-200 rounded"
                >
                  {/* Badge top-left */}
                  {prod.badge && (
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 text-[11px] font-bold font-futuraLight uppercase rounded z-10 ${
                        prod.badge === "New Arrival"
                          ? "bg-amber-400 text-black"
                          : "bg-amber-500 text-black"
                      }`}
                    >
                      {prod.badge}
                    </span>
                  )}

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="px-3 py-1.5 rounded-full bg-[#38D300] text-[#041229] text-xs font-futuraLight font-bold hover:bg-green-400 flex items-center gap-1 shadow"
                    >
                      {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                      {added ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </Link>

                {/* Product Meta */}
                <div className="pt-3 pb-1 flex flex-col flex-grow">
                  <Link
                    href={`/shop/${prod.slug}`}
                    className="font-futuraLight font-bold text-[15px] sm:text-[16px] leading-[20px] text-[#041229] hover:underline line-clamp-2"
                  >
                    {prod.name}
                  </Link>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2 font-futuraLight text-[14px]">
                    {prod.regularPrice > prod.salePrice ? (
                      <>
                        <span className="line-through text-gray-400">
                          ₹{prod.regularPrice.toFixed(2)}
                        </span>
                        <span className="text-[#041229] font-bold text-[15px]">
                          ₹{prod.salePrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#041229] font-bold text-[15px]">
                        ₹{prod.regularPrice.toFixed(2)}
                      </span>
                    )}
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
