"use client";

import { useEffect, useState, useCallback } from "react";
import { onDiscountsSnapshot } from "@/lib/firebase/firestore";

// ─── Module-level singleton ───────────────────────────────────────────────────
// All hook instances share one Firestore real-time subscription to avoid
// duplicate listeners when many ProductCards render simultaneously.
let _cache = [];
const _listeners = new Set();
let _unsub = null;

function _subscribe(cb) {
  _listeners.add(cb);
  if (_listeners.size === 1) {
    // First subscriber — open the Firestore listener
    _unsub = onDiscountsSnapshot(
      (data) => {
        _cache = data;
        _listeners.forEach((fn) => fn(data));
      },
      (err) => console.error("[useDiscounts] Firestore error:", err)
    );
  } else {
    // Subsequent subscribers get current data immediately
    cb(_cache);
  }
  return () => {
    _listeners.delete(cb);
    if (_listeners.size === 0 && _unsub) {
      _unsub();
      _unsub = null;
    }
  };
}

// Date-only strings like "2026-03-17" parse as UTC midnight in JS,
// which causes timezone bugs (e.g. UTC+3 at 1 AM sees it as "future").
// Appending "T00:00:00" forces local-timezone parsing.
function _parseStart(str) {
  if (!str) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? new Date(str + "T00:00:00") : new Date(str);
}
function _parseEnd(str) {
  if (!str) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? new Date(str + "T23:59:59") : new Date(str);
}

