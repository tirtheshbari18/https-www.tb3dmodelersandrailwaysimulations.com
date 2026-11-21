"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  regularPrice: number;
  image: string;
  sku: string;
  categoryName?: string;
  compatibility?: string;
  isFree?: boolean;
}

export interface AppliedCoupon {
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  coupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  subtotal: number;
  discountTotal: number;
  finalTotal: number;
  itemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("vg_cart_items");
      const savedCoupon = localStorage.getItem("vg_cart_coupon");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        // Default empty cart for fresh users
        const initialSeed: CartItem[] = [];
        setItems(initialSeed);
        try {
          localStorage.setItem("vg_cart_items", JSON.stringify(initialSeed));
        } catch (e) {}
      }
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("vg_cart_items", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (coupon) {
        localStorage.setItem("vg_cart_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("vg_cart_coupon");
      }
    } catch (e) {
      console.error("Failed to save coupon to localStorage", e);
    }
  }, [coupon, isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Digital products are single-license by default
      if (prev.some((i) => i.productId === item.productId)) {
        return prev;
      }
      return [...prev, item];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const isInCart = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const applyCoupon = (newCoupon: AppliedCoupon) => {
    setCoupon(newCoupon);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);

  let discountTotal = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discountTotal = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discountTotal = Math.min(subtotal, coupon.discountAmount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountTotal);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountTotal,
        finalTotal,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
