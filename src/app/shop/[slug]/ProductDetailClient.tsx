"use client";

import React, { useState, useEffect } from "react";
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
  HardDrive,
  Ban,
  Clock,
  Eye,
  CheckCircle2,
  Sparkles
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

  const [currentProduct, setCurrentProduct] = useState(product);

  useEffect(() => {
    const fetchLatest = () => {
      fetch(`/api/products/${encodeURIComponent(product.slug || product.id)}?nocache=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setCurrentProduct((prev: any) => ({
              ...prev,
              ...data.product,
              images: data.product.images?.length > 0 ? data.product.images : prev.images,
              files: data.product.files?.length > 0 ? data.product.files : prev.files,
              versions: data.product.versions?.length > 0 ? data.product.versions : prev.versions,
            }));
          }
        })
        .catch(() => {});
    };

    fetchLatest();

    window.addEventListener("focus", fetchLatest);
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchLatest();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", fetchLatest);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [product.id, product.slug]);

  const rawImgList =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images.map((i: any) => (typeof i === "string" ? i : i.url)).filter(Boolean)
      : [];
  const images = rawImgList.length > 0 ? rawImgList : [currentProduct.image || "/assets/tbpro/lhb_chaircar.png"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "install" | "files">("desc");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isOutOfStock = currentProduct.status === "OUT_OF_STOCK" || (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity <= 0);
  const isComingSoon = currentProduct.status === "COMING_SOON";
  const hasOffer = Boolean(currentProduct.isSpecialOffer) || (currentProduct.salePrice !== null && currentProduct.salePrice !== undefined && currentProduct.salePrice < currentProduct.regularPrice);
  const currentPrice = currentProduct.salePrice ?? currentProduct.regularPrice;
  const isFree = currentProduct.isFree || currentPrice === 0;
  const inCart = isInCart(currentProduct.id);

  const statusBadge = isOutOfStock ? (
    <span className="px-3 py-1 rounded-full bg-[#DC2626] text-white text-xs font-bold uppercase shadow-sm">
      Out of Stock
    </span>
  ) : isComingSoon ? (
    <span className="px-3 py-1 rounded-full bg-[#16A34A] text-white text-xs font-bold uppercase shadow-sm">
      Coming Soon
    </span>
  ) : hasOffer ? (
    <span className="px-3 py-1 rounded-full bg-[#FF6B00] text-white text-xs font-bold uppercase shadow-sm">
      {currentProduct.specialOfferText || "Special Offer"}
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full bg-[#174EA6] text-white text-xs font-bold uppercase shadow-sm">
      Available
    </span>
  );

  let parsedSpecs: Record<string, string> = {};
  if (currentProduct.fullSpecs || currentProduct.specifications) {
    try {
      parsedSpecs = JSON.parse(currentProduct.fullSpecs || currentProduct.specifications);
    } catch (e) {}
  }

  const handleAddToCart = () => {
    addToCart({
      id: currentProduct.id,
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentPrice,
      regularPrice: currentProduct.regularPrice,
      image: images[0],
      sku: currentProduct.sku,
      categoryName: currentProduct.category?.name,
      compatibility: currentProduct.compatibility,
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
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#172033] pb-20 font-josefin">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-josefin flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#174EA6] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/shop" className="hover:text-[#174EA6] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {currentProduct.category && (
            <>
              <Link
                href={`/shop?category=${currentProduct.category.slug}`}
                className="hover:text-[#174EA6] transition-colors"
              >
                {currentProduct.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </>
          )}
          <span className="text-[#101D35] font-bold truncate max-w-[220px] sm:max-w-none">
            {currentProduct.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Product Images & Gallery */}
          <div className="space-y-4">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm cursor-pointer"
            >
              <img
                src={images[activeImageIndex] || images[0]}
                alt={currentProduct.name}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 z-10">
                {statusBadge}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs text-white flex items-center gap-1.5 font-bold">
                  <ZoomIn className="w-4 h-4 text-[#00B8D9]" /> Click to zoom render
                </span>
                <span className="text-xs text-slate-300">
                  {activeImageIndex + 1} of {images.length}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-white p-1 ${
                      activeImageIndex === idx
                        ? "border-[#174EA6] shadow-md scale-105"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Pricing, Specs & Purchase */}
          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="text-[#174EA6] font-bold uppercase tracking-wider">
                  {currentProduct.category?.name || "LHB Coach Pack"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-[11px]">SKU: {currentProduct.sku}</span>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1 text-slate-600 hover:text-[#174EA6] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copySuccess ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101D35] leading-tight">
                {currentProduct.name}
              </h1>

              {/* Price display */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3 pb-4 border-b border-gray-100">
                {isFree ? (
                  <span className="text-3xl font-bold text-[#16A34A]">FREE DOWNLOAD</span>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#101D35]">
                      {formatCurrency(currentPrice)}
                    </span>
                    {currentProduct.regularPrice > currentPrice && (
                      <span className="text-lg text-slate-400 line-through">
                        {formatCurrency(currentProduct.regularPrice)}
                      </span>
                    )}
                    {currentProduct.regularPrice > currentPrice && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-xs font-bold">
                        Save {Math.round(((currentProduct.regularPrice - currentPrice) / currentProduct.regularPrice) * 100)}%
                      </span>
                    )}
                  </>
                )}
                <div className="ml-auto">{statusBadge}</div>
              </div>
            </div>

            {/* Quick Meta Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F4F7FB] p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Simulator</span>
                <span className="text-[#101D35] font-semibold">{currentProduct.compatibility || "Open Rails / MSTS"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">File Size</span>
                <span className="text-[#101D35] font-semibold">{currentProduct.fileSize || "140 MB"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Version</span>
                <span className="text-[#101D35] font-semibold">{currentProduct.version || "v2.0"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery</span>
                <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Instant Digital
                </span>
              </div>
            </div>

            {/* Actions: Add to Cart and Buy Now */}
            <div className="space-y-3 pt-2">
              {isOutOfStock ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-red-700 font-bold text-sm">
                    <Ban className="w-4 h-4 text-red-600" />
                    <span>Currently Out of Stock</span>
                  </div>
                  <p className="text-xs text-red-700">
                    This simulation pack is undergoing maintenance or stock refresh.
                  </p>
                </div>
              ) : isComingSoon ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-green-700 font-bold text-sm">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Coming Soon</span>
                  </div>
                  <p className="text-xs text-green-700">
                    This release is in final testing and will be unlocked for download shortly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      inCart
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-[#101D35] hover:bg-[#174EA6] text-white"
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-[#16A34A]" />
                        In Your Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-[#00B8D9]" />
                        Add To Cart
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#00B8D9] hover:from-[#101D35] hover:to-[#174EA6] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {isFree ? "Download Now" : "Buy Now"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  Verified for Open Rails &amp; MSTS
                </span>
                <span>Permanent Re-download Entitlement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Technical Specs, Installation, Files */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex border-b border-gray-200 overflow-x-auto bg-[#F4F7FB]">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "desc"
                  ? "border-[#174EA6] text-[#174EA6] bg-white font-extrabold"
                  : "border-transparent text-slate-500 hover:text-[#101D35]"
              }`}
            >
              <FileText className="w-4 h-4" />
              Description &amp; Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[#174EA6] text-[#174EA6] bg-white font-extrabold"
                  : "border-transparent text-slate-500 hover:text-[#101D35]"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("install")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "install"
                  ? "border-[#174EA6] text-[#174EA6] bg-white font-extrabold"
                  : "border-transparent text-slate-500 hover:text-[#101D35]"
              }`}
            >
              <Layers className="w-4 h-4" />
              Installation Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("files")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "files"
                  ? "border-[#174EA6] text-[#174EA6] bg-white font-extrabold"
                  : "border-transparent text-slate-500 hover:text-[#101D35]"
              }`}
            >
              <Download className="w-4 h-4" />
              Package Contents ({currentProduct.files?.length || 1})
            </button>
          </div>

          <div className="p-6 sm:p-8 text-sm text-[#172033] leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4 whitespace-pre-line">
                <p className="text-base text-slate-700 leading-relaxed">
                  {currentProduct.description || "High-precision 3D rolling stock model crafted for Open Rails and MSTS with authentic FIAT bogie geometry, night lighting cabins, and animated doors."}
                </p>
                {currentProduct.shortDesc && currentProduct.shortDesc !== currentProduct.description && (
                  <p className="text-sm text-slate-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    {currentProduct.shortDesc}
                  </p>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div>
                {Object.keys(parsedSpecs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parsedSpecs).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-3.5 rounded-xl bg-[#F4F7FB] border border-gray-200 flex justify-between items-center"
                      >
                        <span className="text-xs text-slate-500 font-semibold">{key}</span>
                        <span className="text-xs font-bold text-[#101D35] text-right ml-4">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#F4F7FB] border border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Simulator Compatibility</span>
                      <span className="text-xs font-bold text-[#101D35]">{currentProduct.compatibility || "Open Rails / MSTS"}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F4F7FB] border border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Bogie Type</span>
                      <span className="text-xs font-bold text-[#101D35]">FIAT Air Suspension</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F4F7FB] border border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Model Version</span>
                      <span className="text-xs font-bold text-[#101D35]">{currentProduct.version || "v2.0"}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F4F7FB] border border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Archive Size</span>
                      <span className="text-xs font-bold text-[#101D35]">{currentProduct.fileSize || "140 MB"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "install" && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#101D35]">
                  Step-by-Step Installation Instructions
                </h4>
                <div className="p-5 rounded-xl bg-[#F4F7FB] border border-gray-200 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {currentProduct.installGuide ||
                    `1. Extract the downloaded ZIP or RAR archive using 7-Zip or WinRAR.
2. Copy the resulting folder into: [Simulator Root]/TRAINS/TRAINSET/
3. If consist (.con) files are included, copy them to: [Simulator Root]/TRAINS/CONSISTS/
4. Launch Open Rails or MSTS. The new rolling stock will appear under Trainset selection.`}
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#101D35] mb-2">Package Contents &amp; Digital Files</h4>
                {currentProduct.files && currentProduct.files.length > 0 ? (
                  currentProduct.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5 text-[#174EA6]" />
                        <div>
                          <p className="font-bold text-[#101D35] text-xs">{file.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Format: {file.fileFormat || "ZIP"} • Size: {file.fileSize || currentProduct.fileSize || "140 MB"} • Version: {file.version || currentProduct.version || "v2.0"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-800 font-semibold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300">
                        {file.isPublicFree || isFree ? "Free Download" : "Available After Purchase"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-[#174EA6]" />
                      <div>
                        <p className="font-bold text-[#101D35] text-xs">{currentProduct.name} (Full Package)</p>
                        <p className="text-[11px] text-slate-500">
                          Format: ZIP Archive • Size: {currentProduct.fileSize || "140 MB"} • Version: {currentProduct.version || "v2.0"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300">
                      {isFree ? "Free Download" : "Available After Purchase"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-[#101D35] mb-6 border-b border-gray-200 pb-3">
              Related Rolling Stock Add-ons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel: any) => {
                const img =
                  rel.images?.[0]?.url ||
                  rel.image ||
                  "/assets/tbpro/lhb_chaircar.png";
                const price = rel.salePrice ?? rel.regularPrice;
                return (
                  <Link
                    key={rel.id}
                    href={`/shop/${rel.slug || rel.id}`}
                    className="group rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-[#174EA6] hover:shadow-lg transition-all flex flex-col justify-between p-4 shadow-sm"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F7FB] rounded-xl p-2">
                      <img
                        src={img}
                        alt={rel.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {rel.category?.name || "LHB Coaches"}
                        </span>
                        <h4 className="font-bold text-[#101D35] text-sm group-hover:text-[#174EA6] transition-colors line-clamp-1 mt-0.5">
                          {rel.name}
                        </h4>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs font-bold pt-2 border-t border-gray-100">
                        <span className="text-[#101D35]">{price === 0 ? "FREE" : formatCurrency(price)}</span>
                        <span className="text-[#174EA6] flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Contents</span>
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[activeImageIndex]}
            alt={currentProduct.name}
            className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
