"use client";

import React from "react";
import Link from "next/link";

interface TBProLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TBProLogo({
  className = "",
  showSubtitle = true,
  size = "md",
}: TBProLogoProps) {
  const heightClasses = {
    sm: "h-8",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Aerodynamic High-Speed Bullet Train Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 90"
          className={
            size === "sm"
              ? "w-8 h-8"
              : size === "lg"
              ? "w-12 h-12"
              : "w-9 h-9 sm:w-10 sm:h-10"
          }
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00B8D9" />
              <stop offset="100%" stopColor="#174EA6" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Rail Track Sleepers & Rails */}
          <path d="M 6 78 L 94 78" stroke="#174EA6" strokeWidth="3" strokeLinecap="round" />
          <path d="M 12 84 L 90 84" stroke="#00B8D9" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <line x1="22" y1="74" x2="18" y2="86" stroke="#174EA6" strokeWidth="2.5" />
          <line x1="42" y1="74" x2="38" y2="86" stroke="#174EA6" strokeWidth="2.5" />
          <line x1="62" y1="74" x2="58" y2="86" stroke="#174EA6" strokeWidth="2.5" />
          <line x1="82" y1="74" x2="78" y2="86" stroke="#174EA6" strokeWidth="2.5" />

          {/* Aerodynamic Locomotive Body */}
          <path
            d="M 10 66 C 18 48, 38 20, 78 8 C 86 6, 94 5, 96 5 C 94 18, 88 38, 86 48 C 84 59, 76 66, 60 66 Z"
            fill="url(#logoCyan)"
          />

          {/* Windshield */}
          <path
            d="M 46 30 C 54 22, 68 15, 76 13 C 75 20, 71 28, 69 32 C 60 34, 52 33, 46 30 Z"
            fill="#101D35"
            stroke="#00B8D9"
            strokeWidth="1.5"
          />

          {/* Speed line accents */}
          <path d="M 16 70 L 76 70" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M 26 74 L 84 74" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />

          {/* Glowing Headlights */}
          <circle cx="28" cy="63" r="3" fill="#FFFFFF" filter="url(#logoGlow)" />
          <circle cx="44" cy="63" r="3" fill="#FFFFFF" filter="url(#logoGlow)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-josefin font-extrabold text-white tracking-wider text-xl sm:text-2xl drop-shadow-sm">
            TB
          </span>
          <span className="bg-gradient-to-r from-[#00B8D9] to-[#174EA6] text-white font-josefin font-black px-2 py-0.5 rounded-md text-xs sm:text-sm tracking-widest border border-[#00B8D9]/40 shadow-sm">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="font-josefin text-[9px] sm:text-[10px] font-semibold text-[#00B8D9] tracking-wider mt-0.5 flex items-center gap-1">
            <span>INDIAN RAILWAYS</span>
            <span className="w-1 h-1 rounded-full bg-[#FF6B00]"></span>
            <span className="text-gray-300">SIMULATION</span>
          </span>
        )}
      </div>
    </div>
  );
}
