"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Package, Tag, Percent, Gift, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDiscounts } from "@/lib/hooks/useDiscounts";
import PromoBanners from "@/lib/components/PromoBanners";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import { getSettings, getOrdersByUser } from "@/lib/firebase/firestore";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SepetPage() {
  const { user } = useAuth();
  const { cart, updateQty, removeItem, subtotal, count } = useCart();
  const { discounts, applyToCart, validateCoupon } = useDiscounts();
  const [siteSettings, setSiteSettings] = useState(null);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  useEffect(() => {
    if (!user) { setIsFirstOrder(false); return; }
    getOrdersByUser(user.uid).then((orders) => setIsFirstOrder(orders.length === 0));
  }, [user?.uid]);
  useEffect(() => { getSettings().then((s) => setSiteSettings(s)); }, []);
  const FREE_SHIPPING_THRESHOLD = Number(siteSettings?.freeShippingThreshold ?? 500);
  const SHIPPING_COST = Number(siteSettings?.shippingCost ?? 29.90);
  const activeCarrier = (siteSettings?.carriers ?? []).find((c) => c.enabled);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Restore applied coupon from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("gb_coupon");
    if (saved) {
      try {
        const { code } = JSON.parse(saved);
        setCouponCode(code);
        setAppliedCouponCode(code);
      } catch {}
    }
  }, []);

  const discountResult = useMemo(
    () => applyToCart(cart, appliedCouponCode, isFirstOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, appliedCouponCode, applyToCart, isFirstOrder]
  );

  const { totalDiscount, breakdown, appliedCoupon } = discountResult;
  const couponApplied = !!appliedCoupon || (appliedCouponCode && !couponError && breakdown.some(b => b.type === "cart_coupon"));

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - totalDiscount + shipping;

  const handleCoupon = () => {
    const result = validateCoupon(couponCode, subtotal);
    if (!result.valid) {
      setCouponError(result.error || "Geçersiz kupon kodu.");
      return;
    }
    setAppliedCouponCode(couponCode.trim().toUpperCase());
    setCouponError("");
    sessionStorage.setItem("gb_coupon", JSON.stringify({ code: couponCode.trim().toUpperCase() }));
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode("");
    setCouponCode("");
    setCouponError("");
    sessionStorage.removeItem("gb_coupon");
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: "2rem" }}>
        <div className="gb-container" style={{ textAlign: "center" }}>
          <div className="hero-fade">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d2d2d] mb-3">
              Alışveriş{" "}
              <span className="gb-gradient-text">Sepeti</span>
            </h1>
            <p className="text-sm text-[#737373]">
              {count > 0 ? `${count} ürün` : "Sepetiniz boş"}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="gb-container">
          <AnimatePresence mode="wait">
            {cart.length === 0 ? (
              /* ─── Empty State ─── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #fde8ee, #fce4ec)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <ShoppingBag size={28} className="text-[#e0b4be]" />
                </div>
                <h2 className="text-xl font-bold text-[#2d2d2d] mb-2">Sepetiniz Boş</h2>
                <p className="text-sm text-[#737373] mb-8">
                  Harika kokularımızı keşfetmeye ne dersiniz?
                </p>
                <Link href="/urunler">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.875rem 2.5rem",
                      background: "linear-gradient(to right, #b76e79, #c4587a)",
                      color: "#fff",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      borderRadius: "9999px",
                      boxShadow: "0 8px 24px rgba(183,110,121,0.3)",
                    }}
                  >
                    <ShoppingBag size={15} />
                    Ürünleri Keşfet
                    <ArrowRight size={15} />
                  </motion.span>
                </Link>
              </motion.div>
            ) : (
              /* ─── Cart Grid ─── */
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="cart-layout-grid"
                style={{
                  display: "grid",
                  gap: "2rem",
                  alignItems: "start",
                }}
              >
                {/* Promo Banners — testMode=true shows all for preview, change to false for production */}
                {discounts.length > 0 && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <PromoBanners discounts={discounts} testMode={true} isFirstOrder={isFirstOrder} />
                  </div>
                )}

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <AnimatePresence>
                    {cart.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
                        exit={{ opacity: 0, x: -80, height: 0, overflow: "hidden", transition: { duration: 0.28 } }}
                        className="bg-white rounded-2xl border border-[#f0e8e4]"
                        style={{ padding: "1.25rem", display: "flex", gap: "1.25rem" }}
                      >
                        {/* Visual */}
                        <Link href={`/urunler/${item.slug}`}>
                          <div
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ background: item.gradient }}
                          >
                            {(() => {
                              const src = item.images?.[0];
                              return src ? (
                                <Image
                                  src={src}
                                  alt={item.name}
                                  fill
                                  draggable={false}
                                  sizes="(max-width: 640px) 80px, 96px"
                                  style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    pointerEvents: 'none',
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-8 h-16 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/urunler/${item.slug}`}
                                className="text-sm sm:text-base font-bold text-[#2d2d2d] hover:text-[#b76e79] transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[10px] text-[#b76e79] tracking-wider uppercase font-semibold mt-0.5">
                                {item.tagline}
                              </p>
                              <p className="text-[11px] text-[#a3a3a3] mt-0.5">{item.volume}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#d4d4d4] hover:text-red-400 transition-colors p-1 shrink-0"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-[#e5e5e5] rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#2d2d2d] border-x border-[#e5e5e5]">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-base font-bold text-[#2d2d2d]">
                              ₺{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Free shipping progress bar */}
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl border border-[#f0e8e4]"
                      style={{ padding: "1rem 1.25rem" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={14} className="text-[#b76e79]" />
                        <p className="text-xs text-[#525252]">
                          Ücretsiz kargo için{" "}
                          <span className="font-bold text-[#b76e79]">
                            ₺{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                          </span>{" "}
                          daha ekle!
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0e8e4] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(to right, #b76e79, #e890a8)" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Summary */}
                <div className="cart-summary-sticky">
                  <div className="bg-white rounded-3xl border border-[#f0e8e4]" style={{ padding: "2rem" }}>
                    <h3 className="text-lg font-bold text-[#2d2d2d] mb-6">Sipariş Özeti</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#737373]">Ara Toplam ({count} ürün)</span>
                        <span className="font-semibold">₺{subtotal.toFixed(2)}</span>
                      </div>
                      {/* Discount breakdown */}
                      {breakdown.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-green-600 flex items-center gap-1">
                            {item.type === "cart_coupon" && <Tag size={11} />}
                            {item.type === "product" && <Percent size={11} />}
                            {item.type === "bxgy" && <Gift size={11} />}
                            {item.type === "threshold" && <Zap size={11} />}
                            {item.label}
                            {item.sublabel && <span className="text-[10px] opacity-70">({item.sublabel})</span>}
                          </span>
                          <span className="font-semibold text-green-600">−₺{item.amount.toFixed(2)}</span>
                        </motion.div>
                      ))}
                      <div className="flex justify-between text-sm">
                        <span className="text-[#737373]">Kargo</span>
                        <span className="font-semibold">
                          {shipping === 0 ? (
                            <span className="text-green-600">Ücretsiz</span>
                          ) : (
                            `₺${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="h-px bg-[#f0e8e4]" />
                      <div className="flex justify-between">
                        <span className="font-bold text-[#2d2d2d]">Toplam</span>
                        <span className="text-xl font-extrabold text-[#2d2d2d]">₺{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    {!couponApplied ? (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                          <div style={{ flex: 1 }}>
                            <GBInput
                              name="kupon"
                              placeholder="Kupon Kodun"
                              label="Kupon Kodu"
                              value={couponCode}
                              onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                              onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                            />
                          </div>
                          <GBButton variant="secondary" size="md" onClick={handleCoupon}>
                            Uygula
                          </GBButton>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-500 mt-1">{couponError}</p>
                        )}
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between bg-green-50 rounded-xl border border-green-100"
                        style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem" }}
                      >
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-green-600" />
                          <span className="text-xs font-semibold text-green-700">{appliedCouponCode} uygulandı</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-[10px] text-green-600 hover:text-green-800 font-semibold"
                        >
                          Kaldır
                        </button>
                      </div>
                    )}

                    {/* Carrier info */}
                    {activeCarrier && (
                      <div className="flex items-center gap-2 text-xs text-[#737373] mb-3">
                        <Package size={12} className="text-[#b76e79] shrink-0" />
                        <span>
                          <strong className="text-[#2d2d2d]">{activeCarrier.name}</strong> ile kargo
                          {activeCarrier.estimatedDays ? ` · Tahmini ${activeCarrier.estimatedDays} iş günü` : ""}
                        </span>
                      </div>
                    )}

                    <GBButton
                      href="/odeme"
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ShieldCheck size={16} />}
                      style={{ marginBottom: "1rem" }}
                    >
                      Güvenli Ödeme
                    </GBButton>

                    <div className="text-center">
                      <Link
                        href="/urunler"
                        className="text-[11px] text-[#b76e79] font-semibold tracking-wider uppercase hover:underline"
                      >
                        Alışverişe Devam Et →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
