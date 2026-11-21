"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AntiPiracyModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Trigger modal on initial load and route changes
  useEffect(() => {
    setIsOpen(true);
  }, [pathname]);

  // Listen to manual open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-anti-piracy-modal", handleOpen);
    return () => window.removeEventListener("open-anti-piracy-modal", handleOpen);
  }, []);

  // Prevent Escape key from closing the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="anti-piracy-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FFFFFF] text-[#172033] rounded-2xl shadow-2xl border-2 border-[#174EA6]/40 overflow-hidden p-6 sm:p-8 md:p-9 animate-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button in Top-Right */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close Notice"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-[#F4F7FB] text-[#101D35] hover:bg-[#00B8D9] hover:text-[#101D35] border border-gray-300 shadow-md flex items-center justify-center transition-all duration-200 z-20 cursor-pointer focus:outline-none"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-1">
          {/* Left Column: Official Anti-Piracy Notice */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 text-[#FF6B00]">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 animate-pulse text-[#FF6B00]" />
              <h2
                id="anti-piracy-title"
                className="font-josefin font-bold text-lg sm:text-xl md:text-2xl tracking-wide uppercase leading-tight text-[#101D35]"
              >
                OFFICIAL NOTICE &bull; <span className="text-[#174EA6]">TB PRO</span>
              </h2>
            </div>

            <p className="font-josefin font-semibold text-[15px] sm:text-[16px] leading-relaxed text-[#101D35]">
              <strong>TB PRO</strong> is the exclusive, authorized developer and publisher for all our Indian Railways LHB coach models, train boards, 3D routes, and train simulation add-ons.
            </p>

            <div className="space-y-2.5 bg-[#F4F7FB] p-4 rounded-xl border border-gray-200 text-[13px] sm:text-[14px]">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#174EA6] mt-0.5">•</span>
                <p>
                  <strong>No Authorized Resellers:</strong> We do not partner with or sell through any unauthorized third-party websites, Telegram groups, or Discord leak channels.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#FF6B00] mt-0.5">•</span>
                <p>
                  <strong>Authentic Digital Assets:</strong> Pirated and modified files often contain corrupted shape files, broken textures, or unsafe executables that crash Open Rails and MSTS.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#16A34A] mt-0.5">•</span>
                <p>
                  <strong>Official Entitlements &amp; Support:</strong> Instant high-speed downloads, future coach updates, and technical assistance are strictly available through registered accounts on TB PRO.
                </p>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-semibold text-[#101D35]">Direct Assistance &amp; Verification:</span>
                <span className="ml-1 text-slate-600">+91 7738980989</span>
              </div>
              <a
                href="https://wa.me/917738980989"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#16A34A] hover:underline"
              >
                Chat on WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Visual Coach Showcase Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full bg-[#101D35] rounded-xl p-4 text-center border-2 border-[#00B8D9] shadow-xl overflow-hidden">
              <div className="relative aspect-[16/10] w-full flex items-center justify-center bg-gradient-to-b from-[#174EA6] to-[#101D35] rounded-lg p-2 overflow-hidden">
                <img
                  src="/assets/tbpro/lhb_ac_first.jpg"
                  alt="Official TB PRO LHB Rolling Stock"
                  className="max-h-full max-w-full object-cover rounded-md drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-3">
                <div className="text-[13px] font-bold text-[#00B8D9] tracking-wider uppercase">
                  TB PRO Verified Release
                </div>
                <div className="text-[12px] text-slate-300 mt-0.5 font-medium">
                  Indian Railways LHB Coaches &bull; Open Rails &amp; MSTS
                </div>
              </div>
            </div>

            {/* Acknowledge Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-2.5 px-6 rounded-full bg-[#174EA6] text-white hover:bg-[#00B8D9] hover:text-[#101D35] font-josefin font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-md border border-[#00B8D9]/40"
            >
              I Understand &bull; Enter TB PRO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
