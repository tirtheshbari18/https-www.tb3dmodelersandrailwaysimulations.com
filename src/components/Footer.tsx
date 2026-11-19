"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#041229] border-t border-gray-200 pt-10 pb-12">
      <div className="max-w-[980px] mx-auto px-4">
        {/* Top Header Brand Title */}
        <div className="text-center mb-6">
          <h2 className="font-futuraBook text-[26px] sm:text-[32px] font-normal tracking-normal text-[#041229] leading-tight">
            VG-3D Modelers & Railway Simulations
          </h2>
        </div>

        {/* 3-Column Middle Section: Legal Links on Left, Regd & Email in Center */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 my-6 max-w-[850px] mx-auto">
          {/* Left Legal Links */}
          <div className="flex flex-col space-y-1">
            <Link
              href="/terms-and-conditions"
              className="font-futuraLight text-[15px] leading-[28.125px] text-[#041229] hover:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="font-futuraLight text-[15px] leading-[28.125px] text-[#041229] hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/eula"
              className="font-futuraLight text-[15px] leading-[28.125px] text-[#041229] hover:underline"
            >
              EULA
            </Link>
          </div>

          {/* Center Info */}
          <div className="flex flex-col space-y-1 text-center">
            <p className="font-futuraLight text-[14px] leading-[25.06px] text-[#041229]">
              (Regd. no: UDYAM-MH-18-0225661)
            </p>
            <a
              href="mailto:varunganesh221@gmail.com"
              className="font-futuraLight text-[15px] leading-[28.125px] text-[#041229] hover:underline"
            >
              varunganesh221@gmail.com
            </a>
          </div>

          {/* Right empty spacer for symmetry on desktop */}
          <div className="hidden md:block w-36"></div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col items-center justify-center pt-6 border-t border-gray-100 gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/VarunGaneshTheRailfan/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
              aria-label="Facebook"
            >
              <img
                src="/assets/icons/facebook.png"
                alt="Facebook"
                className="w-[30px] h-[30px] object-contain rounded"
              />
            </a>
            <a
              href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
              aria-label="YouTube"
            >
              <img
                src="/assets/icons/youtube.png"
                alt="YouTube"
                className="w-[30px] h-[30px] object-contain rounded"
              />
            </a>
          </div>

          <p className="font-futuraLight text-[14px] leading-[25.06px] text-[#041229] text-center">
            ©2026 by VG-3D Modelers & Railway Simulations. Designed by Varun Ganesh
          </p>
        </div>
      </div>
    </footer>
  );
}
