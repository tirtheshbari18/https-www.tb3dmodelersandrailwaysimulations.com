"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, CheckCircle2, Lock, FileText, Sparkles } from "lucide-react";

interface DownloadsClientProps {
  freeFiles: any[];
  categories: any[];
}

export default function DownloadsClient({ freeFiles, categories }: DownloadsClientProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEntitlements, setUserEntitlements] = useState<any[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    fetch("/api/downloads")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        if (data.userEntitlements) {
          setUserEntitlements(data.userEntitlements);
        }
      })
      .catch((err) => console.error("Error fetching downloads", err))
      .finally(() => setIsLoadingAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsAuthenticated(true);
      // Refresh downloads
      const dlRes = await fetch("/api/downloads");
      const dlData = await dlRes.json();
      if (dlData.userEntitlements) {
        setUserEntitlements(dlData.userEntitlements);
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@vg3dmodelers.com");
    setPassword("Admin@VG3D#2025");
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-white">
        <p className="font-josefin text-[15px] text-gray-500">Loading downloads...</p>
      </div>
    );
  }

  // If not authenticated, display the member login dialog matching Wix layout
  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[#F5F6F8] text-[#101C32] py-20 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="w-full max-w-[440px] p-8 sm:p-10 border border-gray-200 shadow-xl rounded-2xl bg-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0B2852] text-[#39FF00] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-josefin text-[32px] sm:text-[38px] font-extralight text-[#0B2852]">
              Member Log In
            </h1>
            <p className="font-josefin text-[14px] text-gray-600">
              New to this site?{" "}
              <Link href="/register" className="text-[#0B2852] font-semibold underline hover:text-[#39FF00]">
                Sign Up
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="font-josefin text-xs text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white font-josefin text-[15px] font-semibold rounded-full shadow transition-all duration-200 disabled:opacity-50"
            >
              {isLoggingIn ? "Logging In..." : "Log In & Access Downloads"}
            </button>
          </form>

          {/* Quick Demo Fill helper */}
          <div className="pt-3 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={fillDemo}
              className="font-josefin text-xs text-gray-500 hover:text-[#0B2852] underline"
            >
              Auto-fill Admin / Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // When logged in, display Member Downloads
  return (
    <div className="w-full bg-white text-[#101C32] py-16 px-4 min-h-[75vh]">
      <div className="max-w-[1080px] mx-auto space-y-10">
        <div className="border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-josefin text-[34px] sm:text-[42px] font-extralight text-[#0B2852]">
              Member Downloads Library
            </h1>
            <p className="font-josefin text-[15px] text-gray-600 mt-1">
              Access your purchased high-fidelity rolling stock addons and simulator files.
            </p>
          </div>
          <span className="bg-[#39FF00] text-[#101C32] px-4 py-1.5 rounded-full font-josefin font-semibold text-xs self-start sm:self-auto shadow-sm">
            ✓ Authenticated Member
          </span>
        </div>

        {/* Purchased Entitlements */}
        <div className="space-y-4">
          <h2 className="font-josefin text-[24px] font-semibold text-[#0B2852]">
            Your Licensed Add-ons ({userEntitlements.length})
          </h2>

          {userEntitlements.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-4 bg-[#F5F6F8]">
              <Sparkles className="w-10 h-10 text-[#0B2852] mx-auto" />
              <p className="font-josefin text-[15px] text-gray-600 max-w-sm mx-auto">
                You do not have any purchased simulator add-ons currently linked. Explore our official catalog to obtain high-precision train models.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white font-josefin font-semibold px-6 py-2.5 rounded-full shadow transition-all duration-200 text-sm"
              >
                Browse Shop →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEntitlements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <h3 className="font-josefin font-semibold text-base text-[#0B2852]">
                      {item.productName || item.fileName}
                    </h3>
                    <p className="font-josefin text-xs text-gray-500">
                      Version: {item.version || "Latest"} • Format: {item.fileType || "ZIP/RAR"}
                    </p>
                  </div>
                  <a
                    href={`/api/downloads/${item.fileId || "sample"}`}
                    className="flex items-center gap-2 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white px-4 py-2 rounded-full font-josefin text-xs font-semibold shadow transition-all flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Free Utilities & Sound Packs */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h2 className="font-josefin text-[24px] font-semibold text-[#0B2852]">
            Free Community Tools & Acoustic Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-4 shadow-sm hover:border-[#0B2852] transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] bg-[#39FF00] text-[#101C32] font-bold px-2 py-0.5 rounded-full">
                  FREE TOOL
                </span>
                <h3 className="font-josefin font-semibold text-base text-[#0B2852]">
                  VG LHB FIAT Bogie Audio Pack v1.2
                </h3>
                <p className="font-josefin text-xs text-gray-500">
                  Track joint acoustics & calibrated flange curves for Open Rails / MSTS.
                </p>
              </div>
              <a
                href="/downloads/files/VG_FIAT_Bogie_Audio_v1.2_FREE.zip"
                download
                className="flex items-center gap-2 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white px-4 py-2 rounded-full font-josefin text-xs font-semibold shadow transition-all flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Get Free</span>
              </a>
            </div>

            <div className="p-5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-4 shadow-sm hover:border-[#0B2852] transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] bg-[#39FF00] text-[#101C32] font-bold px-2 py-0.5 rounded-full">
                  FREE UTILITY
                </span>
                <h3 className="font-josefin font-semibold text-base text-[#0B2852]">
                  VG Physics Converter v2.0.1
                </h3>
                <p className="font-josefin text-xs text-gray-500">
                  Mass, friction, and brake deceleration converter for Indian rolling stock.
                </p>
              </div>
              <a
                href="/downloads/files/VG_Physics_Converter_v2.0.1_FREE.zip"
                download
                className="flex items-center gap-2 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white px-4 py-2 rounded-full font-josefin text-xs font-semibold shadow transition-all flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Get Free</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
