"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#0B2852] text-white">
      {/* 1. Full-Width Deep Navy-Blue Hero Section */}
      <div className="w-full py-16 sm:py-24 px-4 border-b border-[#143B73]">
        <div className="max-w-[960px] mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h1 className="font-josefin text-[34px] sm:text-[44px] md:text-[52px] font-extralight tracking-wide text-white leading-tight">
            About VG-3D Modelers & Railway Simulations
          </h1>

          {/* Subtitle */}
          <p className="font-josefin text-[19px] sm:text-[23px] text-[#A7D2F7] font-light tracking-wide max-w-[800px] mx-auto leading-relaxed">
            Authentic rail simulation add-ons driven by real-life physics and engineering insights.
          </p>

          <div className="w-24 h-1 bg-[#39FF00] mx-auto rounded-full"></div>

          {/* Large Readable Paragraph */}
          <div className="max-w-[880px] mx-auto pt-4">
            <p className="font-josefin text-[17px] sm:text-[20px] text-white/95 leading-[34px] sm:leading-[38px] font-light text-center sm:text-justify sm:text-center">
              VG-3D Modelers & Railway Simulations is a premier digital design studio dedicated to bringing the spirit of Indian Railways to life with unparalleled realism. Founded by Varun Ganesh, our studio bridges the gap between engineering and high-fidelity 3D artistry. We specialize in crafting ultra-detailed rolling stock and assets for Open Rails and MSTS, featuring designs thoughtfully inspired by the modern LHB coaches that define the Indian rail experience. By focusing on technical accuracy, realistic physics, and aesthetic nuances, we provide rail enthusiasts with an immersive, &quot;true-to-life&quot; simulation that honors the engineering heritage of India&apos;s lifeline. From sleek silhouettes to iconic liveries, VG-3D doesn&apos;t just build models; we recreate the journey.
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="bg-white hover:bg-[#39FF00] text-[#101C32] font-josefin font-semibold text-sm sm:text-base px-8 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="bg-[#143B73] hover:bg-white/20 text-white font-josefin font-semibold text-sm sm:text-base px-8 py-3 rounded-full border border-white/30 shadow transition-all duration-200"
            >
              Visit Simulator Shop
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Light-Blue Accent Section (#A7D2F7) with 3-Angle Coach Render Showcase */}
      <div className="w-full bg-[#A7D2F7] py-16 px-4 flex flex-col justify-center items-center">
        <div className="max-w-[850px] w-full text-center space-y-4 mb-6">
          <h2 className="font-josefin text-[26px] sm:text-[32px] font-light text-[#0B2852] tracking-wide">
            High-Precision Rolling Stock Engineering
          </h2>
          <p className="font-josefin text-[15px] sm:text-[16px] text-[#0B2852]/80 max-w-[600px] mx-auto">
            From exterior coach textures to interior night lighting and animated doors, every detail is crafted with engineering passion.
          </p>
        </div>

        <div className="border-4 border-white p-2 bg-white rounded-2xl shadow-2xl max-w-[760px] w-full overflow-hidden hover:scale-[1.01] transition-transform duration-300">
          <img
            src="/assets/banners/about_hero_trio.png"
            alt="VG LHB CHAIRCAR COACHES multi-angle render"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
      </div>

      {/* 3. Modeler Commitment & Stats Banner */}
      <div className="w-full bg-[#081d3d] py-14 px-4 border-t border-[#143B73]">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-josefin text-3xl sm:text-4xl font-bold text-[#39FF00] block">
              100%
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Authentic Physics
            </span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-josefin text-3xl sm:text-4xl font-bold text-[#A7D2F7] block">
              13+
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              LHB Coach Models
            </span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-josefin text-3xl sm:text-4xl font-bold text-white block">
              MSTS & OR
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Simulator Compatibility
            </span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-josefin text-3xl sm:text-4xl font-bold text-[#39FF00] block">
              Varun G.
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Lead Modeler & Founder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
