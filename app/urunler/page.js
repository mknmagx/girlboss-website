"use client";

import { motion } from "framer-motion";
import { Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/data/products";
import { useState } from "react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import ProductCard from "@/lib/components/ProductCard";
import GBSelect from "@/lib/components/ui/GBSelect";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function UrunlerPage() {
  const [sortBy, setSortBy] = useState("default");

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <Sparkles size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Koleksiyon</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#2d2d2d] mb-6">
              Tüm{" "}
              <span className="gb-gradient-text">Ürünler</span>
            </h1>
            <p className="text-[#737373] text-sm leading-relaxed" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
              6 eşsiz body mist arasından sana en uygun olanı keşfet.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="section-pad">
        <div className="gb-container">
          {/* Sort bar */}
          <div className="hero-fade-1"
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0e8e4' }}>
            <p className="text-sm text-[#737373]">
              <span className="font-semibold text-[#2d2d2d]">{products.length}</span> ürün gösteriliyor
            </p>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-[#b76e79]" />
              <div style={{ minWidth: '220px' }}>
                <GBSelect
                  name="sortBy"
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  options={[
                    { value: 'default', label: 'Varsayılan Sıralama' },
                    { value: 'price-asc', label: 'Fiyat: Düşükten Yüksek’e' },
                    { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
                    { value: 'name', label: 'İsme Göre (A-Z)' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
