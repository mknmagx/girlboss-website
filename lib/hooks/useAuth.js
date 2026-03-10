"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gb_user";
const EVENT_KEY = "gb_auth_change";

function readUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writeUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readUser());
    setLoading(false);
    const onSync = () => setUser(readUser());
    window.addEventListener(EVENT_KEY, onSync);
    return () => window.removeEventListener(EVENT_KEY, onSync);
  }, []);

  /**
   * Login — demo: any valid-looking email + password ≥6 chars passes.
   * Returns { ok: true } or { ok: false, error: string }
   */
  const login = useCallback(({ email, password }) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Geçerli bir e-posta adresi girin." };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: "Şifre en az 6 karakter olmalıdır." };
    }
    const newUser = {
      email,
      ad: email.split("@")[0],
      soyad: "",
      telefon: "",
      createdAt: new Date().toISOString(),
    };
    writeUser(newUser);
    setUser(newUser);
    return { ok: true };
  }, []);

  /**
   * Register — validates and saves.
   * Returns { ok: true } or { ok: false, error: string }
   */
  const register = useCallback(({ ad, soyad, email, sifre }) => {
    if (!ad || ad.trim().length < 2) return { ok: false, error: "Ad en az 2 karakter olmalıdır." };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Geçerli bir e-posta adresi girin." };
    if (!sifre || sifre.length < 8) return { ok: false, error: "Şifre en az 8 karakter olmalıdır." };
    const newUser = {
      email,
      ad: ad.trim(),
      soyad: (soyad || "").trim(),
      telefon: "",
      createdAt: new Date().toISOString(),
    };
    writeUser(newUser);
    setUser(newUser);
    return { ok: true };
  }, []);

  const updateProfile = useCallback((updates) => {
    const updated = { ...readUser(), ...updates };
    writeUser(updated);
    setUser(updated);
  }, []);

  const logout = useCallback(() => {
    writeUser(null);
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(user);

  return { user, loading, isLoggedIn, login, register, updateProfile, logout };
}
