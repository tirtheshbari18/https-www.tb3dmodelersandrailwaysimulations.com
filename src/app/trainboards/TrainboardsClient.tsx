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
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  ShieldCheck,
  AlertCircle,
  X,
  Upload,
  Camera,
  Layers,
} from "lucide-react";

export interface TrainboardFile {
  id: string;
  name: string;
  zone: string;
  zoneName: string;
  size: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
  downloadUrl: string;
  description?: string | null;
  image?: string | null;
  regularPrice?: number;
  salePrice?: number | null;
  status?: string;
  displayOrder?: number;
  category?: string;
  discountPercent?: number;
  isSpecialOffer?: boolean;
}

const DEFAULT_TRAINBOARDS: TrainboardFile[] = [
  {
    id: "wr-09124",
    name: "09124 Vadodara - Kottayam Special Fare Special.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.4 MB",
    downloadUrl: "/downloads/trainboards/WR/09124 Vadodara - Kottayam Special Fare Special.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "wr-12010",
    name: "12010 Ahmedabad - Mumbai Central Shatabdi Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "3.1 MB",
    downloadUrl: "/downloads/trainboards/WR/12010 Ahmedabad - Mumbai Central Shatabdi Express.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "wr-12227",
    name: "12227 Mumbai Central - Indore Duronto Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.8 MB",
    downloadUrl: "/downloads/trainboards/WR/12227 Mumbai Central - Indore Duronto Express.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "wr-12247",
    name: "12247 Bandra Terminus - Hazrat Nizamuddin Yuva Express.zip",
    zone: "WR",
    zoneName: "Western Railway",
    size: "2.6 MB",
    downloadUrl: "/downloads/trainboards/WR/12247 Bandra Terminus - Hazrat Nizamuddin Yuva Express.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "cr-12137",
    name: "12137 CSMT - Firozpur Punjab Mail.zip",
    zone: "CR",
    zoneName: "Central Railway",
    size: "3.4 MB",
    downloadUrl: "/downloads/trainboards/CR/12137 CSMT - Firozpur Punjab Mail.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "cr-22221",
    name: "22221 CSMT - Hazrat Nizamuddin Rajdhani Express.zip",
    zone: "CR",
    zoneName: "Central Railway",
    size: "3.7 MB",
    downloadUrl: "/downloads/trainboards/CR/22221 CSMT - Hazrat Nizamuddin Rajdhani Express.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "ecor-12801",
    name: "12801 Puri - New Delhi Purushottam Express.zip",
    zone: "ECoR",
    zoneName: "East Coast Railway",
    size: "2.9 MB",
    downloadUrl: "/downloads/trainboards/ECoR/12801 Puri - New Delhi Purushottam Express.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
  {
    id: "ecor-22823",
    name: "22823 Bhubaneswar - New Delhi Tejas Rajdhani.zip",
    zone: "ECoR",
    zoneName: "East Coast Railway",
    size: "3.5 MB",
    downloadUrl: "/downloads/trainboards/ECoR/22823 Bhubaneswar - New Delhi Tejas Rajdhani.zip",
    status: "AVAILABLE",
    regularPrice: 0,
  },
];

export default function TrainboardsClient({ initialTrainboards }: { initialTrainboards?: TrainboardFile[] }) {
  const [trainboardFiles, setTrainboardFiles] = useState<TrainboardFile[]>(
    initialTrainboards && initialTrainboards.length > 0 ? initialTrainboards : DEFAULT_TRAINBOARDS
  );
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Admin Mode State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);

  // Modals
  const [isAddTrainboardOpen, setIsAddTrainboardOpen] = useState(false);
  const [editingTrainboard, setEditingTrainboard] = useState<TrainboardFile | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [renameModalTb, setRenameModalTb] = useState<TrainboardFile | null>(null);
  const [imageModalTb, setImageModalTb] = useState<TrainboardFile | null>(null);
  const [priceModalTb, setPriceModalTb] = useState<TrainboardFile | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch trainboards from central production database API
  const refreshTrainboards = () => {
    fetch("/api/admin/trainboards", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.trainboards && data.trainboards.length > 0) {
          setTrainboardFiles(data.trainboards);
        }
      })
      .catch((e) => console.log("Using cached trainboard data"));
  };

  // Check user session from localStorage and API
  const checkAuth = async () => {
    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("vg_user") : null;
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN")) {
            setCurrentUser(parsed);
          }
        } catch (e) {}
      }

      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch("/api/auth/me", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user && (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN")) {
          setCurrentUser(data.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("vg_user", JSON.stringify(data.user));
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    refreshTrainboards();
    checkAuth();

    // Multi-tab synchronization on focus & visibilitychange
    const onFocus = () => refreshTrainboards();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshTrainboards();
    };
    const handleAuthEvent = () => checkAuth();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("vg-auth-changed", handleAuthEvent);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("vg-auth-changed", handleAuthEvent);
    };
  }, []);

  // Handlers for Admin Operations
  const handleSaveTrainboard = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    try {
      if (editingTrainboard) {
        const res = await fetch(`/api/admin/trainboards/${editingTrainboard.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update trainboard");

        setTrainboardFiles((prev) =>
          prev.map((tb) => (tb.id === editingTrainboard.id ? { ...tb, ...data.trainboard } : tb))
        );
        setEditingTrainboard(null);
        showToast("Trainboard package updated successfully!");
      } else {
        const res = await fetch("/api/admin/trainboards", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create trainboard");

        setTrainboardFiles([data.trainboard, ...trainboardFiles]);
        setIsAddTrainboardOpen(false);
        showToast("New Trainboard package added to catalog!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteTrainboard = async () => {
    if (!deleteModal) return;
    const { id, name } = deleteModal;
    setDeleteModal(null);

    try {
      const res = await fetch(`/api/admin/trainboards/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete trainboard");
      setTrainboardFiles((prev) => prev.filter((tb) => tb.id !== id));
      showToast(`Trainboard "${name}" permanently deleted.`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleSaveRename = async (id: string, name: string) => {
    try {
      const cleanName = name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`;
      const res = await fetch(`/api/admin/trainboards/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: cleanName }),
      });
      if (!res.ok) throw new Error("Failed to rename trainboard");
      setTrainboardFiles((prev) =>
        prev.map((tb) => (tb.id === id ? { ...tb, name: cleanName } : tb))
      );
      setRenameModalTb(null);
      showToast(`Trainboard renamed to "${cleanName}"!`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleSaveImage = async (id: string, image: string) => {
    try {
      const res = await fetch(`/api/admin/trainboards/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ image }),
      });
      if (!res.ok) throw new Error("Failed to update trainboard image");
      setTrainboardFiles((prev) =>
        prev.map((tb) => (tb.id === id ? { ...tb, image } : tb))
      );
      setImageModalTb(null);
      showToast("Trainboard image updated successfully!");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleSavePriceOffer = async (
    id: string,
    regularPrice: number,
    salePrice: number | null,
    discountPercent: number,
    isSpecialOffer: boolean
  ) => {
    try {
      const res = await fetch(`/api/admin/trainboards/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ regularPrice, salePrice, discountPercent, isSpecialOffer }),
      });
      if (!res.ok) throw new Error("Failed to update trainboard pricing");
      setTrainboardFiles((prev) =>
        prev.map((tb) =>
          tb.id === id ? { ...tb, regularPrice, salePrice, discountPercent, isSpecialOffer } : tb
        )
      );
      setPriceModalTb(null);
      showToast("Trainboard pricing and offer updated successfully!");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleUpdateAvailability = async (tb: TrainboardFile, newStatus: "AVAILABLE" | "OUT_OF_STOCK" | "COMING_SOON") => {
    try {
      const res = await fetch(`/api/admin/trainboards/${tb.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setTrainboardFiles((prev) =>
        prev.map((item) => (item.id === tb.id ? { ...item, status: newStatus } : item))
      );
      showToast(`Marked ${tb.name} as ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

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
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            toastMsg.isError
              ? "bg-rose-900 text-white border-rose-700"
              : "bg-[#0B2852] text-white border-[#39FF00]"
          }`}
        >
          {toastMsg.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#39FF00]" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-lg font-bold text-[#0B2852]">Confirm Permanent Deletion</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{deleteModal.name}&quot;</strong>?
              This will remove the trainboard package from the library immediately.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTrainboard}
                className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Trainboard Modal */}
      {renameModalTb && (
        <RenameTrainboardModal
          trainboard={renameModalTb}
          onClose={() => setRenameModalTb(null)}
          onSave={(newName) => handleSaveRename(renameModalTb.id, newName)}
        />
      )}

      {/* Trainboard Image Modal */}
      {imageModalTb && (
        <TrainboardImageModal
          trainboard={imageModalTb}
          onClose={() => setImageModalTb(null)}
          onSave={(newImg) => handleSaveImage(imageModalTb.id, newImg)}
        />
      )}

      {/* Trainboard Price & Offer Modal */}
      {priceModalTb && (
        <TrainboardPriceOfferModal
          trainboard={priceModalTb}
          onClose={() => setPriceModalTb(null)}
          onSave={(regPrice, sPrice, discPct, isOffer) =>
            handleSavePriceOffer(priceModalTb.id, regPrice, sPrice, discPct, isOffer)
          }
        />
      )}

      {/* Add / Edit Trainboard Modal */}
      {(isAddTrainboardOpen || editingTrainboard) && (
        <TrainboardDialog
          isOpen={isAddTrainboardOpen || !!editingTrainboard}
          trainboard={editingTrainboard}
          onClose={() => {
            setIsAddTrainboardOpen(false);
            setEditingTrainboard(null);
          }}
          onSave={handleSaveTrainboard}
        />
      )}

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

        {/* Visible Admin Management Toolbar for Train Boards */}
        {currentUser && (
          <div className="bg-[#0B2852] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl border-2 border-[#39FF00]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#39FF00]/20 text-[#39FF00] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide uppercase">Train Boards Admin Mode</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#39FF00] text-[#101C32] text-[10px] font-bold uppercase">
                    Live
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Logged in as <strong>{currentUser.name}</strong> ({currentUser.role})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <span className="text-xs font-semibold text-gray-200">Admin Controls:</span>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isAdminMode ? "bg-[#39FF00] text-[#101C32]" : "bg-gray-400 text-white"
                  }`}
                >
                  {isAdminMode ? "ON" : "OFF (Visitor View)"}
                </button>
              </div>

              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTrainboard(null);
                    setIsAddTrainboardOpen(true);
                  }}
                  className="px-4 py-2 bg-[#39FF00] text-[#101C32] hover:bg-white rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Add Train Board (+)
                </button>
              )}
            </div>
          </div>
        )}

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
              {filteredFiles.map((file) => {
                const isOutOfStock = file.status === "OUT_OF_STOCK";
                const isComingSoon = file.status === "COMING_SOON";

                return (
                  <div
                    key={file.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2852] flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                        {file.image ? (
                          <img src={file.image} alt={file.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <FileArchive className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm sm:text-base text-[#0B2852] hover:text-blue-700 transition-colors">
                            {file.name}
                          </span>
                          {isOutOfStock && (
                            <span className="px-2 py-0.5 rounded-full bg-[#DC2626] text-white font-bold text-[10px] uppercase shadow-xs">
                              Out of Stock
                            </span>
                          )}
                          {isComingSoon && (
                            <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white font-bold text-[10px] uppercase shadow-xs">
                              Coming Soon
                            </span>
                          )}
                          {!isOutOfStock && !isComingSoon && (
                            <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] uppercase shadow-xs">
                              Available
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px]">
                            {file.zoneName}
                          </span>
                          <span>&bull;</span>
                          <span>Size: {file.size}</span>
                          {file.regularPrice && file.regularPrice > 0 ? (
                            <>
                              <span>&bull;</span>
                              <span className="font-bold text-gray-700">Price: ₹{file.regularPrice.toFixed(2)}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                      {/* Public Action */}
                      {isOutOfStock ? (
                        <span className="px-4 py-2 rounded-full bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 font-bold text-xs">
                          Temporarily Unavailable
                        </span>
                      ) : isComingSoon ? (
                        <span className="px-4 py-2 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 font-bold text-xs">
                          Release Pending
                        </span>
                      ) : (
                        <a
                          href={file.downloadUrl}
                          download
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex-shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download ZIP</span>
                        </a>
                      )}

                      {/* Admin Controls on Item */}
                      {currentUser && isAdminMode && (
                        <div className="flex flex-col gap-1.5 p-2 bg-blue-50/80 rounded-xl border border-blue-200 mt-2 sm:mt-0 shadow-xs">
                          <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#0B2852] pb-1 border-b border-blue-200">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#0B2852]" />
                              Admin Controls
                            </span>
                            <span className="font-mono text-gray-500 text-[9px]">Order: {file.displayOrder || 0}</span>
                          </div>

                          {/* Row 1: [EDIT] [RENAME] [UPLOAD IMAGE] */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingTrainboard(file)}
                              className="px-2 py-1 rounded bg-[#0B2852] text-white hover:bg-black font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Edit Full Details"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setRenameModalTb(file)}
                              className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800 hover:border-[#0B2852] font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Rename Train Board"
                            >
                              Rename
                            </button>

                            <button
                              type="button"
                              onClick={() => setImageModalTb(file)}
                              className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Upload / Replace Image"
                            >
                              <Upload className="w-3 h-3" />
                              Image
                            </button>
                          </div>

                          {/* Row 2: [PRICE] [OFFER] [DELETE] */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPriceModalTb(file)}
                              className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800 hover:border-[#FF6600] font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Edit Price"
                            >
                              <DollarSign className="w-3 h-3 text-[#FF6600]" />
                              Price
                            </button>

                            <button
                              type="button"
                              onClick={() => setPriceModalTb(file)}
                              className="px-2 py-1 rounded bg-[#FF6B00] text-white hover:bg-[#e05a00] font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Special Offer"
                            >
                              <Tag className="w-3 h-3" />
                              Offer
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteModal({ id: file.id, name: file.name })}
                              className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Delete Trainboard"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>

                          {/* Row 3: 1-Click Availability Pills */}
                          <div className="flex items-center gap-1 pt-1 border-t border-blue-200">
                            <button
                              type="button"
                              onClick={() => handleUpdateAvailability(file, "AVAILABLE")}
                              className={`flex-1 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                file.status === "AVAILABLE" || !file.status
                                  ? "bg-[#2563EB] text-white shadow-xs"
                                  : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              Avail
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateAvailability(file, "OUT_OF_STOCK")}
                              className={`flex-1 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                file.status === "OUT_OF_STOCK"
                                  ? "bg-[#DC2626] text-white shadow-xs"
                                  : "bg-white border border-gray-200 text-gray-600 hover:bg-red-50"
                              }`}
                            >
                              Out
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateAvailability(file, "COMING_SOON")}
                              className={`flex-1 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                file.status === "COMING_SOON"
                                  ? "bg-[#16A34A] text-white shadow-xs"
                                  : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"
                              }`}
                            >
                              Soon
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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

// --- SUB-COMPONENT: TRAINBOARD DIALOG (ADD / EDIT) ---
function TrainboardDialog({
  isOpen,
  trainboard,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  trainboard: TrainboardFile | null;
  onClose: () => void;
  onSave: (e: React.FormEvent, formValues: any) => void;
}) {
  const [name, setName] = useState(trainboard?.name || "");
  const [zone, setZone] = useState(trainboard?.zone || "WR");
  const [zoneName, setZoneName] = useState(trainboard?.zoneName || "Western Railway");
  const [size, setSize] = useState(trainboard?.size || "2.5 MB");
  const [downloadUrl, setDownloadUrl] = useState(trainboard?.downloadUrl || "");
  const [description, setDescription] = useState(trainboard?.description || "");
  const [regularPrice, setRegularPrice] = useState(trainboard?.regularPrice ?? 0);
  const [salePrice, setSalePrice] = useState(trainboard?.salePrice ?? "");
  const [status, setStatus] = useState(trainboard?.status || "AVAILABLE");
  const [image, setImage] = useState(trainboard?.image || "");
  const [isUploading, setIsUploading] = useState(false);

  const zonePresets: Record<string, string> = {
    WR: "Western Railway",
    CR: "Central Railway",
    ECoR: "East Coast Railway",
    NR: "Northern Railway",
    SR: "Southern Railway",
    ER: "Eastern Railway",
    NCR: "North Central Railway",
    NER: "North Eastern Railway",
    NWR: "North Western Railway",
    SECR: "South East Central Railway",
    SER: "South Eastern Railway",
    SWR: "South Western Railway",
    WCR: "West Central Railway",
  };

  const handleZoneSelect = (z: string) => {
    setZone(z);
    setZoneName(zonePresets[z] || `${z} Zone`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSave(e, {
      name,
      zone,
      zoneName,
      size,
      downloadUrl:
        downloadUrl ||
        `/downloads/trainboards/${zone}/${name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`}`,
      description,
      regularPrice: parseFloat(regularPrice.toString()) || 0,
      salePrice: salePrice ? parseFloat(salePrice.toString()) : null,
      status,
      image,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-4 text-xs font-josefin">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-[#0B2852]">
            {trainboard ? `Edit Trainboard: ${trainboard.name}` : "Add New Trainboard Package"}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Title / Zip File Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 12010 Ahmedabad Shatabdi Express.zip"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Railway Zone *</label>
              <select
                value={zone}
                onChange={(e) => handleZoneSelect(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              >
                {Object.keys(zonePresets).map((z) => (
                  <option key={z} value={z}>
                    {z} ({zonePresets[z]})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">File Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="2.5 MB"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Price (₹, 0 for Free)</label>
              <input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Availability</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              >
                <option value="AVAILABLE">Available / In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="COMING_SOON">Coming Soon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Download Link</label>
            <input
              type="text"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="/downloads/trainboards/WR/filename.zip"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">Preview Image / Texture Thumbnail</label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL or upload from disk"
                className="flex-1 p-2 border rounded-lg text-xs"
              />
              <label className="px-3 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-definition bilingual trainboard set for Open Rails / MSTS coaches"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all shadow-md"
            >
              {trainboard ? "Save Trainboard" : "Add Trainboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: RENAME TRAINBOARD MODAL ---
function RenameTrainboardModal({
  trainboard,
  onClose,
  onSave,
}: {
  trainboard: TrainboardFile;
  onClose: () => void;
  onSave: (newName: string) => void;
}) {
  const [name, setName] = useState(trainboard.name || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">Rename Train Board</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onSave(name.trim());
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-bold text-gray-700 mb-1">Train Board File Name (.zip)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm text-[#101C32] focus:ring-2 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all"
            >
              Save Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TRAINBOARD IMAGE MODAL ---
function TrainboardImageModal({
  trainboard,
  onClose,
  onSave,
}: {
  trainboard: TrainboardFile;
  onClose: () => void;
  onSave: (newImg: string) => void;
}) {
  const [image, setImage] = useState(trainboard.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">
            Upload / Replace Train Board Image
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview */}
        <div className="aspect-[16/9] w-full bg-gray-50 rounded-xl overflow-hidden border flex items-center justify-center p-2">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400">No image specified</span>
          )}
        </div>

        {error && <p className="text-rose-600 text-[11px] font-semibold">{error}</p>}

        <div>
          <label className="block font-bold text-gray-700 mb-1">Upload from Computer</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0B2852] file:text-white hover:file:bg-[#39FF00] hover:file:text-[#101C32] cursor-pointer"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Or Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/assets/products/... or https://..."
            className="w-full p-2 border rounded font-mono text-xs text-[#101C32]"
          />
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => onSave(image)}
            className="flex-1 py-2 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Image"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TRAINBOARD PRICE & OFFER MODAL ---
function TrainboardPriceOfferModal({
  trainboard,
  onClose,
  onSave,
}: {
  trainboard: TrainboardFile;
  onClose: () => void;
  onSave: (
    regularPrice: number,
    salePrice: number | null,
    discountPercent: number,
    isSpecialOffer: boolean
  ) => void;
}) {
  const [regularPrice, setRegularPrice] = useState<number>(trainboard.regularPrice || 0);
  const [isSpecialOffer, setIsSpecialOffer] = useState<boolean>(
    Boolean((trainboard as any).isSpecialOffer)
  );
  const [discountPercent, setDiscountPercent] = useState<number>(
    (trainboard as any).discountPercent || 20
  );

  const calculatedSalePrice =
    regularPrice > 0 && isSpecialOffer
      ? Math.round(regularPrice * (1 - discountPercent / 100))
      : trainboard.salePrice || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">
            Price & Special Offer: {trainboard.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Original Price (₹, enter 0 for Free Download)
          </label>
          <input
            type="number"
            min={0}
            value={regularPrice}
            onChange={(e) => setRegularPrice(parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 border rounded-lg text-sm text-[#101C32]"
          />
        </div>

        {regularPrice > 0 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Enable Special Offer</span>
                <span className="text-[11px] text-gray-500">Apply promotional discount</span>
              </div>
              <input
                type="checkbox"
                checked={isSpecialOffer}
                onChange={(e) => setIsSpecialOffer(e.target.checked)}
                className="w-5 h-5 text-[#FF6600] rounded focus:ring-[#FF6600]"
              />
            </div>

            {isSpecialOffer && (
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span>Discount:</span>
                  <span className="text-[#FF6600] font-mono text-sm">{discountPercent}% OFF</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-[#FF6600]"
                />
                <div className="flex justify-between text-xs font-semibold pt-2 text-[#0B2852]">
                  <span>Discounted Price:</span>
                  <span className="text-[#FF6600] font-bold text-sm">
                    ₹{calculatedSalePrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSave(
                regularPrice,
                isSpecialOffer ? calculatedSalePrice : null,
                discountPercent,
                isSpecialOffer
              )
            }
            className="flex-1 py-2 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all shadow-md"
          >
            Save Price & Offer
          </button>
        </div>
      </div>
    </div>
  );
}
