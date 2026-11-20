"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Download, 
  Layers, 
  Share2, 
  ZoomIn, 
  X,
  ChevronRight,
  HardDrive
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  const images =
    product.images && product.images.length > 0
      ? product.images.map((i: any) => i.url)
      : ["https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1000"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "install" | "files">("desc");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isOutOfStock = product.status === "OUT_OF_STOCK";
  const isComingSoon = product.status === "COMING_SOON";
  const currentPrice = product.salePrice ?? product.regularPrice;
  const isFree = product.isFree || currentPrice === 0;
  const inCart = isInCart(product.id);

  let parsedSpecs: Record<string, string> = {};
  if (product.fullSpecs) {
    try {
      parsedSpecs = JSON.parse(product.fullSpecs);
    } catch (e) {
      // not json, treat as plain text
    }
  }

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

  const handleBuyNow = () => {
    if (!inCart) {
      handleAddToCart();
    }
    router.push("/checkout");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-[#101C32] pb-20 font-josefin">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#F5F6F8] border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 font-josefin flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          {product.category && (
            <>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-black transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </>
          )}
          <span className="text-black font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Images & Gallery */}
          <div className="space-y-4">
            {/* Main Stage Image */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="group relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow cursor-pointer"
            >
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs text-white flex items-center gap-1.5 font-futura">
                  <ZoomIn className="w-4 h-4 text-[#38D300]" /> Click to zoom render
                </span>
                <span className="text-xs text-gray-300 font-futura">
                  {activeImageIndex + 1} of {images.length}
                </span>
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-[#041229] shadow-md"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Pricing, Specs & Purchase */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-futura">
                <span className="text-[#041229] font-semibold uppercase tracking-wider">
                  {product.category?.name || "LHB Coach Pack"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-400">SKU: {product.sku}</span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copySuccess ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-normal text-[#041229] font-futura leading-tight">
                {product.name}
              </h1>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-gray-200">
                {isFree ? (
                  <span className="text-3xl font-bold font-futura text-emerald-600">FREE DOWNLOAD</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold font-futura text-[#041229]">
                      {formatCurrency(currentPrice)}
                    </span>
                    {product.regularPrice > currentPrice && (
                      <span className="text-lg text-gray-400 line-through font-futura">
                        {formatCurrency(product.regularPrice)}
                      </span>
                    )}
                    {product.regularPrice > currentPrice && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-xs font-futura font-bold">
                        Special Offer: Save {Math.round(((product.regularPrice - currentPrice) / product.regularPrice) * 100)}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Meta Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-4 rounded-lg border border-gray-200 font-futura">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Simulator</span>
                <span className="text-[#041229] font-semibold">{product.compatibility}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">File Size</span>
                <span className="text-[#041229] font-semibold">{product.fileSize || "140 MB"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Version</span>
                <span className="text-[#041229] font-semibold">{product.version || "v2.0"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Delivery</span>
                <span className="text-emerald-700 font-semibold">Instant Digital</span>
              </div>
            </div>

            {/* Actions: Add to Cart and Buy Now */}
            <div className="space-y-3 pt-2">
              {isOutOfStock ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1">
                  <span className="px-4 py-1.5 rounded-full bg-[#DC2626] text-white font-bold text-xs uppercase tracking-wider inline-block">
                    Out of Stock
                  </span>
                  <p className="text-xs text-red-800">
                    This coach / add-on is currently unavailable for order. Please check back soon or contact support.
                  </p>
                </div>
              ) : isComingSoon ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center space-y-1">
                  <span className="px-4 py-1.5 rounded-full bg-[#16A34A] text-white font-bold text-xs uppercase tracking-wider inline-block">
                    Coming Soon
                  </span>
                  <p className="text-xs text-green-800">
                    This official release is in final testing and will be available for download shortly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-futura">
                  <button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className={`py-3 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      inCart
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#39FF00] hover:bg-green-400 text-black shadow-sm"
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        In Your Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add To Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-6 rounded-full bg-[#041229] hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all"
                  >
                    {isFree ? "Download Now" : "Buy Now"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 px-1 font-futura">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified for Open Rails & MSTS
                </span>
                <span>Permanent Re-download Entitlement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Technical Specs, Installation, Files */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50 font-futura">
            <button
              onClick={() => setActiveTab("desc")}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "desc"
                  ? "border-[#041229] text-[#041229] bg-white font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <FileText className="w-4 h-4" />
              Description & Details
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[#041229] text-[#041229] bg-white font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("install")}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "install"
                  ? "border-[#041229] text-[#041229] bg-white font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Layers className="w-4 h-4" />
              Installation Guide
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "files"
                  ? "border-[#041229] text-[#041229] bg-white font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Download className="w-4 h-4" />
              Included Files ({product.files?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 text-sm text-[#041229] leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4 whitespace-pre-line font-light">
                {product.description}
              </div>
            )}

            {activeTab === "specs" && (
              <div>
                {Object.keys(parsedSpecs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parsedSpecs).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center font-futura"
                      >
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-xs font-semibold text-[#041229] text-right ml-4">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-futura">
                    {product.fullSpecs || "Standard LHB high-speed simulation specifications apply."}
                  </p>
                )}
              </div>
            )}

            {activeTab === "install" && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-[#041229] font-futura">
                  Step-by-Step Installation Instructions
                </h4>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                  {product.installGuide ||
                    `1. Extract the downloaded ZIP or RAR archive using 7-Zip or WinRAR.\n2. Copy the resulting folder into: [Simulator Root]/TRAINS/TRAINSET/\n3. If consists (.con files) are included, copy them to: [Simulator Root]/TRAINS/CONSISTS/\n4. Launch Open Rails or MSTS. The new rolling stock will appear under Trainset selection.`}
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-[#041229] font-futura mb-2">Package Contents</h4>
                {product.files && product.files.length > 0 ? (
                  product.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between font-futura"
                    >
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5 text-[#041229]" />
                        <div>
                          <p className="font-semibold text-[#041229] text-xs">{file.name}</p>
                          <p className="text-[11px] text-gray-500">
                            Format: {file.fileFormat} • Size: {file.fileSize} • Version: {file.version}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-800 font-semibold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300">
                        {file.isPublicFree ? "Free Download" : "Available After Purchase"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 font-futura">
                    Primary simulation package file included in digital entitlement.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
              Related Rolling Stock Add-ons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel: any) => {
                const img =
                  rel.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=600";
                const price = rel.salePrice ?? rel.regularPrice;
                return (
                  <Link
                    key={rel.id}
                    href={`/shop/${rel.slug}`}
                    className="group rounded-2xl bg-railway-card border border-railway-border/80 overflow-hidden hover:border-railway-accent/50 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      <img
                        src={img}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-railway-accent font-bold uppercase">
                          {rel.category?.name}
                        </span>
                        <h4 className="font-bold text-white text-sm group-hover:text-red-400 transition-colors line-clamp-1 mt-1">
                          {rel.name}
                        </h4>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span>{price === 0 ? "FREE" : formatCurrency(price)}</span>
                        <span className="text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-railway-accent text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[activeImageIndex]}
            alt={product.name}
            className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
}
