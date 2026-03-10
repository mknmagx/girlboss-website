"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { products } from "@/lib/data/products";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function FavorilerPage() {
  const { favorites, toggle, isFavorite } = useFavorites();
  const { addItem, inCart } = useCart();

  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: "2rem" }}>
        <div className="gb-container" style={{ textAlign: "center" }}>
          <div className="hero-fade">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "4rem",
                height: "4rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
                marginBottom: "1.5rem",
                boxShadow: "0 8px 32px rgba(183,110,121,0.25)",
              }}
            >
              <Heart size={22} className="text-white" fill="white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d2d2d] mb-3">
              Favori{" "}
              <span className="gb-gradient-text">Kokularım</span>
            </h1>
            <p className="text-sm text-[#737373]">
              {favProducts.length > 0
                ? `${favProducts.length} ürün listenizde`
                : "Henüz favori eklemediniz"}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="gb-container">
          <AnimatePresence mode="wait">
            {favProducts.length === 0 ? (
              /* ─── Empty State ─── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }}
              >
                {/* Decorative hearts */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: "7rem",
                      height: "7rem",
                      borderRadius: "9999px",
                      background: "linear-gradient(135deg, #fde8ee, #fce4ec)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                    }}
                  >
                    <Heart size={40} className="text-[#e0b4be]" />
                  </div>
                  {[
                    { size: 10, top: "-0.25rem", right: "-0.5rem", delay: 0 },
                    { size: 8, bottom: "0.5rem", left: "-0.75rem", delay: 0.15 },
                    { size: 12, top: "1.5rem", left: "-1.25rem", delay: 0.3 },
                  ].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: h.delay, type: "spring", stiffness: 200 }}
                      style={{
                        position: "absolute",
                        top: h.top,
                        bottom: h.bottom,
                        left: h.left,
                        right: h.right,
                        width: `${h.size * 4}px`,
                        height: `${h.size * 4}px`,
                        borderRadius: "9999px",
                        background: "linear-gradient(135deg, #b76e79, #e890a8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Heart size={h.size - 2} className="text-white" fill="white" />
                    </motion.div>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-[#2d2d2d] mb-2">
                  Favori Listeniz Boş
                </h2>
                <p className="text-sm text-[#737373] mb-8" style={{ maxWidth: "28rem", margin: "0 auto 2rem" }}>
                  Beğendiğiniz ürünlerin kalp ikonuna tıklayarak favorilerinize ekleyin.
                  Listeniz burada sizi bekliyor olacak.
                </p>

                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-block" }}
                >
                  <Link
                    href="/urunler"
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
                    <Sparkles size={15} />
                    Koleksiyonu Keşfet
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* ─── Products Grid ─── */
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.75rem",
                  }}
                >
                  <AnimatePresence>
                    {favProducts.map((product, i) => (
                      <FavCard
                        key={product.id}
                        product={product}
                        index={i}
                        onRemove={() => toggle(product.id)}
                        onAddToCart={() => addItem(product)}
                        inCart={inCart(product.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer actions */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{
                    marginTop: "3.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <p className="text-xs text-[#a3a3a3] text-center">
                    {favProducts.length} ürün • Beğendiklerinizi sepete ekleyebilirsiniz
                  </p>
                  <Link
                    href="/urunler"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 1.5rem",
                      border: "1.5px solid #e8d8d4",
                      color: "#b76e79",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      borderRadius: "9999px",
                      transition: "all 0.2s",
                    }}
                    className="hover:bg-[#fdf0f0]"
                  >
                    Alışverişe Devam Et <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Individual Favorite Card ─── */
function FavCard({ product, index, onRemove, onAddToCart, inCart }) {
  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
      custom={index}
      className="group bg-white rounded-3xl border border-[#f0e8e4] overflow-hidden hover:shadow-[0_16px_48px_rgba(183,110,121,0.12)] hover:border-[#fecdd3] transition-all duration-500"
    >
      {/* Visual */}
      <div
        className="relative overflow-hidden flex items-end justify-center"
        style={{ background: product.gradient, height: "14rem" }}
      >
        {/* Remove button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          title="Favorilerden Çıkar"
          style={{
            position: "absolute",
            top: "0.875rem",
            right: "0.875rem",
            zIndex: 10,
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Heart size={14} fill="#b76e79" className="text-[#b76e79]" />
        </motion.button>

        {/* Product image */}
        <div style={{ width: '72%', height: '92%', flexShrink: 0 }}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-36 rounded-xl bg-white/25 backdrop-blur-sm border border-white/40 shadow-xl">
                <div className="h-full flex flex-col items-center justify-center p-2.5">
                  <div
                    className="w-4 h-4 rounded-full mb-2"
                    style={{ background: product.color, boxShadow: `0 0 16px ${product.color}50` }}
                  />
                  <div className="text-[7px] tracking-[0.12em] uppercase text-white/90 font-bold text-center leading-tight">GIRLBOSS</div>
                  <div className="text-[5px] tracking-wider text-white/70 text-center mt-0.5">{product.name}</div>
                  <div className="text-[5px] text-white/50 mt-auto">{product.volume}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick view on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/urunler/${product.slug}`}
            className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-[#2d2d2d] text-[11px] tracking-wider font-semibold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-sm"
          >
            <ChevronRight size={13} /> Ürünü İncele
          </Link>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <Link
            href={`/urunler/${product.slug}`}
            className="text-[15px] font-bold text-[#2d2d2d] hover:text-[#b76e79] transition-colors"
          >
            {product.name}
          </Link>
          {product.badge && (
            <span
              style={{
                fontSize: "0.6rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {product.badge}
            </span>
          )}
        </div>

        <p className="text-[10px] text-[#b76e79] tracking-[0.12em] uppercase font-semibold mb-3">
          {product.tagline}
        </p>

        {/* Notes */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "1rem" }}>
          {Object.values(product.notes).map((val, i) => (
            <span
              key={i}
              className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf8f5] text-[#8a8a8a] border border-[#f0e8e4]"
            >
              {val}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid #f3efed",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#2d2d2d" }}>
            ₺{product.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddToCart}
          style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              background: inCart ? "#ffffff" : "linear-gradient(to right, #b76e79, #c4587a)",
              color: inCart ? "#b76e79" : "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              borderRadius: "9999px",
              border: inCart ? "1.5px solid #b76e79" : "none",
              cursor: "pointer",
              boxShadow: inCart ? "none" : "0 4px 12px rgba(183,110,121,0.3)",
            }}
          >
            <ShoppingBag size={12} />
            {inCart ? "Sepette ✓" : "Sepete Ekle"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
