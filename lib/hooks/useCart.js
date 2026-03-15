"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuth } from "@/lib/firebase/auth";
import { getUserDoc, updateUserDoc } from "@/lib/firebase/firestore";

const STORAGE_KEY = "gb_cart";
const EVENT_KEY = "gb_cart_change";
const SYNC_EVENT_KEY = "gb_cart_sync";

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function useCart() {
  const [cart, setCart] = useState([]);
  const uidRef = useRef(null);
  // Mirror of cart state — lets us read current value outside updater functions
  const cartRef = useRef([]);
  // Holds the value to broadcast after the next commit
  const pendingDispatchRef = useRef(null);

  // Runs after React commits the new cart state — safe place to dispatch events
  useEffect(() => {
    if (pendingDispatchRef.current !== null) {
      const data = pendingDispatchRef.current;
      pendingDispatchRef.current = null;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_KEY, { detail: data }));
      }
    }
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        uidRef.current = firebaseUser.uid;
        const doc = await getUserDoc(firebaseUser.uid);
        const loaded = doc?.cart || [];
        cartRef.current = loaded;
        setCart(loaded);
      } else {
        uidRef.current = null;
        const loaded = readLocal();
        cartRef.current = loaded;
        setCart(loaded);
      }
    });

    const onLocalSync = () => {
      if (!uidRef.current) {
        const loaded = readLocal();
        cartRef.current = loaded;
        setCart(loaded);
      }
    };
    const onFirestoreSync = (e) => {
      if (uidRef.current) {
        cartRef.current = e.detail;
        setCart(e.detail);
      }
    };
    window.addEventListener(EVENT_KEY, onLocalSync);
    window.addEventListener(SYNC_EVENT_KEY, onFirestoreSync);

    return () => {
      unsubscribe();
      window.removeEventListener(EVENT_KEY, onLocalSync);
      window.removeEventListener(SYNC_EVENT_KEY, onFirestoreSync);
    };
  }, []);

  // Persist next cart state to Firestore or localStorage and schedule sync broadcast
  const persist = useCallback((next) => {
    if (uidRef.current) {
      updateUserDoc(uidRef.current, { cart: next }).catch(() => {});
      // Will be dispatched by the useEffect above after commit
      pendingDispatchRef.current = next;
    } else {
      writeLocal(next);
    }
  }, []);

  /** Add product (with qty, default 1). If already in cart, increments. */
  const addItem = useCallback((product, qty = 1) => {
    const prev = cartRef.current;
    const existing = prev.find((i) => i.id === product.id);
    const next = existing
      ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      : [...prev, { ...product, qty }];
    cartRef.current = next;
    setCart(next);
    persist(next);
  }, [persist]);

  /** Set absolute quantity for an item */
  const setQty = useCallback((id, qty) => {
    if (qty < 1) return;
    const next = cartRef.current.map((i) => (i.id === id ? { ...i, qty } : i));
    cartRef.current = next;
    setCart(next);
    persist(next);
  }, [persist]);

  /** Change quantity by a delta (+1 / -1) */
  const updateQty = useCallback((id, delta) => {
    const next = cartRef.current.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    cartRef.current = next;
    setCart(next);
    persist(next);
  }, [persist]);

  /** Remove item from cart */
  const removeItem = useCallback((id) => {
    const next = cartRef.current.filter((i) => i.id !== id);
    cartRef.current = next;
    setCart(next);
    persist(next);
  }, [persist]);

  /** Clear entire cart */
  const clearCart = useCallback(() => {
    cartRef.current = [];
    setCart([]);
    persist([]);
  }, [persist]);

  /** Is a product already in cart? */
  const inCart = useCallback(
    (id) => cart.some((i) => i.id === id),
    [cart]
  );

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return { cart, addItem, setQty, updateQty, removeItem, clearCart, inCart, count, subtotal };
}
