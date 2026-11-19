"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectsClientProps {
  projects: any[];
  products: any[];
}

export default function ProjectsClient({ projects, products }: ProjectsClientProps) {
  const [modalImage, setModalImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Exact 7 projects specification matching original reference layout
  const projectItems = [
    {
      num: "01",
      title: "VG LHB CHAIRCAR COACHES",
      image: "/assets/projects/01_vg_lhb_chaircar.png",
      alt: "VG LHB CHAIRCAR COACHES AD",
      description:
        "High-fidelity 3D models of VG LHB Chair Car coaches engineered for Open Rails and MSTS by Varun Ganesh (VG). Designed for premier daytime express services including the Shatabdi, Jan Shatabdi, and Intercity Express, featuring animated doors, detailed 3D passenger cabins with realistic night lighting, and customizable zone markings and trainboards. Includes liveries inspired by the Deccan Queen, Anubhuti coach, and the Tricolour Shatabdi.",
    },
    {
      num: "02",
      title: "VG LHB VISTADOME COACHES",
      image: "/assets/projects/02_vg_lhb_vistadome.png",
      alt: "VG LHB VISTADOME COACHES AD",
      description:
        "High-fidelity 3D models of VG LHB Vistadome panoramic coaches, crafted as an authentic addition to the LHB collection. Features expansive glass-domed observation ceilings, rotatable pushback seats, animated doors, and realistic night-time illumination. Provides rich customizability for regional railway zones and distinctive rakes including the modern Deccan Queen Vistadome.",
    },
    {
      num: "03",
      title: "VG LHB SLEEPER COACHES",
      image: "/assets/projects/03_vg_lhb_sleeper.avif",
      alt: "VG LHB SLEEPER COACHES AD",
      description:
        "Detailed 3D models of VG LHB Sleeper coaches for long-distance day and night transit in Open Rails and MSTS. Modeled for premier services including the Rajdhani, Duronto, and standard Superfast Express trains. Complete with animated doors, detailed interior berths with realistic night-time lighting, and adaptable trainboards and zonal markings.",
    },
    {
      num: "04",
      title: "VG LHB HUMSAFAR COACHES",
      image: "/assets/projects/04_vg_lhb_humsafar.avif",
      alt: "VG LHB HUMSAFAR COACHES AD",
      description:
        "High-fidelity 3D models of VG LHB Humsafar coaches, showcasing the signature geometric exterior vinyl wrap and modern 3-tier sleeper layout. Designed for high-speed intercity operations, featuring animated doors, custom passenger amenities, calibrated night lighting, and trainboards compatible with Open Rails and MSTS.",
    },
    {
      num: "05",
      title: "VG LHB BANGLADESH COACHES",
      image: "/assets/projects/05_vg_lhb_bangladesh.png",
      alt: "VG LHB BANGLADESH COACHES AD",
      description:
        "High-fidelity 3D models of export-variant LHB coaches delivered for international services including the Maitree Express and Bandhan Express connecting Dhaka and Kolkata. Features broad-gauge FIAT bogie gear, bilingual coach numbering, animated doors, authentic sleeper and chair car interiors, and regional trainboards.",
    },
    {
      num: "06",
      title: "3D Models for Routes",
      isRouteSection: true,
      image: "/assets/projects/06_route_naini_bridge.webp",
      alt: "Route 3D Models - Naini Bridges",
      caption:
        "Old Naini and New Naini bridges modelled by VG for The Great Northern Corridor (Pic courtesy: https://hindustanrailways.site/)",
      description:
        "VG has contributed numerous precision 3D models for routes including The Great Northern Corridor created by Mudit Pranay. Deliverables range from small wayside assets such as signal posts, catenary masts, and warning boards, to massive engineering structures such as passenger platform sheds, trusses, station buildings, and major river bridges.",
    },
    {
      num: "07",
      title: "Work in Progress",
      isWipSection: true,
      wipIcon: "/assets/projects/07_wip_icon.png",
      wipRender: "/assets/projects/07_wip_sleeper_render.png",
      alt: "Work in progress rolling stock",
      description:
        "Active design and development pipeline including upcoming locomotive acoustic soundpacks, modernized cab interior environments, advanced consist physics configurations, and upcoming rolling stock additions.",
    },
  ];

  return (
    <div className="w-full bg-white text-[#041229]">
      {/* 1. Dark Blue Hero Section */}
      <div className="w-full bg-[#041229] text-white py-12 px-4 border-b border-gray-800">
        <div className="max-w-[980px] mx-auto">
          {/* Top Row: Title + Coach Render Image */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-10 mb-6">
            <h1 className="font-futuraBook text-[42px] sm:text-[56px] font-normal tracking-wide text-white leading-tight self-center sm:self-auto">
              Projects
            </h1>
            <div className="border border-white/20 p-1 rounded bg-black/20">
              <img
                src="/assets/banners/projects_hero_coach.png"
                alt="VG LHB Vistadome Coach Render"
                className="w-[260px] sm:w-[320px] md:w-[360px] h-auto object-contain rounded cursor-pointer"
                onClick={() =>
                  setModalImage({
                    url: "/assets/banners/projects_hero_coach.png",
                    title: "VG LHB Vistadome Coach Render",
                  })
                }
              />
            </div>
          </div>

          {/* Subtitle intro statement */}
          <p className="font-futuraLight text-[17px] sm:text-[20px] font-normal leading-[30px] sm:leading-[36px] text-white/95 text-center max-w-[880px] mx-auto">
            Specializing in precision engineering design, high-fidelity 3D modeling, and
            immersive railway simulations. Our commitment to technical accuracy and visual
            excellence is showcased in the following featured projects:
          </p>
        </div>
      </div>

      {/* 2. Numbered Project Sections (White Background) */}
      <div className="max-w-[980px] mx-auto px-4 py-12">
        {projectItems.map((item, idx) => {
          if (item.isRouteSection) {
            return (
              <div key={item.num}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                  {/* Left Column: Number, Title, Description */}
                  <div>
                    <span className="block font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-1">
                      {item.num}
                    </span>
                    <h2 className="font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-4">
                      {item.title}
                    </h2>
                    <p className="font-futuraLight text-[15px] sm:text-[16px] font-normal leading-[28.8px] text-[#041229]">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: Route Image + Caption */}
                  <div className="flex flex-col items-center">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full max-w-[438px] h-auto object-contain shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() =>
                        setModalImage({ url: item.image || "", title: item.title })
                      }
                    />
                    {item.caption && (
                      <p className="font-futuraBook text-[15px] sm:text-[18px] text-[#041229] mt-3 text-center leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
                <hr className="border-t border-gray-300 my-8" />
              </div>
            );
          }

          if (item.isWipSection) {
            return (
              <div key={item.num}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                  {/* Left Column: Number, Title, WIP Icon */}
                  <div>
                    <span className="block font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-1">
                      {item.num}
                    </span>
                    <h2 className="font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-6">
                      {item.title}
                    </h2>
                    {item.wipIcon && (
                      <img
                        src={item.wipIcon}
                        alt="Work in Progress"
                        className="w-[120px] h-[120px] object-contain mb-4"
                      />
                    )}
                    <p className="font-futuraLight text-[15px] sm:text-[16px] font-normal leading-[28.8px] text-[#041229]">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: WIP Render */}
                  <div className="flex justify-center">
                    <img
                      src={item.wipRender}
                      alt={item.alt}
                      className="w-full max-w-[438px] h-auto object-contain shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() =>
                        setModalImage({ url: item.wipRender || "", title: item.title })
                      }
                    />
                  </div>
                </div>
                <hr className="border-t border-gray-300 my-8" />
              </div>
            );
          }

          return (
            <div key={item.num}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                {/* Left Column: Number, Title, Description */}
                <div>
                  <span className="block font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-1">
                    {item.num}
                  </span>
                  <h2 className="font-futuraBook text-[26px] sm:text-[30px] font-normal text-[#041229] mb-4">
                    {item.title}
                  </h2>
                  <p className="font-futuraLight text-[15px] sm:text-[16px] font-normal leading-[28.8px] text-[#041229]">
                    {item.description}
                  </p>
                </div>

                {/* Right Column: Project Render Poster */}
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full max-w-[438px] h-auto object-contain shadow-sm rounded-none hover:opacity-95 transition-opacity"
                      onClick={() =>
                        setModalImage({ url: item.image || "", title: item.title })
                      }
                    />
                    <div
                      onClick={() =>
                        setModalImage({ url: item.image || "", title: item.title })
                      }
                      className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full shadow text-[#041229] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {idx < projectItems.length - 1 && (
                <hr className="border-t border-gray-300 my-8" />
              )}
            </div>
          );
        })}

        {/* 3. Final Legal Disclaimer */}
        <div className="mt-8 text-center px-4">
          <p className="font-futuraLight text-[15px] sm:text-[16px] font-normal leading-[28.8px] text-[#041229] max-w-[850px] mx-auto">
            Disclaimer: This is an independent 3D artistic work. This project is not affiliated
            with, endorsed by, or connected to Indian Railways, Rail Coach Factory, Integral
            Coach Factory, or Modern Coach Factory. All logos and liveries are artistic
            representations for historical and simulation purposes.
          </p>
        </div>
      </div>

      {/* 4. Lightbox Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={modalImage.url}
              alt={modalImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
            <p className="font-futuraBook text-white text-base mt-3 text-center">
              {modalImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
