"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuth, signIn, signUp, signOut, signInWithGoogle, signInWithApple, resetPassword } from "@/lib/firebase/auth";
import { getUserDoc, updateUserDoc, getSettings } from "@/lib/firebase/firestore";

const DEFAULT_AUTH_PROVIDERS = {
  emailPassword: true,
  google: true,
  apple: true,
  forgotPassword: true,
};

const LOCAL_CART_KEY = "gb_cart";
const LOCAL_FAV_KEY = "gb_favorites";
const EVENT_KEY = "gb_auth_change";

/**
 * Syncs localStorage cart & favorites to Firestore on first login,
 * then clears local copies.
 */
async function syncLocalToFirebase(uid) {
  try {
    const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
    const localFavs = JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) || "[]");

    if (localCart.length > 0 || localFavs.length > 0) {
      const updates = {};
      if (localCart.length > 0) updates.cart = localCart;
      if (localFavs.length > 0) updates.favorites = localFavs;
      await updateUserDoc(uid, updates);
      localStorage.removeItem(LOCAL_CART_KEY);
      localStorage.removeItem(LOCAL_FAV_KEY);
    }
  } catch {
    // Silent fail — localStorage data isn't critical
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authProviders, setAuthProviders] = useState(DEFAULT_AUTH_PROVIDERS);

  useEffect(() => {
    getSettings().then((s) => {
      if (s?.authProviders) {
        setAuthProviders({ ...DEFAULT_AUTH_PROVIDERS, ...s.authProviders });
      }
    }).catch(() => {});
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const doc = await getUserDoc(firebaseUser.uid);
        const merged = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ad: doc?.ad || "",
          soyad: doc?.soyad || "",
          telefon: doc?.telefon || "",
          role: doc?.role || "customer",
          disabled: doc?.disabled || false,
          createdAt: doc?.createdAt || new Date().toISOString(),
        };
        setUser(merged);
        setProfile(doc);
        // Sync local data on login
        await syncLocalToFirebase(firebaseUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(EVENT_KEY));
      }
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      await signIn({ email, password });
      return { ok: true };
    } catch (err) {
      const msg = firebaseErrorToTurkish(err.code);
      return { ok: false, error: msg };
    }
  }, []);

  const register = useCallback(async ({ ad, soyad, email, sifre }) => {
    if (!ad || ad.trim().length < 2)
      return { ok: false, error: "Ad en az 2 karakter olmalıdır." };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, error: "Geçerli bir e-posta adresi girin." };
    if (!sifre || sifre.length < 8)
      return { ok: false, error: "Şifre en az 8 karakter olmalıdır." };

    try {
      await signUp({ email, password: sifre, ad, soyad });
      return { ok: true };
    } catch (err) {
      const msg = firebaseErrorToTurkish(err.code);
      return { ok: false, error: msg };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithGoogle();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Google ile giriş başarısız oldu." };
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      await signInWithApple();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Apple ile giriş başarısız oldu." };
    }
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, error: "Geçerli bir e-posta adresi girin." };
    try {
      await resetPassword(email);
      return { ok: true };
    } catch (err) {
      const msg = firebaseErrorToTurkish(err.code);
      return { ok: false, error: msg };
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user?.uid) return;
    await updateUserDoc(user.uid, updates);
    setUser((prev) => ({ ...prev, ...updates }));
    setProfile((prev) => ({ ...prev, ...updates }));
  }, [user?.uid]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor";
  const hasAdminAccess = isAdmin || isEditor;

  return {
    user,
    profile,
    loading,
    isLoggedIn,
    isAdmin,
    isEditor,
    hasAdminAccess,
    authProviders,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    sendPasswordReset,
    updateProfile,
    logout,
  };
}

function firebaseErrorToTurkish(code) {
  const map = {
    "auth/email-already-in-use": "Bu e-posta adresi zaten kullanılıyor.",
    "auth/invalid-email": "Geçerli bir e-posta adresi girin.",
    "auth/user-disabled": "Bu hesap devre dışı bırakılmış.",
    "auth/user-not-found": "Bu e-posta adresine ait hesap bulunamadı.",
    "auth/wrong-password": "Şifre hatalı.",
    "auth/weak-password": "Şifre çok zayıf. En az 6 karakter kullanın.",
    "auth/too-many-requests": "Çok fazla deneme. Lütfen biraz bekleyin.",
    "auth/invalid-credential": "E-posta veya şifre hatalı.",
  };
  return map[code] || "Bir hata oluştu. Lütfen tekrar deneyin.";
}
