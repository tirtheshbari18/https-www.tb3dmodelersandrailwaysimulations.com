"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full bg-white text-[#041229]">
      {/* 1. Deep Navy Hero Section */}
      <div className="w-full bg-[#041229] text-white py-16 px-4">
        <div className="max-w-[950px] mx-auto text-center space-y-6">
          <h1 className="font-futuraBook text-[32px] sm:text-[40px] font-normal tracking-wide text-white leading-[54px]">
            About VG-3D Modelers & Railway Simulations
          </h1>

          <p className="font-futuraLight text-[18px] sm:text-[20px] text-white/90 font-normal italic">
            Authentic rail simulation add-ons driven by real-life physics and engineering insights.
          </p>

          <p className="font-futuraLight text-[16px] sm:text-[18px] text-white/95 leading-[30px] sm:leading-[34px] max-w-[880px] mx-auto text-center">
            VG-3D Modelers & Railway Simulations is a premier digital design studio dedicated to
            bringing the spirit of Indian Railways to life with unparalleled realism. Founded by
            Varun Ganesh, our studio bridges the gap between engineering and high-fidelity 3D
            artistry. We specialize in crafting ultra-detailed rolling stock and assets for Open
            Rails and MSTS, featuring designs thoughtfully inspired by the modern LHB coaches
            that define the Indian rail experience. By focusing on technical accuracy, realistic
            physics, and aesthetic nuances, we provide rail enthusiasts with an immersive,
            &quot;true-to-life&quot; simulation that honors the engineering heritage of India&apos;s lifeline.
            From sleek silhouettes to iconic liveries, VG-3D doesn&apos;t just build models; we recreate
            the journey.
          </p>
        </div>
      </div>

      {/* 2. Sky Blue Section with 3-Panel Render Showcase */}
      <div className="w-full bg-[#9ac7f7] py-14 px-4 flex justify-center items-center">
        <div className="border-[3px] border-black p-1 bg-white shadow-md max-w-[700px] w-full">
          <img
            src="/assets/banners/about_hero_trio.png"
            alt="VG LHB CHAIRCAR COACHES multi-angle render"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