function _isActive(d) {
  if (!d.active) return false;
  const now = Date.now();
  const start = _parseStart(d.startDate);
  const end = _parseEnd(d.endDate);
  if (start && start.getTime() > now) return false;
  if (end && end.getTime() < now) return false;
  return true;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * useDiscounts()
 *
 * Provides the full discount engine.  All instances share one Firestore
 * subscription, so this is safe to call in ProductCard, sepet, odeme, etc.
 *
 * Key functions:
 *   getProductDiscount(productId, price)            → { discountedPrice, percent, label } | null
 *   applyToCart(cart, couponCode, isFirstOrder)      → { breakdown, totalDiscount, ... }
 *   validateCoupon(code, subtotal)                  → { valid, error, coupon }
 *   getBanners()                                    → active[] (threshold + bxgy + public coupons)
 */
export function useDiscounts() {
  const [discounts, setDiscounts] = useState(_cache);

  useEffect(() => _subscribe(setDiscounts), []);

  const active = discounts.filter(_isActive);

  /* ── Get discount for a single product (for cards / product page) ── */
  const getProductDiscount = useCallback(
    (productId, price) => {
      const pd = active.find(
        (d) => d.type === "product" && d.productIds?.includes(productId)
      );
      if (!pd) return null;
      const discAmt =
        pd.discountType === "percentage"
          ? price * (pd.value / 100)
          : Math.min(pd.value, price);
      const discountedPrice = Math.max(0, price - discAmt);
      const percent = Math.round((discAmt / price) * 100);
      return { discountedPrice, percent, label: pd.name, discount: pd };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(active)]
  );

  /* ── Full cart discount engine ── */
  /**
   * Applies ALL active discounts in order:
   *   1. Product-level discounts  (adjusts effectivePrice per item)
   *   2. BXGY (Buy X Get Y free)  — cheapest items become free
   *   3. Threshold (automatic)    — min cart amount triggers discount
   *   4. Cart coupon              — explicit code
   *
   * Returns:
   *   { items, breakdown, totalDiscount, effectiveSubtotal, appliedCoupon, couponError }
   */
  const applyToCart = useCallback(
    (cart, couponCode = "", isFirstOrder = false) => {
      const empty = {
        items: cart || [],
        breakdown: [],
        totalDiscount: 0,
        effectiveSubtotal: (cart || []).reduce((s, i) => s + i.price * i.qty, 0),
        appliedCoupon: null,
        couponError: null,
      };
      if (!cart?.length) return empty;

      // ── Step 1: Product discounts ──────────────────────────────────
      const items = cart.map((item) => {
        const pd = active.find(
          (d) => d.type === "product" && d.productIds?.includes(item.id)
        );
        if (!pd) return { ...item, effectivePrice: item.price };
        const discAmt =
          pd.discountType === "percentage"
            ? item.price * (pd.value / 100)
            : Math.min(pd.value, item.price);
        return { ...item, effectivePrice: Math.max(0, item.price - discAmt) };
      });

      const rawSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const effectiveSubtotal = items.reduce((s, i) => s + i.effectivePrice * i.qty, 0);
      const productDiscountAmt = rawSubtotal - effectiveSubtotal;

      const breakdown = [];
      if (productDiscountAmt > 0.001) {
        breakdown.push({ type: "product", label: "Ürün İndirimi", amount: productDiscountAmt });
      }

      // ── Step 2: BXGY ───────────────────────────────────────────────
      let bxgyAmt = 0;
      for (const bg of active.filter((d) => d.type === "bxgy")) {
        const applicable = items.filter(
          (i) => !bg.productIds?.length || bg.productIds.includes(i.id)
        );
        // Expand to per-unit price list, sort ascending (cheapest = free)
        const units = [];
        for (const item of applicable) {
          for (let k = 0; k < item.qty; k++) units.push(item.effectivePrice);
        }
        units.sort((a, b) => a - b);
        const buyQty = Math.max(2, Number(bg.buyQty) || 3);
        const getQty = Math.max(1, Number(bg.getQty) || 1);
        const freeCount = Math.floor(units.length / buyQty) * getQty;
        const freeAmt = units.slice(0, freeCount).reduce((s, p) => s + p, 0);
        if (freeAmt > 0.001) {
          breakdown.push({
            type: "bxgy",
            label: bg.name,
            sublabel: `${buyQty} al ${buyQty - getQty} öde`,
            amount: freeAmt,
            freeCount,
          });
          bxgyAmt += freeAmt;
        }
      }

      // ── Step 3: Threshold (automatic) ─────────────────────────────
      let thresholdAmt = 0;
      for (const td of active.filter((d) => d.type === "threshold")) {
        if (effectiveSubtotal >= (td.minCartAmount ?? 0)) {
          const base = effectiveSubtotal;
          const amt =
            td.discountType === "percentage"
              ? base * (td.value / 100)
              : Math.min(td.value, base);
          if (amt > 0.001) {
            breakdown.push({ type: "threshold", label: td.name, amount: amt });
            thresholdAmt += amt;
          }
        }
      }

      // ── Step 4: Cart coupon ────────────────────────────────────────
      let couponAmt = 0;
      let appliedCoupon = null;
      let couponError = null;
      if (couponCode.trim()) {
        const coupon = active.find(
          (d) =>
            d.type === "cart_coupon" &&
            d.code?.toUpperCase() === couponCode.trim().toUpperCase()
        );
        if (!coupon) {
          couponError = "Geçersiz kupon kodu.";
        } else if (coupon.minCartAmount && effectiveSubtotal < coupon.minCartAmount) {
          couponError = `Bu kupon için minimum ₺${coupon.minCartAmount} tutarında alışveriş gereklidir.`;
        } else if (coupon.usageLimit && (coupon.usageCount ?? 0) >= coupon.usageLimit) {
          couponError = "Bu kuponun kullanım limiti dolmuştur.";
        } else {
          const base = Math.max(0, effectiveSubtotal - bxgyAmt - thresholdAmt);
          const amt =
            coupon.discountType === "percentage"
              ? base * (coupon.value / 100)
              : Math.min(coupon.value, base);
          if (amt > 0.001) {
            breakdown.push({ type: "cart_coupon", label: `Kupon: ${coupon.code}`, amount: amt });
            couponAmt = amt;
            appliedCoupon = coupon;
          }
        }
      }

      // ── Step 5: First order (auto-applied, no code) ─────────────────────
      let firstOrderAmt = 0;
      if (isFirstOrder) {
        for (const fo of active.filter((d) => d.type === "first_order")) {
          const base = Math.max(0, effectiveSubtotal - bxgyAmt - thresholdAmt - couponAmt);
          const amt =
            fo.discountType === "percentage"
              ? base * (fo.value / 100)
              : Math.min(fo.value, base);
          if (amt > 0.001) {
            breakdown.push({ type: "first_order", label: fo.name, amount: amt });
            firstOrderAmt += amt;
          }
        }
      }

      const totalDiscount = productDiscountAmt + bxgyAmt + thresholdAmt + couponAmt + firstOrderAmt;

      return {
        items,
        breakdown,
        totalDiscount,
        effectiveSubtotal,
        appliedCoupon,
        couponError,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(active)]
  );

  /* ── Validate coupon only (without running full cart calc) ── */
  const validateCoupon = useCallback(
    (code, subtotal) => {
      if (!code?.trim()) return { valid: false, error: "" };
      const coupon = active.find(
        (d) =>
          d.type === "cart_coupon" &&
          d.code?.toUpperCase() === code.trim().toUpperCase()
      );
      if (!coupon) return { valid: false, error: "Geçersiz kupon kodu." };
      if (coupon.minCartAmount && subtotal < coupon.minCartAmount) {
        return {
          valid: false,
          error: `Bu kupon için minimum ₺${coupon.minCartAmount} alışveriş gereklidir.`,
          coupon,
        };
      }
      if (coupon.usageLimit && (coupon.usageCount ?? 0) >= coupon.usageLimit) {
        return { valid: false, error: "Bu kuponun kullanım limiti dolmuştur.", coupon };
      }
      return { valid: true, error: null, coupon };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(active)]
  );

  /* ── Promotional banners for display on home / cart ── */
  const getBanners = useCallback(
    () =>
      active.filter(
        (d) =>
          d.type === "threshold" ||
          d.type === "bxgy" ||
          d.type === "first_order" ||
          (d.type === "cart_coupon" && d.publicVisible)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(active)]
  );

  return {
    discounts,
    active,
    loading: _unsub === null && _cache.length === 0,
    getProductDiscount,
    applyToCart,
    validateCoupon,
    getBanners,
  };
}
