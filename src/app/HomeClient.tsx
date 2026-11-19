"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

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

  // Exact 11 original products showcase matching reference site
  const showcaseProducts = [
    {
      title: "VG LHB VG ACADEMY LIVERY SLEEPER COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vg_academy_sleeper.avif",
      slug: "vg-lhb-vg-academy-livery-sleeper-coaches",
    },
    {
      title: "VG LHB HUMSAFAR COACHES V2",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/humsafar_v2.avif",
      slug: "vg-lhb-humsafar-coaches-v2",
    },
    {
      title: "VG LHB SLEEPER COACHES V2",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/sleeper_v2.avif",
      slug: "vg-lhb-sleeper-coaches-v2-update",
    },
    {
      title: "VG LHB CHAIRCAR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/chaircar_standard.png",
      slug: "vg-lhb-coaches",
    },
    {
      title: "VG LHB VISTADOME COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vistadome_standard.png",
      slug: "vg-lhb-vistadome-coaches",
    },
    {
      title: "VG LHB AMRIT BHARAT COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/amrit_bharat.png",
      slug: "vg-lhb-amrit-bharat-coaches",
    },
    {
      title: "VG LHB BANGLADESH COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/bangladesh_coaches.png",
      slug: "vg-lhb-bangladesh-coaches",
    },
    {
      title: "VG LHB PNB LIVERY CHAIRCAR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/pnb_livery.png",
      slug: "vg-lhb-pnb-livery-chaircar-coaches",
    },
    {
      title: "VG LHB INDIAN TRICOLOUR COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/indian_tricolour.avif",
      slug: "vg-lhb-indian-tricolour-coaches",
    },
    {
      title: "VG LHB VISTADOME LIVERY COACHES",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/vistadome_livery.png",
      slug: "vg-lhb-vistadome-livery-coaches",
    },
    {
      title: "WHR Route (V2 Ahmedabad Update)",
      subtitle: "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!",
      image: "/assets/products/whr_route_v2.png",
      slug: "whr-route-v2-ahmedabad-update",
    },
  ];

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
    <div className="w-full bg-white text-[#041229]">
      {/* 1. Festival Offer Marquee Ticker */}
      <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[#d32f2f] font-futuraLight text-[14px] sm:text-[15px] font-bold mx-4">
              Last Day! Festival offer ends tonight at 11:45 PM. (Please visit shop page for more details)&nbsp;&nbsp;»»&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="max-w-[980px] mx-auto px-4 pt-10 pb-16">
        {/* Top Header: "Home: Products - 11x" on Left, Search Input on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-futuraBook text-[36px] sm:text-[40px] font-normal tracking-tight text-[#041229] leading-[48px] sm:leading-[54px]">
              Home:<br />Products - 11x
            </h1>
          </div>

          {/* Clean Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[260px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-400 rounded-none bg-white font-futuraLight text-[14px] text-[#041229] placeholder-gray-500 focus:outline-none focus:border-[#041229]"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* 3. Center Showcase Carousel Box */}
        <div className="relative border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
          {/* Main Showcase Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center bg-gray-50 overflow-hidden">
            <Link href={`/shop/${currentItem.slug}`} className="w-full h-full flex items-center justify-center">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-contain p-2 hover:scale-[1.01] transition-transform duration-300"
              />
            </Link>

            {/* Previous Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous product"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#041229] border border-gray-300 shadow flex items-center justify-center transition-all hover:scale-105 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next product"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#041229] border border-gray-300 shadow flex items-center justify-center transition-all hover:scale-105 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Overlay Bar */}
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <Link
                href={`/shop/${currentItem.slug}`}
                className="font-futuraBook text-[18px] sm:text-[20px] font-normal text-[#041229] hover:underline"
              >
                {currentItem.title}
              </Link>
              <p className="font-futuraLight text-[13px] sm:text-[14px] text-gray-700">
                {currentItem.subtitle}
              </p>
            </div>

            {/* Pagination Counter */}
            <span className="font-futuraLight text-[14px] text-gray-500 self-end sm:self-auto flex-shrink-0">
              {currentIndex + 1}/{showcaseProducts.length}
            </span>
          </div>
        </div>

        {/* 4. WhatsApp Contact Shortcut */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="font-futuraLight font-bold text-[18px] sm:text-[20px] leading-[33.4px] text-[#041229]">
            Contact Varun Ganesh for details
          </span>
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Varun Ganesh on WhatsApp"
            className="hover:scale-110 transition-transform"
          >
            <img
              src="/assets/icons/whatsapp.png"
              alt="WhatsApp"
              className="w-10 h-10 object-contain rounded-full shadow-sm"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
