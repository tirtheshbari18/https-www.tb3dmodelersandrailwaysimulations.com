"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, country }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-white flex items-center justify-center p-4 font-futura">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-normal text-[#041229]">
            Sign Up
          </h1>
          <p className="text-xs text-gray-600">
            Already a member?{" "}
            <Link href="/login" className="text-[#041229] font-medium underline">
              Log In
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
            <label className="block text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Varun Ganesh"
              className="w-full px-3 py-2 border border-gray-400 rounded text-[#041229] text-sm focus:outline-none focus:border-[#041229]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Address *</label>
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
            <label className="block text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-400 rounded text-[#041229] text-sm focus:outline-none focus:border-[#041229]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">WhatsApp / Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 border border-gray-400 rounded text-[#041229] text-sm focus:outline-none focus:border-[#041229]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#041229] hover:bg-black text-white text-sm rounded transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
