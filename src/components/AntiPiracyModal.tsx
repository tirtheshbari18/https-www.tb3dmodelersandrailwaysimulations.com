"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";

export default function AntiPiracyModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Trigger modal on initial load and every time route/pathname changes
  useEffect(() => {
    // Show modal on route navigation
    setIsOpen(true);
  }, [pathname]);

  // Listen to manual open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-anti-piracy-modal", handleOpen);
    return () => window.removeEventListener("open-anti-piracy-modal", handleOpen);
  }, []);

  // Prevent Escape key from closing the modal (user must explicitly click the close button)
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        // Outside clicks intentionally DO NOT close the modal
        e.stopPropagation();
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-[#ECE8F8] text-[#2A1E68] rounded-2xl shadow-2xl border-2 border-[#D8CEF6] overflow-hidden p-6 sm:p-8 md:p-9 animate-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* White Circular Close Button in Top-Right Corner */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close Notice"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white text-[#2A1E68] border border-gray-300 shadow-xl flex items-center justify-center hover:bg-[#39FF00] hover:text-[#101C32] hover:scale-110 active:scale-95 transition-all duration-200 z-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#39FF00]"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-2">
          {/* Left Column: Official Anti-Piracy Notice */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 text-[#D21312]">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 animate-bounce" />
              <h2
                id="anti-piracy-title"
                className="font-josefin font-bold text-lg sm:text-xl md:text-2xl tracking-wide uppercase leading-tight text-[#D21312]"
              >
                OFFICIAL NOTICE FROM VARUN GANESH
              </h2>
            </div>

            <p className="font-josefin font-medium text-[15px] sm:text-[16px] leading-relaxed text-[#2A1E68]">
              <strong>VG-3D Modelers &amp; Railway Simulations</strong> is the exclusive, authorized source for all our 3D train models, coaches, sounds, and railway simulation add-ons.
            </p>

            <div className="space-y-2.5 bg-white/70 p-4 rounded-xl border border-[#D8CEF6] text-[13px] sm:text-[14px]">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#D21312] mt-0.5">•</span>
                <p>
                  <strong>No Authorized Resellers:</strong> We do not partner with or sell through any third-party websites, Telegram channels, Discord servers, or unauthorized individuals.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#D21312] mt-0.5">•</span>
                <p>
                  <strong>Scam &amp; Piracy Warning:</strong> Any other site or individual claiming to distribute, leak, or resell our payware files is operating illegally and fraudulently.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#D21312] mt-0.5">•</span>
                <p>
                  <strong>Security &amp; Stability Risk:</strong> Pirated and stolen files frequently contain broken shape files, modified textures, or malicious code that compromises your system and crashes simulators.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#D21312] mt-0.5">•</span>
                <p>
                  <strong>Official Verification:</strong> Official updates, technical support, and authentic download keys are strictly restricted to verified registered accounts.
                </p>
              </div>
            </div>

            {/* Direct Contact & WhatsApp */}
            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#2A1E68]">
              <div>
                <span className="font-semibold">Direct Queries &amp; Verification:</span>
                <span className="ml-1 text-gray-700">+91 7738980989</span>
              </div>
              <a
                href="https://wa.me/917738980989"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#0B2852] hover:text-[#25D366] underline transition-colors"
              >
                Chat on WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Visual Coach Banner Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full bg-[#0B2852] rounded-xl p-4 text-center border-2 border-[#39FF00] shadow-xl overflow-hidden">
              <div className="relative aspect-[16/10] w-full flex items-center justify-center bg-gradient-to-b from-[#0F356B] to-[#0B2852] rounded-lg p-2 overflow-hidden">
                <img
                  src="/assets/coaches/vistadome_ad.png"
                  alt="Official VG-3D Rolling Stock"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-3">
                <div className="text-[13px] font-bold text-[#39FF00] tracking-wider uppercase">
                  VG-3D Modelers Authentic Release
                </div>
                <div className="text-[12px] text-[#A7D2F7] mt-0.5 font-medium">
                  Protected Intellectual Property &bull; Regd UDYAM-MH-18-0225661
                </div>
              </div>
            </div>

            {/* Acknowledge / Close Action */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-2.5 px-6 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-josefin font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-md border border-[#39FF00]"
            >
              I Understand &bull; Continue to Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
