"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gb_cart";
const EVENT_KEY = "gb_cart_change";

function readStorage() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStorage(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function useCart() {
  const [cart, setCart] = useState([]);

  // Hydrate on mount + cross-tab/cross-component sync
  useEffect(() => {
    setCart(readStorage());
    const onSync = () => setCart(readStorage());
    window.addEventListener(EVENT_KEY, onSync);
    return () => window.removeEventListener(EVENT_KEY, onSync);
  }, []);

  /** Add product (with qty, default 1). If already in cart, increments. */
  const addItem = useCallback((product, qty = 1) => {
    const current = readStorage();
    const existing = current.find((i) => i.id === product.id);
    const next = existing
      ? current.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      : [...current, { ...product, qty }];
    writeStorage(next);
    setCart(next);
  }, []);

  /** Set absolute quantity for an item */
  const setQty = useCallback((id, qty) => {
    if (qty < 1) return;
    const current = readStorage();
    const next = current.map((i) => (i.id === id ? { ...i, qty } : i));
    writeStorage(next);
    setCart(next);
  }, []);

  /** Change quantity by a delta (+1 / -1) */
  const updateQty = useCallback((id, delta) => {
    const current = readStorage();
    const next = current.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    writeStorage(next);
    setCart(next);
  }, []);

  /** Remove item from cart */
  const removeItem = useCallback((id) => {
    const next = readStorage().filter((i) => i.id !== id);
    writeStorage(next);
    setCart(next);
  }, []);

  /** Clear entire cart */
  const clearCart = useCallback(() => {
    writeStorage([]);
    setCart([]);
  }, []);

  /** Is a product already in cart? */
  const inCart = useCallback(
    (id) => cart.some((i) => i.id === id),
    [cart]
  );

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return { cart, addItem, setQty, updateQty, removeItem, clearCart, inCart, count, subtotal };
}
