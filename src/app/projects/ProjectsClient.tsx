"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ZoomIn, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface ProjectsClientProps {
  projects: any[];
  products: any[];
}

export default function ProjectsClient({ projects, products }: ProjectsClientProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption?: string;
  } | null>(null);

  // Exact 7 project items with exact prompt descriptions and multi-image collages
  const projectItems = [
    {
      num: "01",
      title: "TB PRO LHB CHAIRCAR COACHES",
      mainImage: "/assets/projects/01_vg_lhb_chaircar.png",
      alt: "TB PRO LHB CHAIRCAR COACHES Showcase",
      extraImages: [
        "/assets/coaches/chaircar_ad.png",
        "/assets/products/chaircar_standard.png",
        "/assets/products/pnb_livery.png",
        "/assets/products/indian_tricolour.avif"
      ],
      description:
        "This pack features high-fidelity 3D models of TB PRO LHB Chair Car coaches for Open Rails and MSTS, meticulously crafted by Varun Ganesh (VG). Designed for daytime services like the Shatabdi, Jan Shatabdi, and Intercity Express, these models feature animated doors and highly detailed interiors with realistic night lighting. The coaches are fully customizable for specific zones and trainboards. This comprehensive pack also includes prestigious rakes inspired by the legendary Deccan Queen, the premium Anubhuti coach, and the Tricolour livery Shatabdi coaches.",
      highlights: ["Animated Passenger Doors", "Night Lighting Cabin View", "Deccan Queen Rake", "Anubhuti Premium Class"],
      link: "/shop/vg-lhb-coaches"
    },
    {
      num: "02",
      title: "TB PRO LHB VISTADOME COACHES",
      mainImage: "/assets/projects/02_vg_lhb_vistadome.png",
      alt: "TB PRO LHB VISTADOME COACHES Showcase",
      extraImages: [
        "/assets/coaches/vistadome_ad.png",
        "/assets/products/vistadome_standard.png",
        "/assets/products/vistadome_livery.png"
      ],
      description:
        "This pack features high-fidelity 3D models of TB PRO LHB Vistadome coaches, meticulously crafted by Varun Ganesh (VG) as a premium addition to the TB PRO LHB Chair Car collection. Specifically designed to replicate the unique, panoramic experience of daytime tourist travel, these models feature fully animated doors and highly detailed glass-roof interiors with realistic night lighting. The coaches offer high customizability for various regional zones and trainboards. This installment includes specialized variants inspired by the modern LHB Vistadome fleet and the iconic livery of the legendary Deccan Queen.",
      highlights: ["Curved Glass Canopy Roof", "Rotating Pushback Seats", "Custom Regional Trainboards", "Scenic Route Shaders"],
      link: "/shop/vg-lhb-vistadome-coaches"
    },
    {
      num: "03",
      title: "TB PRO LHB SLEEPER COACHES",
      mainImage: "/assets/projects/03_vg_lhb_sleeper.avif",
      alt: "TB PRO LHB SLEEPER COACHES Showcase",
      extraImages: [
        "/assets/coaches/sleeper_render.png",
        "/assets/products/sleeper_v2.avif",
        "/assets/products/vg_academy_sleeper.avif"
      ],
      description:
        "This pack features high-fidelity 3D models of TB PRO LHB Sleeper coaches, meticulously crafted by Varun Ganesh (VG). Designed for long-distance day and night transit, these models are inspired by the versatile rolling stock used in premier services like the Rajdhani, Duronto as well as various Superfast Express trains. The coaches feature fully animated doors and highly detailed sleeper-class interiors complete with realistic night lighting effects. Fully customizable for specific regional zones and trainboards, this comprehensive pack is engineered to bring an authentic long-haul experience to the Open Rails and MSTS platforms.",
      highlights: ["Day & Night Compartment Modes", "Rajdhani / Duronto Variants", "Accurate FIAT Bogies", "Berth Detailing"],
      link: "/shop/vg-lhb-sleeper-coaches-v2-update"
    },
    {
      num: "04",
      title: "TB PRO LHB HUMSAFAR COACHES",
      mainImage: "/assets/projects/04_vg_lhb_humsafar.avif",
      alt: "TB PRO LHB HUMSAFAR COACHES Showcase",
      extraImages: [
        "/assets/products/humsafar_v2.avif",
        "/assets/products/amrit_bharat.png"
      ],
      description:
        "This pack features high-fidelity 3D models of TB PRO LHB Humsafar coaches, meticulously crafted by Varun Ganesh (VG). Designed for long-distance day and night transit, these models are inspired by the distinctive aesthetic of the Humsafar Express and are compatible with various premier services like the Rajdhani and Duronto. The coaches feature fully animated doors and highly detailed, modern sleeper interiors complete with realistic night lighting effects. Fully customizable for specific regional zones and trainboards, this comprehensive pack is engineered to deliver a premium, high-tech travel experience to the Open Rails and MSTS platforms.",
      highlights: ["Geometric Vinyl Livery", "Modern 3-Tier Interior", "Calibrated Deceleration Physics", "Open Rails & MSTS"],
      link: "/shop/vg-lhb-humsafar-coaches-v2"
    },
    {
      num: "05",
      title: "TB PRO LHB BANGLADESH COACHES",
      mainImage: "/assets/projects/05_vg_lhb_bangladesh.png",
      alt: "TB PRO LHB BANGLADESH COACHES Showcase",
      extraImages: [
        "/assets/products/bangladesh_coaches.png"
      ],
      description:
        "This pack features high-fidelity 3D models of TB PRO LHB Bangladesh coaches, meticulously crafted by Varun Ganesh (VG). Designed for international transit, these models are inspired by the prestigious rakes used in services such as the Maitree Express, which connects Dhaka and Kolkata. The coaches feature fully animated doors and highly detailed interiors complete with realistic night lighting effects. Equipped with accurate trainboards and regional detailing, this comprehensive pack is engineered to bring an authentic cross-border rail experience to the Open Rails and MSTS platforms.",
      highlights: ["International Maitree Express", "Bilingual Trainboards", "Export Broad-Gauge Bogie", "Dhaka-Kolkata Livery"],
      link: "/shop/vg-lhb-bangladesh-coaches"
    },
    {
      num: "06",
      title: "3D Models for Routes",
      isRouteSection: true,
      mainImage: "/assets/projects/06_route_naini_bridge.webp",
      alt: "Route 3D Models - Naini Bridges",
      caption: "Old Naini and New Naini bridges modelled by VG for The Great Northern Corridor (Pic courtesy: https://hindustanrailways.site/)",
      extraImages: [
        "/assets/products/whr_route_v2.png"
      ],
      description:
        "VG has contributed to many 3D models for the route The Great Northern Corridor created by Mudit Pranay. Various models ranging from small objects like signboards, signals, catenary masts to massive structures like platform shed, bridges, monuments, station building have been developed for this route.",
      highlights: ["Old & New Naini River Bridges", "The Great Northern Corridor", "Catenary Masts & Signals", "Custom Station Sheds"],
      link: "/shop/whr-route-v2-ahmedabad-update"
    },
    {
      num: "07",
      title: "WORK IN PROGRESS",
      isWipSection: true,
      mainImage: "/assets/projects/07_wip_sleeper_render.png",
      wipIcon: "/assets/projects/07_wip_icon.png",
      alt: "Work In Progress Renders",
      extraImages: [],
      description:
        "Active design, research, and development pipeline at VG-3D Modelers. Current roadmap includes realistic electric locomotive sound packs (WAP-7 / WAG-9), authentic Indian cab interior environments, advanced consist physics tuning, and next-generation push-pull trainsets.",
      highlights: ["Locomotive Acoustic Soundpacks", "Physics Tuning Curves", "Cab Interior Models", "Next-Gen Push-Pull"],
      link: "/contact"
    }
  ];

  return (
    <div className="w-full bg-white text-[#101C32]">
      {/* =========================================================================
          LIGHTBOX MODAL FOR IMAGE ZOOM
          ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#101D35] text-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              aria-label="Close Lightbox"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#101C32] shadow-lg flex items-center justify-center hover:bg-[#00B8D9] transition-transform hover:scale-110 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black/40 p-2">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-3">
              <div>
                <h4 className="font-josefin font-semibold text-lg text-white">
                  {lightboxImage.title}
                </h4>
                {lightboxImage.caption && (
                  <p className="font-josefin text-xs sm:text-sm text-[#A0C4E8] mt-0.5">
                    {lightboxImage.caption}
                  </p>
                )}
              </div>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/80 font-josefin self-start sm:self-auto">
                VG-3D Modelers Authentic Asset
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. HERO SECTION (NAVY BLUE #0B2852)
          ========================================================================= */}
      <div className="w-full bg-[#101D35] text-white py-14 sm:py-20 px-4 border-b border-[#143B73]">
        <div className="max-w-[1080px] mx-auto">
          {/* Top Row: Title + Coach Render Image */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-xs font-semibold bg-[#00B8D9] text-[#101C32] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Precision Engineering Showcase
              </span>
              <h1 className="font-josefin text-[42px] sm:text-[56px] md:text-[64px] font-extralight tracking-widest text-white leading-tight">
                PROJECTS
              </h1>
              <p className="font-josefin text-[17px] sm:text-[20px] text-[#A0C4E8] font-light max-w-[620px] leading-relaxed">
                Specializing in precision engineering design, high-fidelity 3D modeling, and immersive railway simulations. Our commitment to technical accuracy and visual excellence is showcased in the following featured projects:
              </p>
            </div>

            {/* Coach Render Banner on Right */}
            <div
              className="relative p-2 bg-white/10 rounded-2xl border-2 border-white/20 shadow-2xl flex-shrink-0 cursor-pointer group hover:scale-[1.02] transition-transform"
              onClick={() =>
                setLightboxImage({
                  url: "/assets/banners/projects_hero_coach.png",
                  title: "TB PRO LHB Vistadome Coach 3D Render",
                  caption: "Authentic high-poly geometry and observation canopy roof."
                })
              }
            >
              <img
                src="/assets/banners/projects_hero_coach.png"
                alt="TB PRO LHB Vistadome Coach Render"
                className="w-[280px] sm:w-[340px] md:w-[380px] h-auto object-contain rounded-xl"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="bg-white/90 text-[#101C32] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to Enlarge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. NUMBERED PROJECT SECTIONS (01 - 07)
          ========================================================================= */}
      <div className="max-w-[1080px] mx-auto px-4 py-16 space-y-20">
        {projectItems.map((item, index) => {
          const isEven = index % 2 === 1;

          return (
            <section
              key={item.num}
              id={`project-${item.num}`}
              className="scroll-mt-28"
            >
              {/* Project Card Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Image Collage Side (Alternates on desktop) */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="bg-[#F4F7FB] p-3 sm:p-4 rounded-2xl border-2 border-gray-200 shadow-md space-y-3">
                    {/* Primary Square / 4:3 Collage Image */}
                    <div
                      className="relative aspect-square sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-white cursor-pointer group shadow-inner border border-gray-100"
                      onClick={() =>
                        setLightboxImage({
                          url: item.mainImage,
                          title: item.title,
                          caption: item.caption
                        })
                      }
                    >
                      <img
                        src={item.mainImage}
                        alt={item.alt}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Zoom Indicator */}
                      <div className="absolute top-3 right-3 bg-white/90 text-[#101C32] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-[#101D35]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                        Project {item.num} Multi-View
                      </div>
                    </div>

                    {/* Secondary Multi-Image Panels (if available) */}
                    {item.extraImages && item.extraImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {item.extraImages.slice(0, 3).map((subImg, subIdx) => (
                          <div
                            key={subIdx}
                            onClick={() =>
                              setLightboxImage({
                                url: subImg,
                                title: `${item.title} — Detail View ${subIdx + 1}`,
                                caption: "High-resolution livery and bogie inspection view."
                              })
                            }
                            className="relative h-20 rounded-lg overflow-hidden bg-white border border-gray-200 cursor-pointer hover:border-[#00B8D9] hover:scale-105 transition-all shadow-sm"
                          >
                            <img
                              src={subImg}
                              alt={`${item.title} sub render ${subIdx + 1}`}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bridge Caption (for Project 06) */}
                    {item.caption && (
                      <p className="font-josefin text-[13px] sm:text-[14px] text-gray-600 italic text-center px-2 pt-2 border-t border-gray-200">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description Text Side */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* Number Badge & Title */}
                  <div className="space-y-1">
                    <span className="font-josefin font-bold text-lg sm:text-xl text-[#00B8D9] bg-[#101D35] px-3.5 py-1 rounded-full inline-block shadow-sm">
                      {item.num}
                    </span>
                    <h2 className="font-josefin text-[26px] sm:text-[32px] md:text-[36px] font-normal tracking-wide text-[#101D35] uppercase leading-tight pt-1">
                      {item.title}
                    </h2>
                  </div>

                  {/* Exact Project Description */}
                  <p className="font-josefin text-[15px] sm:text-[16px] text-gray-700 leading-[28px] sm:leading-[30px] font-normal">
                    {item.description}
                  </p>

                  {/* Feature Highlights Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#A7D2F7]/30 text-[#101D35] font-semibold px-3 py-1 rounded-full border border-[#A7D2F7]/50"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* Action Link to Shop / Details */}
                  <div className="pt-2">
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2 bg-[#101D35] hover:bg-[#00B8D9] hover:text-[#101C32] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200"
                    >
                      <span>Explore in Shop</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider Line between Projects */}
              {index < projectItems.length - 1 && (
                <div className="w-full h-px bg-gray-200 my-16"></div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
