"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Check, ShoppingCart, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";

interface QuickViewModalProps {
  product: any | null;
  isOpen?: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, isInCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images.map((img: any) => img.url)
    : [product.image || product.imageUrl || "/assets/products/chaircar_standard.png"];

  const currentPrice = product.salePrice ?? product.regularPrice;
  const isFree = product.isFree || currentPrice === 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      regularPrice: product.regularPrice,
      image: images[0],
      sku: product.sku || product.id.toUpperCase(),
      categoryName: product.category?.name || product.categoryName,
      compatibility: product.compatibility,
      isFree,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in font-josefin">
      <div
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-[#101C32] flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-gray-100 text-gray-700 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-[#F5F6F8] flex flex-col justify-between border-r border-gray-200">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center p-4">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300"
            />
            {product.isFeatured && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FF6600] text-white text-[11px] font-bold tracking-wider uppercase">
                Featured Add-on
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all bg-white p-0.5 ${
                    selectedImageIndex === idx
                      ? "border-[#0B2852] scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
              <span className="text-[#0B2852] font-semibold uppercase">
                {product.category?.name || product.categoryName || "LHB Coach"}
              </span>
              <span>•</span>
              <span>SKU: {product.sku || product.id}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-normal text-[#0B2852] mb-2 leading-tight">
              {product.name}
            </h3>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 my-3">
              {isFree ? (
                <span className="text-2xl font-bold text-[#39FF00] bg-[#0B2852] px-3 py-1 rounded-full">
                  FREE DOWNLOAD
                </span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-[#101C32]">
                    {formatCurrency(currentPrice)}
                  </span>
                  {product.regularPrice > currentPrice && (
                    <span className="text-base text-gray-400 line-through">
                      {formatCurrency(product.regularPrice)}
                    </span>
                  )}
                  {product.regularPrice > currentPrice && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      Save {Math.round(((product.regularPrice - currentPrice) / product.regularPrice) * 100)}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-4 mb-4">
              {product.shortDesc || product.description || "High-precision 3D rolling stock model crafted for Open Rails and MSTS with authentic bogie geometry, night lighting cabins, and animated doors."}
            </p>

            {/* Specs Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F5F6F8] p-3 rounded-xl border border-gray-200 mb-6">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Compatibility</span>
                <span className="font-semibold text-[#0B2852]">{product.compatibility || "Open Rails / MSTS"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">File Format</span>
                <span className="font-semibold text-[#0B2852]">ZIP / RAR Package</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Physics</span>
                <span className="font-semibold text-[#0B2852]">Realistic LHB Specs</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">License</span>
                <span className="font-semibold text-[#0B2852]">Personal Simulation</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
                className={`py-3 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 shadow transition-all ${
                  isInCart(product.id)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white"
                }`}
              >
                {isInCart(product.id) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </>
                )}
              </button>

              <Link
                href={`/shop/${product.slug}`}
                onClick={onClose}
                className="py-3 px-4 rounded-full bg-[#F5F6F8] hover:bg-gray-200 text-[#0B2852] font-semibold text-xs flex items-center justify-center gap-2 border border-gray-300 transition-colors"
              >
                Full Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-center text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Authentic VG-3D release with instant digital download entitlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
