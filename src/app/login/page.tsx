"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

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

      if (data.user?.role === "ADMIN" && redirectUrl === "/account") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
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
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 font-futura">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-normal text-[#041229]">
          Log In
        </h1>
        <p className="text-xs text-gray-600">
          New to this site?{" "}
          <Link href="/register" className="text-[#041229] font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-gray-700 font-futura mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2 border border-gray-400 rounded text-[#041229] text-sm focus:outline-none focus:border-[#041229]"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-futura mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-400 rounded text-[#041229] text-sm focus:outline-none focus:border-[#041229]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-[#041229] hover:bg-black text-white font-futura text-sm rounded transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>
      </form>

      {/* Demo Credentials Quick-Fill helper */}
      <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block text-center">
          Quick Test Accounts:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoFill("admin")}
            className="py-1.5 px-2 rounded bg-white hover:bg-gray-100 text-[#041229] border border-gray-300 text-[11px] font-medium text-center"
          >
            Admin (Varun Ganesh)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill("user")}
            className="py-1.5 px-2 rounded bg-white hover:bg-gray-100 text-[#041229] border border-gray-300 text-[11px] font-medium text-center"
          >
            Demo Member
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] bg-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm font-futura text-gray-500">Loading Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
