"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#0B2852]">Invalid Reset Link</h2>
        <p className="text-xs sm:text-sm text-gray-600">
          This password reset link is invalid or incomplete. Please request a new reset link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block px-6 py-2.5 bg-[#0B2852] text-white rounded-full font-bold text-xs uppercase"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-xl text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#0B2852]">Password Reset Complete</h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Your password has been updated successfully. You can now log in using your new credentials.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-bold text-sm tracking-wide uppercase transition-all shadow-md"
        >
          Log In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-7 sm:p-9 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 text-[#0B2852] rounded-full flex items-center justify-center mx-auto mb-2">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-light tracking-wide text-[#0B2852]">
          Set New Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Resetting password for <strong className="text-[#0B2852]">{email}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-bold text-sm tracking-wide uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white font-josefin text-[#101C32]">
      <Suspense fallback={<div className="text-center p-8">Loading password reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
