"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  Leaf,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react";
import { products, brand } from "@/lib/data/products";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
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

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const [qty, setQty] = useState(1);
  const { toggle, isFavorite } = useFavorites();
  const { addItem, inCart } = useCart();

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

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
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#b76e79] font-bold mb-2">
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
                      size={14}
                      className="fill-[#c4a265] text-[#c4a265]"
                    />
                  ))}
                </div>
                <span className="text-xs text-[#a3a3a3]">
                  (128 değerlendirme)
                </span>
              </div>

              <p className="text-sm text-[#737373] leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-xs tracking-wider uppercase text-[#2d2d2d] font-bold mb-3">
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
                      <p className="text-[9px] uppercase tracking-wider text-[#a3a3a3] mb-1">
                        {key === "top"
                          ? "Üst Nota"
                          : key === "middle"
                            ? "Orta Nota"
                            : "Alt Nota"}
                      </p>
                      <p className="text-xs font-semibold text-[#2d2d2d]">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-extrabold text-[#2d2d2d]">
                  ₺{product.price}
                </span>
                <span className="text-sm text-[#a3a3a3] line-through">
                  ₺{(product.price * 1.2).toFixed(2)}
                </span>
              </div>

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

              {/* Features */}
              <div
                className="product-features-grid"
                style={{
                  display: "grid",
                  gap: "1.25rem",
                  marginTop: "3.5rem",
                }}
              >
                {[
                  { icon: <Leaf size={20} />, text: "%100 Vegan" },
                  { icon: <Clock size={20} />, text: "12h Kalıcılık" },
                  { icon: <Shield size={20} />, text: "Dermatolog Onaylı" },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#f0e8e4]"
                  >
                    <span className="text-[#b76e79] shrink-0">{f.icon}</span>
                    <span className="text-xs font-semibold text-[#525252]">
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
