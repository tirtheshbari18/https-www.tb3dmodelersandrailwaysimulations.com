"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F6F8] text-[#101C32] border-t border-gray-200 select-none">
      {/* WhatsApp Contact Bar right above footer contents */}
      <div className="w-full bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <span className="font-josefin font-bold text-[18px] sm:text-[20px] text-[#0B2852]">
            Contact Varun Ganesh for details.
          </span>
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp message to Varun Ganesh"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2 rounded-full font-josefin font-semibold text-sm shadow-sm transition-transform hover:scale-105"
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

      <div className="max-w-[1080px] mx-auto px-4 py-12">
        {/* Brand Title */}
        <div className="text-center mb-8">
          <h2 className="font-josefin text-[28px] sm:text-[34px] font-extralight tracking-wide text-[#0B2852] leading-tight">
            VG-3D Modelers & Railway Simulations
          </h2>
          <p className="font-josefin text-xs text-gray-500 mt-1">
            Official Indian Railways 3D Modeling & Simulation Studio
          </p>
        </div>

        {/* 3-Column Middle Section: Links, Regd & Email, Socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center max-w-[900px] mx-auto mb-8">
          {/* Legal Links */}
          <div className="flex flex-col space-y-1.5 md:text-left">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
              Legal & Terms
            </span>
            <Link
              href="/terms-and-conditions"
              className="font-josefin text-[15px] text-[#101C32] hover:text-[#0B2852] hover:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="font-josefin text-[15px] text-[#101C32] hover:text-[#0B2852] hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/eula"
              className="font-josefin text-[15px] text-[#101C32] hover:text-[#0B2852] hover:underline"
            >
              EULA
            </Link>
          </div>

          {/* Registration & Email */}
          <div className="flex flex-col space-y-1.5 text-center">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
              Official Identification
            </span>
            <p className="font-josefin text-[14px] text-gray-700 font-medium">
              Regd. no.: UDYAM-MH-18-0225661
            </p>
            <a
              href="mailto:varunganesh221@gmail.com"
              className="font-josefin text-[15px] text-[#0B2852] font-semibold hover:underline"
            >
              varunganesh221@gmail.com
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
              Connect With Us
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/VarunGaneshTheRailfan/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 p-1.5 bg-white rounded-full shadow-sm border border-gray-200"
                aria-label="Facebook"
              >
                <img
                  src="/assets/icons/facebook.png"
                  alt="Facebook"
                  className="w-6 h-6 object-contain"
                />
              </a>
              <a
                href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 p-1.5 bg-white rounded-full shadow-sm border border-gray-200"
                aria-label="YouTube"
              >
                <img
                  src="/assets/icons/youtube.png"
                  alt="YouTube"
                  className="w-6 h-6 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="pt-8 border-t border-gray-200 text-center space-y-1">
          <p className="font-josefin text-[14px] text-gray-600">
            ©2026 by VG-3D Modelers & Railway Simulations. Designed by Varun Ganesh
          </p>
          <p className="text-[11px] text-gray-500 font-josefin">
            Indian Railways is a registered trademark of the Ministry of Railways, Govt. of India. Add-ons are independent digital representations for train simulation enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
