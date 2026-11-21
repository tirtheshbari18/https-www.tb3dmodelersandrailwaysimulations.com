"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Upload,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Clock,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
  ShoppingCart,
  Gauge,
  Zap,
  Wrench,
  Layers,
  Monitor,
  Download
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";
import QuickViewModal from "@/components/QuickViewModal";

interface HomeSlideItem {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
  order: number;
  isActive: boolean;
}

interface HomeClientProps {
  featuredProducts: any[];
  newArrivals: any[];
  categories: any[];
  projects: any[];
  services: any[];
  settings: any;
  homeSlides?: any[];
}

export default function HomeClient({
  featuredProducts,
  newArrivals,
  categories,
  projects,
  services,
  settings,
  homeSlides = [],
}: HomeClientProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Admin and Auth State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(true);

  // Slides State
  const [slides, setSlides] = useState<HomeSlideItem[]>(homeSlides);

  // Auto-Slide Timing
  const [slideInterval, setSlideInterval] = useState<number>(
    settings?.sliderInterval || 5000
  );
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  // Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Admin Modals
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HomeSlideItem | null>(null);
  const [renameSlideModal, setRenameSlideModal] = useState<HomeSlideItem | null>(null);
  const [imageUploadSlideModal, setImageUploadSlideModal] = useState<HomeSlideItem | null>(null);
  const [deleteSlideModal, setDeleteSlideModal] = useState<{ id: string; title: string } | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Admin Login Status from localStorage & API
  const checkAuth = async () => {
    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("vg_user") : null;
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN")) {
            setCurrentUser(parsed);
          }
        } catch (e) {}
      }

      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch("/api/auth/me", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user && (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN")) {
          setCurrentUser(data.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("vg_user", JSON.stringify(data.user));
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    checkAuth();
    const handleAuthEvent = () => checkAuth();
    window.addEventListener("vg-auth-changed", handleAuthEvent);
    return () => window.removeEventListener("vg-auth-changed", handleAuthEvent);
  }, []);

  // Fetch updated slides from API
  const refreshSlides = async () => {
    try {
      const res = await fetch("/api/admin/slides", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      }
    } catch (e) {}
  };

  // Filter slides
  const visibleSlides = currentUser && isAdminMode ? slides : slides.filter((s) => s.isActive);
  const activeSlidesCount = slides.filter((s) => s.isActive).length;

  // Auto Slider Effect
  useEffect(() => {
    if (!isAutoPlay || visibleSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleSlides.length);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [isAutoPlay, visibleSlides.length, slideInterval]);

  // Clamp current index if slides change
  useEffect(() => {
    if (currentIndex >= visibleSlides.length && visibleSlides.length > 0) {
      setCurrentIndex(0);
    }
  }, [visibleSlides.length, currentIndex]);

  const handleNext = () => {
    if (visibleSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % visibleSlides.length);
  };

  const handlePrev = () => {
    if (visibleSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + visibleSlides.length) % visibleSlides.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  // Disk Image Upload Handler
  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onSuccess(data.url);
      showToast("Image uploaded successfully!");
    } catch (err: any) {
      showToast(err.message || "Upload failed", true);
    } finally {
      setIsUploading(false);
    }
  };

  // Admin Slide Handlers
  const handleSaveSlide = async (e: React.FormEvent, formValues: any, isNew: boolean = false) => {
    e.preventDefault();
    try {
      const url = isNew ? "/api/admin/slides" : `/api/admin/slides/${formValues.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save slide");

      showToast(isNew ? "New slide added successfully!" : "Slide updated successfully!");
      setShowAddSlideModal(false);
      setEditingSlide(null);
      setRenameSlideModal(null);
      setImageUploadSlideModal(null);
      refreshSlides();
    } catch (err: any) {
      showToast(err.message || "Error saving slide", true);
    }
  };

  const handleDeleteSlide = async () => {
    if (!deleteSlideModal) return;
    try {
      const res = await fetch(`/api/admin/slides/${deleteSlideModal.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete slide");

      showToast(`Slide "${deleteSlideModal.title}" deleted permanently!`);
      setDeleteSlideModal(null);
      refreshSlides();
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    } catch (err: any) {
      showToast(err.message || "Error deleting slide", true);
    }
  };

  const handleToggleSlideActive = async (slide: HomeSlideItem) => {
    try {
      const res = await fetch(`/api/admin/slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });
      if (res.ok) {
        showToast(`Slide marked ${!slide.isActive ? "ACTIVE" : "INACTIVE"}`);
        refreshSlides();
      }
    } catch (e) {
      showToast("Failed to toggle status", true);
    }
  };

  const handleMoveSlide = async (slide: HomeSlideItem, direction: "left" | "right") => {
    const currentIdx = slides.findIndex((s) => s.id === slide.id);
    const targetIdx = direction === "left" ? currentIdx - 1 : currentIdx + 1;

    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const targetSlide = slides[targetIdx];
    const newOrder = targetSlide.order;
    const targetNewOrder = slide.order;

    try {
      await Promise.all([
        fetch(`/api/admin/slides/${slide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder }),
        }),
        fetch(`/api/admin/slides/${targetSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetNewOrder }),
        }),
      ]);

      showToast("Slide reordered successfully!");
      refreshSlides();
    } catch (e) {
      showToast("Failed to reorder slide", true);
    }
  };

  const handleSaveInterval = async (intervalMs: number) => {
    setSlideInterval(intervalMs);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sliderInterval: intervalMs }),
      });
      showToast(`Automatic slide timing set to ${intervalMs / 1000} seconds!`);
    } catch (e) {}
  };

  const currentSlide = visibleSlides[currentIndex] || slides[0] || null;

  return (
    <div className="w-full bg-[#F4F7FB] text-[#172033] select-none font-josefin">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl font-josefin text-sm flex items-center gap-2 border transition-all animate-bounce ${
            toastMsg.isError
              ? "bg-rose-50 text-rose-800 border-rose-300"
              : "bg-emerald-50 text-emerald-800 border-emerald-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#00B8D9]" />
          <span className="font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* =========================================================================
          1. PROMOTIONAL ANNOUNCEMENT BAR
          ========================================================================= */}
      <div className="w-full bg-[#101D35] text-white py-2 overflow-hidden select-none border-b border-[#174EA6]/40 shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center mx-4 font-josefin text-[13px] sm:text-[14px] font-semibold tracking-wide"
            >
              <span className="text-[#FF6B00] font-bold mr-2">SPECIAL OFFER:</span>
              <span>Exclusive 20% discount on Indian Railways LHB coach sets and train boards!</span>
              <span className="text-[#00B8D9] font-bold text-base mx-3">»»</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. ADMIN SLIDER MANAGEMENT TOOLBAR (VISIBLE FOR LOGGED IN ADMIN)
          ========================================================================= */}
      {currentUser && (
        <div className="bg-[#101D35] text-white border-b-2 border-[#00B8D9] py-3 px-4 shadow-md sticky top-[69px] z-30">
          <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#174EA6] text-[#00B8D9] flex items-center justify-center font-bold border border-[#00B8D9]/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wide text-[#00B8D9]">
                    TB PRO SLIDER MANAGEMENT
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold text-white">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Total Slides: <strong>{slides.length}</strong> ({activeSlidesCount} Active)
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isAdminMode
                    ? "bg-[#00B8D9] text-[#101D35] hover:bg-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <span>ADMIN MODE:</span>
                <span className="uppercase">{isAdminMode ? "ON" : "OFF"}</span>
              </button>

              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => setShowAddSlideModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-white text-[#101D35] hover:bg-[#00B8D9] text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Add New Slide</span>
                </button>
              )}

              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg text-xs text-white">
                <Clock className="w-3 h-3 text-[#00B8D9]" />
                <span className="text-[11px] text-slate-300">Timer:</span>
                <select
                  value={slideInterval}
                  onChange={(e) => handleSaveInterval(parseInt(e.target.value, 10))}
                  className="bg-transparent text-[#00B8D9] font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value={3000} className="text-[#101D35]">3 Seconds</option>
                  <option value={5000} className="text-[#101D35]">5 Seconds (Default)</option>
                  <option value={8000} className="text-[#101D35]">8 Seconds</option>
                  <option value={10000} className="text-[#101D35]">10 Seconds</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isAutoPlay ? "bg-[#00B8D9] text-[#101D35]" : "bg-white/20 text-white"
                }`}
                title={isAutoPlay ? "Pause Auto-Slide" : "Start Auto-Slide"}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg bg-[#174EA6] hover:bg-[#1b4d96] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. HERO SECTION (MASTER PROMPT SPECIFICATION)
          ========================================================================= */}
      <section className="relative w-full bg-[#101D35] text-white py-16 sm:py-24 border-b border-[#174EA6]/30 overflow-hidden">
        {/* Photorealistic Hero Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img
            src="/assets/tbpro/hero_lhb_train.jpg"
            alt="Indian Railways LHB Train"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101D35] via-[#101D35]/90 to-transparent"></div>
        </div>

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-7/12 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174EA6]/50 border border-[#00B8D9]/40 text-[#00B8D9] text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PREMIER INDIAN RAILWAYS SIMULATION PLATFORM</span>
              </div>

              {/* Exact heading requested in Master Prompt */}
              <h1 className="font-josefin text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Experience Indian Railways <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] via-blue-200 to-white">
                  Like Never Before.
                </span>
              </h1>

              {/* Supporting text about LHB coaches, railway assets, MSTS, and Open Rails */}
              <p className="font-josefin text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Step into true virtual railroading with high-precision Indian Railways LHB coaching stock, authentic soundscapes, realistic FIAT bogies, and engineered route assets built exclusively for <strong>Open Rails</strong> and <strong>Microsoft Train Simulator (MSTS)</strong>.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  href="/coaches"
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#00B8D9] hover:from-[#101D35] hover:to-[#174EA6] text-white text-sm sm:text-base font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                >
                  <span>Explore LHB Coaches</span>
                  <ArrowRight className="w-4 h-4 text-[#00B8D9]" />
                </Link>

                <Link
                  href="/shop"
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-white text-[#101D35] hover:bg-[#00B8D9] hover:text-[#101D35] text-sm sm:text-base font-bold shadow-md transition-all"
                >
                  Visit Simulator Shop
                </Link>

                <Link
                  href="/msts-openrails"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
                >
                  MSTS &amp; Open Rails Hub
                </Link>
              </div>

              {/* Quick Specs Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:text-left">
                  <span className="text-[10px] text-[#00B8D9] font-bold uppercase tracking-wider block">Speed Potential</span>
                  <span className="text-white text-lg font-bold">160 – 200 km/h</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:text-left">
                  <span className="text-[10px] text-[#00B8D9] font-bold uppercase tracking-wider block">Bogie Mechanics</span>
                  <span className="text-white text-lg font-bold">FIAT Air Spring</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:text-left">
                  <span className="text-[10px] text-[#00B8D9] font-bold uppercase tracking-wider block">Compatibility</span>
                  <span className="text-white text-lg font-bold">Open Rails &bull; MSTS</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:text-left">
                  <span className="text-[10px] text-[#00B8D9] font-bold uppercase tracking-wider block">Framerate Target</span>
                  <span className="text-white text-lg font-bold">60 FPS Smooth</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Hero Visual Card */}
            <div className="lg:w-5/12 w-full">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#00B8D9]/40 shadow-2xl bg-[#0B1527] group">
                <img
                  src="/assets/tbpro/hero_lhb_train.jpg"
                  alt="Indian Railways LHB Rake in Motion"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#101D35] via-[#101D35]/85 to-transparent p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#00B8D9] uppercase tracking-wider block">
                        Official Simulation Fleet
                      </span>
                      <div className="text-white font-bold text-lg sm:text-xl">
                        Indian Railways LHB Passenger Express
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B00] text-white shadow-sm">
                      TB PRO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. TRAIN SIMULATION HIGHLIGHTS (KEY PILLARS)
          ========================================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174EA6] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Engineered For Train Enthusiasts
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D35]">
            Why Choose TB PRO Add-ons?
          </h2>
          <p className="text-sm text-slate-600">
            We bridge the gap between engineering specifications and interactive virtual railway simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#174EA6] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#101D35]">Engineering Precision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modeled to exact Research Designs and Standards Organisation (RDSO) blueprints with stainless steel body dimensions, CBC couplers, and roof profiles.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#174EA6] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#101D35]">FIAT Bogie Suspension</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom .wag physics with authentic secondary air spring damping, twin-pipe air brake curves, and wheel-rail sound acoustic resonance.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#174EA6] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center font-bold">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#101D35]">Open Rails &amp; MSTS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tested on both modern 64-bit Open Rails v1.5+ multi-threading and classic MSTS Bin 1.8 engines without bounding box or polygon crashes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#174EA6] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center font-bold">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#101D35]">Instant Digital Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate access upon checkout with high-speed download links, clear install guides, and lifetime access from your personal account portal.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED LHB COACHES SECTION (FROM DATABASE PRODUCTS)
          ========================================================================= */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Rolling Stock Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D35] mt-2">
                Featured LHB Coaches &amp; Consists
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore real, verified Indian Railways coaching stock available for instant simulation.
              </p>
            </div>

            <Link
              href="/coaches"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#174EA6] hover:text-[#00B8D9] transition-colors"
            >
              <span>View All LHB Coaches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.slice(0, 6).map((product) => {
              const currentPrice = product.salePrice ?? product.regularPrice;
              const hasDiscount = product.regularPrice > currentPrice;
              const isOutOfStock = product.status === "OUT_OF_STOCK" || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
              const isComingSoon = product.status === "COMING_SOON";

              const primaryImg =
                product.images && product.images.length > 0
                  ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0].url)
                  : (product.image || product.imageUrl || "/assets/tbpro/lhb_chaircar.png");

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#174EA6]/40 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="relative aspect-[16/10] bg-[#F4F7FB] overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.isSpecialOffer && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF6B00] text-white shadow-sm uppercase tracking-wider">
                          {product.specialOfferText || "Special Offer"}
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

                    <button
                      onClick={() => setQuickViewProduct(product)}
                      aria-label={`Quick view ${product.name}`}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-[#174EA6] hover:text-white text-[#172033] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-bold text-[#174EA6] uppercase tracking-wider">
                          {product.category?.name || "LHB Coach"}
                        </span>
                        <span className="bg-[#F4F7FB] px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200">
                          {product.compatibility || "Open Rails / MSTS"}
                        </span>
                      </div>

                      <Link
                        href={`/shop/${product.slug || product.id}`}
                        className="font-josefin font-bold text-lg text-[#101D35] group-hover:text-[#174EA6] transition-colors line-clamp-2 leading-snug"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {product.shortDesc || product.description || "Authentic Indian Railways rolling stock designed for Open Rails & MSTS."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-[#101D35]">
                            {formatCurrency(currentPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-slate-400 line-through">
                              {formatCurrency(product.regularPrice)}
                            </span>
                          )}
                        </div>

                        {hasDiscount && (
                          <span className="text-xs font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {Math.round(((product.regularPrice - currentPrice) / product.regularPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="py-2.5 px-3 rounded-xl bg-[#F4F7FB] hover:bg-[#174EA6] hover:text-white text-[#174EA6] text-xs font-bold transition-all border border-gray-200 flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Contents</span>
                        </button>

                        <button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              productId: product.id,
                              name: product.name,
                              price: currentPrice,
                              regularPrice: product.regularPrice,
                              image: primaryImg,
                              sku: product.sku || product.id,
                              categoryName: product.category?.name,
                              compatibility: product.compatibility,
                              isFree: product.isFree || currentPrice === 0,
                            });
                          }}
                          disabled={isOutOfStock || isComingSoon || isInCart(product.id)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                            isInCart(product.id)
                              ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                              : isOutOfStock || isComingSoon
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-[#101D35] hover:bg-[#174EA6] text-white"
                          }`}
                        >
                          {isInCart(product.id) ? (
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
      </section>

      {/* =========================================================================
          6. DYNAMIC SLIDESHOW SHOWCASE (PRESERVES EXISTING ADMIN SLIDER MANAGEMENT)
          ========================================================================= */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#174EA6] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Interactive Fleet Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D35] mt-2">
              LHB Coach Lineup
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browsing {visibleSlides.length} verified coach liveries &amp; route simulation packs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[260px]">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl bg-white font-josefin text-xs text-[#172033] placeholder-gray-400 focus:outline-none focus:border-[#174EA6] transition-colors shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>
          </div>
        </div>

        {/* Slide Showcase Box */}
        {currentSlide ? (
          <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl transition-all">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-[#F4F7FB] overflow-hidden group">
              <Link
                href={currentSlide.buttonUrl || "/shop"}
                className="w-full h-full flex items-center justify-center p-4 sm:p-8"
              >
                <img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-contain transition-all duration-700 ease-out animate-fadeIn group-hover:scale-105"
                />
              </Link>

              {/* Prev & Next Navigation Buttons */}
              <button
                onClick={handlePrev}
                aria-label="Previous coach slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#101D35] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next coach slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#101D35] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Counter Badge */}
              <div className="absolute top-4 left-4 bg-[#101D35]/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                <span>Slide {currentIndex + 1} of {visibleSlides.length}</span>
                {!currentSlide.isActive && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                    INACTIVE
                  </span>
                )}
              </div>

              {/* On-Slide Admin Controls */}
              {currentUser && isAdminMode && (
                <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(currentSlide)}
                    className="p-1.5 rounded-md bg-[#101D35] text-white hover:bg-[#00B8D9] hover:text-[#101D35] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Edit Slide Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRenameSlideModal(currentSlide)}
                    className="p-1.5 rounded-md bg-white/20 text-white hover:bg-white/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Rename Title"
                  >
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadSlideModal(currentSlide);
                      setUploadPreview(currentSlide.image);
                    }}
                    className="p-1.5 rounded-md bg-[#174EA6] text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Upload / Replace Image"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSlideActive(currentSlide)}
                    className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      currentSlide.isActive
                        ? "bg-[#16A34A] text-white hover:bg-emerald-700"
                        : "bg-gray-500 text-white hover:bg-gray-600"
                    }`}
                    title={currentSlide.isActive ? "Disable Slide" : "Enable Slide"}
                  >
                    {currentSlide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{currentSlide.isActive ? "Active" : "Disabled"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => handleMoveSlide(currentSlide, "left")}
                    className="p-1.5 rounded-md bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 text-xs transition-colors cursor-pointer"
                    title="Move Order Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={currentIndex === visibleSlides.length - 1}
                    onClick={() => handleMoveSlide(currentSlide, "right")}
                    className="p-1.5 rounded-md bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 text-xs transition-colors cursor-pointer"
                    title="Move Order Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteSlideModal({ id: currentSlide.id, title: currentSlide.title })}
                    className="p-1.5 rounded-md bg-[#DC2626] text-white hover:bg-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-5 sm:p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Link
                  href={currentSlide.buttonUrl || "/shop"}
                  className="font-josefin text-xl sm:text-2xl font-bold text-[#101D35] hover:text-[#174EA6] transition-colors block leading-tight"
                >
                  {currentSlide.title}
                </Link>
                {currentSlide.description && (
                  <p className="font-josefin text-xs sm:text-sm text-slate-500">
                    {currentSlide.description}
                  </p>
                )}
                {currentSlide.subtitle && (
                  <p className="font-josefin text-xs sm:text-sm font-semibold text-[#FF6B00]">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                <Link
                  href={currentSlide.buttonUrl || "/shop"}
                  className="bg-[#101D35] hover:bg-[#174EA6] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>{currentSlide.buttonText || "View Product Details"}</span>
                  <ArrowRight className="w-4 h-4 text-[#00B8D9]" />
                </Link>
                <span className="font-josefin text-xs font-bold text-slate-400">
                  {currentIndex + 1} of {visibleSlides.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-8">
            <p className="text-base font-semibold text-gray-600 mb-4">No slides currently available.</p>
            {currentUser && (
              <button
                type="button"
                onClick={() => setShowAddSlideModal(true)}
                className="px-6 py-2.5 rounded-xl bg-[#101D35] text-white font-bold text-sm hover:bg-[#00B8D9] hover:text-[#101D35]"
              >
                + Add Your First Slide
              </button>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          7. TRAIN BOARDS & ROUTE TEASER SECTION
          ========================================================================= */}
      <section className="bg-[#101D35] text-white py-16 border-t border-[#174EA6]/30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-[#00B8D9] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Simulation Accessories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Authentic Indian Railways <br />
                <span className="text-[#00B8D9]">Train Boards</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Elevate your Open Rails and MSTS consists with high-resolution, zone-authentic destination boards for Western Railway (WR), Central Railway (CR), and East Coast Railway (ECoR). Features accurate Hindi/English typography, coach numbers, and bilingual destination plates.
              </p>
              <div className="pt-2">
                <Link
                  href="/trainboards"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#00B8D9] hover:from-[#101D35] hover:to-[#174EA6] text-white text-sm font-bold inline-flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>Browse Train Boards Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-[#0B1527] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="text-xs text-[#00B8D9] font-bold uppercase tracking-wider">
                Popular Train Board Packs Available:
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>12010 Ahmedabad – Mumbai Central Shatabdi Express</span>
                  <span className="text-[#00B8D9] font-bold">WR</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>22221 CSMT – Hazrat Nizamuddin Rajdhani Express</span>
                  <span className="text-[#00B8D9] font-bold">CR</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>22823 Bhubaneswar – New Delhi Tejas Rajdhani</span>
                  <span className="text-[#00B8D9] font-bold">ECoR</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ADMIN MODALS (1: ADD, 2: EDIT, 3: RENAME, 4: UPLOAD, 5: DELETE)
          ========================================================================= */}
      {showAddSlideModal && (
        <SlideEditModal
          title="Add New Home Page Slide"
          initialValues={{
            title: "",
            subtitle: "TB PRO Indian Railways LHB Coaching Stock",
            description: "High-precision Indian Railway rolling stock model built for Open Rails and MSTS.",
            image: "/assets/tbpro/lhb_chaircar.png",
            buttonText: "View Product Details",
            buttonUrl: "/shop",
            order: slides.length + 1,
            isActive: true,
          }}
          isNew={true}
          onClose={() => setShowAddSlideModal(false)}
          onSave={(vals) => handleSaveSlide({ preventDefault: () => {} } as any, vals, true)}
          onUpload={handleFileUpload}
          isUploading={isUploading}
        />
      )}

      {editingSlide && (
        <SlideEditModal
          title={`Edit Slide: ${editingSlide.title}`}
          initialValues={editingSlide}
          isNew={false}
          onClose={() => setEditingSlide(null)}
          onSave={(vals) => handleSaveSlide({ preventDefault: () => {} } as any, vals, false)}
          onUpload={handleFileUpload}
          isUploading={isUploading}
        />
      )}

      {renameSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="font-josefin text-xl font-bold text-[#101D35] mb-3">Rename Slide Title</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newTitle = (form.elements.namedItem("title") as HTMLInputElement).value;
                handleSaveSlide(e, { id: renameSlideModal.id, title: newTitle }, false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slide Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={renameSlideModal.title}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm text-[#172033] focus:ring-2 focus:ring-[#174EA6]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameSlideModal(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101D35] text-white text-xs font-bold hover:bg-[#174EA6]"
                >
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {imageUploadSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-josefin text-xl font-bold text-[#101D35]">Upload or Replace Image</h3>
              <button
                type="button"
                onClick={() => setImageUploadSlideModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/9] w-full bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center p-4">
              <img
                src={uploadPreview || imageUploadSlideModal.image}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Upload from Local Computer (JPG, PNG, WEBP, AVIF)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, (uploadedUrl) => {
                      setUploadPreview(uploadedUrl);
                    });
                  }
                }}
                className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#101D35] file:text-white hover:file:bg-[#174EA6] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Or Image URL</label>
              <input
                type="text"
                value={uploadPreview}
                onChange={(e) => setUploadPreview(e.target.value)}
                placeholder="/assets/products/coach.png or https://..."
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono text-[#172033]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setImageUploadSlideModal(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={(e) => {
                  handleSaveSlide(
                    e,
                    { id: imageUploadSlideModal.id, image: uploadPreview || imageUploadSlideModal.image },
                    false
                  );
                }}
                className="px-5 py-2 rounded-xl bg-[#101D35] text-white text-xs font-bold hover:bg-[#174EA6] disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-josefin text-lg font-bold text-gray-900">Delete Slide Permanently?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <strong>"{deleteSlideModal.title}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteSlideModal(null)}
                className="px-5 py-2 rounded-xl border text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSlide}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

// Subcomponent: Slide Edit / Create Modal
function SlideEditModal({
  title,
  initialValues,
  isNew,
  onClose,
  onSave,
  onUpload,
  isUploading,
}: {
  title: string;
  initialValues: any;
  isNew: boolean;
  onClose: () => void;
  onSave: (vals: any) => void;
  onUpload: (file: File, cb: (url: string) => void) => void;
  isUploading: boolean;
}) {
  const [formData, setFormData] = useState({
    id: initialValues.id,
    title: initialValues.title || "",
    subtitle: initialValues.subtitle || "",
    description: initialValues.description || "",
    image: initialValues.image || "/assets/tbpro/lhb_chaircar.png",
    buttonText: initialValues.buttonText || "View Product Details",
    buttonUrl: initialValues.buttonUrl || "/shop",
    order: initialValues.order || 1,
    isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
  });

  const presetImages = [
    { name: "LHB Train (Hero)", url: "/assets/tbpro/hero_lhb_train.jpg" },
    { name: "WAP-7 Loco", url: "/assets/tbpro/wap7_locomotive.jpg" },
    { name: "LHB AC 1st", url: "/assets/tbpro/lhb_ac_first.jpg" },
    { name: "LHB Sleeper", url: "/assets/tbpro/lhb_sleeper.png" },
    { name: "LHB Chair Car", url: "/assets/tbpro/lhb_chaircar.png" },
    { name: "LHB Vistadome", url: "/assets/tbpro/lhb_vistadome.png" },
    { name: "Amrit Bharat", url: "/assets/tbpro/lhb_amrit_bharat.png" },
    { name: "Bangladesh Maitree", url: "/assets/tbpro/lhb_bangladesh.png" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-josefin">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <h3 className="font-josefin text-xl font-bold text-[#101D35]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="space-y-4 font-josefin text-xs sm:text-sm"
        >
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Slide Title / Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. TB PRO LHB SLEEPER COACHES"
              className="w-full px-3 py-2 border rounded-lg text-[#172033]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Subtitle (Highlight Text)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="TB PRO Indian Railways Simulation Stock"
              className="w-full px-3 py-2 border rounded-lg text-[#172033]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Hyper-realistic LHB coach model crafted for Open Rails and MSTS..."
              className="w-full px-3 py-2 border rounded-lg text-[#172033]"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <label className="block font-semibold text-gray-700">Slide Image &amp; Upload</label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="aspect-[16/9] w-36 bg-white rounded-lg border overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUpload(file, (url) => setFormData({ ...formData, image: url }));
                    }
                  }}
                  className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#101D35] file:text-white hover:file:bg-[#174EA6] cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or enter direct image path..."
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 block mb-1">Or choose a TB PRO preset:</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {presetImages.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: p.url })}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      formData.image === p.url
                        ? "bg-[#101D35] text-white border-[#101D35]"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="View Product Details"
                className="w-full px-3 py-2 border rounded-lg text-[#172033]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Destination URL</label>
              <input
                type="text"
                value={formData.buttonUrl}
                onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                placeholder="/shop/product-slug"
                className="w-full px-3 py-2 border rounded-lg text-[#172033]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Display Order Index</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-[#172033]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#101D35] rounded focus:ring-[#101D35]"
              />
              <label htmlFor="isActiveCheck" className="font-semibold text-gray-700 cursor-pointer">
                Active &amp; Published on Home Slider
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 rounded-xl bg-[#101D35] text-white text-xs font-bold hover:bg-[#174EA6] shadow-md transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : isNew ? "Create Slide" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
