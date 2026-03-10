"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gb_favorites";
const EVENT_KEY = "gb_favorites_change";

function readStorage() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStorage(ids) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Hydrate on mount
  useEffect(() => {
    setFavorites(readStorage());

    const onSync = () => setFavorites(readStorage());
    window.addEventListener(EVENT_KEY, onSync);
    return () => window.removeEventListener(EVENT_KEY, onSync);
  }, []);

  const toggle = useCallback((id) => {
    const current = readStorage();
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    writeStorage(next);
    setFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const count = favorites.length;

  return { favorites, toggle, isFavorite, count };
}
