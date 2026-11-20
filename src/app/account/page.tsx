"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, 
  Package, 
  Download, 
  LifeBuoy, 
  LogOut, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Train,
  CheckCircle2,
  Clock
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ticket submission state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState("TECHNICAL");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  useEffect(() => {
    // 1. Fetch current user
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/login?redirect=/account");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        // 2. Fetch orders
        return fetch("/api/orders");
      })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        // 3. Fetch downloads
        return fetch("/api/downloads");
      })
      .then((res) => (res.ok ? res.json() : { userEntitlements: [] }))
      .then((data) => {
        if (data.userEntitlements) setEntitlements(data.userEntitlements);
      })
      .catch((err) => {
        console.error("Account fetch error", err);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTicketSubject("");
    setTicketMessage("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#041229] flex items-center justify-center p-4 font-futura">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-gray-500 font-futura">Loading Member Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-[#041229] pb-20 font-futura">
      {/* Header Banner */}
      <div className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#041229] flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-normal text-[#041229]">{user.name}</h1>
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold uppercase">
                    {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-full bg-[#041229] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-black transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="bg-railway-card p-4 rounded-2xl border border-railway-border space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === "profile"
                  ? "bg-railway-accent text-white shadow-md shadow-red-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              Member Profile
            </button>

            <button
              onClick={() => setActiveTab("downloads")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === "downloads"
                  ? "bg-railway-accent text-white shadow-md shadow-red-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Download className="w-4 h-4" />
                My Downloads
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {entitlements.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === "orders"
                  ? "bg-railway-accent text-white shadow-md shadow-red-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                Order History
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === "support"
                  ? "bg-railway-accent text-white shadow-md shadow-red-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              Support & Helpdesk
            </button>

            <Link
              href="/shop"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left border-t border-railway-border/60 pt-3 mt-1"
            >
              <Train className="w-4 h-4 text-[#39FF00]" />
              Browse Shop & Coaches
            </Link>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-3">
            {/* 1. Member Profile */}
            {activeTab === "profile" && (
              <div className="bg-railway-card p-6 sm:p-8 rounded-2xl border border-railway-border space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-railway-border/60 pb-3">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Full Name</span>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Email Address</span>
                    <p className="text-sm font-semibold text-white">{user.email}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Phone Number</span>
                    <p className="text-sm font-semibold text-white">{user.phone || "Not provided"}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Country</span>
                    <p className="text-sm font-semibold text-white">{user.country || "India"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Account Status: </span>
                    <strong className="text-emerald-400">Active & Verified</strong>
                  </div>
                  <span className="text-slate-500 font-mono">
                    Member Since: {formatDate(user.createdAt || new Date())}
                  </span>
                </div>
              </div>
            )}

            {/* 2. My Downloads */}
            {activeTab === "downloads" && (
              <div className="bg-railway-card p-6 sm:p-8 rounded-2xl border border-railway-border space-y-6">
                <div className="flex items-center justify-between border-b border-railway-border/60 pb-3">
                  <h2 className="text-lg font-bold text-white">Your Licensed Digital Files</h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {entitlements.length} Active Entitlement(s)
                  </span>
                </div>

                {entitlements.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <p className="text-xs text-slate-400">
                      You have not purchased any premium packages yet.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-5 py-2.5 rounded-xl bg-railway-accent text-white font-bold text-xs shadow-md shadow-red-950"
                    >
                      Browse Simulation Shop
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entitlements.map((ent) => (
                      <div
                        key={ent.id}
                        className="p-4 rounded-xl bg-railway-darkest border border-railway-border/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-slate-600 transition-colors"
                      >
                        <div>
                          <span className="text-[10px] text-railway-accent font-bold uppercase block">
                            {ent.product?.name}
                          </span>
                          <h4 className="font-bold text-sm text-white">
                            {ent.productFile?.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Format: {ent.productFile?.fileFormat} • Size: {ent.productFile?.fileSize} • Version: {ent.productFile?.version}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-[11px] text-slate-400">
                            Downloaded {ent.downloadCount} / {ent.maxDownloads}
                          </span>
                          <a
                            href={`/api/downloads/${ent.productFileId}`}
                            download
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Order History */}
            {activeTab === "orders" && (
              <div className="bg-railway-card p-6 sm:p-8 rounded-2xl border border-railway-border space-y-6">
                <div className="flex items-center justify-between border-b border-railway-border/60 pb-3">
                  <h2 className="text-lg font-bold text-white">Order & Payment History</h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {orders.length} Order(s)
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No order history recorded on this account yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl bg-railway-darkest border border-railway-border space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-railway-border/40 pb-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-white">
                              #{order.orderNumber}
                            </span>
                            <span className="text-slate-400 text-xs ml-3">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                order.status === "PAID"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : "bg-amber-950 text-amber-400 border border-amber-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(order.finalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5 text-xs text-slate-300">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                              <span>• {item.productName}</span>
                              <span className="font-semibold text-slate-400">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-between items-center text-xs border-t border-railway-border/40">
                          <span className="text-[11px] text-slate-500">
                            Gateway: {order.paymentMethod}{" "}
                            {order.paymentId && `(${order.paymentId})`}
                          </span>
                          <Link
                            href={`/order-success/${order.id}`}
                            className="text-railway-accent hover:text-red-400 font-semibold flex items-center gap-1"
                          >
                            View Receipt <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Support Desk */}
            {activeTab === "support" && (
              <div className="bg-railway-card p-6 sm:p-8 rounded-2xl border border-railway-border space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Technical Support Helpdesk</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Have questions about Open Rails consist errors, sound packs, or download entitlement issues? Submit a support request directly.
                  </p>
                </div>

                {ticketSubmitted ? (
                  <div className="py-8 text-center space-y-3 bg-emerald-950/20 border border-emerald-800 rounded-xl p-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-sm">Ticket Submitted!</h4>
                    <p className="text-xs text-slate-300">
                      Your ticket has been forwarded to Varun Ganesh. We typically respond within 24 hours via email.
                    </p>
                    <button
                      onClick={() => setTicketSubmitted(false)}
                      className="px-4 py-2 rounded-lg bg-railway-accent text-white text-xs font-bold"
                    >
                      Open New Ticket
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white focus:outline-none focus:border-railway-accent"
                      >
                        <option value="TECHNICAL">Technical Simulation Issue (.wag / .eng)</option>
                        <option value="INSTALLATION">Installation Assistance</option>
                        <option value="DOWNLOAD">Download / File Extraction Issue</option>
                        <option value="BILLING">Billing & Orders</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g. Open Rails crash when loading Shatabdi consist"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white focus:outline-none focus:border-railway-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Detailed Description & Error Log
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Please include simulator version (e.g. Open Rails 1.4 or 1.5.1) and any error text..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-railway-darkest border border-railway-border text-white focus:outline-none focus:border-railway-accent"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-railway-accent hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-950 transition-colors"
                    >
                      Submit Support Ticket
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-railway-darkest text-slate-400 p-8 text-center text-xs">Loading member account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
