"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MENU_ITEMS, type MenuItem } from "@/data/menu";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type FulfillmentType = "pickup" | "delivery";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  fulfillment: FulfillmentType;
  setFulfillment: (mode: FulfillmentType) => void;
  subtotal: number;
  vat: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
  toastMessage: string | null;
}

const STORAGE_KEY = "coffee-shop-cart-v1";
const FREE_DELIVERY_THRESHOLD = 80;
const STANDARD_DELIVERY_FEE = 10;
const VAT_RATE = 0.05;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [hydrated, setHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          items?: CartItem[];
          entries?: { id: string; quantity: number }[];
          fulfillment?: FulfillmentType;
        };

        if (Array.isArray(parsed.items)) {
          const valid = parsed.items.filter(
            (ci) => ci?.item?.id && ci.quantity > 0
          );
          setItems(valid);
        } else if (Array.isArray(parsed.entries)) {
          const restored: CartItem[] = [];
          for (const entry of parsed.entries) {
            const found = MENU_ITEMS.find((m) => m.id === entry.id);
            if (found && entry.quantity > 0) {
              restored.push({ item: found, quantity: entry.quantity });
            }
          }
          setItems(restored);
        }

        if (
          parsed.fulfillment === "pickup" ||
          parsed.fulfillment === "delivery"
        ) {
          setFulfillment(parsed.fulfillment);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload = {
        items,
        fulfillment,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  }, [items, fulfillment, hydrated]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setToastMessage(`Added ${item.name} to your cart`);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((ci) => ci.item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === id ? { ...ci, quantity } : ci))
    );
  }, []);

  const getItemQuantity = useCallback(
    (id: string) => items.find((ci) => ci.item.id === id)?.quantity ?? 0,
    [items]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);
    const subtotal = items.reduce(
      (sum, ci) => sum + ci.item.priceAed * ci.quantity,
      0
    );
    const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
    const deliveryFee =
      fulfillment === "delivery" &&
      subtotal > 0 &&
      subtotal < FREE_DELIVERY_THRESHOLD
        ? STANDARD_DELIVERY_FEE
        : 0;
    const total = Math.round((subtotal + vat + deliveryFee) * 100) / 100;

    return {
      items,
      itemCount,
      fulfillment,
      setFulfillment,
      subtotal,
      vat,
      deliveryFee,
      total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      addItem,
      removeItem,
      updateQuantity,
      getItemQuantity,
      clearCart,
      toastMessage,
    };
  }, [
    items,
    fulfillment,
    addItem,
    removeItem,
    updateQuantity,
    getItemQuantity,
    clearCart,
    toastMessage,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
