"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  UserX
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
  currentAdmin,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "projects" | "orders" | "customers" | "enquiries" | "settings"
  >("overview");

  // State management
  const [products, setProducts] = useState(initialProducts);
  const [projects, setProjects] = useState(initialProjects);
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [settings, setSettings] = useState(initialSettings || {});

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [rejectionModalUser, setRejectionModalUser] = useState<any | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");

  // Status message
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + (o.finalAmount || 0), 0);
  const paidOrdersCount = orders.filter((o) => o.status === "PAID").length;
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "NEW").length;
  const pendingUsersCount = customers.filter((c) => c.status === "PENDING_APPROVAL").length;

  // --- Product Handlers ---
  const handleSaveProduct = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update product");

        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formValues } : p)));
        setEditingProduct(null);
        showToast("Product updated successfully!");
      } else {
        // Create product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product");

        setProducts([data.product, ...products]);
        setIsAddProductOpen(false);
        showToast("New product created and published!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        showToast("Product deleted successfully.");
      }
    } catch (err) {
      showToast("Failed to delete product.", true);
    }
  };

  // --- Project Handlers ---
  const handleSaveProject = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update project");

        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...formValues } : p)));
        setEditingProject(null);
        showToast("Project updated successfully!");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create project");

        setProjects([...projects, data.project]);
        setIsAddProjectOpen(false);
        showToast("New project published to catalog!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        showToast("Project deleted.");
      }
    } catch (err) {
      showToast("Failed to delete project.", true);
    }
  };

  // --- Order Status Handler ---
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        showToast(`Order status updated to ${status}`);
      }
    } catch (err) {
      showToast("Failed to update order status", true);
    }
  };

  // --- Enquiry Status Handler ---
  const handleUpdateEnquiryStatus = async (enquiryId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e)));
        showToast(`Enquiry marked as ${status}`);
      }
    } catch (err) {
      showToast("Failed to update enquiry", true);
    }
  };

  // --- Settings Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Website settings & Legal pages updated!");
      }
    } catch (err) {
      showToast("Failed to save settings", true);
    }
  };

  // --- User Approval & Status Handlers ---
  const handleUserStatusAction = async (userId: string, action: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user status");

      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === userId) {
            let nextStatus = c.status;
            if (action === "approve" || action === "reactivate") nextStatus = "APPROVED";
            else if (action === "reject") nextStatus = "REJECTED";
            else if (action === "suspend") nextStatus = "SUSPENDED";

            return {
              ...c,
              status: nextStatus,
              rejectionReason: action === "reject" ? reason : c.rejectionReason,
              approvedAt: action === "approve" ? new Date().toISOString() : c.approvedAt,
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      setCustomers((prev) => prev.filter((c) => c.id !== userId));
      showToast("User account deleted successfully");
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  return (
    <div className="min-h-screen bg-railway-darkest text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="py-8 bg-railway-dark border-b border-railway-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-railway-accent to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-950 border border-red-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  VG Admin Command Center
                </h1>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong>{currentAdmin.name}</strong> ({currentAdmin.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border ${
            toastMsg.isError
              ? "bg-red-950 text-red-200 border-red-800"
              : "bg-emerald-950 text-emerald-200 border-emerald-800"
          }`}
        >
          {toastMsg.isError ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-railway-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview Stats
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "products"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "projects"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "orders"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "customers"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Users &amp; Approvals ({customers.length})
            {pendingUsersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                {pendingUsersCount} PENDING
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "enquiries"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Enquiries Desk {newEnquiriesCount > 0 && `(${newEnquiriesCount})`}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === "settings"
                ? "bg-railway-accent text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings & Legal Pages
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-railway-card border border-railway-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Total Store Revenue
                </span>
                <p className="text-2xl font-black text-emerald-400">
                  {formatCurrency(totalRevenue)}
                </p>
                <span className="text-[11px] text-slate-400">
                  {paidOrdersCount} Paid Transactions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-railway-card border border-railway-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Total Orders
                </span>
                <p className="text-2xl font-black text-white">{orders.length}</p>
                <span className="text-[11px] text-amber-400">
                  {pendingOrdersCount} Pending Checkout
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-railway-card border border-railway-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Total Products & Add-ons
                </span>
                <p className="text-2xl font-black text-white">{products.length}</p>
                <span className="text-[11px] text-slate-400">
                  Across {categories.length} Categories
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-railway-card border border-railway-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Registered Members
                </span>
                <p className="text-2xl font-black text-white">{customers.length}</p>
                <span className="text-[11px] text-slate-400">
                  {newEnquiriesCount} New Enquiries
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-railway-card rounded-2xl border border-railway-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-railway-border/60 pb-3">
                <h3 className="font-bold text-white text-base">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-railway-accent hover:text-red-400 font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-500 uppercase border-b border-railway-border/40 font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5">Order No</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-railway-border/40">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-mono font-semibold text-white">
                          #{ord.orderNumber}
                        </td>
                        <td>
                          <span className="font-semibold text-white block">
                            {ord.customerName}
                          </span>
                          <span className="text-slate-500 text-[10px]">{ord.customerEmail}</span>
                        </td>
                        <td className="text-slate-400">{formatDate(ord.createdAt)}</td>
                        <td className="font-bold text-emerald-400">
                          {formatCurrency(ord.finalAmount)}
                        </td>
                        <td>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === "PAID"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-slate-300 hover:text-white underline text-xs"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-railway-card border border-railway-border text-white text-xs placeholder-slate-500"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>

            <div className="bg-railway-card rounded-2xl border border-railway-border overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 uppercase border-b border-railway-border/60 font-mono text-[10px] bg-railway-dark">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>File Format</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th className="text-right px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-railway-border/40">
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images?.[0]?.url || "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=200"}
                              alt={prod.name}
                              className="w-10 h-8 rounded object-cover bg-slate-900 border border-white/10"
                            />
                            <div>
                              <span>{prod.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                SKU: {prod.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-slate-300">{prod.category?.name}</td>
                        <td className="font-bold text-emerald-400">
                          {prod.isFree ? "FREE" : formatCurrency(prod.salePrice ?? prod.regularPrice)}
                        </td>
                        <td className="font-mono text-slate-400">{prod.fileSize || "100 MB"}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300">
                            {prod.status}
                          </span>
                        </td>
                        <td>
                          {prod.isFeatured ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-slate-600">No</span>
                          )}
                        </td>
                        <td className="text-right px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsAddProductOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400"
                              title="Delete Product"
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
        )}

        {/* TAB 3: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">Projects Catalog Manager</h3>
                <p className="text-xs text-slate-400">
                  Manage the 7 signature sections. Changes reflect immediately on `/projects`.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAddProjectOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-railway-card border border-railway-border overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={proj.mainImage}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-railway-accent text-white font-black text-xs">
                      {proj.projectNo}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-slate-300 font-semibold text-[10px] border border-white/10">
                      {proj.status}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {proj.subtitle || proj.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-railway-border/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Order: {proj.order}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsAddProjectOpen(true);
                          }}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded bg-red-950/40 hover:bg-red-950 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-railway-card border border-railway-border text-white text-xs placeholder-slate-500"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-railway-card border border-railway-border text-white text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Total Orders: <strong>{orders.length}</strong>
              </span>
            </div>

            <div className="bg-railway-card rounded-2xl border border-railway-border overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 uppercase border-b border-railway-border/60 font-mono text-[10px] bg-railway-dark">
                  <tr>
                    <th className="py-3 px-4">Order No</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th className="text-right px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-railway-border/40">
                  {orders
                    .filter((o) => {
                      if (orderFilter !== "ALL" && o.status !== orderFilter) return false;
                      if (!orderSearch.trim()) return true;
                      const q = orderSearch.toLowerCase();
                      return (
                        o.orderNumber.toLowerCase().includes(q) ||
                        o.customerName.toLowerCase().includes(q) ||
                        o.customerEmail.toLowerCase().includes(q)
                      );
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono font-semibold text-white">
                          #{ord.orderNumber}
                        </td>
                        <td className="font-semibold text-white">{ord.customerName}</td>
                        <td className="text-slate-400">{ord.customerEmail}</td>
                        <td className="font-bold text-emerald-400">
                          {formatCurrency(ord.finalAmount)}
                        </td>
                        <td className="font-mono text-slate-400">{ord.paymentMethod}</td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-railway-darkest border ${
                              ord.status === "PAID"
                                ? "text-emerald-400 border-emerald-800"
                                : ord.status === "REFUNDED"
                                ? "text-red-400 border-red-800"
                                : "text-amber-400 border-amber-800"
                            }`}
                          >
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REFUNDED">REFUNDED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="text-right px-4">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-slate-300 hover:text-white underline text-xs"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: USER APPROVAL & CUSTOMERS MANAGEMENT */}
        {activeTab === "customers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-railway-card p-4 rounded-2xl border border-railway-border">
              <div>
                <h3 className="font-bold text-white text-base">User Approvals &amp; Member Directory</h3>
                <p className="text-xs text-slate-400">Review registrations, authorize customer accounts, and manage member statuses.</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "ALL", label: `All (${customers.length})` },
                  { key: "PENDING_APPROVAL", label: `Pending (${customers.filter((c) => c.status === "PENDING_APPROVAL").length})` },
                  { key: "APPROVED", label: `Approved (${customers.filter((c) => c.status === "APPROVED").length})` },
                  { key: "REJECTED", label: `Rejected (${customers.filter((c) => c.status === "REJECTED").length})` },
                  { key: "SUSPENDED", label: `Suspended (${customers.filter((c) => c.status === "SUSPENDED").length})` },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setUserStatusFilter(pill.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userStatusFilter === pill.key
                        ? "bg-railway-accent text-white shadow-sm"
                        : "bg-railway-dark text-slate-400 hover:text-white"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email, phone, city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-railway-card border border-railway-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-railway-accent"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Users Table */}
            <div className="bg-railway-card rounded-2xl border border-railway-border overflow-x-auto shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 uppercase border-b border-railway-border/60 font-mono text-[10px] bg-railway-dark">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th>Contact &amp; Location</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th className="text-right px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-railway-border/40">
                  {customers
                    .filter((c) => {
                      if (userStatusFilter !== "ALL" && c.status !== userStatusFilter) return false;
                      if (!userSearch) return true;
                      const q = userSearch.toLowerCase();
                      return (
                        c.name?.toLowerCase().includes(q) ||
                        c.email?.toLowerCase().includes(q) ||
                        c.phone?.toLowerCase().includes(q) ||
                        c.city?.toLowerCase().includes(q) ||
                        c.country?.toLowerCase().includes(q)
                      );
                    })
                    .map((cust) => (
                      <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white text-sm">{cust.name}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{cust.email}</div>
                          {cust.rejectionReason && cust.status === "REJECTED" && (
                            <div className="text-[10px] text-red-400 mt-1 italic">
                              Reason: {cust.rejectionReason}
                            </div>
                          )}
                        </td>

                        <td className="text-slate-300">
                          <div>{cust.phone || "No phone"}</div>
                          <div className="text-slate-500 text-[11px]">
                            {cust.city ? `${cust.city}, ` : ""}{cust.country || "India"}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              cust.role === "ADMIN"
                                ? "bg-red-950 text-red-400 border border-red-800"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {cust.role}
                          </span>
                        </td>

                        <td>
                          {cust.status === "PENDING_APPROVAL" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
                              <Clock className="w-3 h-3" />
                              Pending Approval
                            </span>
                          ) : cust.status === "APPROVED" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <Check className="w-3 h-3" />
                              Approved
                            </span>
                          ) : cust.status === "REJECTED" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-800">
                              <UserX className="w-3 h-3" />
                              Rejected
                            </span>
                          ) : cust.status === "SUSPENDED" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                              <Ban className="w-3 h-3" />
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400">
                              Approved
                            </span>
                          )}
                        </td>

                        <td className="text-slate-400 font-mono text-[11px]">
                          {formatDate(cust.createdAt)}
                        </td>

                        <td className="text-right px-4 space-x-2 whitespace-nowrap">
                          {cust.status === "PENDING_APPROVAL" && (
                            <>
                              <button
                                onClick={() => handleUserStatusAction(cust.id, "approve")}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold shadow-sm transition-all"
                                title="Approve registration application"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectionModalUser(cust);
                                  setRejectionReasonText("");
                                }}
                                className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-md text-[11px] font-bold shadow-sm transition-all"
                                title="Reject registration application"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {cust.status === "APPROVED" && cust.role !== "ADMIN" && (
                            <button
                              onClick={() => handleUserStatusAction(cust.id, "suspend")}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[11px] font-medium transition-all"
                              title="Temporarily suspend access"
                            >
                              Suspend
                            </button>
                          )}

                          {(cust.status === "REJECTED" || cust.status === "SUSPENDED") && (
                            <button
                              onClick={() => handleUserStatusAction(cust.id, "reactivate")}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-[11px] font-bold shadow-sm transition-all"
                              title="Reactivate and approve user"
                            >
                              Reactivate
                            </button>
                          )}

                          {cust.role !== "ADMIN" && (
                            <button
                              onClick={() => handleDeleteUser(cust.id)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors inline-flex items-center"
                              title="Delete user record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: ENQUIRIES DESK */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Contact & Service Enquiries</h3>
              <span className="text-xs text-slate-400 font-mono">
                {enquiries.length} Enquiries Total
              </span>
            </div>

            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 rounded-2xl bg-railway-card border border-railway-border space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-railway-border/40 pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase mr-2">
                        {enq.enquiryType}
                      </span>
                      <strong className="text-white text-sm">{enq.subject}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">
                        {formatDate(enq.createdAt)}
                      </span>
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-railway-darkest border ${
                          enq.status === "RESOLVED"
                            ? "text-emerald-400 border-emerald-800"
                            : "text-amber-400 border-amber-800"
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {enq.message}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap gap-4 border-t border-railway-border/40">
                    <span>From: <strong>{enq.name}</strong></span>
                    <span>Email: <a href={`mailto:${enq.email}`} className="text-slate-300 underline">{enq.email}</a></span>
                    {enq.phone && <span>Phone: {enq.phone}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & LEGAL PAGES */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="bg-railway-card p-6 sm:p-8 rounded-2xl border border-railway-border space-y-6">
              <h3 className="font-bold text-white text-base border-b border-railway-border/60 pb-3">
                Website Branding & Legal Policies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName || ""}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Founder / Lead Modeler Name
                  </label>
                  <input
                    type="text"
                    value={settings.founderName || ""}
                    onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber || ""}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">
                    Independent Railway Simulator Disclaimer
                  </label>
                  <textarea
                    rows={3}
                    value={settings.disclaimerText || ""}
                    onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">
                    Terms & Conditions Content (Markdown / Plain Text)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.termsContent || ""}
                    onChange={(e) => setSettings({ ...settings, termsContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">
                    End User License Agreement (EULA)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.eulaContent || ""}
                    onChange={(e) => setSettings({ ...settings, eulaContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Website & Legal Settings
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isAddProductOpen && (
        <ProductFormModal
          categories={categories}
          initialValues={editingProduct}
          onClose={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Project Add / Edit Modal */}
      {isAddProjectOpen && (
        <ProjectFormModal
          initialValues={editingProject}
          onClose={() => {
            setIsAddProjectOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg bg-railway-darkest border border-railway-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white">
              Order #{selectedOrder.orderNumber}
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
              <p><strong>Total Amount:</strong> {formatCurrency(selectedOrder.finalAmount)}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} {selectedOrder.paymentId && `(${selectedOrder.paymentId})`}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>

            <div className="pt-3 border-t border-railway-border space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Items Ordered:</span>
              {selectedOrder.items?.map((it: any) => (
                <div key={it.id} className="text-xs text-white flex justify-between">
                  <span>{it.productName}</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(it.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Rejection Reason Modal */}
      {rejectionModalUser && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRejectionModalUser(null)}
        >
          <div
            className="w-full max-w-md bg-railway-darkest border border-railway-border rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setRejectionModalUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Reject Registration</h3>
              <p className="text-xs text-slate-400">
                Rejecting application for <strong className="text-white">{rejectionModalUser.name}</strong> ({rejectionModalUser.email}).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Rejection (optional, will be sent to user):
              </label>
              <textarea
                rows={3}
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="e.g. Incomplete address details or unverified contact information."
                className="w-full p-3 rounded-xl bg-railway-card border border-railway-border text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUserStatusAction(rejectionModalUser.id, "reject", rejectionReasonText);
                  setRejectionModalUser(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Product Add/Edit Modal
function ProductFormModal({ categories, initialValues, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    sku: initialValues?.sku || "",
    shortDesc: initialValues?.shortDesc || "",
    description: initialValues?.description || "",
    regularPrice: initialValues?.regularPrice || 799,
    salePrice: initialValues?.salePrice || 599,
    isFree: initialValues?.isFree || false,
    categoryId: initialValues?.categoryId || categories[0]?.id || "",
    compatibility: initialValues?.compatibility || "Open Rails / MSTS",
    version: initialValues?.version || "v2.0",
    fileSize: initialValues?.fileSize || "140 MB",
    status: initialValues?.status || "AVAILABLE",
    isFeatured: initialValues?.isFeatured || false,
    imageUrl: initialValues?.images?.[0]?.url || "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800",
    fileName: initialValues?.files?.[0]?.fileName || "VG_LHB_Package.zip",
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-railway-darkest border border-railway-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-white">
          {initialValues ? "Edit Product" : "Add New Railway Product"}
        </h3>

        <form onSubmit={(e) => onSave(e, formData)} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              >
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Regular Price (₹)</label>
              <input
                type="number"
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sale Price (₹)</label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Compatibility</label>
              <input
                type="text"
                value={formData.compatibility}
                onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">File Size</label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded bg-railway-dark text-railway-accent"
                />
                <span className="text-white">Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="rounded bg-railway-dark text-railway-accent"
                />
                <span className="text-white">Free Community Add-on</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Project Add/Edit Modal
function ProjectFormModal({ initialValues, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    projectNo: initialValues?.projectNo || "08",
    title: initialValues?.title || "",
    subtitle: initialValues?.subtitle || "",
    description: initialValues?.description || "",
    fullContent: initialValues?.fullContent || "",
    mainImage: initialValues?.mainImage || "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800",
    status: initialValues?.status || "COMPLETED",
    compatibility: initialValues?.compatibility || "Open Rails 1.4+, MSTS Bin 1.8",
    order: initialValues?.order || 8,
    isPublished: initialValues?.isPublished !== undefined ? initialValues.isPublished : true,
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-railway-darkest border border-railway-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-white">
          {initialValues ? `Edit Project: ${initialValues.title}` : "Add New Project"}
        </h3>

        <form onSubmit={(e) => onSave(e, formData)} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Number *</label>
              <input
                type="text"
                required
                value={formData.projectNo}
                onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Main Image URL</label>
              <input
                type="url"
                value={formData.mainImage}
                onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              >
                <option value="COMPLETED">COMPLETED</option>
                <option value="WORK_IN_PROGRESS">WORK_IN_PROGRESS</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Catalog Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-railway-dark border border-railway-border text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
