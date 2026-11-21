"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Lock, AlertTriangle, Phone, ExternalLink, ShieldAlert, Sparkles, FolderArchive, ArrowRight } from "lucide-react";

interface DownloadsClientProps {
  freeFiles: any[];
  categories: any[];
}

export default function DownloadsClient({ freeFiles, categories }: DownloadsClientProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEntitlements, setUserEntitlements] = useState<any[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

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

  return (
    <div className="w-full bg-[#101D35] text-white min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 font-josefin">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Contact & Maintenance Banner */}
        <div className="bg-[#174EA6] border-2 border-[#00B8D9] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#00B8D9] text-[#101D35] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow">
            <AlertTriangle className="w-4 h-4" />
            Official Downloads Portal
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide text-white">
            TB PRO Simulation Download Center
          </h1>

          <p className="text-sm sm:text-base text-[#A0C4E8] max-w-2xl mx-auto leading-relaxed">
            Download official rolling stock updates, sounds, trainboards, test consists, and licensed add-ons for Open Rails &amp; MSTS.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-[#101D35] px-4 py-2 rounded-full border border-blue-400/30">
              <Phone className="w-4 h-4 text-[#00B8D9]" />
              <span>For Queries &amp; Consists: <strong>Varun Ganesh (+91 7738980989)</strong></span>
            </div>
            <a
              href="https://wa.me/917738980989"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20b857] text-white px-5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow"
            >
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Essential Navigation & Neon Green Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/trainboards"
            className="group bg-[#00B8D9] hover:bg-white text-[#172033] p-5 rounded-2xl font-bold text-center flex flex-col items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 border-[#00B8D9]"
          >
            <FolderArchive className="w-7 h-7 text-[#101D35]" />
            <span className="text-sm tracking-wider uppercase font-black">TB PRO LHB TRAINBOARDS</span>
            <span className="text-[11px] font-medium text-gray-700">CR, ECoR, WR Zonal Packs &rarr;</span>
          </Link>

          <a
            href="/downloads/files/VG_FIAT_Bogie_Audio_v1.2_FREE.zip"
            download
            className="group bg-[#00B8D9] hover:bg-white text-[#172033] p-5 rounded-2xl font-bold text-center flex flex-col items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 border-[#00B8D9]"
          >
            <Download className="w-7 h-7 text-[#101D35]" />
            <span className="text-sm tracking-wider uppercase font-black">RRG LHB SOUNDS</span>
            <span className="text-[11px] font-medium text-gray-700">Bogie &amp; Flange Audio Package</span>
          </a>

          <a
            href="/downloads/files/VG_Physics_Converter_v2.0.1_FREE.zip"
            download
            className="group bg-[#00B8D9] hover:bg-white text-[#172033] p-5 rounded-2xl font-bold text-center flex flex-col items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 border-[#00B8D9]"
          >
            <Download className="w-7 h-7 text-[#101D35]" />
            <span className="text-sm tracking-wider uppercase font-black">COMMON SOUNDS &amp; LIGHTS</span>
            <span className="text-[11px] font-medium text-gray-700">Lighting Scripts &amp; Brakes</span>
          </a>

          <a
            href="/downloads"
            className="group bg-[#00B8D9] hover:bg-white text-[#172033] p-5 rounded-2xl font-bold text-center flex flex-col items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 border-[#00B8D9]"
          >
            <Download className="w-7 h-7 text-[#101D35]" />
            <span className="text-sm tracking-wider uppercase font-black">TB PRO CONSISTS</span>
            <span className="text-[11px] font-medium text-gray-700">Ready CON files for Open Rails</span>
          </a>
        </div>

        {/* Model Status & Maintenance Table */}
        <div className="bg-[#174EA6]/60 border border-blue-400/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="border-b border-blue-400/20 pb-4 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              Add-on Release Status &amp; Maintenance Matrix
            </h2>
            <span className="text-xs text-[#A0C4E8] font-mono">Updated November 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-[#A0C4E8] uppercase tracking-wider font-bold border-b border-blue-400/20">
                <tr>
                  <th className="py-3 px-3">Addon / Component</th>
                  <th className="px-3">Category</th>
                  <th className="px-3">Version Status</th>
                  <th className="px-3 text-right">Action / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-400/10">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">TB PRO LHB Chaircar Coaches Pack</td>
                  <td className="px-3 text-[#A0C4E8]">Payware</td>
                  <td className="px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-[#00B8D9] border border-emerald-500/50 text-[11px] font-bold">
                      V2.0 Version
                    </span>
                  </td>
                  <td className="px-3 text-right">
                    <Link href="/shop" className="text-[#00B8D9] hover:underline font-semibold">Available in Shop</Link>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">TB PRO LHB Vistadome Panoramic Coaches</td>
                  <td className="px-3 text-[#A0C4E8]">Payware</td>
                  <td className="px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-[#00B8D9] border border-emerald-500/50 text-[11px] font-bold">
                      V2.0 Version
                    </span>
                  </td>
                  <td className="px-3 text-right">
                    <Link href="/shop" className="text-[#00B8D9] hover:underline font-semibold">Available in Shop</Link>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">TB PRO LHB Sleeper Coaches</td>
                  <td className="px-3 text-[#A0C4E8]">Payware</td>
                  <td className="px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-[#00B8D9] border border-emerald-500/50 text-[11px] font-bold">
                      Available
                    </span>
                  </td>
                  <td className="px-3 text-right">
                    <Link href="/shop" className="text-[#00B8D9] hover:underline font-semibold">Available in Shop</Link>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">TB PRO LHB AC 3-Tier Coaches</td>
                  <td className="px-3 text-[#A0C4E8]">Payware</td>
                  <td className="px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-[#00B8D9] border border-emerald-500/50 text-[11px] font-bold">
                      Available
                    </span>
                  </td>
                  <td className="px-3 text-right">
                    <Link href="/shop" className="text-[#00B8D9] hover:underline font-semibold">Available in Shop</Link>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">TB PRO Trainboards &amp; Sound Scripts</td>
                  <td className="px-3 text-[#A0C4E8]">Common</td>
                  <td className="px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-900/80 text-[#A0C4E8] border border-blue-500/50 text-[11px] font-bold">
                      Public Release
                    </span>
                  </td>
                  <td className="px-3 text-right">
                    <Link href="/trainboards" className="text-[#00B8D9] hover:underline font-semibold">Browse Trainboards &rarr;</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Licensed Downloads Section */}
        <div className="bg-white text-[#172033] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-[#101D35]">
                Your Licensed Payware Downloads
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Download your purchased rolling stock and route packages with unique license keys.
              </p>
            </div>

            {isAuthenticated ? (
              <span className="bg-[#00B8D9] text-[#172033] px-4 py-1.5 rounded-full font-bold text-xs self-start sm:self-auto shadow-sm">
                ✓ Approved &amp; Logged In
              </span>
            ) : (
              <Link
                href="/login?redirect=/downloads"
                className="bg-[#101D35] hover:bg-[#00B8D9] hover:text-[#172033] text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow"
              >
                Log In to Access Files &rarr;
              </Link>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="p-8 bg-[#F5F6F8] rounded-xl text-center space-y-3 border border-gray-200">
              <Lock className="w-8 h-8 text-[#101D35] mx-auto" />
              <h3 className="text-base font-bold text-[#101D35]">Member Authentication Required</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Payware downloads are restricted to verified accounts. Please log in with your approved credentials to access your simulator add-ons.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/login?redirect=/downloads"
                  className="px-6 py-2 bg-[#101D35] text-white hover:bg-[#00B8D9] hover:text-[#172033] rounded-full font-bold text-xs uppercase transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-full font-bold text-xs uppercase transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : userEntitlements.length === 0 ? (
            <div className="p-8 bg-[#F5F6F8] rounded-xl text-center space-y-3 border border-gray-200">
              <Sparkles className="w-8 h-8 text-[#101D35] mx-auto" />
              <p className="text-xs sm:text-sm text-gray-600">
                You do not have any purchased add-ons linked to this account yet.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 bg-[#101D35] text-white hover:bg-[#00B8D9] hover:text-[#172033] rounded-full font-bold text-xs uppercase transition-colors"
              >
                Browse Payware Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEntitlements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F5F6F8] rounded-xl border border-gray-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-[#101D35] text-sm">{item.productName || item.fileName}</h4>
                    <p className="text-xs text-gray-500">Version: {item.version || "v2.0"} &bull; {item.fileType || "ZIP"}</p>
                  </div>
                  <a
                    href={`/api/downloads/${item.fileId || "sample"}`}
                    className="flex items-center gap-1.5 bg-[#101D35] hover:bg-[#00B8D9] hover:text-[#172033] text-white px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anti-Piracy Notice at bottom */}
        <div className="bg-[#ECE8F8] text-[#2A1E68] p-5 sm:p-6 rounded-2xl border-2 border-[#D8CEF6] text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#D21312]">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>WARNING &bull; INTELLECTUAL PROPERTY NOTICE</span>
          </div>
          <p className="leading-relaxed">
            All files, textures, sound scripts, and 3D shapes downloaded from this website are proprietary works of <strong>TB PRO Railway Simulations</strong>. Redistribution, leaking, re-uploading, or unauthorized modifications are strictly forbidden and subject to civil prosecution under Indian copyright legislation.
          </p>
        </div>
      </div>
    </div>
  );
}
