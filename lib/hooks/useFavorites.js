"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuth } from "@/lib/firebase/auth";
import { getUserDoc, updateUserDoc } from "@/lib/firebase/firestore";

const STORAGE_KEY = "gb_favorites";
const EVENT_KEY = "gb_favorites_change";
const SYNC_EVENT_KEY = "gb_favorites_sync";

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const uidRef = useRef(null);
  // Mirror of favorites state — lets us read current value outside updater functions
  const favRef = useRef([]);
  // Holds the value to broadcast after the next commit
  const pendingDispatchRef = useRef(null);

  // Runs after React commits the new favorites state — safe place to dispatch events
  useEffect(() => {
    if (pendingDispatchRef.current !== null) {
      const data = pendingDispatchRef.current;
      pendingDispatchRef.current = null;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_KEY, { detail: data }));
      }
    }
  }, [favorites]);

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        uidRef.current = firebaseUser.uid;
        const doc = await getUserDoc(firebaseUser.uid);
        const loaded = doc?.favorites || [];
        favRef.current = loaded;
        setFavorites(loaded);
      } else {
        uidRef.current = null;
        const loaded = readLocal();
        favRef.current = loaded;
        setFavorites(loaded);
      }
    });

    const onLocalSync = () => {
      if (!uidRef.current) {
        const loaded = readLocal();
        favRef.current = loaded;
        setFavorites(loaded);
      }
    };
    const onFirestoreSync = (e) => {
      if (uidRef.current) {
        favRef.current = e.detail;
        setFavorites(e.detail);
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

  const toggle = useCallback((id) => {
    // Compute next state from ref — no side effects inside setState updater
    const prev = favRef.current;
    const next = prev.includes(id)
      ? prev.filter((v) => v !== id)
      : [...prev, id];
    favRef.current = next;
    setFavorites(next);
    if (uidRef.current) {
      updateUserDoc(uidRef.current, { favorites: next }).catch(() => {});
      // Will be dispatched by the useEffect above after commit
      pendingDispatchRef.current = next;
    } else {
      writeLocal(next);
    }
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const count = favorites.length;

  return { favorites, toggle, isFavorite, count };
}
