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
    : [product.imageUrl || "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800"];

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
      sku: product.sku,
      categoryName: product.category?.name,
      compatibility: product.compatibility,
      isFree,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-railway-darkest border border-railway-border rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-railway-dark/80 hover:bg-railway-accent text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-railway-dark flex flex-col justify-between">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-railway-border/60">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.isFeatured && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-railway-accent text-white text-[11px] font-bold tracking-wider uppercase">
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
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-railway-accent scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
              <span className="text-railway-accent font-semibold uppercase">
                {product.category?.name || "LHB Coach"}
              </span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              {product.name}
            </h3>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 my-3">
              {isFree ? (
                <span className="text-2xl font-black text-emerald-400">FREE DOWNLOAD</span>
              ) : (
                <>
                  <span className="text-2xl font-black text-white">
                    {formatCurrency(currentPrice)}
                  </span>
                  {product.regularPrice > currentPrice && (
                    <span className="text-base text-slate-500 line-through">
                      {formatCurrency(product.regularPrice)}
                    </span>
                  )}
                  {product.regularPrice > currentPrice && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Save {Math.round(((product.regularPrice - currentPrice) / product.regularPrice) * 100)}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 mb-4">
              {product.shortDesc || product.description}
            </p>

            {/* Specs Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-railway-card/60 p-3 rounded-xl border border-railway-border/60 mb-6">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Compatibility</span>
                <span className="font-semibold text-white">{product.compatibility}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">File Size</span>
                <span className="font-semibold text-white">{product.fileSize || "120 MB"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Version</span>
                <span className="font-semibold text-white">{product.version || "v2.0"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">License</span>
                <span className="font-semibold text-emerald-400">Personal Simulation</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 border-t border-railway-border/60">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
                className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isInCart(product.id)
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                    : "bg-railway-accent hover:bg-red-700 text-white shadow-lg shadow-red-950"
                }`}
              >
                {isInCart(product.id) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
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
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                Full Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Instant digital delivery with authenticated download entitlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
