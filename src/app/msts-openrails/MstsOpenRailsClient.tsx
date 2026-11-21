"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Monitor, 
  Cpu, 
  Gauge, 
  MapPin, 
  Zap, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Sparkles,
  Layers
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MstsOpenRailsClientProps {
  compatibleProducts: any[];
}

export default function MstsOpenRailsClient({ compatibleProducts }: MstsOpenRailsClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "locos" | "routes" | "physics" | "guide">("overview");

  // Route products from catalog
  const routeProducts = compatibleProducts.filter((p) =>
    p.category?.slug?.includes("route") || p.name?.toLowerCase().includes("route")
  );

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen font-josefin pb-24">
      {/* 1. Hero Section */}
      <div className="relative w-full bg-[#101D35] text-white py-16 sm:py-24 border-b border-[#174EA6]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="/assets/tbpro/msts_openrails_sim.jpg"
            alt="MSTS Open Rails Simulation"
            className="w-full h-full object-cover filter blur-sm"
          />
        </div>

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-7/12 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174EA6]/50 border border-[#00B8D9]/40 text-[#00B8D9] text-xs font-bold tracking-widest uppercase">
                <Monitor className="w-3.5 h-3.5" />
                <span>OPEN RAILS &amp; MICROSOFT TRAIN SIMULATOR PLATFORM</span>
              </div>

              <h1 className="font-josefin text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Engineering-Grade <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-blue-300">
                  Indian Rail Simulation
                </span>
              </h1>

              <p className="font-josefin text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Step into the driver&apos;s cab and experience the thundering power of Indian Railways. TB PRO add-ons are tested and verified for seamless operation in <strong>Open Rails (v1.5+ / Testing / NewYear MG)</strong> and <strong>MSTS Bin 1.8</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#174EA6] to-[#00B8D9] hover:from-[#101D35] hover:to-[#174EA6] text-white text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>Explore Compatible Add-ons</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/coaches"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
                >
                  Browse LHB Consists
                </Link>
              </div>
            </div>

            {/* Right: Dual Engine Visual */}
            <div className="lg:w-5/12 w-full">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#00B8D9]/40 shadow-2xl bg-[#0B1527]">
                <img
                  src="/assets/tbpro/wap7_locomotive.jpg"
                  alt="WAP-7 Electric Locomotive"
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 bg-[#101D35] border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#00B8D9] uppercase tracking-wider block">
                      Tractive Effort &bull; 6350 HP
                    </span>
                    <span className="text-white font-bold text-sm">
                      WAP-7 Locomotive with LHB Rake
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#174EA6] text-[#00B8D9] text-xs font-bold rounded-lg border border-[#00B8D9]/30">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Section Nav Tabs */}
      <div className="sticky top-[69px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Simulator Engines" },
            { id: "locos", label: "Locomotives & Cabs" },
            { id: "routes", label: "Indian Routes & Tracks" },
            { id: "physics", label: "FIAT Physics & Consists" },
            { id: "guide", label: "Setup & FPS Optimization" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-josefin text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#174EA6] text-white shadow-md border border-[#00B8D9]/40"
                  : "bg-[#F4F7FB] text-[#172033] hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tab Content */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Compare Open Rails vs MSTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Open Rails */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4 hover:border-[#174EA6] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#174EA6] flex items-center justify-center font-bold">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-[#174EA6] text-xs font-bold uppercase">
                    Primary Engine
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#101D35]">Open Rails Simulator (v1.5+)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open Rails is a modern, open-source train simulator that provides 64-bit multi-core processing, dynamic weather, animated 3D passengers, supersampled anti-aliasing, and true-to-life pneumatic air brake simulation. All TB PRO LHB coaches are optimized to deliver rock-solid 60 FPS performance on modern PC setups.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Native 64-bit multi-threading with modern GPU shaders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Realistic Indian Railways 25 kV AC catenary pantograph physics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Operational FIAT bogie suspension and realistic rail joint sounds</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Microsoft Train Simulator */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4 hover:border-[#174EA6] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#101D35] flex items-center justify-center font-bold">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase">
                    Classic MSTS Bin 1.8
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#101D35]">Microsoft Train Simulator (MSTS)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For enthusiasts running classic MSTS, TB PRO assets include backward-compatible .eng, .wag, and compressed .s shape files. Models are verified with Shape Viewer and MSTS Bin 1.8.0521 to ensure textures, bounding boxes, and lighting definitions load cleanly without shape crashes.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Tested on MSTS Bin 1.8 with clean shape memory allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Standardized TRAINSET folder structure for drop-in installation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Compatible with classic Activity Editor and Consist Editor (CON)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual Route & Yard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-[#101D35] group">
                <img
                  src="/assets/tbpro/railway_yard_tracks.jpg"
                  alt="Indian Railway Yard & Track Switches"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 text-white space-y-2">
                  <span className="text-[11px] font-bold text-[#00B8D9] uppercase tracking-wider">
                    Infrastructure &bull; Indian Track Physics
                  </span>
                  <h4 className="text-xl font-bold">Realistic Yard Geometry &amp; Switches</h4>
                  <p className="text-xs text-slate-300">
                    Engineered broad gauge (1676 mm) track geometry with authentic ballast profiles, pre-stressed concrete sleepers, and speed-tested turnout frogs.
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-[#101D35] group">
                <img
                  src="/assets/tbpro/station_platform.jpg"
                  alt="Indian Railway Station Platform"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 text-white space-y-2">
                  <span className="text-[11px] font-bold text-[#00B8D9] uppercase tracking-wider">
                    Environment &bull; Platform Realism
                  </span>
                  <h4 className="text-xl font-bold">High-Level Station Platforms &amp; OHE</h4>
                  <p className="text-xs text-slate-300">
                    Authentic 840 mm platform height perfectly matching LHB footboards, station signage, and 25 kV AC cantilever catenary masts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Locos */}
        {activeTab === "locos" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <img
                    src="/assets/tbpro/wap7_locomotive.jpg"
                    alt="WAP-7 Electric Locomotive"
                    className="w-full rounded-xl border border-gray-200 shadow-md object-cover"
                  />
                </div>
                <div className="md:w-1/2 space-y-4">
                  <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                    3-Phase AC Electric Locomotive
                  </span>
                  <h3 className="text-3xl font-bold text-[#101D35]">WAP-7 &bull; The White Stallion</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The backbone of Indian Railways high-speed passenger operations. Equipped with 6,350 HP, Co-Co bogies, GTO/IGBT converter simulation, dynamic regenerative braking, and Head-On Generation (HOG) to supply electrical power directly to LHB air conditioning rucksacks.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Maximum Speed</span>
                      <span className="text-base font-bold text-[#101D35]">140 km/h (160 test)</span>
                    </div>
                    <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Tractive Effort</span>
                      <span className="text-base font-bold text-[#101D35]">322 kN Starting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Routes */}
        {activeTab === "routes" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-[#101D35]">Featured Indian Simulation Routes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore meticulously detailed Indian rail routes featuring real-world track alignments, multi-aspect color light signaling (MACLS), and realistic junction interlockings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {routeProducts.map((route) => (
                  <div key={route.id} className="p-5 rounded-2xl border border-gray-200 bg-[#F4F7FB] space-y-4">
                    <img
                      src={route.images?.[0]?.url || route.image || "/assets/tbpro/railway_yard_tracks.jpg"}
                      alt={route.name}
                      className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#174EA6] uppercase tracking-wider">
                        Route Package
                      </span>
                      <h4 className="text-lg font-bold text-[#101D35]">{route.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{route.shortDesc || route.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-base font-extrabold text-[#101D35]">
                          {formatCurrency(route.salePrice ?? route.regularPrice)}
                        </span>
                        <Link
                          href={`/shop/${route.slug || route.id}`}
                          className="px-4 py-2 rounded-xl bg-[#174EA6] hover:bg-[#101D35] text-white text-xs font-bold transition-colors"
                        >
                          View Route Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Physics */}
        {activeTab === "physics" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-[#101D35]">FIAT Bogie Physics &amp; LHB Engineering</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-[#F4F7FB] border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-[#174EA6] uppercase">Braking Ratio</span>
                  <h4 className="text-lg font-bold text-[#101D35]">Twin-Pipe Air Brake</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulates authentic brake pipe pressure (5.0 kg/cm²) and feed pipe pressure (6.0 kg/cm²). Rapid release and gradual application modeled accurately in Open Rails.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F4F7FB] border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-[#174EA6] uppercase">Coupling Dynamics</span>
                  <h4 className="text-lg font-bold text-[#101D35]">Tightlock CBC</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Anti-climbing AAR 'H' type Centre Buffer Couplers configured in .wag parameters with precise spring stiffness and damping values to prevent in-train shock surges.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F4F7FB] border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-[#174EA6] uppercase">Ride Quality</span>
                  <h4 className="text-lg font-bold text-[#101D35]">Secondary Air Spring</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Air spring deflection parameters tuned for smooth lateral and vertical track damping over high-speed turnouts and rail expansion joints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Guide */}
        {activeTab === "guide" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-[#101D35]">Installation &amp; FPS Optimization Guide</h3>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200">
                  <h4 className="font-bold text-[#101D35] text-base mb-1">Step 1: Download &amp; Extract</h4>
                  <p className="text-xs">
                    Extract your downloaded .ZIP or .RAR package into your Open Rails or MSTS root directory: <code className="bg-white px-2 py-0.5 rounded text-blue-700">TRAINS\TRAINSET\TB_PRO_LHB_COACHES</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200">
                  <h4 className="font-bold text-[#101D35] text-base mb-1">Step 2: Recommended Open Rails Video Settings</h4>
                  <p className="text-xs">
                    Under Open Rails &gt; Options &gt; Video: Enable <strong>Dynamic Shadows</strong>, set <strong>Viewing Distance to 3000m</strong>, and choose <strong>DirectX Anti-Aliasing (4x MSAA)</strong> for crisp overhead catenary rendering without FPS drops.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200">
                  <h4 className="font-bold text-[#101D35] text-base mb-1">Step 3: Creating Consists</h4>
                  <p className="text-xs">
                    Open ConBuilder, TSRE5 Consist Editor, or the classic MSTS Consist Editor. Select a WAP-7 or WAP-5 locomotive followed by EOG (Generator), AC 1st, AC 2-Tier, AC 3-Tier, Pantry Car, and rear EOG to build authentic Indian Railways rakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
