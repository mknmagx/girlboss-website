"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gb_addresses";
const EVENT_KEY = "gb_addr_change";

function readStorage() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStorage(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_KEY));
}

/**
 * useAddresses — GIRLBOSS Address Book
 *
 * Each address: { id, baslik, ad, soyad, telefon, adres, sehir, ilce, postakodu, isDefault }
 */
export function useAddresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setAddresses(readStorage());
    const onSync = () => setAddresses(readStorage());
    window.addEventListener(EVENT_KEY, onSync);
    return () => window.removeEventListener(EVENT_KEY, onSync);
  }, []);

  /** Add a new address. First address is auto-set as default. */
  const addAddress = useCallback((addr) => {
    const current = readStorage();
    const isFirst = current.length === 0;
    const newAddr = {
      ...addr,
      id: Date.now().toString(),
      isDefault: isFirst ? true : Boolean(addr.isDefault),
    };
    let next = [...current, newAddr];
    if (newAddr.isDefault) {
      next = next.map((a) => ({ ...a, isDefault: a.id === newAddr.id }));
    }
    writeStorage(next);
    setAddresses(next);
  }, []);

  /** Update an existing address by id. */
  const updateAddress = useCallback((id, updates) => {
    let next = readStorage().map((a) => (a.id === id ? { ...a, ...updates } : a));
    if (updates.isDefault) {
      next = next.map((a) => ({ ...a, isDefault: a.id === id }));
    }
    writeStorage(next);
    setAddresses(next);
  }, []);

  /** Remove an address. If it was default, promote the next one. */
  const removeAddress = useCallback((id) => {
    let next = readStorage().filter((a) => a.id !== id);
    if (next.length && !next.some((a) => a.isDefault)) {
      next[0] = { ...next[0], isDefault: true };
    }
    writeStorage(next);
    setAddresses(next);
  }, []);

  /** Set an address as the default. */
  const setDefault = useCallback((id) => {
    const next = readStorage().map((a) => ({ ...a, isDefault: a.id === id }));
    writeStorage(next);
    setAddresses(next);
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  return { addresses, addAddress, updateAddress, removeAddress, setDefault, defaultAddress };
}
