"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Cpu, Compass, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#101D35] text-white">
      {/* 1. Full-Width Deep Navy-Blue Hero Section */}
      <div className="w-full py-16 sm:py-24 px-4 border-b border-[#174EA6]/40">
        <div className="max-w-[960px] mx-auto text-center space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#174EA6]/40 border border-[#00B8D9]/40 text-[#00B8D9] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#00B8D9]" />
            Engineering & Simulation Heritage
          </div>

          {/* Main Heading */}
          <h1 className="font-josefin text-[34px] sm:text-[46px] md:text-[54px] font-extralight tracking-wide text-white leading-tight">
            About <span className="font-bold text-[#00B8D9]">TB PRO</span>
          </h1>

          {/* Subtitle */}
          <p className="font-josefin text-[19px] sm:text-[23px] text-[#A0C4E8] font-light tracking-wide max-w-[800px] mx-auto leading-relaxed">
            Authentic Indian Railways rail simulation add-ons driven by real-life engineering, FIAT bogie physics, and high-fidelity 3D modeling.
          </p>

          <div className="w-24 h-1 bg-[#00B8D9] mx-auto rounded-full"></div>

          {/* Large Readable Paragraph */}
          <div className="max-w-[880px] mx-auto pt-4">
            <p className="font-josefin text-[17px] sm:text-[19px] text-white/90 leading-[34px] sm:leading-[38px] font-light text-center sm:text-justify sm:text-center">
              TB PRO is a premier digital engineering studio and simulation asset platform dedicated to bringing the spirit of Indian Railways to life with unprecedented realism. We bridge the gap between locomotive engineering, rolling stock physics, and cinematic 3D fidelity. Specializing in high-precision Linke Hofmann Busch (LHB) passenger stock, authentic WAP-7 locomotive consists, and zonal train boards for Open Rails and Microsoft Train Simulator (MSTS), TB PRO delivers true-to-life train operations. From photorealistic stainless steel textures and custom night interior lighting to realistic deceleration physics and authentic FIAT bogie soundsets, TB PRO doesn&apos;t just build train models; we recreate the full journey.
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/coaches"
              className="bg-[#00B8D9] hover:bg-white text-[#101D35] font-josefin font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore LHB Coaches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/msts-openrails"
              className="bg-[#174EA6] hover:bg-[#174EA6]/80 text-white font-josefin font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full border border-white/20 shadow transition-all duration-200"
            >
              MSTS &amp; Open Rails Hub
            </Link>
            <Link
              href="/shop"
              className="bg-white/10 hover:bg-white/20 text-white font-josefin font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full border border-white/20 shadow transition-all duration-200"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Light Showcase Section with Coach Render Showcase */}
      <div className="w-full bg-[#F4F7FB] py-16 px-4 flex flex-col justify-center items-center text-[#172033]">
        <div className="max-w-[850px] w-full text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-[#174EA6]/10 text-[#174EA6] font-bold text-xs uppercase px-3.5 py-1 rounded-full">
            <Cpu className="w-3.5 h-3.5" />
            Precision Craftsmanship
          </div>
          <h2 className="font-josefin text-[28px] sm:text-[34px] font-bold text-[#101D35] tracking-wide">
            High-Precision Rolling Stock Engineering
          </h2>
          <p className="font-josefin text-[15px] sm:text-[16px] text-gray-600 max-w-[620px] mx-auto leading-relaxed">
            From exterior coach textures, air suspension bogie geometry, and bilingual train boards to interior night lighting and animated doors, every detail is engineered for immersion.
          </p>
        </div>

        <div className="border-4 border-white p-3 bg-white rounded-2xl shadow-xl max-w-[800px] w-full overflow-hidden hover:scale-[1.01] transition-transform duration-300">
          <img
            src="/assets/banners/about_hero_trio.png"
            alt="TB PRO LHB Coaches Multi-Angle Render"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
      </div>

      {/* 3. Modeler Commitment & Stats Banner */}
      <div className="w-full bg-[#101D35] py-14 px-4 border-t border-[#174EA6]/40">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-[#00B8D9]/40 transition-colors">
            <span className="font-josefin text-3xl sm:text-4xl font-extrabold text-[#00B8D9] block">
              100%
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Authentic Physics
            </span>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-[#00B8D9]/40 transition-colors">
            <span className="font-josefin text-3xl sm:text-4xl font-extrabold text-[#A0C4E8] block">
              13+
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              LHB Coach Models
            </span>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-[#00B8D9]/40 transition-colors">
            <span className="font-josefin text-3xl sm:text-4xl font-extrabold text-white block">
              MSTS &amp; OR
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Dual Compatibility
            </span>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-[#00B8D9]/40 transition-colors">
            <span className="font-josefin text-3xl sm:text-4xl font-extrabold text-[#16A34A] block">
              TB PRO
            </span>
            <span className="font-josefin text-xs sm:text-sm text-gray-300 font-light mt-1 block">
              Simulation Studio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
