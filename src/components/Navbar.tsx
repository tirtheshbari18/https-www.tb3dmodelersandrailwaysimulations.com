"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  Download, 
  Package
} from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartDrawerOpen } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // Fetch current user session
  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setIsUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Shop", href: "/shop" },
    { name: "Downloads", href: "/downloads" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-[#041229] text-white">
      <div className="max-w-[980px] mx-auto px-4 pt-6 pb-4">
        {/* Tier 1: Logo, Centered Main Brand Title, Log In & Cart */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Coach Render Logo + VG */}
          <Link href="/" className="flex flex-col items-center flex-shrink-0 group">
            <img
              src="/assets/logo/vg_header_coach.png"
              alt="VG Coach Render"
              className="w-[110px] sm:w-[127px] h-auto object-contain"
            />
            <span className="font-futuraBook text-[18px] font-normal tracking-wide text-white leading-[25px]">
              VG
            </span>
            <span className="font-futuraBook text-[8px] font-normal text-white/90 tracking-tight leading-[11px] text-center">
              -3D Modelers & Railway Simulations
            </span>
          </Link>

          {/* Center: Large Brand Title */}
          <div className="hidden lg:flex flex-1 justify-center px-2">
            <Link href="/" className="text-center group">
              <h1 className="font-futuraBook text-[32px] xl:text-[40px] font-bold leading-[54px] tracking-normal text-white group-hover:text-gray-100 transition-colors">
                VG-3D Modelers & Railway Simulations
              </h1>
            </Link>
          </div>

          {/* Right: User Login & Green Shopping Bag */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-[#38D300] font-futuraLight text-[16px] font-bold transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:inline">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-futuraLight">Signed in as</p>
                      <p className="text-sm font-semibold truncate font-futuraBook">{currentUser.name}</p>
                    </div>

                    {currentUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#041229] hover:bg-gray-100 font-futuraBook font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-red-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-100 font-futuraLight"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      My Orders & Profile
                    </Link>

                    <Link
                      href="/downloads"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-100 font-futuraLight"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                      My Downloads
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1 font-futuraLight"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-white hover:text-[#38D300] font-futuraLight text-[16px] sm:text-[18px] font-bold leading-[31.5px] transition-colors"
              >
                <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Log In</span>
              </Link>
            )}

            {/* Custom Green Shopping Bag matching original Wix design */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center justify-center transition-transform hover:scale-105 ml-1"
            >
              <div className="w-[35px] h-[42px] bg-[#38D300] rounded-b-md rounded-t-sm flex items-center justify-center relative shadow-sm">
                {/* Bag Handle */}
                <div className="absolute -top-2 w-4 h-3 border-2 border-[#38D300] rounded-t-full bg-transparent"></div>
                {/* Item Count */}
                <span className="font-futuraLight font-bold text-[#041229] text-[15px] pt-1">
                  {itemCount}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="lg:hidden text-white p-1 hover:text-[#38D300] focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Brand Title for small screens */}
        <div className="lg:hidden text-center mt-3 pt-2 border-t border-white/10">
          <Link href="/">
            <h1 className="font-futuraBook text-[22px] sm:text-[28px] font-normal leading-tight tracking-normal text-white">
              VG-3D Modelers & Railway Simulations
            </h1>
          </Link>
        </div>

        {/* Tier 2: Centered Desktop Navigation Pills */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 mt-5 pt-3 border-t border-white/10">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-futuraLight font-bold text-[14px] leading-[30px] px-3.5 py-1 rounded-full transition-all ${
                  isActive
                    ? "bg-[#38D300] text-[#041229] shadow-sm"
                    : "text-white hover:text-[#38D300]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#041229] border-t border-white/10 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block font-futuraLight font-bold text-[15px] px-4 py-2.5 rounded-full transition-all ${
                  isActive
                    ? "bg-[#38D300] text-[#041229]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
