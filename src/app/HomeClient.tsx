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
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Filter slides: If not admin, show only active slides
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
    <div className="w-full bg-white text-[#101C32] select-none font-josefin">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl font-josefin text-sm flex items-center gap-2 border transition-all animate-bounce ${
            toastMsg.isError
              ? "bg-rose-50 text-rose-800 border-rose-300"
              : "bg-emerald-50 text-emerald-800 border-emerald-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#39FF00]" />
          <span className="font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* =========================================================================
          PROMOTIONAL ANNOUNCEMENT BAR
          ========================================================================= */}
      <div className="w-full bg-[#FF6600] text-white py-2 overflow-hidden select-none border-b border-[#E65C00] shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center mx-4 font-josefin text-[14px] sm:text-[15px] font-semibold tracking-wide"
            >
              <span>Last Day! Festival offer ends tonight at 11:45 PM. (Please visit shop page for more details)</span>
              <span className="text-[#39FF00] font-bold text-lg mx-3">»»</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ADMIN SLIDER MANAGEMENT TOOLBAR (VISIBLE FOR LOGGED IN ADMIN)
          ========================================================================= */}
      {currentUser && (
        <div className="bg-[#0B2852] text-white border-b-2 border-[#39FF00] py-3 px-4 shadow-md sticky top-[69px] z-30">
          <div className="max-w-[1080px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#39FF00] text-[#101C32] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-[#0B2852]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wide text-[#39FF00]">
                    HOME SLIDER MANAGEMENT
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold text-white">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">
                  Total Slides: <strong>{slides.length}</strong> ({activeSlidesCount} Active)
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Admin Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isAdminMode
                    ? "bg-[#39FF00] text-[#101C32] hover:bg-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <span>ADMIN MODE:</span>
                <span className="uppercase">{isAdminMode ? "ON" : "OFF"}</span>
              </button>

              {/* Add New Slide Button */}
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => setShowAddSlideModal(true)}
                  className="px-4 py-1.5 rounded-full bg-white text-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Add New Slide</span>
                </button>
              )}

              {/* Slide Timing Dropdown */}
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs text-white">
                <Clock className="w-3 h-3 text-[#39FF00]" />
                <span className="text-[11px] text-gray-300">Timer:</span>
                <select
                  value={slideInterval}
                  onChange={(e) => handleSaveInterval(parseInt(e.target.value, 10))}
                  className="bg-transparent text-[#39FF00] font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value={3000} className="text-[#101C32]">3 Seconds</option>
                  <option value={5000} className="text-[#101C32]">5 Seconds (Default)</option>
                  <option value={8000} className="text-[#101C32]">8 Seconds</option>
                  <option value={10000} className="text-[#101C32]">10 Seconds</option>
                </select>
              </div>

              {/* Auto Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  isAutoPlay ? "bg-[#39FF00] text-[#101C32]" : "bg-white/20 text-white"
                }`}
                title={isAutoPlay ? "Pause Auto-Slide" : "Start Auto-Slide"}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-full bg-[#143B73] hover:bg-[#1b4d96] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN HOME CONTENT & SLIDER WINDOW
          ========================================================================= */}
      <div className="max-w-[1080px] mx-auto px-4 pt-10 pb-16">
        {/* Top Header: "Home: Products - 11x" on Left, Notice Trigger & Search on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
          <div>
            <h1 className="font-josefin text-[36px] sm:text-[44px] font-extralight tracking-tight text-[#101C32] leading-tight">
              Home:<br />
              <span className="font-normal text-[#0B2852]">Products - 11x</span>
            </h1>
            <p className="font-josefin text-sm text-gray-500 mt-1">
              Showing {visibleSlides.length} high-fidelity Indian Railway rolling stock and route add-ons
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Notice Recall Button */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-anti-piracy-modal"));
                }
              }}
              className="text-xs bg-[#ECE8F8] text-[#2A1E68] border border-[#D8CEF6] px-3.5 py-2 rounded-full font-semibold hover:bg-[#D8CEF6] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>⚠️ Official Notice</span>
            </button>

            {/* Clean Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[260px]">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-full bg-white font-josefin text-[13px] text-[#101C32] placeholder-gray-400 focus:outline-none focus:border-[#0B2852] transition-colors shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>
          </div>
        </div>

        {/* Center Showcase Carousel Box */}
        {currentSlide ? (
          <div className="relative border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl transition-all">
            {/* Main Showcase Image Area */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-[#F5F6F8] overflow-hidden group">
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

              {/* Previous Button */}
              <button
                onClick={handlePrev}
                aria-label="Previous coach slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0B2852] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                aria-label="Next coach slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0B2852] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Slide Counter Badge */}
              <div className="absolute top-4 left-4 bg-[#0B2852]/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                <span>Slide {currentIndex + 1} of {visibleSlides.length}</span>
                {!currentSlide.isActive && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                    INACTIVE
                  </span>
                )}
              </div>

              {/* ON-SLIDE ADMIN MANAGEMENT CONTROLS */}
              {currentUser && isAdminMode && (
                <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(currentSlide)}
                    className="p-1.5 rounded-md bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
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
                    className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                    title={currentSlide.isActive ? "Disable Slide" : "Enable Slide"}
                  >
                    {currentSlide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{currentSlide.isActive ? "Active" : "Disabled"}</span>
                  </button>

                  {/* Reorder Buttons */}
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

                  {/* Delete Slide */}
                  <button
                    type="button"
                    onClick={() => setDeleteSlideModal({ id: currentSlide.id, title: currentSlide.title })}
                    className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Caption Overlay Bar */}
            <div className="p-5 sm:p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Link
                  href={currentSlide.buttonUrl || "/shop"}
                  className="font-josefin text-[20px] sm:text-[24px] font-normal text-[#0B2852] hover:text-[#39FF00] hover:underline transition-colors block leading-tight"
                >
                  {currentSlide.title}
                </Link>
                {currentSlide.description && (
                  <p className="font-josefin text-[13px] sm:text-[14px] text-gray-500">
                    {currentSlide.description}
                  </p>
                )}
                {currentSlide.subtitle && (
                  <p className="font-josefin text-[12px] sm:text-[13px] font-semibold text-[#FF6600]">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Actions: View in Shop & Pagination */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                <Link
                  href={currentSlide.buttonUrl || "/shop"}
                  className="bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow transition-all duration-200"
                >
                  {currentSlide.buttonText || "View Product Details"}
                </Link>
                <span className="font-josefin text-[14px] font-bold text-gray-400">
                  {currentIndex + 1} of {visibleSlides.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-8">
            <p className="text-lg font-semibold text-gray-600 mb-4">No slides currently available.</p>
            {currentUser && (
              <button
                type="button"
                onClick={() => setShowAddSlideModal(true)}
                className="px-6 py-2.5 rounded-full bg-[#0B2852] text-white font-bold text-sm hover:bg-[#39FF00] hover:text-[#101C32]"
              >
                + Add Your First Slide
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            WHATSAPP CONTACT SHORTCUT
            ========================================================================= */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-[#F5F6F8] rounded-2xl border border-gray-200">
          <span className="font-josefin font-bold text-[18px] sm:text-[22px] leading-tight text-[#0B2852]">
            Contact Varun Ganesh for details
          </span>
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Varun Ganesh on WhatsApp"
            className="hover:scale-110 transition-transform flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full shadow font-semibold text-sm"
          >
            <img
              src="/assets/icons/whatsapp.png"
              alt="WhatsApp"
              className="w-5 h-5 object-contain"
            />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ADD NEW SLIDE
          ========================================================================= */}
      {showAddSlideModal && (
        <SlideEditModal
          title="Add New Home Page Slide"
          initialValues={{
            title: "",
            subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
            description: "High-precision Indian Railway rolling stock model built for Open Rails and MSTS.",
            image: "/assets/products/chaircar_standard.png",
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

      {/* =========================================================================
          MODAL 2: EDIT EXISTING SLIDE
          ========================================================================= */}
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

      {/* =========================================================================
          MODAL 3: QUICK RENAME SLIDE
          ========================================================================= */}
      {renameSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="font-josefin text-xl font-bold text-[#0B2852] mb-3">Rename Slide Title</h3>
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
                  className="w-full px-3 py-2 border rounded-lg text-sm text-[#101C32] focus:ring-2 focus:ring-[#0B2852]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameSlideModal(null)}
                  className="px-4 py-2 rounded-full border text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0B2852] text-white text-xs font-bold hover:bg-[#39FF00] hover:text-[#101C32]"
                >
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: UPLOAD / REPLACE IMAGE
          ========================================================================= */}
      {imageUploadSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-josefin text-xl font-bold text-[#0B2852]">Upload or Replace Image</h3>
              <button
                type="button"
                onClick={() => setImageUploadSlideModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview */}
            <div className="aspect-[16/9] w-full bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center p-4">
              <img
                src={uploadPreview || imageUploadSlideModal.image}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            {/* File Upload from Disk */}
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
                className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0B2852] file:text-white hover:file:bg-[#39FF00] hover:file:text-[#101C32] cursor-pointer"
              />
            </div>

            {/* Image URL Direct Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Or Image URL</label>
              <input
                type="text"
                value={uploadPreview}
                onChange={(e) => setUploadPreview(e.target.value)}
                placeholder="/assets/products/coach.png or https://..."
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono text-[#101C32]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setImageUploadSlideModal(null)}
                className="px-4 py-2 rounded-full border text-xs font-semibold text-gray-700 hover:bg-gray-100"
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
                className="px-5 py-2 rounded-full bg-[#0B2852] text-white text-xs font-bold hover:bg-[#39FF00] hover:text-[#101C32] disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deleteSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-josefin text-lg font-bold text-gray-900">Delete Slide Permanently?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <strong>"{deleteSlideModal.title}"</strong>? This will remove it from the Home page immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteSlideModal(null)}
                className="px-5 py-2 rounded-full border text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSlide}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Slide Edit / Create Modal with Image Upload & Live Preview
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
    image: initialValues.image || "/assets/products/chaircar_standard.png",
    buttonText: initialValues.buttonText || "View Product Details",
    buttonUrl: initialValues.buttonUrl || "/shop",
    order: initialValues.order || 1,
    isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
  });

  const presetImages = [
    { name: "Academy Sleeper", url: "/assets/products/vg_academy_sleeper.avif" },
    { name: "Humsafar V2", url: "/assets/products/humsafar_v2.avif" },
    { name: "Sleeper V2", url: "/assets/products/sleeper_v2.avif" },
    { name: "Chair Car", url: "/assets/products/chaircar_standard.png" },
    { name: "Vistadome", url: "/assets/products/vistadome_standard.png" },
    { name: "Amrit Bharat", url: "/assets/products/amrit_bharat.png" },
    { name: "Bangladesh", url: "/assets/products/bangladesh_coaches.png" },
    { name: "PNB Livery", url: "/assets/products/pnb_livery.png" },
    { name: "Tricolour", url: "/assets/products/indian_tricolour.avif" },
    { name: "Vistadome Livery", url: "/assets/products/vistadome_livery.png" },
    { name: "WHR Route V2", url: "/assets/products/whr_route_v2.png" },
    { name: "Maitree Pack", url: "/assets/projects/05_vg_lhb_bangladesh.png" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <h3 className="font-josefin text-xl font-bold text-[#0B2852]">{title}</h3>
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
          {/* Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Slide Title / Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. VG LHB ACADEMY LIVERY SLEEPER COACHES"
              className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Subtitle (Orange Highlight Text)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="(Coming Soon) Please Sign Up to purchase and download these addons!!!!!"
              className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Hyper-realistic LHB Sleeper coach with custom Academy livery..."
              className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
            />
          </div>

          {/* Image Upload & Live Preview */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <label className="block font-semibold text-gray-700">Slide Image & Upload</label>
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
                  className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0B2852] file:text-white hover:file:bg-[#39FF00] hover:file:text-[#101C32] cursor-pointer"
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

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] text-gray-500 block mb-1">Or choose an official preset:</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {presetImages.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: p.url })}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      formData.image === p.url
                        ? "bg-[#0B2852] text-white border-[#0B2852]"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Button Text & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="View Product Details"
                className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Destination URL</label>
              <input
                type="text"
                value={formData.buttonUrl}
                onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                placeholder="/shop/product-slug"
                className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
              />
            </div>
          </div>

          {/* Display Order & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Display Order Index</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-[#101C32]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#0B2852] rounded focus:ring-[#0B2852]"
              />
              <label htmlFor="isActiveCheck" className="font-semibold text-gray-700 cursor-pointer">
                Active & Published on Home Slider
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 rounded-full bg-[#0B2852] text-white text-xs font-bold hover:bg-[#39FF00] hover:text-[#101C32] shadow-md transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : isNew ? "Create Slide" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
