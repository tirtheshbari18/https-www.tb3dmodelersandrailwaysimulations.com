"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Train,
  Search,
  Filter,
  X,
  Save,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Clock,
  Check,
  Ban,
  UserCheck,
  UserX,
  Tag,
  Percent,
  Upload,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  ShieldAlert,
  Archive,
  AlertTriangle,
  FileText,
  Boxes,
  Play,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AdminClientProps {
  initialProducts: any[];
  categories: any[];
  initialProjects: any[];
  initialOrders: any[];
  initialCustomers: any[];
  initialEnquiries: any[];
  initialSettings: any;
  initialTrainboards?: any[];
  initialOffers?: any[];
  initialAuditLogs?: any[];
  initialSlides?: any[];
  currentAdmin: any;
}

export default function AdminClient({
  initialProducts,
  categories,
  initialProjects,
  initialOrders,
  initialCustomers,
  initialEnquiries,
  initialSettings,
  initialTrainboards = [],
  initialOffers = [],
  initialAuditLogs = [],
  initialSlides = [],
  currentAdmin,
}: AdminClientProps) {
  const router = useRouter();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "slides"
    | "coaches"
    | "trainboards"
    | "products"
    | "prices"
    | "offers"
    | "stock"
    | "settings"
    | "users"
    | "orders"
    | "enquiries"
  >("dashboard");

  // State
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [trainboards, setTrainboards] = useState<any[]>(initialTrainboards);
  const [offers, setOffers] = useState<any[]>(initialOffers);
  const [auditLogs, setAuditLogs] = useState<any[]>(initialAuditLogs);
  const [slides, setSlides] = useState<any[]>(initialSlides);
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [customers, setCustomers] = useState<any[]>(initialCustomers);
  const [enquiries, setEnquiries] = useState<any[]>(initialEnquiries);
  const [settings, setSettings] = useState<any>(initialSettings || {});

  // Mobile sidebar open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [deleteSlideModal, setDeleteSlideModal] = useState<{ id: string; title: string } | null>(null);

  const [isAddTrainboardOpen, setIsAddTrainboardOpen] = useState(false);
  const [editingTrainboard, setEditingTrainboard] = useState<any | null>(null);

  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "product" | "trainboard" | "offer" | "user";
    id: string;
    name: string;
  } | null>(null);

  const [rejectionModalUser, setRejectionModalUser] = useState<any | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");

  const [roleChangeUser, setRoleChangeUser] = useState<any | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState("USER");

  // Search & Filter state
  const [coachSearch, setCoachSearch] = useState("");
  const [coachCategoryFilter, setCoachCategoryFilter] = useState("ALL");
  const [trainboardSearch, setTrainboardSearch] = useState("");
  const [trainboardZoneFilter, setTrainboardZoneFilter] = useState("ALL");
  const [priceSearch, setPriceSearch] = useState("");
  const [stockSearch, setStockSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  // Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Metrics computation
  const coachesList = products.filter((p) => {
    const cat = p.category?.name?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";
    return cat.includes("coach") || name.includes("coach") || name.includes("lhb") || name.includes("vistadome");
  });

  const totalCoachesCount = coachesList.length;
  const totalTrainboardsCount = trainboards.length;
  const availableProductsCount = products.filter((p) => p.status === "AVAILABLE").length;
  const outOfStockProductsCount = products.filter((p) => p.status === "OUT_OF_STOCK").length;
  const comingSoonProductsCount = products.filter(
    (p) => p.status === "COMING_SOON" || Boolean(p.isComingSoon)
  ).length;
  const activeOffersCount = offers.filter((o) => o.isActive).length;
  const totalProductsCount = products.length;

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // --- Handlers: Home Slide Management ---
  const handleSaveSlide = async (e: React.FormEvent, formValues: any, isNew: boolean = false) => {
    e.preventDefault();
    try {
      const url = isNew ? "/api/admin/slides" : `/api/admin/slides/${formValues.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save slide");

      if (isNew) {
        setSlides([...slides, data.slide]);
      } else {
        setSlides(slides.map((s) => (s.id === formValues.id ? data.slide : s)));
      }
      setIsAddSlideOpen(false);
      setEditingSlide(null);
      showToast(isNew ? "New slide created!" : "Slide updated successfully!");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteSlide = async () => {
    if (!deleteSlideModal) return;
    try {
      const res = await fetch(`/api/admin/slides/${deleteSlideModal.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slide");
      setSlides(slides.filter((s) => s.id !== deleteSlideModal.id));
      setDeleteSlideModal(null);
      showToast("Slide permanently deleted.");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleToggleSlideActive = async (slide: any) => {
    try {
      const res = await fetch(`/api/admin/slides/${slide.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !slide.isActive }),
      });
      if (res.ok) {
        setSlides(slides.map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s)));
        showToast(`Slide marked ${!slide.isActive ? "ACTIVE" : "INACTIVE"}`);
      }
    } catch (e) {
      showToast("Failed to toggle status", true);
    }
  };

  // --- Handlers: Coach / Product ---
  const handleSaveProduct = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update item");

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
        );
        setEditingProduct(null);
        showToast("Coach/Product updated successfully!");
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create item");

        setProducts([data.product, ...products]);
        setIsAddProductOpen(false);
        showToast("New Coach/Product created and published!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    const { type, id, name } = deleteModal;
    setDeleteModal(null);

    try {
      if (type === "product") {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`"${name}" was permanently deleted.`);
      } else if (type === "trainboard") {
        const res = await fetch(`/api/admin/trainboards/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete trainboard");
        setTrainboards((prev) => prev.filter((tb) => tb.id !== id));
        showToast(`Trainboard "${name}" permanently deleted.`);
      } else if (type === "offer") {
        const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete offer");
        setOffers((prev) => prev.filter((o) => o.id !== id));
        showToast(`Offer "${name}" deleted.`);
      } else if (type === "user") {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to delete user");
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        showToast(`User account "${name}" deleted.`);
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: 1-Click Availability / Stock Toggle ---
  const handleUpdateAvailability = async (product: any, newStatus: "AVAILABLE" | "OUT_OF_STOCK" | "COMING_SOON") => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newStatus,
          stockQuantity: newStatus === "OUT_OF_STOCK" ? 0 : product.stockQuantity || 100,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update availability");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                status: newStatus,
                stockQuantity: newStatus === "OUT_OF_STOCK" ? 0 : p.stockQuantity || 100,
              }
            : p
        )
      );
      showToast(`Status updated: ${product.name} is now ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleUpdateStockQuantity = async (product: any, qtyStr: string) => {
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty < 0) return;
    const newStatus = qty === 0 ? "OUT_OF_STOCK" : product.status === "OUT_OF_STOCK" ? "AVAILABLE" : product.status;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockQuantity: qty,
          status: newStatus,
        }),
      });
      if (!res.ok) throw new Error("Failed to update stock quantity");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stockQuantity: qty, status: newStatus } : p
        )
      );
      showToast(`Stock for ${product.name} set to ${qty} (${newStatus})`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: Price Management ---
  const handleSavePrice = async (productId: string, regularPrice: number, salePrice: number | null) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          regularPrice,
          salePrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update price");

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, regularPrice, salePrice } : p))
      );
      showToast("Price updated and synchronized immediately!");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: Trainboards CRUD ---
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

        setTrainboards((prev) =>
          prev.map((tb) => (tb.id === editingTrainboard.id ? { ...tb, ...data.trainboard } : tb))
        );
        setEditingTrainboard(null);
        showToast("Trainboard updated successfully!");
      } else {
        const res = await fetch("/api/admin/trainboards", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create trainboard");

        setTrainboards([data.trainboard, ...trainboards]);
        setIsAddTrainboardOpen(false);
        showToast("New Trainboard package added to official collection!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: Offers CRUD ---
  const handleSaveOffer = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        const res = await fetch(`/api/admin/offers/${editingOffer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update offer");

        setOffers((prev) =>
          prev.map((o) => (o.id === editingOffer.id ? { ...o, ...data.offer } : o))
        );
        setEditingOffer(null);
        showToast("Offer updated successfully!");
      } else {
        const res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create offer");

        setOffers([data.offer, ...offers]);
        setIsAddOfferOpen(false);
        showToast("New promotional offer created!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleToggleOfferActive = async (offer: any) => {
    try {
      const res = await fetch(`/api/admin/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !offer.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle offer");

      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, isActive: !o.isActive } : o))
      );
      showToast(`Offer "${offer.title}" is now ${!offer.isActive ? "ACTIVE" : "DISABLED"}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: User Management ---
  const handleUserStatusAction = async (userId: string, action: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === userId) {
            return {
              ...c,
              status:
                action === "approve" || action === "reactivate"
                  ? "APPROVED"
                  : action === "reject"
                  ? "REJECTED"
                  : "SUSPENDED",
              rejectionReason: action === "reject" ? reason : c.rejectionReason,
            };
          }
          return c;
        })
      );
      showToast(`User status updated: ${action.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleAssignUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setRole", role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Role assignment failed");

      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: newRole } : c))
      );
      setRoleChangeUser(null);
      showToast(`User role successfully updated to ${newRole}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: Settings ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      showToast("Website settings saved successfully!");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // --- Handlers: Logout ---
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    window.location.href = "/login";
  };

  const isSuperAdmin = currentAdmin.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#101C32] font-josefin flex flex-col">
      {/* Toast Notification */}
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
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#0B2852]">Confirm Permanent Deletion</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete <strong>&quot;{deleteModal.name}&quot;</strong>?
                This action cannot be undone and will immediately remove the item from the live website.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0B2852]">Change User Role</h3>
              <button onClick={() => setRoleChangeUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Assign role for <strong>{roleChangeUser.name}</strong> ({roleChangeUser.email})
            </p>
            <div className="space-y-2">
              {["SUPER_ADMIN", "ADMIN", "USER"].map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedNewRole === r
                      ? "border-[#0B2852] bg-blue-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="userRole"
                      value={r}
                      checked={selectedNewRole === r}
                      onChange={(e) => setSelectedNewRole(e.target.value)}
                      className="text-[#0B2852]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0B2852] block">
                        {r === "SUPER_ADMIN"
                          ? "Super Administrator"
                          : r === "ADMIN"
                          ? "Administrator"
                          : "Normal User"}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {r === "SUPER_ADMIN"
                          ? "Full system control, can assign roles and manage admins"
                          : r === "ADMIN"
                          ? "Can manage coaches, T-boards, prices, offers, and inventory"
                          : "Standard customer privileges, no dashboard access"}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRoleChangeUser(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAssignUserRole(roleChangeUser.id, selectedNewRole)}
                className="flex-1 py-2.5 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] text-xs font-bold transition-all"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-[#0B2852] text-white border-b border-[#0B2852]/80 sticky top-0 z-30 shadow-md">
        <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Train className="w-6 h-6 text-[#39FF00]" />
              <span className="font-bold text-base sm:text-lg tracking-wide uppercase">
                VG Control Center
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#39FF00]/20 text-[#39FF00] border border-[#39FF00]/40 text-[10px] font-bold uppercase tracking-wider">
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Website
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-7 h-7 rounded-full bg-[#39FF00] text-[#0B2852] font-bold flex items-center justify-center text-xs">
                {currentAdmin.name ? currentAdmin.name[0].toUpperCase() : "A"}
              </div>
              <span className="hidden md:inline font-semibold">{currentAdmin.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-rose-900/60 text-gray-300 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-full overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B2852] text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between lg:hidden">
            <span className="font-bold text-sm tracking-wide">Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "slides", label: "Home Slider Management", icon: Play, badge: slides.length },
              { id: "coaches", label: "Coach Management", icon: Train, badge: totalCoachesCount },
              { id: "trainboards", label: "T-Board Management", icon: Layers, badge: totalTrainboardsCount },
              { id: "products", label: "Product Management", icon: Package, badge: totalProductsCount },
              { id: "prices", label: "Price Management", icon: DollarSign },
              { id: "offers", label: "Offers Management", icon: Tag, badge: activeOffersCount },
              { id: "stock", label: "Stock Management", icon: Boxes, badge: outOfStockProductsCount > 0 ? `${outOfStockProductsCount} Out` : undefined },
              { id: "orders", label: "Orders & Entitlements", icon: ShoppingCart },
              { id: "users", label: "User Management", icon: Users },
              { id: "enquiries", label: "Contact Inquiries", icon: MessageSquare },
              { id: "settings", label: "Website Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#39FF00] text-[#101C32] font-bold shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#101C32]" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#0B2852] text-[#39FF00]"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 border-t border-white/10 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-full">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-light text-[#0B2852]">Dashboard Overview</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time website inventory, products, and administrative audit operations.
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Products</span>
                    <Package className="w-3.5 h-3.5 text-[#0B2852]" />
                  </div>
                  <p className="text-xl font-bold text-[#0B2852]">{totalProductsCount}</p>
                  <span className="text-[9px] text-gray-500">Catalog Items</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Coaches</span>
                    <Train className="w-3.5 h-3.5 text-[#0B2852]" />
                  </div>
                  <p className="text-xl font-bold text-[#0B2852]">{totalCoachesCount}</p>
                  <span className="text-[9px] text-gray-500">Official VG Fleet</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total T-Boards</span>
                    <Layers className="w-3.5 h-3.5 text-[#0B2852]" />
                  </div>
                  <p className="text-xl font-bold text-[#0B2852]">{totalTrainboardsCount}</p>
                  <span className="text-[9px] text-gray-500">Trainboard Packs</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <p className="text-xl font-bold text-[#2563EB]">{availableProductsCount}</p>
                  <span className="text-[9px] text-[#2563EB]">In Stock for Order</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                    <Ban className="w-3.5 h-3.5 text-[#DC2626]" />
                  </div>
                  <p className="text-xl font-bold text-[#DC2626]">{outOfStockProductsCount}</p>
                  <span className="text-[9px] text-[#DC2626]">Purchases Disabled</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Coming Soon</span>
                    <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                  </div>
                  <p className="text-xl font-bold text-[#16A34A]">{comingSoonProductsCount}</p>
                  <span className="text-[9px] text-[#16A34A]">Release Pending</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Offers</span>
                    <Tag className="w-3.5 h-3.5 text-[#FF6B00]" />
                  </div>
                  <p className="text-xl font-bold text-[#FF6B00]">{activeOffersCount}</p>
                  <span className="text-[9px] text-[#FF6B00]">Discounts Live</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Home Slides</span>
                    <Play className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-blue-700">{slides.length}</p>
                  <span className="text-[9px] text-blue-500">Slider Windows</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Coach / Product
                </button>
                <button
                  onClick={() => {
                    setEditingTrainboard(null);
                    setIsAddTrainboardOpen(true);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-800 hover:border-[#0B2852] rounded-full text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Trainboard
                </button>
                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setIsAddOfferOpen(true);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-800 hover:border-[#0B2852] rounded-full text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Promotional Offer
                </button>
              </div>

              {/* Recent Admin Activities Audit Table */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0B2852]">Recent Admin Activities</h3>
                    <p className="text-xs text-gray-500">Live immutable audit log of administrative actions</p>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">{auditLogs.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Entity</th>
                        <th className="py-2.5 px-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {auditLogs.slice(0, 10).map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0B2852] font-bold text-[10px] border border-blue-200">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gray-700">{log.entity}</td>
                          <td className="py-2.5 px-3 text-gray-600 max-w-md truncate">
                            {log.details || "-"}
                          </td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-gray-400">
                            No recent activity recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOME SLIDER MANAGEMENT */}
          {activeTab === "slides" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-[#0B2852]">Home Page Slider Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Add, edit, rename, upload images, reorder, and configure automatic slide transitions on the public Home page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingSlide(null);
                      setIsAddSlideOpen(true);
                    }}
                    className="px-4 py-2 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    + Add New Slide
                  </button>
                  <Link
                    href="/"
                    target="_blank"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0B2852] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Live Home Page
                  </Link>
                </div>
              </div>

              {/* Slider Settings Bar */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0B2852] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#0B2852]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Automatic Slide Transition Timing</span>
                    <span className="text-[11px] text-gray-500">
                      Configure interval before moving to the next slide
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={settings.sliderInterval || 5000}
                    onChange={async (e) => {
                      const newInterval = parseInt(e.target.value, 10);
                      setSettings({ ...settings, sliderInterval: newInterval });
                      try {
                        await fetch("/api/admin/settings", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ sliderInterval: newInterval }),
                        });
                        showToast(`Slide timing set to ${newInterval / 1000} seconds!`);
                      } catch (err) {}
                    }}
                    className="px-3 py-1.5 border rounded-lg text-xs font-semibold text-[#0B2852] bg-white focus:outline-none"
                  >
                    <option value={3000}>3 Seconds (Fast)</option>
                    <option value={5000}>5 Seconds (Recommended)</option>
                    <option value={8000}>8 Seconds (Relaxed)</option>
                    <option value={10000}>10 Seconds (Slow)</option>
                  </select>
                </div>
              </div>

              {/* Slides Grid / List */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <span>Home Showcase Slides ({slides.length} Total)</span>
                  <span className="text-gray-400 font-normal">Active on Home Page: {slides.filter((s) => s.isActive).length}</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {slides.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="w-6 text-center font-mono font-bold text-gray-400 text-xs">
                          #{s.order || idx + 1}
                        </span>
                        <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center p-1 flex-shrink-0">
                          <img src={s.image} alt={s.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#0B2852] truncate block">
                              {s.title}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                s.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {s.isActive ? "Active" : "Disabled"}
                            </span>
                          </div>
                          {s.subtitle && (
                            <p className="text-[11px] text-[#FF6600] font-semibold truncate">{s.subtitle}</p>
                          )}
                          <p className="text-xs text-gray-500 line-clamp-1">{s.description || "No description provided."}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSlideActive(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            s.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          {s.isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingSlide(s)}
                          className="px-3 py-1.5 rounded-lg bg-[#0B2852] text-white hover:bg-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteSlideModal({ id: s.id, title: s.title })}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {slides.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No slides created yet. Click "+ Add New Slide" to start.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COACH MANAGEMENT */}
          {activeTab === "coaches" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-[#0B2852]">Coach Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Add, edit, rename, upload images, specifications, and delete official VG coaches.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Coach
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search coaches by name, SKU or livery..."
                    value={coachSearch}
                    onChange={(e) => setCoachSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={coachCategoryFilter}
                  onChange={(e) => setCoachCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coaches Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Coach / Livery</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Regular Price</th>
                        <th className="py-3 px-3">Offer Price</th>
                        <th className="py-3 px-3">Availability</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coachesList
                        .filter((p) => {
                          const matchesSearch =
                            p.name.toLowerCase().includes(coachSearch.toLowerCase()) ||
                            p.sku.toLowerCase().includes(coachSearch.toLowerCase());
                          const matchesCat =
                            coachCategoryFilter === "ALL" || p.categoryId === coachCategoryFilter;
                          return matchesSearch && matchesCat;
                        })
                        .map((coach) => {
                          const hasOffer = coach.salePrice !== null && coach.salePrice < coach.regularPrice;
                          const isOutOfStock = coach.status === "OUT_OF_STOCK";

                          return (
                            <tr key={coach.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#F5F6F8] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                    <img
                                      src={coach.images?.[0]?.url || "/assets/products/chaircar_standard.png"}
                                      alt={coach.name}
                                      className="w-full h-full object-contain p-1"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#0B2852] block line-clamp-1">
                                      {coach.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      {coach.compatibility || "Open Rails / MSTS"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                                {coach.sku}
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {coach.category?.name || "LHB Coaches"}
                              </td>
                              <td className="py-3 px-3 font-semibold text-gray-800">
                                ₹{coach.regularPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {hasOffer ? (
                                  <span className="text-[#FF6600] font-bold">
                                    ₹{coach.salePrice.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    isOutOfStock
                                      ? "bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30"
                                      : coach.status === "COMING_SOON"
                                      ? "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30"
                                      : "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30"
                                  }`}
                                >
                                  {isOutOfStock
                                    ? "Out of Stock"
                                    : coach.status === "COMING_SOON"
                                    ? "Coming Soon"
                                    : "Available"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(coach);
                                      setIsAddProductOpen(false);
                                    }}
                                    className="p-1.5 rounded-lg border border-gray-200 text-[#0B2852] hover:bg-blue-50"
                                    title="Edit / Rename Coach"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteModal({
                                        isOpen: true,
                                        type: "product",
                                        id: coach.id,
                                        name: coach.name,
                                      })
                                    }
                                    className="p-1.5 rounded-lg border border-gray-200 text-rose-600 hover:bg-rose-50"
                                    title="Delete Coach"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: T-BOARD MANAGEMENT */}
          {activeTab === "trainboards" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-[#0B2852]">T-Board Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Full CRUD for trainboards: Add, rename, edit railway zone, file size, download link, and delete.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTrainboard(null);
                    setIsAddTrainboardOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Trainboard
                </button>
              </div>

              {/* Search & Zone Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search trainboards by name or zone..."
                    value={trainboardSearch}
                    onChange={(e) => setTrainboardSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={trainboardZoneFilter}
                  onChange={(e) => setTrainboardZoneFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                >
                  <option value="ALL">All Zones</option>
                  <option value="WR">WR - Western Railway</option>
                  <option value="CR">CR - Central Railway</option>
                  <option value="ECoR">ECoR - East Coast Railway</option>
                  <option value="NR">NR - Northern Railway</option>
                  <option value="SR">SR - Southern Railway</option>
                  <option value="ER">ER - Eastern Railway</option>
                </select>
              </div>

              {/* Trainboards Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Title / File Name</th>
                        <th className="py-3 px-3">Railway Zone</th>
                        <th className="py-3 px-3">Zone Full Name</th>
                        <th className="py-3 px-3">File Size</th>
                        <th className="py-3 px-3">Download Link</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trainboards
                        .filter((tb) => {
                          const matchesSearch =
                            tb.name.toLowerCase().includes(trainboardSearch.toLowerCase()) ||
                            tb.zone.toLowerCase().includes(trainboardSearch.toLowerCase());
                          const matchesZone =
                            trainboardZoneFilter === "ALL" || tb.zone === trainboardZoneFilter;
                          return matchesSearch && matchesZone;
                        })
                        .map((tb) => (
                          <tr key={tb.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-bold text-[#0B2852]">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span>{tb.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-[#0B2852] text-white text-[10px] font-bold">
                                {tb.zone}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-600">{tb.zoneName}</td>
                            <td className="py-3 px-3 text-gray-500">{tb.size}</td>
                            <td className="py-3 px-3 text-gray-400 font-mono text-[11px] truncate max-w-xs">
                              {tb.downloadUrl}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingTrainboard(tb);
                                    setIsAddTrainboardOpen(false);
                                  }}
                                  className="p-1.5 rounded-lg border border-gray-200 text-[#0B2852] hover:bg-blue-50"
                                  title="Rename / Edit Trainboard"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      type: "trainboard",
                                      id: tb.id,
                                      name: tb.name,
                                    })
                                  }
                                  className="p-1.5 rounded-lg border border-gray-200 text-rose-600 hover:bg-rose-50"
                                  title="Delete Trainboard"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-[#0B2852]">Product Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Full catalog items, route add-ons, and simulator models.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-video bg-[#F5F6F8] rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                        <img
                          src={prod.images?.[0]?.url || "/assets/products/chaircar_standard.png"}
                          alt={prod.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {prod.category?.name || "Rolling Stock"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.status === "OUT_OF_STOCK"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {prod.status === "OUT_OF_STOCK" ? "Out of Stock" : "In Stock"}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#0B2852] line-clamp-1">{prod.name}</h4>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-gray-800">
                          ₹{(prod.salePrice || prod.regularPrice).toFixed(2)}
                        </span>
                        {prod.salePrice && (
                          <span className="line-through text-xs text-gray-400 ml-1.5">
                            ₹{prod.regularPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsAddProductOpen(false);
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 text-[#0B2852] hover:bg-blue-50"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: "product",
                              id: prod.id,
                              name: prod.name,
                            })
                          }
                          className="p-1.5 rounded-lg border border-gray-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRICE MANAGEMENT */}
          {activeTab === "prices" && (
            <div className="space-y-6 max-w-6xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">Price Management</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Change regular prices, set discounted offer prices, apply quick percentage discounts, and save immediately.
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search products to adjust pricing..."
                  value={priceSearch}
                  onChange={(e) => setPriceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Price Management Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Item Name</th>
                        <th className="py-3 px-3">Regular Price (₹)</th>
                        <th className="py-3 px-3">Discounted / Offer Price (₹)</th>
                        <th className="py-3 px-3">Quick Discount</th>
                        <th className="py-3 px-4 text-right">Save Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products
                        .filter((p) => p.name.toLowerCase().includes(priceSearch.toLowerCase()))
                        .map((prod) => (
                          <PriceRowItem
                            key={prod.id}
                            product={prod}
                            onSave={handleSavePrice}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS MANAGEMENT */}
          {activeTab === "offers" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-[#0B2852]">Offers & Discounts Management</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create promotional offers, set discount percentages, active date ranges, and badges.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setIsAddOfferOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create New Offer
                </button>
              </div>

              {/* Offers List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 bg-white ${
                      offer.isActive ? "border-[#0B2852] shadow-md" : "border-gray-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          offer.isActive ? "bg-[#FF6600] text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {offer.badgeText || "SPECIAL OFFER"}
                      </span>
                      <button
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          offer.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {offer.isActive ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-[#0B2852]">{offer.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{offer.description || "Site-wide promotional discount."}</p>
                    </div>

                    <div className="p-3 bg-[#F5F6F8] rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Discount</span>
                        <span className="text-xl font-black text-[#0B2852]">{offer.discountPercent}% OFF</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Scope</span>
                        <span className="text-xs font-semibold text-gray-700">{offer.targetType}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {offer.endDate ? `Ends: ${formatDate(offer.endDate)}` : "Ongoing Offer"}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsAddOfferOpen(false);
                        }}
                        className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#0B2852] hover:bg-blue-50"
                      >
                        Edit Offer
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "offer",
                            id: offer.id,
                            name: offer.title,
                          })
                        }
                        className="p-1.5 rounded-lg border border-gray-200 text-rose-600 hover:bg-rose-50"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {offers.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    No promotional offers created yet. Click &quot;Create New Offer&quot; to begin.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: STOCK & INVENTORY MANAGEMENT */}
          {activeTab === "stock" && (
            <div className="space-y-6 max-w-6xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">Stock & Availability Management</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  1-Click toggle between Available, Out of Stock, and Coming Soon. Quantity reaches 0 automatically marks item Out of Stock.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search product inventory..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                >
                  <option value="ALL">All Stock Statuses</option>
                  <option value="AVAILABLE">Available / In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="COMING_SOON">Coming Soon</option>
                </select>
              </div>

              {/* Stock Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Product Name / Image</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Stock Quantity</th>
                        <th className="py-3 px-3">Current Status</th>
                        <th className="py-3 px-4 text-right">Quick 1-Click Status Switcher</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products
                        .filter((p) => {
                          const matchesSearch = p.name.toLowerCase().includes(stockSearch.toLowerCase());
                          const matchesFilter = stockFilter === "ALL" || p.status === stockFilter;
                          return matchesSearch && matchesFilter;
                        })
                        .map((prod) => (
                          <StockRowItem
                            key={prod.id}
                            product={prod}
                            onUpdateAvailability={handleUpdateAvailability}
                            onUpdateQuantity={handleUpdateStockQuantity}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: USER MANAGEMENT & RBAC */}
          {activeTab === "users" && (
            <div className="space-y-6 max-w-6xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">User Management & Permissions</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Role-based access control (Super Admin, Admin, Normal User) and registration approval workflows.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name, email, city..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0B2852]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_APPROVAL">Pending Review</option>
                  <option value="APPROVED">Approved Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Registered Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers
                        .filter((c) => {
                          const matchesSearch =
                            c.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            c.email?.toLowerCase().includes(userSearch.toLowerCase());
                          const matchesFilter =
                            userStatusFilter === "ALL" || c.status === userStatusFilter;
                          return matchesSearch && matchesFilter;
                        })
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <span className="font-bold text-[#0B2852] block">{user.name}</span>
                              <span className="text-[11px] text-gray-500">{user.email}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  user.role === "SUPER_ADMIN"
                                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                                    : user.role === "ADMIN"
                                    ? "bg-[#0B2852] text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  user.status === "APPROVED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : user.status === "PENDING_APPROVAL"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => {
                                      setRoleChangeUser(user);
                                      setSelectedNewRole(user.role);
                                    }}
                                    className="px-2 py-1 rounded-md border border-gray-200 text-xs font-semibold text-[#0B2852] hover:bg-blue-50"
                                  >
                                    Assign Role
                                  </button>
                                )}

                                {user.status === "PENDING_APPROVAL" && (
                                  <>
                                    <button
                                      onClick={() => handleUserStatusAction(user.id, "approve")}
                                      className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                      title="Approve User"
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRejectionModalUser(user);
                                        setRejectionReasonText("");
                                      }}
                                      className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                                      title="Reject User"
                                    >
                                      <UserX className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                {user.status === "APPROVED" && (
                                  <button
                                    onClick={() => handleUserStatusAction(user.id, "suspend")}
                                    className="p-1 rounded-md border border-gray-200 text-rose-600 hover:bg-rose-50"
                                    title="Suspend User"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {user.status === "SUSPENDED" && (
                                  <button
                                    onClick={() => handleUserStatusAction(user.id, "reactivate")}
                                    className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                    title="Reactivate User"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {user.email !== "admin@vg3dmodelers.com" && (
                                  <button
                                    onClick={() =>
                                      setDeleteModal({
                                        isOpen: true,
                                        type: "user",
                                        id: user.id,
                                        name: user.name,
                                      })
                                    }
                                    className="p-1 rounded-md border border-gray-200 text-rose-600 hover:bg-rose-50"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ORDERS & ENTITLEMENTS */}
          {activeTab === "orders" && (
            <div className="space-y-6 max-w-6xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">Orders & Entitlements</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customer digital purchases and download entitlements.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F6F8] text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Payment Status</th>
                        <th className="py-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono font-bold text-[#0B2852]">
                            {o.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block">{o.customerName}</span>
                            <span className="text-[10px] text-gray-400">{o.customerEmail}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-gray-800">
                            ₹{o.finalAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-500">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            No orders recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CONTACT INQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-6 max-w-6xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">Contact Inquiries</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct customer messages and custom model requests.
                </p>
              </div>

              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-[#0B2852]">{enq.subject}</span>
                      <span className="text-[11px] text-gray-400">{formatDate(enq.createdAt)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      From: <strong>{enq.name}</strong> ({enq.email})
                    </div>
                    <p className="text-xs text-gray-700 bg-[#F5F6F8] p-3 rounded-xl">{enq.message}</p>
                  </div>
                ))}
                {enquiries.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    No contact inquiries received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 11: WEBSITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-light text-[#0B2852]">Website Settings</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  General platform configuration, legal text, and contact details.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Website Brand Title</label>
                  <input
                    type="text"
                    value={settings.siteName || ""}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Founder / Creator Name</label>
                  <input
                    type="text"
                    value={settings.founderName || ""}
                    onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail || ""}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">WhatsApp / Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone || ""}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Home Hero Tagline</label>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Disclaimer</label>
                  <textarea
                    rows={3}
                    value={settings.disclaimerText || ""}
                    onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-bold uppercase transition-all shadow-md"
                >
                  Save Website Settings
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT COACH & PRODUCT */}
      {(isAddProductOpen || editingProduct) && (
        <ProductFormModal
          isOpen={isAddProductOpen || !!editingProduct}
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* MODAL: ADD / EDIT TRAINBOARD */}
      {(isAddTrainboardOpen || editingTrainboard) && (
        <TrainboardFormModal
          isOpen={isAddTrainboardOpen || !!editingTrainboard}
          trainboard={editingTrainboard}
          onClose={() => {
            setIsAddTrainboardOpen(false);
            setEditingTrainboard(null);
          }}
          onSave={handleSaveTrainboard}
        />
      )}

      {/* MODAL: ADD / EDIT OFFER */}
      {(isAddOfferOpen || editingOffer) && (
        <OfferFormModal
          isOpen={isAddOfferOpen || !!editingOffer}
          offer={editingOffer}
          onClose={() => {
            setIsAddOfferOpen(false);
            setEditingOffer(null);
          }}
          onSave={handleSaveOffer}
        />
      )}

      {/* MODAL: ADD / EDIT HOME SLIDE */}
      {(isAddSlideOpen || editingSlide) && (
        <SlideAdminModal
          isOpen={isAddSlideOpen || !!editingSlide}
          slide={editingSlide}
          onClose={() => {
            setIsAddSlideOpen(false);
            setEditingSlide(null);
          }}
          onSave={handleSaveSlide}
        />
      )}

      {/* MODAL: DELETE SLIDE CONFIRMATION */}
      {deleteSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Slide Permanently?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <strong>"{deleteSlideModal.title}"</strong>? It will be removed from the Home page immediately.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteSlideModal(null)}
                className="flex-1 py-2 rounded-full border text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSlide}
                className="flex-1 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: PRICE ROW WITH QUICK DISCOUNT BUTTONS ---
function PriceRowItem({
  product,
  onSave,
}: {
  product: any;
  onSave: (id: string, regularPrice: number, salePrice: number | null) => void;
}) {
  const [regularPrice, setRegularPrice] = useState(product.regularPrice);
  const [salePrice, setSalePrice] = useState<number | null>(product.salePrice);
  const [isChanged, setIsChanged] = useState(false);

  const applyDiscountPercent = (percent: number) => {
    const discounted = Math.round(regularPrice * (1 - percent / 100));
    setSalePrice(discounted);
    setIsChanged(true);
  };

  const handleSave = () => {
    onSave(product.id, regularPrice, salePrice);
    setIsChanged(false);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F5F6F8] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
            <img
              src={product.images?.[0]?.url || "/assets/products/chaircar_standard.png"}
              alt={product.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <span className="font-bold text-[#0B2852] block line-clamp-1">{product.name}</span>
            <span className="text-[10px] text-gray-400 font-mono">{product.sku}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-bold">₹</span>
          <input
            type="number"
            value={regularPrice}
            onChange={(e) => {
              setRegularPrice(parseFloat(e.target.value) || 0);
              setIsChanged(true);
            }}
            className="w-24 p-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
          />
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-bold">₹</span>
          <input
            type="number"
            placeholder="No offer"
            value={salePrice !== null ? salePrice : ""}
            onChange={(e) => {
              const val = e.target.value;
              setSalePrice(val === "" ? null : parseFloat(val) || 0);
              setIsChanged(true);
            }}
            className="w-24 p-1.5 border border-gray-300 rounded-lg text-xs font-bold text-[#FF6600]"
          />
          {salePrice !== null && salePrice < regularPrice && (
            <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FF6600] font-bold text-[10px]">
              {Math.round(((regularPrice - salePrice) / regularPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1">
          {[10, 20, 30, 50].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyDiscountPercent(pct)}
              className="px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-600 hover:border-[#0B2852] hover:bg-blue-50"
            >
              -{pct}%
            </button>
          ))}
          {salePrice !== null && (
            <button
              type="button"
              onClick={() => {
                setSalePrice(null);
                setIsChanged(true);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-semibold text-rose-600 hover:bg-rose-50"
            >
              Clear
            </button>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isChanged}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isChanged
              ? "bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] shadow-sm cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save Price
        </button>
      </td>
    </tr>
  );
}

// --- SUB-COMPONENT: STOCK & INVENTORY ROW ---
function StockRowItem({
  product,
  onUpdateAvailability,
  onUpdateQuantity,
}: {
  product: any;
  onUpdateAvailability: (product: any, status: "AVAILABLE" | "OUT_OF_STOCK" | "COMING_SOON") => void;
  onUpdateQuantity: (product: any, qty: string) => void;
}) {
  const [qty, setQty] = useState(product.stockQuantity ?? 100);

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F5F6F8] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
            <img
              src={product.images?.[0]?.url || "/assets/products/chaircar_standard.png"}
              alt={product.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <span className="font-bold text-[#0B2852] block line-clamp-1">{product.name}</span>
            <span className="text-[10px] text-gray-400">{product.category?.name || "Rolling Stock"}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 font-mono text-[11px] text-gray-600">{product.sku}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)}
            className="w-20 p-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
          />
          <button
            type="button"
            onClick={() => onUpdateQuantity(product, qty.toString())}
            className="px-2.5 py-1 rounded-md border border-gray-300 hover:border-[#0B2852] text-[10px] font-bold"
          >
            Update Qty
          </button>
        </div>
      </td>
      <td className="py-3 px-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            product.status === "OUT_OF_STOCK"
              ? "bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30"
              : product.status === "COMING_SOON"
              ? "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30"
              : "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30"
          }`}
        >
          {product.status === "OUT_OF_STOCK"
            ? "Out of Stock"
            : product.status === "COMING_SOON"
            ? "Coming Soon"
            : "Available"}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateAvailability(product, "AVAILABLE")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              product.status === "AVAILABLE"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-[#2563EB]"
            }`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => onUpdateAvailability(product, "OUT_OF_STOCK")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              product.status === "OUT_OF_STOCK"
                ? "bg-[#DC2626] text-white shadow-xs"
                : "border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-[#DC2626]"
            }`}
          >
            Out of Stock
          </button>
          <button
            type="button"
            onClick={() => onUpdateAvailability(product, "COMING_SOON")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              product.status === "COMING_SOON"
                ? "bg-[#16A34A] text-white shadow-xs"
                : "border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-[#16A34A]"
            }`}
          >
            Coming Soon
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- SUB-COMPONENT: PRODUCT & COACH FORM MODAL ---
function ProductFormModal({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  product: any | null;
  categories: any[];
  onClose: () => void;
  onSave: (e: React.FormEvent, formValues: any) => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [regularPrice, setRegularPrice] = useState(product?.regularPrice || "");
  const [salePrice, setSalePrice] = useState(product?.salePrice || "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId || categories[0]?.id || ""
  );
  const [status, setStatus] = useState(product?.status || "AVAILABLE");
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity ?? 100);
  const [specifications, setSpecifications] = useState(product?.specifications || "");
  const [compatibility, setCompatibility] = useState(
    product?.compatibility || "Open Rails / MSTS"
  );
  const [imageUrl, setImageUrl] = useState(product?.images?.[0]?.url || "");
  const [description, setDescription] = useState(product?.description || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? true);

  const [isUploading, setIsUploading] = useState(false);

  // Quick Coach Preset Images
  const coachPresets = [
    { label: "Academy Sleeper", url: "/assets/products/vg_academy_sleeper.avif" },
    { label: "Humsafar V2", url: "/assets/products/humsafar_v2.avif" },
    { label: "Sleeper V2", url: "/assets/products/sleeper_v2.avif" },
    { label: "Tricolour Coaches", url: "/assets/products/indian_tricolour.avif" },
    { label: "Amrit Bharat", url: "/assets/products/amrit_bharat.png" },
    { label: "Bangladesh Coaches", url: "/assets/products/bangladesh_coaches.png" },
    { label: "Chaircar Coaches", url: "/assets/products/chaircar_standard.png" },
    { label: "Vistadome Premium", url: "/assets/products/vistadome_standard.png" },
    { label: "WHR Route V2", url: "/assets/products/whr_route_v2.png" },
  ];

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

      setImageUrl(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSave(e, {
      name,
      sku: sku || `VG-${Date.now().toString().slice(-6)}`,
      regularPrice: parseFloat(regularPrice) || 0,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      categoryId,
      status,
      stockQuantity: parseInt(stockQuantity.toString(), 10) || 0,
      specifications,
      compatibility,
      imageUrl,
      description: description || name,
      isFeatured,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#0B2852]">
              {product ? `Edit Coach / Product: ${product.name}` : "Add New Coach or Add-on"}
            </h3>
            <p className="text-xs text-gray-500">Configure specifications, pricing, and media.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coach / Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VG LHB ACADEMY LIVERY SLEEPER"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">SKU / Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. VG-LHB-ACADEMY-01"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Regular Price (₹) *</label>
              <input
                type="number"
                required
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="1000"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Sale / Offer Price (₹)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Leave blank for regular"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Availability Status</label>
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
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Simulator Platform</label>
              <input
                type="text"
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          {/* Image Upload and Selection */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Coach Image</label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-[#F5F6F8] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <Train className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL or choose/upload below"
                  className="w-full p-2 border rounded-lg text-xs"
                />
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? "Uploading..." : "Upload from Disk"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <span className="text-[10px] text-gray-400">JPG, PNG, WEBP up to 15MB</span>
                </div>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Quick VG Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {coachPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                      imageUrl === p.url
                        ? "bg-[#0B2852] text-white border-[#0B2852]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Specifications & Engineering Details
            </label>
            <textarea
              rows={2}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="e.g. Bogie: FIAT-SIG 160km/h, Tare Weight: 40.5 tonnes, Sound: 3D High-Fidelity Physics"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[#0B2852]"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Showcase in Home Sliding Window Carousel
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all shadow-md"
            >
              {product ? "Save Changes" : "Create Coach"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TRAINBOARD FORM MODAL ---
function TrainboardFormModal({
  isOpen,
  trainboard,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  trainboard: any | null;
  onClose: () => void;
  onSave: (e: React.FormEvent, formValues: any) => void;
}) {
  const [name, setName] = useState(trainboard?.name || "");
  const [zone, setZone] = useState(trainboard?.zone || "WR");
  const [zoneName, setZoneName] = useState(trainboard?.zoneName || "Western Railway");
  const [size, setSize] = useState(trainboard?.size || "2.5 MB");
  const [downloadUrl, setDownloadUrl] = useState(trainboard?.downloadUrl || "");
  const [description, setDescription] = useState(trainboard?.description || "");
  const [displayOrder, setDisplayOrder] = useState(trainboard?.displayOrder ?? 0);

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

  const handleSubmit = (e: React.FormEvent) => {
    onSave(e, {
      name,
      zone,
      zoneName,
      size,
      downloadUrl: downloadUrl || `/downloads/trainboards/${zone}/${name.trim().endsWith(".zip") ? name.trim() : `${name.trim()}.zip`}`,
      description,
      displayOrder,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-[#0B2852]">
            {trainboard ? `Edit Trainboard: ${trainboard.name}` : "Add New Trainboard Package"}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Title / Zip File Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WR-Trainboard-Set-01.zip"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Railway Zone *</label>
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
              <label className="block font-semibold text-gray-700 mb-1">File Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="2.5 MB"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Zone Full Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="Western Railway"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Download URL</label>
            <input
              type="text"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="/downloads/trainboards/WR/filename.zip"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
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

// --- SUB-COMPONENT: OFFER FORM MODAL ---
function OfferFormModal({
  isOpen,
  offer,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  offer: any | null;
  onClose: () => void;
  onSave: (e: React.FormEvent, formValues: any) => void;
}) {
  const [title, setTitle] = useState(offer?.title || "");
  const [description, setDescription] = useState(offer?.description || "");
  const [discountPercent, setDiscountPercent] = useState(offer?.discountPercent ?? 20);
  const [targetType, setTargetType] = useState(offer?.targetType || "COACHES");
  const [badgeText, setBadgeText] = useState(offer?.badgeText || "SPECIAL OFFER");
  const [isActive, setIsActive] = useState(offer?.isActive ?? true);
  const [endDate, setEndDate] = useState(
    offer?.endDate ? new Date(offer.endDate).toISOString().split("T")[0] : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    onSave(e, {
      title,
      description,
      discountPercent: parseFloat(discountPercent.toString()) || 0,
      targetType,
      badgeText,
      isActive,
      endDate: endDate ? new Date(endDate) : null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-[#0B2852]">
            {offer ? "Edit Promotional Offer" : "Create New Promotional Offer"}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Offer Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festival Offer"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Discount % *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="SPECIAL OFFER"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Scope</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              >
                <option value="ALL">All Items</option>
                <option value="COACHES">Coaches Only</option>
                <option value="TRAINBOARDS">Trainboards Only</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Festival offer ends tonight at 11:45 PM. Please visit shop page."
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveOffer"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-[#0B2852]"
            />
            <label htmlFor="isActiveOffer" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Enable offer immediately on public website
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
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
              {offer ? "Save Offer" : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: SLIDE ADMIN MODAL ---
function SlideAdminModal({
  isOpen,
  slide,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  slide: any | null;
  onClose: () => void;
  onSave: (e: React.FormEvent, formValues: any, isNew: boolean) => void;
}) {
  const [title, setTitle] = useState(slide?.title || "");
  const [subtitle, setSubtitle] = useState(
    slide?.subtitle || "(Coming Soon) Please Sign Up to purchase and download these addons!!!!!"
  );
  const [description, setDescription] = useState(
    slide?.description || "High-precision Indian Railway rolling stock model built for Open Rails and MSTS."
  );
  const [image, setImage] = useState(slide?.image || "/assets/products/chaircar_standard.png");
  const [buttonText, setButtonText] = useState(slide?.buttonText || "View Product Details");
  const [buttonUrl, setButtonUrl] = useState(slide?.buttonUrl || "/shop");
  const [order, setOrder] = useState<number>(slide?.order || 1);
  const [isActive, setIsActive] = useState<boolean>(slide?.isActive !== undefined ? slide.isActive : true);
  const [isUploading, setIsUploading] = useState(false);

  const presets = [
    { label: "Academy Sleeper", url: "/assets/products/vg_academy_sleeper.avif" },
    { label: "Humsafar V2", url: "/assets/products/humsafar_v2.avif" },
    { label: "Sleeper V2", url: "/assets/products/sleeper_v2.avif" },
    { label: "Chair Car", url: "/assets/products/chaircar_standard.png" },
    { label: "Vistadome", url: "/assets/products/vistadome_standard.png" },
    { label: "Amrit Bharat", url: "/assets/products/amrit_bharat.png" },
    { label: "Bangladesh", url: "/assets/products/bangladesh_coaches.png" },
    { label: "PNB Livery", url: "/assets/products/pnb_livery.png" },
    { label: "Tricolour", url: "/assets/products/indian_tricolour.avif" },
    { label: "Vistadome Livery", url: "/assets/products/vistadome_livery.png" },
    { label: "WHR Route V2", url: "/assets/products/whr_route_v2.png" },
    { label: "Maitree Pack", url: "/assets/projects/05_vg_lhb_bangladesh.png" },
  ];

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
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSave(
      e,
      {
        id: slide?.id,
        title,
        subtitle,
        description,
        image,
        buttonText,
        buttonUrl,
        order,
        isActive,
      },
      !slide
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 my-8 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-[#0B2852]">
            {slide ? `Edit Slide: ${slide.title}` : "Add New Home Page Slide"}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Slide Title / Heading *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VG LHB ACADEMY LIVERY SLEEPER COACHES"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Subtitle (Orange Highlight)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="(Coming Soon) Please Sign Up..."
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hyper-realistic LHB coach model..."
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          {/* Slide Image Upload & Preview */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <label className="block font-bold text-gray-700">Slide Image (Upload or Preset)</label>
            <div className="flex gap-4 items-center">
              <div className="w-28 h-18 bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="px-3 py-1.5 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-lg font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5 text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? "Uploading..." : "Upload from Computer"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or enter image URL"
                  className="w-full p-2 border rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 block mb-1">Or choose an official preset:</span>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {presets.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      image === p.url
                        ? "bg-[#0B2852] text-white border-[#0B2852]"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Button Text & Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="View Product Details"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Button Destination URL</label>
              <input
                type="text"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="/shop/product-slug"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isSlideActiveCheck"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#0B2852]"
              />
              <label htmlFor="isSlideActiveCheck" className="font-semibold text-gray-700 cursor-pointer">
                Active & Published on Home Slider
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
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
              {slide ? "Save Changes" : "Create Slide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
