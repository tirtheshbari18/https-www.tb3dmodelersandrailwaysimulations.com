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
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import TBProLogo from "./TBProLogo";

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
    const handleAuthEvent = () => checkUser();
    window.addEventListener("vg-auth-changed", handleAuthEvent);
    return () => window.removeEventListener("vg-auth-changed", handleAuthEvent);
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

  // Nav links strictly following prompt:
  // Home, Shop, LHB Coaches, Train Boards, MSTS & Open Rails, About, Contact
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "LHB Coaches", href: "/coaches" },
    { name: "Train Boards", href: "/trainboards" },
    { name: "MSTS & Open Rails", href: "/msts-openrails" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const notifications = [
    {
      id: "notif-1",
      title: "TB PRO Simulation Platform Live",
      desc: "Welcome to the upgraded TB PRO Indian Railways simulation platform.",
      time: "Just now",
      isNew: true,
      link: "/coaches"
    },
    {
      id: "notif-2",
      title: "New LHB Coach Updates Available",
      desc: "Explore high-precision LHB coaching stock with FIAT bogies and authentic sounds.",
      time: "1 hour ago",
      isNew: true,
      link: "/shop"
    },
    {
      id: "notif-3",
      title: "Open Rails & MSTS Compatibility",
      desc: "All coaches tested and certified for smooth 60 FPS in Open Rails.",
      time: "1 day ago",
      isNew: false,
      link: "/msts-openrails"
    }
  ];

  return (
    <header className="w-full bg-[#101D35] text-white select-none border-b border-[#174EA6]/40 shadow-xl sticky top-0 z-40 transition-colors">
      {/* Top micro announcement bar */}
      <div className="w-full bg-gradient-to-r from-[#101D35] via-[#174EA6] to-[#101D35] py-1 px-4 text-center text-[11px] sm:text-xs font-medium text-slate-200 border-b border-white/10 hidden sm:block">
        <span className="text-[#00B8D9] font-bold">TB PRO SIMULATION</span>
        <span className="mx-2">•</span>
        <span>High-Precision Indian Railways Rolling Stock for Open Rails & MSTS</span>
        <span className="mx-2">•</span>
        <span className="text-[#FF6B00] font-semibold">Instant Digital Download</span>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3">
        {/* Main Tier: Logo, Navigation, Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <TBProLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-josefin text-[13.5px] xl:text-[14.5px] font-medium px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#174EA6] text-white font-semibold shadow-md border border-[#00B8D9]/40 text-[#00B8D9]"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Notifications, User, Cart, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setHasUnreadNotifications(false);
                }}
                aria-label="View notifications"
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#00B8D9] rounded-full ring-2 ring-[#101D35] animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#172033] rounded-xl shadow-2xl border border-gray-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#174EA6]" />
                      <span className="font-josefin font-semibold text-[15px]">TB PRO Announcements</span>
                    </div>
                    <span className="text-[11px] bg-[#00B8D9]/15 text-[#174EA6] px-2 py-0.5 rounded-full font-bold">
                      Official
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#F4F7FB] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-josefin text-[13px] font-semibold text-[#172033] flex items-center gap-1.5">
                            {n.isNew && <Sparkles className="w-3.5 h-3.5 text-[#00B8D9]" />}
                            {n.title}
                          </p>
                          <span className="text-[10px] text-gray-500">{n.time}</span>
                        </div>
                        <p className="font-josefin text-[12px] text-gray-600 mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 pt-2 border-t border-gray-100 text-center">
                    <Link
                      href="/shop"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[12px] text-[#174EA6] font-semibold hover:underline"
                    >
                      Browse All Simulation Assets →
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
                  className="flex items-center gap-2 text-white hover:text-[#00B8D9] font-josefin text-[14px] sm:text-[15px] font-medium transition-colors focus:outline-none bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00B8D9] to-[#174EA6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[110px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-[#172033] rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-josefin">Signed in as</p>
                      <p className="text-sm font-semibold truncate font-josefin text-[#101D35]">{currentUser.name}</p>
                      <span className="text-[10px] bg-blue-100 text-[#174EA6] px-2 py-0.5 rounded-full font-bold">
                        {currentUser.role}
                      </span>
                    </div>

                    {(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#101D35] hover:bg-gray-100 font-josefin font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#FF6B00]" />
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
                className="flex items-center gap-1.5 text-white hover:text-[#00B8D9] font-josefin text-[13.5px] sm:text-[14.5px] font-semibold bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg border border-white/15 transition-all"
              >
                <User className="w-4 h-4 text-[#00B8D9]" />
                <span>Login</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-[#174EA6] to-[#101D35] hover:from-[#00B8D9] hover:to-[#174EA6] text-white border border-[#00B8D9]/40 shadow-sm transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#FF6B00] text-white rounded-full font-josefin font-bold text-[11px] flex items-center justify-center shadow-md animate-scale">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="lg:hidden text-slate-200 hover:text-white p-2 rounded-lg hover:bg-white/10 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1527] border-t border-white/15 px-4 py-4 space-y-1.5 animate-in slide-in-from-top-2">
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
                className={`block font-josefin text-[15px] px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#174EA6] text-[#00B8D9] font-bold border-l-4 border-[#00B8D9]"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
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
