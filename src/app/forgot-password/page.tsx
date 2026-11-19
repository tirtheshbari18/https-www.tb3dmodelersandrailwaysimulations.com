"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, RefreshCw, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken, captchaAnswer }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccessMsg(data.message);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred. Please try again.");
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white font-josefin text-[#101C32]">
      <div className="w-full max-w-md p-7 sm:p-9 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-[#0B2852] rounded-full flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-[#0B2852]">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your registered email address and we will dispatch a secure 30-minute password reset link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold">Email Dispatched</strong>
              <p className="leading-snug">{successMsg}</p>
            </div>
          </div>
        )}

        {!successMsg ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
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
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Security Code <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={isLoadingCaptcha}
                  className="flex items-center gap-1 text-xs text-[#0B2852] hover:text-blue-700 font-medium"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingCaptcha ? "animate-spin" : ""}`} />
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-josefin font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </button>
          </form>
        ) : null}

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B2852] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
