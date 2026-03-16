"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  Leaf,
  Clock,
  Shield,
  ChevronRight,
  CreditCard,
  Building2,
  Truck,
  Package,
  CheckCircle,
  ThumbsUp,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useState, useRef } from "react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
import { useDiscounts } from "@/lib/hooks/useDiscounts";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import ProductCard from "@/lib/components/ProductCard";
import ProductImageCarousel from "@/lib/components/ProductImageCarousel";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FEATURE_ICONS = {
  leaf:   <Leaf size={20} />,
  clock:  <Clock size={20} />,
  shield: <Shield size={20} />,
};

export default function ProductClient({ product, related, reviews: allReviews, settings: siteSettings }) {
  const [qty, setQty] = useState(1);
  const { toggle, isFavorite } = useFavorites();
  const { addItem, inCart } = useCart();
  const { getProductDiscount } = useDiscounts();
  const disc = getProductDiscount(product.id, Number(product.price));

  const reviewsRef = useRef(null);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  /* ── Delivery dates ── */
  const fmt = (d) =>
    d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

  /* ── Computed reviews ── */
  const filteredReviews =
    reviewFilter === "helpful"
      ? [...allReviews].sort((a, b) => b.helpful - a.helpful)
      : reviewFilter === "5"
      ? allReviews.filter((r) => r.rating === 5)
      : reviewFilter === "4"
      ? allReviews.filter((r) => r.rating === 4)
      : reviewFilter === "low"
      ? allReviews.filter((r) => r.rating <= 3)
      : reviewFilter === "with-images"
      ? allReviews.filter((r) => r.images?.length > 0)
      : allReviews;
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 4);

  /* active carrier from settings */
  const activeCarrier = (siteSettings?.carriers ?? []).find((c) => c.enabled);

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div
        className="gb-container"
        style={{ paddingTop: "8rem", paddingBottom: "1.5rem" }}
      >
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-[#a3a3a3] mb-8"
        >
          <Link href="/" className="hover:text-[#b76e79] transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/urunler"
            className="hover:text-[#b76e79] transition-colors"
          >
            Ürünler
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#2d2d2d] font-medium">{product.name}</span>
        </motion.nav>
      </div>

      {/* Product Detail */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="gb-container">
          <div
            className="product-detail-grid"
            style={{
              display: "grid",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Product Visual — Carousel */}
            <div className="hero-fade">
              <ProductImageCarousel
                images={product.images || []}
                gradient={product.gradient}
                badge={product.badge}
                alt={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="hero-fade-1 flex flex-col justify-center">
              <p className="text-xs tracking-[0.2em] uppercase text-[#b76e79] font-bold mb-2">
                {product.tagline}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d2d2d] mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className="fill-[#c4a265] text-[#c4a265]"
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    reviewsRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm text-[#b76e79] font-semibold hover:underline"
                >
                  {product.reviewCount ?? allReviews.length} değerlendirme →
                </button>
              </div>

              <p className="text-sm text-[#525252] leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-sm tracking-wider uppercase text-[#2d2d2d] font-bold mb-3">
                  Koku Notaları
                </h3>
                <div
                  className="product-notes-grid"
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    marginBottom: "2rem",
                  }}
                >
                  {Object.entries(product.notes).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-white rounded-2xl p-4 border border-[#f0e8e4] text-center"
                    >
                      <p className="text-[11px] uppercase tracking-wider text-[#a3a3a3] mb-1">
                        {key === "top"
                          ? "Üst Nota"
                          : key === "middle"
                            ? "Orta Nota"
                            : "Alt Nota"}
                      </p>
                      <p className="text-sm font-semibold text-[#2d2d2d]">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mb-8">
                  <h3 className="text-sm tracking-wider uppercase text-[#2d2d2d] font-bold mb-2">
                    İçindekiler
                  </h3>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {/* Price & Actions */}
              {(() => {
                const displayPrice = disc ? disc.discountedPrice : product.price;
                const origForDisplay = disc ? product.price : (product.originalPrice ?? null);
                const pct = disc
                  ? disc.percent
                  : origForDisplay && origForDisplay > product.price
                    ? Math.round(((origForDisplay - product.price) / origForDisplay) * 100)
                    : 0;
                return (
                  <div className="flex items-end gap-3 mb-6">
                    <span
                      className="font-extrabold leading-none"
                      style={{ fontSize: "clamp(2rem,4vw,2.5rem)", color: "#2d2d2d", letterSpacing: "-0.03em" }}
                    >
                      ₺{Number(displayPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    {pct > 0 && origForDisplay && (
                      <>
                        <span className="text-sm text-[#c5bfbf] line-through font-medium mb-0.5">
                          ₺{Number(origForDisplay).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </span>
                        <span
                          className="text-[11px] font-extrabold px-2.5 py-1 rounded-full mb-0.5"
                          style={{ background: disc ? "#fee2e2" : "#fff0f3", color: disc ? "#dc2626" : "#b76e79" }}
                        >
                          -%{pct}
                        </span>
                      </>
                    )}
                    {disc && (
                      <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "#fee2e2", color: "#dc2626" }}>
                        {disc.label}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-[#2d2d2d]">
                  Adet:
                </span>
                <div className="flex items-center border border-[#e5e5e5] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#2d2d2d] border-x border-[#e5e5e5]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <GBButton
                  variant={inCart(product.id) ? "secondary" : "primary"}
                  size="lg"
                  icon={<ShoppingBag size={16} />}
                  style={{ flex: 1 }}
                  onClick={() => addItem(product, qty)}
                >
                  {inCart(product.id) ? "Sepette ✓" : "Sepete Ekle"}
                </GBButton>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(product.id)}
                  title={
                    isFavorite(product.id)
                      ? "Favorilerden Çıkar"
                      : "Favorilere Ekle"
                  }
                  className="w-14 h-14 rounded-full border flex items-center justify-center transition-colors shrink-0"
                  style={{
                    borderColor: isFavorite(product.id) ? "#b76e79" : "#e5e5e5",
                    background: isFavorite(product.id)
                      ? "#fff0f3"
                      : "transparent",
                  }}
                >
                  <Heart
                    size={18}
                    className="text-[#b76e79]"
                    fill={isFavorite(product.id) ? "#b76e79" : "none"}
                  />
                </motion.button>
              </div>

              {/* ── Payment Methods (from global settings) ── */}
              {(() => {
                const pm = siteSettings?.paymentMethods;
                const cc  = pm?.creditCard    ?? { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] };
                const cod = pm?.cashOnDelivery ?? { enabled: true, fee: 15 };
                const bt  = pm?.bankTransfer   ?? { enabled: false };
                if (!cc.enabled && !cod.enabled && !bt.enabled) return null;
                return (
                  <div
                    className="rounded-2xl border border-[#f0e8e4] bg-white overflow-hidden"
                    style={{ marginTop: "1.25rem" }}
                  >
                    <div
                      className="px-4 py-3 border-b border-[#f0e8e4]"
                      style={{ background: "#fdf8f5" }}
                    >
                      <p className="text-xs tracking-[0.15em] uppercase font-bold text-[#737373]">
                        Ödeme Yöntemleri
                      </p>
                    </div>
                    <div className="divide-y divide-[#f0e8e4]">
                      {cc.enabled && (
                        <div className="flex items-start gap-3.5 px-4 py-4">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "#fff0f3" }}
                          >
                            <CreditCard size={17} className="text-[#b76e79]" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#2d2d2d]">Kredi / Banka Kartı</p>
                            <p className="text-xs text-[#737373] mt-1">3D Secure ile güvenli ödeme</p>
                            {cc.cards?.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-2">
                                {cc.cards.map((c) => (
                                  <span
                                    key={c}
                                    className="text-[10px] font-extrabold px-2 py-0.5 rounded"
                                    style={{ background: "#f5f5f5", color: "#525252", letterSpacing: "0.04em" }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {cod.enabled && (
                        <div className="flex items-start gap-3.5 px-4 py-4">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "#f0faf4" }}
                          >
                            <Package size={17} className="text-[#3d9e6a]" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#2d2d2d]">Kapıda Ödeme</p>
                            <p className="text-xs text-[#737373] mt-1">
                              Nakit veya kart ile kapıda ödeme
                              {cod.fee ? ` · +₺${Number(cod.fee)} hizmet bedeli uygulanır` : ""}
                            </p>
                            <span
                              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-2"
                              style={{ background: "#e8f7ee", color: "#3d9e6a" }}
                            >
                              Mevcut
                            </span>
                          </div>
                        </div>
                      )}
                      {bt.enabled && (
                        <div className="flex items-start gap-3.5 px-4 py-4">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "#f0f4ff" }}
                          >
                            <Building2 size={17} className="text-[#4a6fa5]" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#2d2d2d]">Havale / EFT</p>
                            {bt.bankName && (
                              <p className="text-xs text-[#737373] mt-1">{bt.bankName}</p>
                            )}
                            <span
                              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-2"
                              style={{ background: "#eef2ff", color: "#4a6fa5" }}
                            >
                              Mevcut
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ── Delivery Timeline ── */}
              <div
                className="rounded-2xl border border-[#f0e8e4] bg-white overflow-hidden"
                style={{ marginTop: "0.75rem" }}
              >
                <div
                  className="px-4 py-3 border-b border-[#f0e8e4] flex items-center gap-2"
                  style={{ background: "#fdf8f5" }}
                >
                  <Truck size={14} className="text-[#b76e79]" />
                  <p className="text-xs tracking-[0.15em] uppercase font-bold text-[#737373]">
                    Tahmini Teslimat
                  </p>
                </div>
                <div className="px-4 py-5">
                  {[
                    {
                      icon: <CheckCircle size={16} />,
                      color: "#b76e79",
                      bg: "#fff0f3",
                      label: "Sipariş Verildi",
                      date: fmt(today),
                      desc: "Siparişin hemen onaylandı",
                    },
                    {
                      icon: <Package size={16} />,
                      color: "#c4a265",
                      bg: "#fdf6ec",
                      label: "Kargoya Verildi",
                      date: fmt(tomorrow),
                      desc: activeCarrier
                        ? `${activeCarrier.name} ile kargoya verilir`
                        : "Kargo şubesine teslim",
                    },
                    {
                      icon: <Truck size={16} />,
                      color: "#3d9e6a",
                      bg: "#f0faf4",
                      label: "Teslimat",
                      date: fmt(dayAfter),
                      desc: "Kapına teslim edilir",
                    },
                  ].map((step, i, arr) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: step.bg, color: step.color }}
                        >
                          {step.icon}
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            className="w-px flex-1 my-1"
                            style={{ minHeight: "1.5rem", background: "#f0e8e4" }}
                          />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold" style={{ color: step.color }}>
                            {step.label}
                          </p>
                          <p className="text-xs font-semibold text-right shrink-0" style={{ color: step.color }}>
                            {step.date}
                          </p>
                        </div>
                        <p className="text-xs text-[#737373] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-[#a3a3a3] border-t border-[#f0e8e4] pt-3 mt-1">
                    * Hafta içi saat 15:00&#39;e kadar verilen siparişler aynı gün kargoya verilir.
                    {activeCarrier?.estimatedDays ? ` Tahmini teslimat: ${activeCarrier.estimatedDays} iş günü.` : ""}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div
                className="product-features-grid"
                style={{
                  display: "grid",
                  gap: "1.25rem",
                  marginTop: "3.5rem",
                }}
              >
                {(product.features ?? []).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#f0e8e4]"
                  >
                    <span className="text-[#b76e79] shrink-0">{FEATURE_ICONS[f.icon] ?? <Leaf size={20} />}</span>
                    <span className="text-sm font-semibold text-[#525252]">
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Section ── */}
      <section ref={reviewsRef} id="reviews-section" className="section-pad" style={{ background: "#fdf8f5" }}>
        <div className="gb-container">

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-[#b76e79] font-bold mb-1">
              Müşteri Görüşleri
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d]">
              Değerlendirmeler
            </h2>
          </motion.div>

          {/* Rating summary */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="bg-white rounded-3xl border border-[#f0e8e4] p-6 mb-8 flex flex-col sm:flex-row items-center gap-8"
          >
            <div className="text-center shrink-0">
              <p className="text-6xl font-extrabold text-[#2d2d2d] leading-none">{product.rating ?? "—"}</p>
              <div className="flex items-center justify-center gap-1 mt-2 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-[#c4a265] text-[#c4a265]" />
                ))}
              </div>
              <p className="text-sm text-[#737373]">{product.reviewCount ?? allReviews.length} değerlendirme</p>
            </div>
            <div className="flex-1 w-full">
              {(product.ratingBreakdown ?? []).map((row) => (
                <div key={row.stars} className="flex items-center gap-3 mb-2.5">
                  <span className="text-sm font-semibold text-[#525252] w-4 shrink-0">{row.stars}</span>
                  <Star size={13} className="fill-[#c4a265] text-[#c4a265] shrink-0" />
                  <div className="flex-1 h-2.5 rounded-full bg-[#f0e8e4] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.pct}%`, background: "linear-gradient(to right, #b76e79, #c4a265)" }}
                    />
                  </div>
                  <span className="text-sm text-[#737373] w-8 shrink-0 text-right">{row.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Filter chips */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            {[
              { key: "all", label: "Tümü", count: allReviews.length },
              { key: "5", label: "5 Yıldız", count: allReviews.filter((r) => r.rating === 5).length },
              { key: "4", label: "4 Yıldız", count: allReviews.filter((r) => r.rating === 4).length },
              { key: "low", label: "3 ve altı", count: allReviews.filter((r) => r.rating <= 3).length },
              { key: "with-images", label: "Görselli", count: allReviews.filter((r) => r.images?.length > 0).length, icon: true },
              { key: "helpful", label: "En Faydalı" },
            ].map((chip) => {
              const active = reviewFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => { setReviewFilter(chip.key); setShowAll(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: active ? "#b76e79" : "#ffffff",
                    color: active ? "#ffffff" : "#525252",
                    border: `1.5px solid ${active ? "#b76e79" : "#e5e5e5"}`,
                    boxShadow: active ? "0 4px 14px rgba(183,110,121,0.3)" : "none",
                  }}
                >
                  {chip.icon && <ImageIcon size={13} />}
                  {chip.label}
                  {chip.count !== undefined && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: active ? "rgba(255,255,255,0.25)" : "#f0e8e4",
                        color: active ? "#fff" : "#b76e79",
                      }}
                    >
                      {chip.count}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Review cards */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base font-semibold text-[#525252] mb-1">Bu filtrede değerlendirme yok</p>
              <p className="text-sm text-[#a3a3a3]">Başka bir filtre seçmeyi deneyin.</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {displayedReviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i + 3}
                    className="bg-white rounded-2xl border border-[#f0e8e4] p-5 flex flex-col gap-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-extrabold text-white"
                          style={{
                            background: "linear-gradient(135deg, #b76e79, #c4a265)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {r.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2d2d2d]">{r.name}</p>
                          <p className="text-xs text-[#a3a3a3]">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={13}
                            className={idx < r.rating ? "fill-[#c4a265] text-[#c4a265]" : "fill-[#e5e5e5] text-[#e5e5e5]"}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div>
                      <p className="text-sm font-bold text-[#2d2d2d] mb-1.5">{r.title}</p>
                      <p className="text-sm text-[#737373] leading-relaxed">{r.body}</p>
                    </div>

                    {/* Review Images */}
                    {r.images?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                        {r.images.map((img, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setLightbox({ images: r.images, index: imgIdx })}
                            className="shrink-0 rounded-xl overflow-hidden border border-[#f0e8e4] relative group"
                            style={{ width: 88, height: 88 }}
                            aria-label="Görseli büyüt"
                          >
                            <Image
                              src={img}
                              alt={`Müşteri görseli ${imgIdx + 1}`}
                              fill
                              sizes="88px"
                              style={{ objectFit: 'cover', transition: 'transform 0.3s', transform: 'scale(1)' }}
                              className="transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
                          </button>
                        ))}
                        {r.images.length > 1 && (
                          <div
                            className="shrink-0 rounded-xl border border-[#f0e8e4] bg-[#fdf8f5] flex flex-col items-center justify-center gap-1"
                            style={{ width: 56, height: 88 }}
                          >
                            <ImageIcon size={14} className="text-[#b76e79]" />
                            <span className="text-[10px] font-bold text-[#b76e79]">{r.images.length}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#f0e8e4]">
                      <ThumbsUp size={13} className="text-[#a3a3a3]" />
                      <span className="text-xs text-[#a3a3a3]">{r.helpful} kişi faydalı buldu</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show more / less */}
              {filteredReviews.length > 4 && (
                <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
                  {!showAll ? (
                    <>
                      <button
                        onClick={() => setShowAll(true)}
                        className="px-6 py-3 rounded-full text-sm font-bold transition-all"
                        style={{
                          background: "white",
                          border: "1.5px solid #e5e5e5",
                          color: "#525252",
                        }}
                      >
                        Daha Fazla Göster ({filteredReviews.length - displayedReviews.length} daha)
                      </button>
                      <button
                        onClick={() => setShowAll(true)}
                        className="px-6 py-3 rounded-full text-sm font-bold transition-all"
                        style={{
                          background: "linear-gradient(135deg, #b76e79, #c4587a)",
                          color: "white",
                          border: "none",
                          boxShadow: "0 4px 16px rgba(183,110,121,0.35)",
                        }}
                      >
                        Tümünü Göster ({filteredReviews.length})
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAll(false)}
                      className="px-6 py-3 rounded-full text-sm font-bold transition-all"
                      style={{
                        background: "white",
                        border: "1.5px solid #e5e5e5",
                        color: "#525252",
                      }}
                    >
                      Daha Az Göster
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              <X size={20} />
            </button>

            {/* Prev */}
            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length })); }}
                className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
              src={lightbox.images[lightbox.index]}
              alt="Müşteri görseli"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: "82vh",
                maxWidth: "88vw",
                objectFit: "contain",
                borderRadius: "16px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            />

            {/* Next */}
            {lightbox.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.images.length })); }}
                className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronRightIcon size={22} />
              </button>
            )}

            {/* Dots */}
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-6 flex items-center gap-2">
                {lightbox.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: i })); }}
                    style={{
                      width: i === lightbox.index ? "1.5rem" : "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      background: i === lightbox.index ? "#fff" : "rgba(255,255,255,0.35)",
                      border: "none",
                      padding: 0,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      <section className="section-pad" style={{ background: "#ffffff" }}>
        <div className="gb-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d]">
              Bunları da <span className="gb-gradient-text">Sevebilirsin</span>
            </h2>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
