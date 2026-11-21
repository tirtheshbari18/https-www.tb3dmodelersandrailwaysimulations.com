"use client";

import React from "react";
import Link from "next/link";
import TBProLogo from "./TBProLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#101D35] text-slate-300 border-t border-[#174EA6]/30 select-none">
      {/* Top Assistance Bar */}
      <div className="w-full bg-[#0B1527] border-b border-white/10 py-5 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00B8D9] animate-pulse"></div>
            <span className="font-josefin font-semibold text-base sm:text-lg text-white">
              Need technical support with Open Rails, MSTS, or LHB Coach downloads?
            </span>
          </div>
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp assistance for TB PRO"
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-josefin font-semibold text-sm shadow-md transition-all hover:scale-105 flex-shrink-0"
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

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <TBProLogo size="md" />
            <p className="font-josefin text-xs sm:text-sm text-slate-400 leading-relaxed">
              Premier Indian Railways simulation platform specializing in high-precision LHB coaching stock, authentic route assets, and realistic physics add-ons for Microsoft Train Simulator and Open Rails.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#174EA6]/40 text-[#00B8D9] border border-[#00B8D9]/30">
                Open Rails Certified
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                MSTS Bin 1.8+
              </span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-3">
            <h4 className="font-josefin text-xs uppercase tracking-widest text-[#00B8D9] font-bold">
              Simulation Assets
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white hover:underline transition-colors">
                  Simulator Store
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="hover:text-white hover:underline transition-colors">
                  LHB Coaching Stock
                </Link>
              </li>
              <li>
                <Link href="/trainboards" className="hover:text-white hover:underline transition-colors">
                  Authentic Train Boards
                </Link>
              </li>
              <li>
                <Link href="/msts-openrails" className="hover:text-white hover:underline transition-colors">
                  MSTS &amp; Open Rails Hub
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white hover:underline transition-colors">
                  Customer Downloads
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Security */}
          <div className="space-y-3">
            <h4 className="font-josefin text-xs uppercase tracking-widest text-[#00B8D9] font-bold">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white hover:underline transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/eula" className="hover:text-white hover:underline transition-colors">
                  End User License Agreement (EULA)
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white hover:underline transition-colors">
                  Refund &amp; Download Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Identification & Social */}
          <div className="space-y-3">
            <h4 className="font-josefin text-xs uppercase tracking-widest text-[#00B8D9] font-bold">
              Contact &amp; Identification
            </h4>
            <p className="text-xs text-slate-400">
              Direct verification and inquiries:
            </p>
            <p className="text-sm font-semibold text-white">
              <a href="mailto:support@tbprosimulations.com" className="hover:text-[#00B8D9] transition-colors">
                varunganesh221@gmail.com
              </a>
            </p>
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-2">Follow TB PRO</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/VarunGaneshTheRailfan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-[#174EA6] rounded-lg transition-all hover:scale-105 border border-white/10"
                  aria-label="Facebook"
                >
                  <img src="/assets/icons/facebook.png" alt="Facebook" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-[#174EA6] rounded-lg transition-all hover:scale-105 border border-white/10"
                  aria-label="YouTube"
                >
                  <img src="/assets/icons/youtube.png" alt="YouTube" className="w-5 h-5 object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/10 text-center space-y-2">
          <p className="font-josefin text-sm text-slate-400">
            © 2026 TB PRO. Indian Railways • LHB Coaches • MSTS • Open Rails. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Indian Railways is a registered trademark of the Ministry of Railways, Government of India. TB PRO is an independent virtual railway simulation platform; all coach models, liveries, and assets are digital artistic and engineering representations for train simulation enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
