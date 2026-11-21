"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Eye,
  Check,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Tag,
  Ban,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Camera,
  Layers,
  Search,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { formatCurrency } from "@/lib/utils";
import QuickViewModal from "@/components/QuickViewModal";

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Category Filtering & Search State
  const initialCatParam = searchParams?.get("category") || "all";
  const initialSearchParam = searchParams?.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCatParam);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchParam);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams?.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Admin Mode State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteProductModal, setDeleteProductModal] = useState<{ id: string; name: string } | null>(null);
  const [priceModalProduct, setPriceModalProduct] = useState<any | null>(null);
  const [renameModalProduct, setRenameModalProduct] = useState<any | null>(null);
  const [imageModalProduct, setImageModalProduct] = useState<any | null>(null);
  const [offerModalProduct, setOfferModalProduct] = useState<any | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check Admin Login Status from localStorage & API
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
        } catch (e) { }
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
    } catch (e) { }
  };

  useEffect(() => {
    checkAuth();
    const handleAuthEvent = () => checkAuth();
    window.addEventListener("vg-auth-changed", handleAuthEvent);
    return () => window.removeEventListener("vg-auth-changed", handleAuthEvent);
  }, []);

  // Fallback catalog
  const fallbackProducts = [
    {
      id: "prod-whr",
      slug: "whr-route-v2-ahmedabad-update",
      name: "WHR Route (V2 Ahmedabad Update)",
      badge: "V2.0",
      image: "/assets/products/whr_route_v2.png",
      regularPrice: 1200,
      salePrice: 1000,
      compatibility: "Open Rails",
      categoryName: "Railway Routes",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-academy",
      slug: "vg-lhb-vg-academy-livery-sleeper-coaches",
      name: "VG LHB VG ACADEMY LIVERY SLEEPER COACHES",
      badge: "New Arrival",
      image: "/assets/products/vg_academy_sleeper.avif",
      regularPrice: 1000,
      salePrice: 800,
      compatibility: "Open Rails / MSTS",
      categoryName: "Sleeper Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-humsafar",
      slug: "vg-lhb-humsafar-coaches-v2",
      name: "VG LHB HUMSAFAR COACHES V2",
      badge: "V2.0",
      image: "/assets/products/humsafar_v2.avif",
      regularPrice: 600,
      salePrice: 500,
      compatibility: "Open Rails / MSTS",
      categoryName: "Humsafar Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-sleeper",
      slug: "vg-lhb-sleeper-coaches-v2-update",
      name: "VG LHB SLEEPER COACHES V2",
      badge: "V2.0",
      image: "/assets/products/sleeper_v2.avif",
      regularPrice: 1200,
      salePrice: 1000,
      compatibility: "Open Rails / MSTS",
      categoryName: "Sleeper Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-tricolour",
      slug: "vg-lhb-indian-tricolour-coaches",
      name: "VG LHB INDIAN TRICOLOUR COACHES",
      badge: "New Arrival",
      image: "/assets/products/indian_tricolour.avif",
      regularPrice: 200,
      salePrice: 100,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-amrit",
      slug: "vg-lhb-amrit-bharat-coaches",
      name: "VG LHB AMRIT BHARAT COACHES",
      badge: "V1.0",
      image: "/assets/products/amrit_bharat.png",
      regularPrice: 500,
      salePrice: 300,
      compatibility: "Open Rails / MSTS",
      categoryName: "LHB Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-bangladesh",
      slug: "vg-lhb-bangladesh-coaches",
      name: "VG LHB BANGLADESH COACHES",
      badge: "V1.0",
      image: "/assets/products/bangladesh_coaches.png",
      regularPrice: 500,
      salePrice: 300,
      compatibility: "Open Rails / MSTS",
      categoryName: "International Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-pnb",
      slug: "vg-lhb-pnb-livery-chaircar-coaches",
      name: "VG LHB PNB LIVERY CHAIRCAR COACHES",
      badge: "V1.0",
      image: "/assets/products/chaircar_pnb.png",
      regularPrice: 600,
      salePrice: 400,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-vistadome-livery",
      slug: "vg-lhb-vistadome-livery-coaches",
      name: "VG LHB VISTADOME LIVERY COACHES",
      badge: "V2.0",
      image: "/assets/products/vistadome_livery.png",
      regularPrice: 1200,
      salePrice: 1000,
      compatibility: "Open Rails / MSTS",
      categoryName: "Vistadome Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-vistadome-std",
      slug: "vg-lhb-vistadome-coaches",
      name: "VG LHB VISTADOME COACHES",
      badge: "V1.0",
      image: "/assets/products/vistadome_standard.png",
      regularPrice: 800,
      salePrice: 600,
      compatibility: "Open Rails / MSTS",
      categoryName: "Vistadome Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-chaircar-std",
      slug: "vg-lhb-coaches",
      name: "VG LHB CHAIRCAR COACHES",
      badge: "V1.0",
      image: "/assets/products/chaircar_standard.png",
      regularPrice: 600,
      salePrice: 500,
      compatibility: "Open Rails / MSTS",
      categoryName: "Chair Car Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
    {
      id: "prod-maitree",
      slug: "vg-br-lhb-maitree-v1-5",
      name: "VG BR LHB MAITREE EXPRESS PACK",
      badge: "V1.5",
      image: "/assets/projects/05_vg_lhb_bangladesh.png",
      regularPrice: 400,
      salePrice: 250,
      compatibility: "Open Rails / MSTS",
      categoryName: "International Coaches",
      status: "AVAILABLE",
      stockQuantity: 999,
    },
  ];

  const [products, setProducts] = useState<any[]>(
    initialProducts && initialProducts.length > 0
      ? initialProducts.map((p) => {
        const hasOffer = p.salePrice !== null && p.salePrice !== undefined && p.salePrice < p.regularPrice;
        const isOutOfStock = p.status === "OUT_OF_STOCK";
        const isComingSoon = p.status === "COMING_SOON";
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          sku: p.sku || `VG-${p.id.slice(-5)}`,
          badge: isOutOfStock
            ? "Out of Stock"
            : isComingSoon
              ? "Coming Soon"
              : hasOffer
                ? "Special Offer"
                : p.isNewArrival
                  ? "New Arrival"
                  : p.version || "V1.0",
          image: p.images?.[0]?.url || "/assets/products/chaircar_standard.png",
          regularPrice: p.regularPrice,
          salePrice: p.salePrice,
          compatibility: p.compatibility || "Open Rails / MSTS",
          categoryId: p.categoryId,
          categoryName: p.category?.name || "LHB Coaches",
          status: p.status,
          stockQuantity: p.stockQuantity ?? 100,
          description: p.description || "",
          isOutOfStock,
          isComingSoon,
        };
      })
      : fallbackProducts
  );

  // Admin Action Saving Indicator
  const [isSavingAction, setIsSavingAction] = useState<boolean>(false);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("vg_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const persistToLocalStorage = (productId: string, partial: any) => {
    try {
      const local = localStorage.getItem("vg_saved_products");
      const current = local ? JSON.parse(local) : {};
      current[productId] = { ...(current[productId] || {}), ...partial };
      localStorage.setItem("vg_saved_products", JSON.stringify(current));
    } catch (e) { }
  };

  const formatProductFromApi = (p: any) => {
    const isOutOfStock = p.status === "OUT_OF_STOCK" || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
    const isComingSoon = p.status === "COMING_SOON";
    const hasOffer = Boolean(p.isSpecialOffer) || (p.salePrice !== null && p.salePrice !== undefined && p.salePrice < p.regularPrice);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku || `VG-${p.id.slice(-5)}`,
      badge: isOutOfStock
        ? "Out of Stock"
        : isComingSoon
          ? "Coming Soon"
          : hasOffer
            ? (p.specialOfferText || "Special Offer")
            : p.isNewArrival
              ? "New Arrival"
              : p.version || "V1.0",
      image: p.images?.[0]?.url || p.image || "/assets/products/chaircar_standard.png",
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      compatibility: p.compatibility || "Open Rails / MSTS",
      categoryId: p.categoryId,
      categoryName: p.category?.name || p.categoryName || "LHB Coaches",
      status: p.status,
      stockQuantity: p.stockQuantity ?? 100,
      description: p.description || "",
      isOutOfStock,
      isComingSoon,
    };
  };

  // Revalidate from live database and sync across tabs, passenger logins & refreshes
  useEffect(() => {
    // 1. Instantly merge any saved overrides from localStorage
    try {
      const local = localStorage.getItem("vg_saved_products");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object") {
          setProducts((prev) =>
            prev.map((p) => {
              if (!parsed[p.id]) return p;
              const merged = { ...p, ...parsed[p.id] };
              return formatProductFromApi(merged);
            })
          );
        }
      }
    } catch (e) { }

    // 2. Fetch fresh real-time database state from /api/products
    const loadProductsFromApi = () => {
      fetch(`/api/products?nocache=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.products && data.products.length > 0) {
            setProducts(data.products.map(formatProductFromApi));
          }
        })
        .catch((e) => console.log("Using cached products"));
    };

    loadProductsFromApi();

    const handleFocus = () => loadProductsFromApi();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  // Handlers for Admin Operations
  const handleSaveProduct = async (e: React.FormEvent, formValues: any) => {
    e.preventDefault();
    if (isSavingAction) return;
    setIsSavingAction(true);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update product");

        const confirmed = data.product || formValues;
        persistToLocalStorage(editingProduct.id, {
          ...confirmed,
          ...(formValues.imageUrl && { image: formValues.imageUrl }),
        });

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                ...p,
                ...formValues,
                regularPrice: confirmed.regularPrice !== undefined ? confirmed.regularPrice : p.regularPrice,
                salePrice: confirmed.salePrice !== undefined ? confirmed.salePrice : p.salePrice,
                image: formValues.imageUrl || p.image,
                badge:
                  formValues.status === "OUT_OF_STOCK"
                    ? "Out of Stock"
                    : formValues.status === "COMING_SOON"
                      ? "Coming Soon"
                      : formValues.salePrice && formValues.salePrice < formValues.regularPrice
                        ? "Special Offer"
                        : "V1.0",
              }
              : p
          )
        );
        setEditingProduct(null);
        showToast("Product updated successfully in live database!");
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product");

        const newP = data.product;
        const formattedNew = {
          id: newP.id,
          slug: newP.slug,
          name: newP.name,
          sku: newP.sku,
          badge:
            newP.status === "OUT_OF_STOCK"
              ? "Out of Stock"
              : newP.status === "COMING_SOON"
                ? "Coming Soon"
                : newP.salePrice && newP.salePrice < newP.regularPrice
                  ? "Special Offer"
                  : "New Arrival",
          image: formValues.imageUrl || newP.images?.[0]?.url || "/assets/products/chaircar_standard.png",
          regularPrice: newP.regularPrice,
          salePrice: newP.salePrice,
          compatibility: newP.compatibility || "Open Rails / MSTS",
          categoryId: newP.categoryId,
          categoryName: newP.category?.name || "LHB Coaches",
          status: newP.status,
          stockQuantity: newP.stockQuantity ?? 100,
          description: newP.description || "",
        };

        setProducts([formattedNew, ...products]);
        setIsAddProductOpen(false);
        showToast("New product created and live in catalog!");
      }
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductModal) return;
    const { id, name } = deleteProductModal;
    setDeleteProductModal(null);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      persistToLocalStorage(id, { _deleted: true });
      showToast(`"${name}" permanently deleted.`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleUpdateAvailability = async (prod: any, newStatus: "AVAILABLE" | "OUT_OF_STOCK" | "COMING_SOON") => {
    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newStatus,
          stockQuantity: newStatus === "OUT_OF_STOCK" ? 0 : prod.stockQuantity || 100,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      persistToLocalStorage(prod.id, {
        status: newStatus,
        stockQuantity: newStatus === "OUT_OF_STOCK" ? 0 : prod.stockQuantity || 100,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === prod.id
            ? {
              ...p,
              status: newStatus,
              isOutOfStock: newStatus === "OUT_OF_STOCK",
              isComingSoon: newStatus === "COMING_SOON",
              badge:
                newStatus === "OUT_OF_STOCK"
                  ? "Out of Stock"
                  : newStatus === "COMING_SOON"
                    ? "Coming Soon"
                    : p.salePrice && p.salePrice < p.regularPrice
                      ? "Special Offer"
                      : "Available",
            }
            : p
        )
      );
      showToast(`Saved: Marked ${prod.name} as ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleSavePriceChange = async (regularPrice: number, salePrice: number | null) => {
    if (!priceModalProduct || isSavingAction) return;
    setIsSavingAction(true);
    try {
      const res = await fetch(`/api/admin/products/${priceModalProduct.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ regularPrice, salePrice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update price");

      const confirmedRegular = data.product?.regularPrice !== undefined ? data.product.regularPrice : regularPrice;
      const confirmedSale = data.product?.salePrice !== undefined ? data.product.salePrice : salePrice;

      persistToLocalStorage(priceModalProduct.id, {
        regularPrice: confirmedRegular,
        salePrice: confirmedSale,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === priceModalProduct.id
            ? {
              ...p,
              regularPrice: confirmedRegular,
              salePrice: confirmedSale,
              badge:
                p.status === "OUT_OF_STOCK"
                  ? "Out of Stock"
                  : p.status === "COMING_SOON"
                    ? "Coming Soon"
                    : confirmedSale && confirmedSale < confirmedRegular
                      ? "Special Offer"
                      : "V1.0",
            }
            : p
        )
      );
      setPriceModalProduct(null);
      showToast(`Saved successfully: Price set to ₹${confirmedRegular.toFixed(2)}!`);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleSaveRename = async (id: string, name: string) => {
    if (isSavingAction) return;
    setIsSavingAction(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename product");

      persistToLocalStorage(id, { name });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
      setRenameModalProduct(null);
      showToast(`Saved successfully: Renamed to "${name}"!`);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleSaveImage = async (id: string, imageUrl: string) => {
    if (isSavingAction) return;
    setIsSavingAction(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product image");

      persistToLocalStorage(id, { image: imageUrl });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, image: imageUrl } : p)));
      setImageModalProduct(null);
      showToast("Saved successfully: Product image updated!");
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleSaveSpecialOffer = async (
    id: string,
    isSpecialOffer: boolean,
    specialOfferText: string,
    discountPercent: number,
    newSalePrice?: number | null
  ) => {
    if (isSavingAction) return;
    setIsSavingAction(true);
    try {
      const payload: any = {
        isSpecialOffer,
        specialOfferText,
        discountPercent,
      };
      if (newSalePrice !== undefined) {
        payload.salePrice = newSalePrice;
      }
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update special offer");

      persistToLocalStorage(id, {
        isSpecialOffer,
        specialOfferText,
        discountPercent,
        salePrice: newSalePrice !== undefined ? newSalePrice : null,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
              ...p,
              isSpecialOffer,
              badge: isSpecialOffer ? specialOfferText || "Special Offer" : p.badge,
              salePrice: newSalePrice !== undefined ? newSalePrice : p.salePrice,
            }
            : p
        )
      );
      setOfferModalProduct(null);
      showToast("Saved successfully: Special offer live in database!");
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsSavingAction(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (prod.isOutOfStock || prod.status === "OUT_OF_STOCK" || prod.status === "COMING_SOON") return;
    addToCart({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      price: prod.salePrice !== undefined && prod.salePrice !== null ? prod.salePrice : prod.regularPrice,
      regularPrice: prod.regularPrice,
      image: prod.image,
      sku: (prod.sku || prod.id).toUpperCase(),
      categoryName: prod.categoryName,
      compatibility: prod.compatibility,
      isFree: prod.salePrice === 0 || prod.regularPrice === 0,
    });
  };

  // Category Filtering & Search Configuration
  const categoryTabs = [
    { id: "all", name: "All Products" },
    { id: "lhb", name: "LHB Coaches", match: ["lhb"] },
    { id: "chair-car", name: "Chair Car", match: ["chair", "tricolour", "pnb"] },
    { id: "sleeper", name: "Sleeper", match: ["sleeper", "academy"] },
    { id: "vistadome", name: "Vistadome", match: ["vistadome"] },
    { id: "humsafar", name: "Humsafar", match: ["humsafar"] },
    { id: "bangladesh", name: "Bangladesh", match: ["bangladesh", "international", "maitree"] },
    { id: "routes", name: "Routes", match: ["route", "scenery", "whr"] },
  ];

  const filteredProducts = products.filter((prod) => {
    // 1. Category Matching
    let matchesCategory = true;
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      const activeTab = categoryTabs.find(
        (c) => c.id.toLowerCase() === selectedCategory.toLowerCase() || c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      const catKeywords = activeTab?.match || [selectedCategory.toLowerCase()];
      const targetStr = `${prod.categoryName || ""} ${prod.categoryId || ""} ${prod.name || ""} ${prod.slug || ""}`.toLowerCase();
      matchesCategory = catKeywords.some((kw) => targetStr.includes(kw.toLowerCase()));
    }

    // 2. Search Matching
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const searchTarget = `${prod.name || ""} ${prod.description || ""} ${prod.categoryName || ""} ${prod.compatibility || ""} ${prod.sku || ""}`.toLowerCase();
      matchesSearch = searchTarget.includes(q);
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-white text-[#101C32] pb-24 font-josefin">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${toastMsg.isError
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

      {/* 1. Header Sub-Bar */}
      <div className="w-full bg-[#F5F6F8] border-b border-gray-200 py-3 px-4 text-center">
        <p className="font-josefin text-[15px] sm:text-[16px] text-[#0B2852] font-medium">
          Please click on the product for more details and instant digital simulator downloads.
        </p>
      </div>

      {/* 2. Orange Announcement Marquee */}
      <div className="w-full bg-[#FF6600] text-white py-2 overflow-hidden select-none border-b border-[#E65C00] shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center mx-4 font-josefin text-[14px] sm:text-[15px] font-semibold tracking-wide">
              <span>What&apos;s New? - VG LHB VG ACADEMY LIVERY SLEEPER COACHES</span>
              <span className="text-[#39FF00] font-bold text-lg mx-3">»»</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Visible Admin Management Toolbar (Shown when Admin is logged in) */}
      {currentUser && (
        <div className="max-w-[1080px] mx-auto px-4 mt-6">
          <div className="bg-[#0B2852] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl border-2 border-[#39FF00]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#39FF00]/20 text-[#39FF00] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide uppercase">Shop Admin Management Mode</h3>
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
              {/* Toggle Admin Mode */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <span className="text-xs font-semibold text-gray-200">Admin Controls:</span>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isAdminMode
                    ? "bg-[#39FF00] text-[#101C32] shadow-sm"
                    : "bg-gray-400 text-white"
                    }`}
                >
                  {isAdminMode ? "ON" : "OFF (Visitor View)"}
                </button>
              </div>

              {/* Add Product Button */}
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductOpen(true);
                  }}
                  className="px-4 py-2 bg-[#39FF00] text-[#101C32] hover:bg-white rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Add Product (+)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Products Grid (4 Columns, max-w-[1080px]) */}
      <div className="max-w-[1080px] mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-josefin text-2xl sm:text-3xl font-light text-[#0B2852]">
              Official Simulator Catalog
            </h1>
            <p className="font-josefin text-xs sm:text-sm text-gray-500 mt-0.5">
              Browse {filteredProducts.length} of {products.length} high-fidelity rolling stock and route add-ons
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-[#A7D2F7]/40 text-[#0B2852] px-3.5 py-1 rounded-full">
              {filteredProducts.length} Add-on{filteredProducts.length === 1 ? "" : "s"} Listed
            </span>
          </div>
        </div>

        {/* Category Filter Tabs & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Scrollable Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categoryTabs.map((cat) => {
                const isActive =
                  selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                  (cat.id === "all" && (!selectedCategory || selectedCategory.toLowerCase() === "all"));
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-josefin font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0B2852] text-white shadow-sm border border-[#39FF00]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coaches, routes..."
                className="w-full pl-9 pr-8 py-1.5 rounded-full border border-gray-300 text-xs text-[#101C32] focus:outline-none focus:border-[#0B2852] focus:ring-1 focus:ring-[#0B2852] bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Summary / Reset */}
          {(selectedCategory.toLowerCase() !== "all" || searchQuery.trim() !== "") && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-700">Active Filter:</span>
              {selectedCategory.toLowerCase() !== "all" && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#0B2852] text-white text-[11px] font-semibold flex items-center gap-1.5">
                  Category: {categoryTabs.find((c) => c.id.toLowerCase() === selectedCategory.toLowerCase())?.name || selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory("all")} className="hover:text-[#39FF00]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery.trim() !== "" && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#0B2852] text-white text-[11px] font-semibold flex items-center gap-1.5">
                  Search: &quot;{searchQuery}&quot;
                  <button type="button" onClick={() => setSearchQuery("")} className="hover:text-[#39FF00]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs text-[#FF6600] hover:underline font-bold ml-auto cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200 p-8 my-6">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#0B2852]">No products found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              No railway rolling stock or route items match your current filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] text-xs font-bold transition-all cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod: any) => {
              const added = isInCart(prod.id);
              const isFree = prod.salePrice === 0 && prod.regularPrice === 0;
              const isOutOfStock = prod.status === "OUT_OF_STOCK" || (prod.stockQuantity !== undefined && prod.stockQuantity <= 0);
              const isComingSoon = prod.status === "COMING_SOON";
              const hasOffer = Boolean(prod.isSpecialOffer) || (prod.salePrice !== null && prod.salePrice !== undefined && prod.salePrice < prod.regularPrice);

              const badgeText = isOutOfStock
                ? "Out of Stock"
                : isComingSoon
                  ? "Coming Soon"
                  : isFree
                    ? "Free"
                    : hasOffer
                      ? (prod.specialOfferText || "Special Offer")
                      : prod.badge === "New Arrival"
                        ? "New Arrival"
                        : prod.status === "AVAILABLE"
                          ? "Available"
                          : prod.badge || "Available";

              const badgeBg = isOutOfStock
                ? "bg-[#DC2626] text-white"
                : isComingSoon
                  ? "bg-[#16A34A] text-white"
                  : isFree
                    ? "bg-[#39FF00] text-[#101C32]"
                    : hasOffer
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#2563EB] text-white";

              const productUrl = `/shop/${prod.slug || prod.id}`;

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-white border border-gray-200 hover:border-[#0B2852] hover:shadow-xl transition-all duration-300 rounded-xl p-3"
                >
                  {/* Poster Image Container */}
                  <Link
                    href={productUrl}
                    className="relative aspect-square w-full bg-[#F5F6F8] overflow-hidden flex items-center justify-center rounded-lg border border-gray-100"
                    title={`View contents of ${prod.name}`}
                  >
                    {/* Badge top-left */}
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-bold font-josefin uppercase rounded-full z-10 shadow-sm ${badgeBg}`}
                    >
                      {badgeText}
                    </span>

                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-[#0B2852]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px] p-3 z-20">
                      <span className="w-full max-w-[150px] py-1.5 px-3 rounded-full bg-white text-[#0B2852] text-xs font-josefin font-bold flex items-center justify-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        View Contents
                      </span>

                      {isOutOfStock ? (
                        <span className="w-full max-w-[150px] py-1.5 px-3 rounded-full bg-[#DC2626] text-white text-xs font-josefin font-bold shadow-lg text-center">
                          Out of Stock
                        </span>
                      ) : isComingSoon ? (
                        <span className="w-full max-w-[150px] py-1.5 px-3 rounded-full bg-[#16A34A] text-white text-xs font-josefin font-bold shadow-lg text-center">
                          Coming Soon
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(e, prod);
                          }}
                          className="w-full max-w-[150px] py-1.5 px-3 rounded-full bg-[#39FF00] text-[#101C32] text-xs font-josefin font-bold hover:bg-white flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                          {added ? "In Cart" : isFree ? "Get Free" : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </Link>

                  {/* Product Meta */}
                  <div className="pt-3 pb-1 flex flex-col flex-grow">
                    <span className="text-[11px] text-gray-500 font-josefin uppercase tracking-wider mb-1">
                      {prod.categoryName}
                    </span>
                    <Link
                      href={productUrl}
                      className="font-josefin font-semibold text-[15px] sm:text-[16px] leading-snug text-[#0B2852] hover:text-[#FF6600] line-clamp-2 transition-colors"
                      title={prod.name}
                    >
                      {prod.name}
                    </Link>

                    {/* Price Row */}
                    <div className="mt-3 flex items-center justify-between font-josefin">
                      <div className="flex items-center gap-2">
                        {isFree ? (
                          <span className="text-[#39FF00] bg-[#0B2852] px-2.5 py-0.5 rounded-full font-bold text-xs">
                            FREE
                          </span>
                        ) : prod.regularPrice > prod.salePrice && prod.salePrice !== null ? (
                          <>
                            <span className="line-through text-gray-400 text-xs">
                              ₹{prod.regularPrice.toFixed(2)}
                            </span>
                            <span className="text-[#101C32] font-bold text-[16px]">
                              ₹{prod.salePrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#101C32] font-bold text-[16px]">
                            ₹{prod.regularPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.compatibility}
                      </span>
                    </div>

                    {/* Customer Action Row: VIEW CONTENTS + ADD TO CART */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1.5">
                      <Link
                        href={productUrl}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-[#0B2852] text-[#0B2852] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs text-center border border-gray-200 hover:border-[#0B2852]"
                        title="View Full Product Contents, Specs & Downloads"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Contents</span>
                      </Link>

                      {(!currentUser || !isAdminMode) && (
                        isOutOfStock ? (
                          <span className="px-2.5 py-1.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 font-bold text-xs flex items-center justify-center gap-1 shrink-0">
                            <Ban className="w-3 h-3" />
                            <span>Out</span>
                          </span>
                        ) : isComingSoon ? (
                          <span className="px-2.5 py-1.5 rounded-lg bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 font-bold text-xs flex items-center justify-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>Soon</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, prod)}
                            className="px-3 py-1.5 rounded-lg bg-[#0B2852] hover:bg-[#39FF00] text-white hover:text-[#101C32] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                            title={added ? "Already in Cart" : "Add to Cart"}
                          >
                            {added ? <Check className="w-3.5 h-3.5 text-[#39FF00]" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                            <span>{added ? "In Cart" : isFree ? "Free" : "Cart"}</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* 5. VISIBLE ADMIN MANAGEMENT CONTROLS ON PRODUCT CARD */}
                {currentUser && isAdminMode && (
                  <div className="mt-3 pt-3 border-t-2 border-[#0B2852]/20 bg-blue-50/70 -mx-3 -mb-3 p-3 rounded-b-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0B2852] uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0B2852]" />
                        Admin Controls
                      </span>
                      <span className="font-mono text-gray-500 text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        {prod.sku}
                      </span>
                    </div>

                    {/* Row 1: [EDIT] [RENAME] [UPLOAD IMAGE] */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(prod)}
                        className="py-1.5 px-2 rounded-md bg-[#0B2852] text-white hover:bg-black font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Edit Full Coach Details"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setRenameModalProduct(prod)}
                        className="py-1.5 px-2 rounded-md bg-white border border-gray-300 hover:border-[#0B2852] text-gray-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Quick Rename Product"
                      >
                        Rename
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageModalProduct(prod)}
                        className="py-1.5 px-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Upload / Replace Image"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                    </div>

                    {/* Row 2: [CHANGE PRICE] [OFFER] [DELETE] */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPriceModalProduct(prod)}
                        className="py-1.5 px-2 rounded-md bg-white border border-gray-300 hover:border-[#FF6600] text-gray-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Change Price & Discounts"
                      >
                        <DollarSign className="w-3 h-3 text-[#FF6600]" />
                        Price
                      </button>

                      <button
                        type="button"
                        onClick={() => setOfferModalProduct(prod)}
                        className="py-1.5 px-2 rounded-md bg-[#FF6B00] text-white hover:bg-[#e05a00] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Special Offer & Discount Badge"
                      >
                        <Tag className="w-3 h-3" />
                        Offer
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteProductModal({ id: prod.id, name: prod.name })}
                        className="py-1.5 px-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>

                    {/* Row 3: 1-Click Availability Switcher */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-gray-200/80">
                      <button
                        type="button"
                        onClick={() => handleUpdateAvailability(prod, "AVAILABLE")}
                        className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${prod.status === "AVAILABLE"
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
                          }`}
                        title="Mark Available"
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAvailability(prod, "OUT_OF_STOCK")}
                        className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${prod.status === "OUT_OF_STOCK"
                          ? "bg-[#DC2626] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-red-50"
                          }`}
                        title="Mark Out of Stock"
                      >
                        Out of Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAvailability(prod, "COMING_SOON")}
                        className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${prod.status === "COMING_SOON"
                          ? "bg-[#16A34A] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"
                          }`}
                        title="Mark Coming Soon"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-lg font-bold text-[#0B2852]">Confirm Permanent Deletion</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{deleteProductModal.name}&quot;</strong>?
              This will immediately remove the product from the shop and database.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteProductModal(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PRICE & OFFER EDIT MODAL */}
      {priceModalProduct && (
        <QuickPriceModal
          product={priceModalProduct}
          isSaving={isSavingAction}
          onClose={() => setPriceModalProduct(null)}
          onSave={handleSavePriceChange}
        />
      )}

      {/* QUICK RENAME MODAL */}
      {renameModalProduct && (
        <ProductRenameModal
          product={renameModalProduct}
          onClose={() => setRenameModalProduct(null)}
          onSave={(newName) => handleSaveRename(renameModalProduct.id, newName)}
        />
      )}

      {/* UPLOAD / REPLACE IMAGE MODAL */}
      {imageModalProduct && (
        <ProductImageUploadModal
          product={imageModalProduct}
          onClose={() => setImageModalProduct(null)}
          onSave={(newUrl) => handleSaveImage(imageModalProduct.id, newUrl)}
        />
      )}

      {/* SPECIAL OFFER MODAL */}
      {offerModalProduct && (
        <ProductOfferModal
          product={offerModalProduct}
          isSaving={isSavingAction}
          onClose={() => setOfferModalProduct(null)}
          onSave={(isSpecialOffer, specialOfferText, discountPercent, newSalePrice) =>
            handleSaveSpecialOffer(
              offerModalProduct.id,
              isSpecialOffer,
              specialOfferText,
              discountPercent,
              newSalePrice
            )
          }
        />
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddProductOpen || editingProduct) && (
        <ProductFormDialog
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
    </div>
  );
}

// --- SUB-COMPONENT: QUICK PRICE & DISCOUNT MODAL ---
function QuickPriceModal({
  product,
  onClose,
  onSave,
  isSaving,
}: {
  product: any;
  onClose: () => void;
  onSave: (regularPrice: number, salePrice: number | null) => void;
  isSaving?: boolean;
}) {
  const [regularPrice, setRegularPrice] = useState(product.regularPrice);
  const [salePrice, setSalePrice] = useState<number | null>(product.salePrice);

  const applyDiscountPercent = (pct: number) => {
    const discounted = Math.round(regularPrice * (1 - pct / 100));
    setSalePrice(discounted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs font-josefin">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">
            Edit Price & Offer: {product.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Selling / Regular Price (₹)</label>
            <input
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border rounded-lg font-bold text-sm text-[#0B2852]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Discounted / Offer Price (₹)</label>
            <input
              type="number"
              placeholder="Leave empty for no offer"
              value={salePrice !== null ? salePrice : ""}
              onChange={(e) => {
                const val = e.target.value;
                setSalePrice(val === "" ? null : parseFloat(val) || 0);
              }}
              className="w-full p-2.5 border rounded-lg font-bold text-sm text-[#FF6600]"
            />
          </div>

          <div>
            <span className="font-bold text-gray-500 block mb-1">Quick Percentage Discount:</span>
            <div className="flex gap-2">
              {[10, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyDiscountPercent(pct)}
                  className="flex-1 py-1 rounded-md border border-gray-300 font-bold hover:border-[#0B2852] hover:bg-blue-50 text-[11px]"
                >
                  -{pct}%
                </button>
              ))}
              {salePrice !== null && (
                <button
                  type="button"
                  onClick={() => setSalePrice(null)}
                  className="py-1 px-2 rounded-md text-rose-600 hover:bg-rose-50 text-[11px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave(regularPrice, salePrice)}
            className={`flex-1 py-2.5 rounded-full font-bold uppercase transition-all shadow-md ${isSaving
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32]"
              }`}
          >
            {isSaving ? "Saving to Database..." : "Save Price"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FULL PRODUCT FORM DIALOG ---
function ProductFormDialog({
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
  const [compatibility, setCompatibility] = useState(
    product?.compatibility || "Open Rails / MSTS"
  );
  const [imageUrl, setImageUrl] = useState(product?.image || "");
  const [description, setDescription] = useState(product?.description || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? true);

  const [isUploading, setIsUploading] = useState(false);

  // Quick Presets
  const presets = [
    { label: "Academy Sleeper", url: "/assets/products/vg_academy_sleeper.avif" },
    { label: "Humsafar V2", url: "/assets/products/humsafar_v2.avif" },
    { label: "Sleeper V2", url: "/assets/products/sleeper_v2.avif" },
    { label: "Tricolour", url: "/assets/products/indian_tricolour.avif" },
    { label: "Amrit Bharat", url: "/assets/products/amrit_bharat.png" },
    { label: "Bangladesh", url: "/assets/products/bangladesh_coaches.png" },
    { label: "Chaircar", url: "/assets/products/chaircar_standard.png" },
    { label: "Vistadome", url: "/assets/products/vistadome_standard.png" },
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
      compatibility,
      imageUrl,
      description: description || name,
      isFeatured,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-4 text-xs font-josefin">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-[#0B2852]">
            {product ? `Edit Product: ${product.name}` : "Add New Coach or Add-on"}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
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
              <label className="block font-bold text-gray-700 mb-1">SKU / Code</label>
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
              <label className="block font-bold text-gray-700 mb-1">Selling / Regular Price (₹) *</label>
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
              <label className="block font-bold text-gray-700 mb-1">Discounted / Offer Price (₹)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Leave blank for regular"
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Category *</label>
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
              <label className="block font-bold text-gray-700 mb-1">Availability Status</label>
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
              <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Simulator Platform</label>
              <input
                type="text"
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          {/* Product Image Upload & Selection */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">Product Image</label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-[#F5F6F8] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image path or upload below"
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

            {/* Quick Presets */}
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Quick Image Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${imageUrl === p.url
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
            <label className="block font-bold text-gray-700 mb-1">Product Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-fidelity 3D model recreation for Open Rails & MSTS"
              className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#0B2852]"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
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
              {product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: QUICK RENAME MODAL ---
function ProductRenameModal({
  product,
  onClose,
  onSave,
}: {
  product: any;
  onClose: () => void;
  onSave: (newName: string) => void;
}) {
  const [name, setName] = useState(product.name || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">Rename Product</h3>
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
            <label className="block font-bold text-gray-700 mb-1">Product Name</label>
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

// --- SUB-COMPONENT: PRODUCT IMAGE UPLOAD MODAL ---
function ProductImageUploadModal({
  product,
  onClose,
  onSave,
}: {
  product: any;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState(product.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleDiskUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
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
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#0B2852]">
            Upload or Replace Image: {product.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Image Preview */}
        <div className="aspect-[16/9] w-full bg-gray-50 rounded-xl overflow-hidden border flex items-center justify-center p-3">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400">No image selected</span>
          )}
        </div>

        {uploadError && (
          <p className="text-rose-600 text-[11px] font-semibold">{uploadError}</p>
        )}

        {/* File Upload from Disk */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Upload from Local Computer (JPG, PNG, WEBP, AVIF)
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDiskUpload(file);
            }}
            className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0B2852] file:text-white hover:file:bg-[#39FF00] hover:file:text-[#101C32] cursor-pointer"
          />
        </div>

        {/* URL Input */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Or Direct Image URL / Path</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/assets/products/coach.png or https://..."
            className="w-full p-2 border rounded font-mono text-xs text-[#101C32]"
          />
        </div>

        {/* Presets */}
        <div>
          <span className="font-bold text-gray-700 block mb-1">Or Select Official Coach Preset:</span>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {presets.map((p) => (
              <button
                key={p.url}
                type="button"
                onClick={() => setImageUrl(p.url)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${imageUrl === p.url
                  ? "bg-[#0B2852] text-white border-[#0B2852]"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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
            disabled={isUploading || !imageUrl}
            onClick={() => onSave(imageUrl)}
            className="flex-1 py-2 rounded-full bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] font-bold uppercase transition-all disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Image"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: SPECIAL OFFER & DISCOUNT MODAL ---
function ProductOfferModal({
  product,
  onClose,
  onSave,
  isSaving,
}: {
  product: any;
  onClose: () => void;
  isSaving?: boolean;
  onSave: (
    isSpecialOffer: boolean,
    specialOfferText: string,
    discountPercent: number,
    newSalePrice?: number | null
  ) => void;
}) {
  const [isSpecialOffer, setIsSpecialOffer] = useState<boolean>(
    Boolean(product.isSpecialOffer || product.badge === "Special Offer")
  );
  const [specialOfferText, setSpecialOfferText] = useState<string>(
    product.specialOfferText || "Special Offer"
  );
  const [discountPercent, setDiscountPercent] = useState<number>(
    product.discountPercent ||
    (product.salePrice && product.regularPrice > product.salePrice
      ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
      : 20)
  );

  const regularPrice = product.regularPrice || 1000;
  const calculatedSalePrice = isSpecialOffer
    ? Math.round(regularPrice * (1 - discountPercent / 100))
    : product.salePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 font-josefin text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-[#FF6B00] flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            Special Offer & Discount: {product.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Offer */}
        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <div>
            <span className="font-bold text-gray-900 block">Enable Special Offer</span>
            <span className="text-[11px] text-gray-500">
              Displays prominent orange badge and discounted price
            </span>
          </div>
          <input
            type="checkbox"
            checked={isSpecialOffer}
            onChange={(e) => setIsSpecialOffer(e.target.checked)}
            className="w-5 h-5 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
          />
        </div>

        {isSpecialOffer && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={specialOfferText}
                onChange={(e) => setSpecialOfferText(e.target.value)}
                placeholder="e.g. Special Offer, Festival Sale, 20% OFF"
                className="w-full p-2 border rounded-lg text-sm text-[#101C32]"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-gray-700 mb-1">
                <span>Discount Percentage:</span>
                <span className="text-[#FF6B00] font-mono text-sm">{discountPercent}% OFF</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                step={5}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
                className="w-full accent-[#FF6B00]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>5%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Price Calculation Preview */}
            <div className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between">
              <div>
                <span className="text-gray-500 block">Original Price:</span>
                <span className="font-bold text-gray-700 text-sm">₹{regularPrice.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">Discounted Selling Price:</span>
                <span className="font-bold text-[#FF6B00] text-base">
                  ₹{calculatedSalePrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              onSave(
                isSpecialOffer,
                specialOfferText,
                discountPercent,
                isSpecialOffer ? calculatedSalePrice : null
              )
            }
            className={`flex-1 py-2 rounded-full font-bold uppercase transition-all shadow-md ${isSaving
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#FF6B00] text-white hover:bg-[#e05a00]"
              }`}
          >
            {isSaving ? "Saving to Database..." : "Save Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}
