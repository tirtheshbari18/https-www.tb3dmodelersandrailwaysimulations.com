"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

interface HomeClientProps {
  featuredProducts: any[];
  newArrivals: any[];
  categories: any[];
  projects: any[];
  services: any[];
  settings: any;
}

export default function HomeClient({
  featuredProducts,
  newArrivals,
  categories,
  projects,
  services,
  settings,
}: HomeClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const AUTO_SLIDE_DURATION_MS = 3800; // 3.8 seconds per slide

  // Full 13-item collection matching reference screenshots and catalog
  const showcaseProducts = [
    {
      num: "01",
      title: "VG LHB VG ACADEMY LIVERY SLEEPER COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vg_academy_sleeper.avif",
      slug: "vg-lhb-vg-academy-livery-sleeper-coaches",
      desc: "Hyper-realistic LHB Sleeper coach with custom Academy livery, high-poly bogies, and night lighting.",
      tag: "Academy Livery",
    },
    {
      num: "02",
      title: "VG LHB HUMSAFAR COACHES V2",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/humsafar_v2.avif",
      slug: "vg-lhb-humsafar-coaches-v2",
      desc: "Signature geometric vinyl aesthetic with 3-tier sleeper passenger compartments and animated doors.",
      tag: "V2 Update",
    },
    {
      num: "03",
      title: "VG LHB SLEEPER COACHES V2",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/sleeper_v2.avif",
      slug: "vg-lhb-sleeper-coaches-v2-update",
      desc: "Updated V2 long-distance sleeper rolling stock for Rajdhani, Duronto, and Superfast expresses.",
      tag: "Sleeper Class",
    },
    {
      num: "04",
      title: "VG LHB CHAIRCAR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/chaircar_standard.png",
      slug: "vg-lhb-coaches",
      desc: "Premier daytime express coaches including Shatabdi, Deccan Queen, and Anubhuti variants.",
      tag: "Chair Car",
    },
    {
      num: "05",
      title: "VG LHB VISTADOME COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vistadome_standard.png",
      slug: "vg-lhb-vistadome-coaches",
      desc: "Panoramic observation coaches with curved glass canopy roofs, swivel seating, and animated doors.",
      tag: "Panoramic Dome",
    },
    {
      num: "06",
      title: "VG LHB AMRIT BHARAT COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/amrit_bharat.png",
      slug: "vg-lhb-amrit-bharat-coaches",
      desc: "Modern non-AC high-speed push-pull rake with signature vibrant orange and grey colorway.",
      tag: "Push-Pull Fleet",
    },
    {
      num: "07",
      title: "VG LHB BANGLADESH COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/bangladesh_coaches.png",
      slug: "vg-lhb-bangladesh-coaches",
      desc: "Export LHB rolling stock for international routes like Maitree Express connecting Dhaka and Kolkata.",
      tag: "International Export",
    },
    {
      num: "08",
      title: "VG LHB PNB LIVERY CHAIRCAR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/pnb_livery.png",
      slug: "vg-lhb-pnb-livery-chaircar-coaches",
      desc: "Commercial wrap edition featuring authentic Punjab National Bank advert livery.",
      tag: "Commercial Wrap",
    },
    {
      num: "09",
      title: "VG LHB INDIAN TRICOLOUR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/indian_tricolour.avif",
      slug: "vg-lhb-indian-tricolour-coaches",
      desc: "Patriotic commemorative livery inspired by the national tricolour for celebration rakes.",
      tag: "Special Edition",
    },
    {
      num: "10",
      title: "VG LHB VISTADOME LIVERY COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vistadome_livery.png",
      slug: "vg-lhb-vistadome-livery-coaches",
      desc: "Special scenic route livery with reflective glass shaders and high-detail passenger lounge.",
      tag: "Vistadome Livery",
    },
    {
      num: "11",
      title: "WHR Route (V2 Ahmedabad Update)",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/whr_route_v2.png",
      slug: "whr-route-v2-ahmedabad-update",
      desc: "High-precision Western Railway route expansion featuring major yard layouts and custom scenery.",
      tag: "Route Addon",
    },
    {
      num: "12",
      title: "VG BR LHB MAITREE EXPRESS PACK",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/projects/05_vg_lhb_bangladesh.png",
      slug: "vg-br-lhb-maitree-v1-5",
      desc: "Complete international express consist with custom bogie audio and bilingual trainboards.",
      tag: "Complete Consist",
    },
    {
      num: "13",
      title: "VG LHB FIAT BOGIE AUDIO & PHYSICS EXPANSION",
      subtitle: "(Free Community Utility) Download and calibrate your train simulator rakes.",
      image: "/assets/projects/07_wip_sleeper_render.png",
      slug: "vg-fiat-bogie-audio-v1-2",
      desc: "Authentic track joint sounds, flange squeal, and calibrated deceleration physics curves.",
      tag: "Physics & Audio",
    },
  ];

  // Automatic Sliding Timer (pauses on user hover)
  useEffect(() => {
    if (!isAutoPlaying || isHovered) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, AUTO_SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, showcaseProducts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const currentItem = showcaseProducts[currentIndex];

  return (
    <div className="w-full bg-white text-[#101C32] select-none font-josefin">
      {/* =========================================================================
          A. PROMOTIONAL ANNOUNCEMENT BAR (ORANGE WITH GREEN ARROW SEPARATORS)
          ========================================================================= */}
      <div className="w-full bg-[#FF6600] text-white py-2 overflow-hidden select-none border-b border-[#E65C00] shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-4 font-josefin text-[14px] sm:text-[15px] font-semibold tracking-wide">
              <span>Last Day! Festival offer ends tonight at 11:45 PM. (Please visit shop page for more details)</span>
              <span className="text-[#39FF00] font-bold text-lg mx-3">»»</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          B. PRODUCT GALLERY & AUTOMATIC SLIDING WINDOWS
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
              Showing 13 high-fidelity Indian Railway rolling stock and route add-ons
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

        {/* Center Showcase Sliding Window Box */}
        <div
          className="relative border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl transition-all"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Main Showcase Image Area */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-[#F5F6F8] overflow-hidden group">
            <Link
              href={`/shop/${currentItem.slug}`}
              className="w-full h-full flex items-center justify-center p-4 sm:p-8"
            >
              <img
                key={currentItem.num}
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-contain transition-all duration-700 ease-out animate-fadeIn group-hover:scale-105"
              />
            </Link>

            {/* Previous Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous coach"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0B2852] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next coach"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0B2852] border border-gray-200 shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10 focus:outline-none cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            {/* Top Badges on Image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-[#0B2852]/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Item {currentItem.num} / {showcaseProducts.length}
              </span>
              <span className="hidden sm:inline-block bg-[#39FF00] text-[#101C32] text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {currentItem.tag}
              </span>
            </div>

            {/* Auto-Slide Status Toggle Pill */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0B2852]/80 backdrop-blur-sm text-white hover:bg-[#0B2852] border border-white/20 transition-all cursor-pointer shadow"
                title={isAutoPlaying ? "Pause auto-slide" : "Play auto-slide"}
              >
                {isAutoPlaying && !isHovered ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#39FF00]" />
                    <span className="hidden md:inline">Auto-Sliding</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#39FF00]" />
                    <span className="hidden md:inline">{isHovered ? "Paused on Hover" : "Paused"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Caption Overlay Bar */}
          <div className="p-5 sm:p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link
                href={`/shop/${currentItem.slug}`}
                className="font-josefin text-[20px] sm:text-[24px] font-normal text-[#0B2852] hover:text-[#39FF00] hover:underline transition-colors block leading-tight"
              >
                {currentItem.title}
              </Link>
              <p className="font-josefin text-[13px] sm:text-[14px] text-gray-500">
                {currentItem.desc}
              </p>
              <p className="font-josefin text-[12px] sm:text-[13px] font-semibold text-[#FF6600]">
                {currentItem.subtitle}
              </p>
            </div>

            {/* Actions: View in Shop & Pagination */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
              <Link
                href={`/shop/${currentItem.slug}`}
                className="bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow transition-all duration-200"
              >
                View Product Details
              </Link>
              <span className="font-josefin text-[14px] font-bold text-gray-400">
                {currentIndex + 1} of {showcaseProducts.length}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            C. WHATSAPP CONTACT SHORTCUT
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
    </div>
  );
}
