"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Folder,
  FolderOpen,
  FileArchive,
  Download,
  Search,
  ChevronRight,
  ArrowLeft,
  Home,
  CheckCircle2,
  HardDrive,
  Info,
} from "lucide-react";

interface TrainboardFile {
  id: string;
  name: string;
  zone: "WR" | "CR" | "ECoR";
  zoneName: string;
  size: string;
  updatedAt: string;
  downloadUrl: string;
}

const TRAINBOARDS_DATA: TrainboardFile[] = [
  {
    id: "wr-09124",
    name: "09124 Vadodara - Kottayam Special Fare Special.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.4 MB",
    updatedAt: "18 Nov 2026",
    downloadUrl: "/downloads/trainboards/WR/09124 Vadodara - Kottayam Special Fare Special.zip",
  },
  {
    id: "wr-12010",
    name: "12010 Ahmedabad - Mumbai Central Shatabdi Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "3.1 MB",
    updatedAt: "18 Nov 2026",
    downloadUrl: "/downloads/trainboards/WR/12010 Ahmedabad - Mumbai Central Shatabdi Express.zip",
  },
  {
    id: "wr-12227",
    name: "12227 Mumbai Central - Indore Duronto Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.8 MB",
    updatedAt: "17 Nov 2026",
    downloadUrl: "/downloads/trainboards/WR/12227 Mumbai Central - Indore Duronto Express.zip",
  },
  {
    id: "wr-12247",
    name: "12247 Bandra Terminus - Hazrat Nizamuddin Yuva Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.6 MB",
    updatedAt: "17 Nov 2026",
    downloadUrl: "/downloads/trainboards/WR/12247 Bandra Terminus - Hazrat Nizamuddin Yuva Express.zip",
  },
  {
    id: "cr-12137",
    name: "12137 CSMT - Firozpur Punjab Mail.zip",
    zone: "CR",
    zoneName: "Central Railway",
    size: "3.4 MB",
    updatedAt: "15 Nov 2026",
    downloadUrl: "/downloads/trainboards/CR/12137 CSMT - Firozpur Punjab Mail.zip",
  },
  {
    id: "cr-22221",
    name: "22221 CSMT - Hazrat Nizamuddin Rajdhani Express.zip",
    zone: "CR",
    zoneName: "Central Railway",
    size: "3.7 MB",
    updatedAt: "15 Nov 2026",
    downloadUrl: "/downloads/trainboards/CR/22221 CSMT - Hazrat Nizamuddin Rajdhani Express.zip",
  },
  {
    id: "ecor-12801",
    name: "12801 Puri - New Delhi Purushottam Express.zip",
    zone: "ECoR",
    zoneName: "East Coast Railway",
    size: "2.9 MB",
    updatedAt: "14 Nov 2026",
    downloadUrl: "/downloads/trainboards/ECoR/12801 Puri - New Delhi Purushottam Express.zip",
  },
  {
    id: "ecor-22823",
    name: "22823 Bhubaneswar - New Delhi Tejas Rajdhani.zip",
    zone: "ECoR",
    zoneName: "East Coast Railway",
    size: "3.5 MB",
    updatedAt: "14 Nov 2026",
    downloadUrl: "/downloads/trainboards/ECoR/22823 Bhubaneswar - New Delhi Tejas Rajdhani.zip",
  },
];

