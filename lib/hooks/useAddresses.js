"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuth } from "@/lib/firebase/auth";
import { getUserDoc, updateUserDoc } from "@/lib/firebase/firestore";

const STORAGE_KEY = "gb_addresses";
const EVENT_KEY = "gb_addr_change";

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_KEY));
}

function saveAddresses(uid, data) {
  if (uid) {
    updateUserDoc(uid, { addresses: data }).catch(() => {});
  } else {
    writeLocal(data);
  }
}

/**
 * useAddresses — GIRLBOSS Address Book
 *
 * Each address: { id, baslik, ad, soyad, telefon, adres, sehir, ilce, postakodu, isDefault }
 */
export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const uidRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        uidRef.current = firebaseUser.uid;
        const doc = await getUserDoc(firebaseUser.uid);
        setAddresses(doc?.addresses || []);
      } else {
        uidRef.current = null;
        setAddresses(readLocal());
      }
    });

    const onLocalSync = () => {
      if (!uidRef.current) setAddresses(readLocal());
    };
    window.addEventListener(EVENT_KEY, onLocalSync);

    return () => {
      unsubscribe();
      window.removeEventListener(EVENT_KEY, onLocalSync);
    };
  }, []);

  /** Add a new address. First address is auto-set as default. */
  const addAddress = useCallback((addr) => {
    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      const newAddr = {
        ...addr,
        id: Date.now().toString(),
        isDefault: isFirst ? true : Boolean(addr.isDefault),
      };
      let next = [...prev, newAddr];
      if (newAddr.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: a.id === newAddr.id }));
      }
      saveAddresses(uidRef.current, next);
      return next;
    });
  }, []);

  /** Update an existing address by id. */
  const updateAddress = useCallback((id, updates) => {
    setAddresses((prev) => {
      let next = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: a.id === id }));
      }
      saveAddresses(uidRef.current, next);
      return next;
    });
  }, []);

  /** Remove an address. If it was default, promote the next one. */
  const removeAddress = useCallback((id) => {
    setAddresses((prev) => {
      let next = prev.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      saveAddresses(uidRef.current, next);
      return next;
    });
  }, []);

  /** Set an address as the default. */
  const setDefault = useCallback((id) => {
    setAddresses((prev) => {
      const next = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      saveAddresses(uidRef.current, next);
      return next;
    });
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  return { addresses, addAddress, updateAddress, removeAddress, setDefault, defaultAddress };
}
