"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, CheckCircle2, Lock, FileText } from "lucide-react";

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
    setEmail("demo@trainsim.com");
    setPassword("Passenger@2025");
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-white">
        <p className="font-futuraLight text-[14px] text-gray-500">Loading downloads...</p>
      </div>
    );
  }

  // If not authenticated, display the exact member login screen from the original reference
  if (!isAuthenticated) {
    return (
      <div className="w-full bg-white text-[#041229] py-20 px-4 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-[420px] p-8 border border-gray-300 shadow-sm rounded-none bg-white space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-futuraBook text-[32px] sm:text-[36px] font-normal text-[#041229]">
              Log In
            </h1>
            <p className="font-futuraLight text-[13px] text-gray-600">
              New to this site?{" "}
              <Link href="/register" className="text-[#041229] font-bold underline">
                Sign Up
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 bg-white font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 bg-white font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="font-futuraLight text-xs text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-[#041229] hover:bg-black text-white font-futuraLight text-[15px] font-bold tracking-wide transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Logging In..." : "Log In"}
            </button>
          </form>

          {/* Quick Demo Fill helper */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={fillDemo}
              className="font-futuraLight text-xs text-gray-500 hover:text-black underline"
            >
              Auto-fill Member Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // When logged in, display Member Downloads
  return (
    <div className="w-full bg-white text-[#041229] py-16 px-4 min-h-[70vh]">
      <div className="max-w-[980px] mx-auto space-y-10">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="font-futuraBook text-[32px] sm:text-[36px] font-normal text-[#041229]">
            Member Downloads Library
          </h1>
          <p className="font-futuraLight text-[14px] text-gray-600 mt-1">
            Access your purchased high-fidelity rolling stock addons and community simulation assets.
          </p>
        </div>

        {/* Purchased Entitlements */}
        <div className="space-y-4">
          <h2 className="font-futuraBook text-[22px] font-normal text-[#041229]">
            Your Purchased Assets ({userEntitlements.length})
          </h2>

          {userEntitlements.length === 0 ? (
            <div className="p-8 border border-gray-200 rounded text-center space-y-3 bg-gray-50">
              <p className="font-futuraLight text-[14px] text-gray-600">
                You have not purchased any add-ons yet.
              </p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2 bg-[#041229] text-white font-futuraLight text-xs font-bold rounded"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEntitlements.map((ent) => (
                <div
                  key={ent.id}
                  className="p-5 border border-gray-200 rounded flex items-center justify-between gap-4 bg-white shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-futuraBook text-[15px] font-normal text-[#041229]">
                      {ent.productFile?.name || ent.product?.name}
                    </p>
                    <p className="font-futuraLight text-xs text-gray-500">
                      Format: {ent.productFile?.fileFormat} • Size: {ent.productFile?.fileSize} • Version: {ent.productFile?.version}
                    </p>
                    <p className="font-futuraLight text-[11px] text-green-700">
                      Downloads: {ent.downloadCount} / {ent.maxDownloads} used
                    </p>
                  </div>

                  <a
                    href={`/api/downloads/${ent.productFile?.id}`}
                    download
                    className="px-4 py-2 rounded bg-[#38D300] hover:bg-green-400 text-[#041229] font-futuraLight font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Freeware Files */}
        {freeFiles.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-gray-200">
            <h2 className="font-futuraBook text-[22px] font-normal text-[#041229]">
              Community Freeware Downloads ({freeFiles.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {freeFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-5 border border-gray-200 rounded flex items-center justify-between gap-4 bg-white shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-futuraBook text-[15px] font-normal text-[#041229]">{file.name}</p>
                    <p className="font-futuraLight text-xs text-gray-500">
                      Format: {file.fileFormat} • Size: {file.fileSize} • Version: {file.version}
                    </p>
                  </div>

                  <a
                    href={`/api/downloads/${file.id}`}
                    download
                    className="px-4 py-2 rounded bg-[#041229] hover:bg-black text-white font-futuraLight font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Free Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
