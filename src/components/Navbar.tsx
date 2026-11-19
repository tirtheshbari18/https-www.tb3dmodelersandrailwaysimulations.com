"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Package,
  Bell,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartDrawerOpen } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user session
  const checkUser = async () => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
      const res = await fetch("/api/auth/me", { headers });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (typeof window !== "undefined" && data.user) {
          localStorage.setItem("vg_user", JSON.stringify(data.user));
        }
      } else {
        // Fallback to localStorage user if valid
        const localUser = typeof window !== "undefined" ? localStorage.getItem("vg_user") : null;
        if (localUser) {
          try {
            setCurrentUser(JSON.parse(localUser));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, [pathname]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("vg_user");
        localStorage.removeItem("vg_token");
        localStorage.removeItem("vg_admin_mode");
      }
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
    { name: "Train Boards", href: "/trainboards" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const notifications = [
    {
      id: "notif-1",
      title: "Festival Offer Ending Tonight!",
      desc: "Special discount on all LHB coach sets ends tonight at 11:45 PM.",
      time: "Just now",
      isNew: true,
      link: "/shop"
    },
    {
      id: "notif-2",
      title: "Official Verification Notice",
      desc: "VG-3D Modelers is the sole authorized publisher. Beware of counterfeit resellers.",
      time: "2 hours ago",
      isNew: true,
      link: "/"
    },
    {
      id: "notif-3",
      title: "WHR Route V2 Ahmedabad Update",
      desc: "New route upgrade compatible with Open Rails now in shop.",
      time: "1 day ago",
      isNew: false,
      link: "/shop"
    }
  ];

  return (
    <header className="w-full bg-[#0B2852] text-white select-none border-b border-[#143B73] shadow-lg sticky top-0 z-40 transition-colors">
      <div className="max-w-[1080px] mx-auto px-4 pt-4 pb-3 sm:pb-4">
        {/* Tier 1: Logo, Centered Main Brand Title, Right Actions */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Coach Render Logo + VG */}
          <Link href="/" className="flex flex-col items-center flex-shrink-0 group">
            <img
              src="/assets/logo/vg_header_coach.png"
              alt="VG Coach Render Logo"
              className="w-[100px] sm:w-[125px] h-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-josefin text-[17px] font-light tracking-widest text-white leading-tight">
              VG
            </span>
            <span className="font-josefin text-[9px] font-light text-white/80 tracking-wide text-center">
              -3D Modelers & Railway Simulations
            </span>
          </Link>

          {/* Center: Large Website Title */}
          <div className="hidden md:flex flex-1 justify-center px-2">
            <Link href="/" className="text-center group">
              <h1 className="font-josefin text-[28px] lg:text-[36px] xl:text-[40px] font-extralight tracking-wide text-white leading-tight transition-colors group-hover:text-[#A7D2F7]">
                VG-3D Modelers & Railway Simulations
              </h1>
            </Link>
          </div>

          {/* Right: Notifications, User Profile / Account Dropdown, Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setHasUnreadNotifications(false);
                }}
                aria-label="View notifications"
                className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#39FF00] rounded-full ring-2 ring-[#0B2852] animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#101C32] rounded-xl shadow-2xl border border-gray-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#0B2852]" />
                      <span className="font-josefin font-semibold text-[15px]">Announcements & Updates</span>
                    </div>
                    <span className="text-[11px] bg-[#A7D2F7]/40 text-[#0B2852] px-2 py-0.5 rounded-full font-medium">
                      Official
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#F5F6F8] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-josefin text-[13px] font-semibold text-[#101C32] flex items-center gap-1.5">
                            {n.isNew && <Sparkles className="w-3.5 h-3.5 text-[#39FF00]" />}
                            {n.title}
                          </p>
                          <span className="text-[10px] text-gray-600">{n.time}</span>
                        </div>
                        <p className="font-josefin text-[12px] text-gray-700 mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 pt-2 border-t border-gray-100 text-center">
                    <Link
                      href="/shop"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[12px] text-[#0B2852] font-semibold hover:underline"
                    >
                      Browse All Simulation Add-ons →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Account Dropdown */}
            {currentUser ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-[#39FF00] font-josefin text-[15px] sm:text-[16px] font-medium transition-colors focus:outline-none bg-white/10 px-3 py-1.5 rounded-full"
                >
                  <div className="w-6 h-6 rounded-full bg-[#39FF00] text-[#101C32] flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-[#101C32] rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-700 font-josefin">Signed in as</p>
                      <p className="text-sm font-semibold truncate font-josefin text-[#0B2852]">{currentUser.name}</p>
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                        {currentUser.role}
                      </span>
                    </div>

                    {(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#0B2852] hover:bg-gray-100 font-josefin font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-red-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-josefin"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      My Orders & Profile
                    </Link>

                    <Link
                      href="/downloads"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-josefin"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                      My Downloads
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1 font-josefin"
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
                className="flex items-center gap-2 text-white hover:text-[#39FF00] font-josefin text-[15px] sm:text-[16px] font-medium bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all"
              >
                <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span>Log In</span>
              </Link>
            )}

            {/* Custom Green Shopping Bag with Item Counter */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center justify-center transition-transform hover:scale-105 ml-1"
            >
              <div className="w-[36px] h-[40px] bg-[#39FF00] rounded-b-md rounded-t-sm flex items-center justify-center relative shadow-md">
                {/* Bag Handle */}
                <div className="absolute -top-2.5 w-4 h-3.5 border-2 border-[#39FF00] rounded-t-full bg-transparent"></div>
                {/* Item Count */}
                <span className="font-josefin font-bold text-[#101C32] text-[15px] pt-1">
                  {itemCount}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="lg:hidden text-white p-1 hover:text-[#39FF00] focus:outline-none ml-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden text-center mt-2.5 pt-2 border-t border-white/10">
          <Link href="/">
            <h1 className="font-josefin text-[20px] sm:text-[24px] font-extralight tracking-wide text-white">
              VG-3D Modelers & Railway Simulations
            </h1>
          </Link>
        </div>

        {/* Tier 2: Navigation Buttons (White Rounded Buttons with Bright Green Active State) */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 mt-4 pt-3 border-t border-white/15">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-josefin font-medium text-[14px] px-5 py-1.5 rounded-full shadow-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#39FF00] text-[#101C32] font-semibold shadow-md scale-105"
                    : "bg-white text-[#101C32] hover:bg-[#39FF00] hover:text-[#101C32] hover:shadow"
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
        <div className="lg:hidden bg-[#081d3d] border-t border-white/15 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
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
                className={`block font-josefin text-[15px] px-5 py-2.5 rounded-full transition-all text-center ${
                  isActive
                    ? "bg-[#39FF00] text-[#101C32] font-semibold shadow-md"
                    : "bg-white text-[#101C32] hover:bg-[#39FF00]"
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