export default function TrainboardsPage() {
  const [trainboardFiles, setTrainboardFiles] = useState<TrainboardFile[]>(TRAINBOARDS_DATA);
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/trainboards", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.trainboards && data.trainboards.length > 0) {
          setTrainboardFiles(data.trainboards);
        }
      })
      .catch((e) => console.log("Using cached trainboard data"));
  }, []);

  const dynamicZonesList = Array.from(new Set(trainboardFiles.map((f) => f.zone))).filter(
    (z) => z !== "WR" && z !== "CR" && z !== "ECoR"
  );

  const zones = [
    { code: "ALL", name: "All Railway Zones", count: trainboardFiles.length },
    { code: "WR", name: "Western Railway (WR)", count: trainboardFiles.filter((f) => f.zone === "WR").length },
    { code: "CR", name: "Central Railway (CR)", count: trainboardFiles.filter((f) => f.zone === "CR").length },
    { code: "ECoR", name: "East Coast Railway (ECoR)", count: trainboardFiles.filter((f) => f.zone === "ECoR").length },
    ...dynamicZonesList.map((z) => ({
      code: z,
      name: `${z} Zone`,
      count: trainboardFiles.filter((f) => f.zone === z).length,
    })),
  ];

  const filteredFiles = trainboardFiles.filter((file) => {
    if (selectedZone !== "ALL" && file.zone !== selectedZone) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        file.name.toLowerCase().includes(q) ||
        file.zone.toLowerCase().includes(q) ||
        file.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-[#F5F6F8] min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8 font-josefin text-[#101C32]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#0B2852] flex items-center gap-1 font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/downloads" className="hover:text-[#0B2852] font-medium">
            Downloads
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#0B2852]">Train Boards</span>
          {selectedZone !== "ALL" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-bold text-[#0B2852]">{selectedZone}</span>
            </>
          )}
        </nav>

        {/* Header Banner */}
        <div className="bg-[#0B2852] text-white p-7 sm:p-9 rounded-2xl shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#39FF00] bg-white/10 px-3 py-1 rounded-full">
                Public Trainboard Library
              </span>
              <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-white mt-2">
                VG LHB Train Boards
              </h1>
            </div>
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#39FF00] transition-colors self-start sm:self-auto bg-white/10 px-4 py-2 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Downloads Center</span>
            </Link>
          </div>

          <p className="text-sm sm:text-base text-[#A7D2F7] leading-relaxed max-w-3xl">
            This page contains train boards for VG LHB Coaches. Download and extract them to your Open Rails / MSTS trainset folder.
          </p>
        </div>

        {/* Search & Folder Navigation Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trainboards by train number, name or zone (e.g. 12010, Shatabdi, WR)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Total count badge */}
            <div className="text-xs text-gray-500 font-medium self-center sm:self-auto whitespace-nowrap">
              Showing <strong>{filteredFiles.length}</strong> of {trainboardFiles.length} packages
            </div>
          </div>

          {/* Zonal Folder Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {zones.map((z) => (
              <button
                key={z.code}
                type="button"
                onClick={() => setSelectedZone(z.code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedZone === z.code
                    ? "bg-[#0B2852] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedZone === z.code ? (
                  <FolderOpen className="w-4 h-4 text-[#39FF00]" />
                ) : (
                  <Folder className="w-4 h-4 text-gray-500" />
                )}
                <span>{z.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedZone === z.code ? "bg-[#39FF00] text-[#0B2852]" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {z.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Files Browser Table / Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#0B2852]" />
              Directory Contents &bull; {selectedZone === "ALL" ? "All Zones" : selectedZone}
            </span>
            <span className="text-xs text-gray-500 font-mono">Format: .ZIP</span>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-2">
              <p className="text-base font-semibold">No trainboards found matching your query.</p>
              <button
                onClick={() => {
                  setSelectedZone("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-[#0B2852] underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2852] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                      <FileArchive className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm sm:text-base text-[#0B2852] hover:text-blue-700 transition-colors">
                        {file.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px]">
                          {file.zoneName}
                        </span>
                        <span>&bull;</span>
                        <span>Size: {file.size}</span>
                        <span>&bull;</span>
                        <span>Updated: {file.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={file.downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ZIP</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Installation Instructions */}
        <div className="p-6 bg-[#ECE8F8] border border-[#D8CEF6] rounded-2xl text-[#2A1E68] text-xs sm:text-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0B2852]">
            <Info className="w-5 h-5 text-[#0B2852]" />
            <span>How to Install Train Boards</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 leading-relaxed">
            <li>Download the trainboard ZIP file corresponding to your preferred train service.</li>
            <li>Extract the contained texture files (e.g., <code>.ACE</code> or <code>.DDS</code>) to your VG LHB coach directory: <code>TRAINSET/VG_LHB_COACHES/TRAINBOARDS/</code>.</li>
            <li>Open Rails or MSTS will automatically render the customized bilingual destination plates on the coach sideboards.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
