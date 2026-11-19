"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, RefreshCw, AlertCircle, Clock, ShieldX, CheckCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  // Server-side CAPTCHA state
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(true);

  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const res = await fetch("/api/auth/captcha", { cache: "no-store" });
      const data = await res.json();
      if (data.token && data.svg) {
        setCaptchaToken(data.token);
        setCaptchaSvg(data.svg);
        setCaptchaAnswer("");
      }
    } catch (e) {
      console.error("Failed to load captcha", e);
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setAccountStatus(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          captchaToken,
          captchaAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.accountStatus) {
          setAccountStatus(data.accountStatus);
        }
        throw new Error(data.error || "Login failed");
      }

      if (data.user?.role === "ADMIN" && (redirectUrl === "/account" || redirectUrl === "/")) {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
      // Refresh captcha on failure
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@vg3dmodelers.com");
      setPassword("Admin@VG3D#2025");
    } else {
      setEmail("demo@trainsim.com");
      setPassword("Passenger@2025");
    }
  };

  return (
    <div className="w-full max-w-md p-7 sm:p-9 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6 font-josefin text-[#101C32]">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-[#0B2852]">
          Log In
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-normal">
          New to VG-3D Modelers?{" "}
          <Link href="/register" className="text-[#0B2852] font-semibold hover:text-[#39FF00] underline transition-colors">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Account Status Alerts */}
      {accountStatus === "PENDING_APPROVAL" && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <Clock className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Account Pending Approval</strong>
            <p className="leading-snug">
              Your registration application is currently under review by the administrator. Once verified, you will receive an approval email notification.
            </p>
          </div>
        </div>
      )}

      {accountStatus === "REJECTED" && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <ShieldX className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Application Not Approved</strong>
            <p className="leading-snug">{errorMsg || "Your account registration was not approved."}</p>
          </div>
        </div>
      )}

      {accountStatus === "SUSPENDED" && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Account Suspended</strong>
            <p className="leading-snug">This account is suspended. For inquiries, please contact varunganesh221@gmail.com.</p>
          </div>
        </div>
      )}

      {errorMsg && !accountStatus && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-[#101C32] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852] focus:border-transparent transition-all"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-gray-700 font-semibold">
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#0B2852] hover:text-[#39FF00] font-semibold hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-[#101C32] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852] focus:border-transparent transition-all"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live SVG CAPTCHA Verification */}
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Security Verification <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={fetchCaptcha}
              disabled={isLoadingCaptcha}
              className="flex items-center gap-1 text-xs text-[#0B2852] hover:text-blue-700 font-medium"
              title="Refresh security code"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCaptcha ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 overflow-hidden rounded-md border border-gray-300 shadow-inner"
              dangerouslySetInnerHTML={{ __html: captchaSvg || "<div class='w-[180px] h-[50px] bg-gray-200 animate-pulse'></div>" }}
            />
            <input
              type="text"
              required
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
              placeholder="Enter code"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono tracking-widest uppercase text-center focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-josefin font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Verifying..." : "Log In"}
        </button>
      </form>

      {/* Quick Demo Credentials Autofill */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-center mb-2">
          Demo Testing Credentials
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoFill("user")}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors text-center"
          >
            Fill Demo Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("admin")}
            className="px-3 py-1.5 border border-[#0B2852] text-[#0B2852] rounded-lg hover:bg-blue-50 font-medium transition-colors text-center"
          >
            Fill Admin User
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white">
      <Suspense fallback={<div className="text-center p-8 font-josefin">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
