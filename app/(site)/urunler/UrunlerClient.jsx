"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import ProductCard from "@/lib/components/ProductCard";
import GBSelect from "@/lib/components/ui/GBSelect";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function UrunlerClient({ products }) {
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
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "820px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background image — next/image ile preload + WebP/AVIF otomatik */}
        <Image
          src="https://res.cloudinary.com/dnfmvs2ci/image/upload/v1773692691/mkngroup/girlboss/owOvV4K0fvLF-u7FZSHac_gK8icfsj_mgitlt.png"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "bottom",
            pointerEvents: "none",
          }}
        />
        {/* Gradient overlay — left dark, right transparent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(20,10,14,0.78) 0%, rgba(20,10,14,0.55) 45%, rgba(20,10,14,0.15) 75%, transparent 100%)",
          }}
        />
        {/* Bottom fade to page bg */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, transparent, #fdf8f5)",
          }}
        />

        {/* Content */}
        <div
          className="gb-container"
          style={{
            position: "relative",
            zIndex: 10,
            paddingTop: "9rem",
            paddingBottom: "5rem",
          }}
        >
          <div className="hero-fade" style={{ maxWidth: "540px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 1rem",
                background: "rgba(183,110,121,0.25)",
                border: "1px solid rgba(183,110,121,0.45)",
                borderRadius: "9999px",
                marginBottom: "1.25rem",
                backdropFilter: "blur(6px)",
              }}
            >
              <Sparkles size={13} style={{ color: "#f4c2c8" }} />
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "#f4c2c8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Koleksiyon
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              Tüm <span style={{ color: "#f4a8b0" }}>Ürünler</span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "26rem",
              }}
            >
              6 eşsiz body mist arasından sana en uygun olanı keşfet. Her koku,
              bir hikaye anlatır.
            </p>
          </div>
        </div>
      </section>

      {/* Campaign Ticker Banner */}
      <style>{`
        @keyframes gb-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .gb-campaign-track {
          animation: gb-marquee 32s linear infinite;
        }
        .gb-campaign-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div
        style={{
          background:
            "linear-gradient(90deg, #1e0d12 0%, #2e1119 50%, #1e0d12 100%)",
          overflow: "hidden",
          height: "46px",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid rgba(183,110,121,0.18)",
          borderBottom: "1px solid rgba(183,110,121,0.18)",
        }}
      >
        <div
          className="gb-campaign-track"
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {[0, 1].map((k) => (
            <span
              key={k}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              {/* Item 1 */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0 2.5rem",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#f4a8b0", fontSize: "0.55rem" }}>✦</span>
                Kaydol · İlk Siparişine
                <span
                  style={{
                    color: "#fbd4d9",
                    fontWeight: 800,
                    marginLeft: "0.2rem",
                  }}
                >
                  %10 İndirim
                </span>
              </span>
              <span style={{ color: "#7a3d4a", fontSize: "0.5rem" }}>◆</span>

              {/* Item 2 */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0 2.5rem",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#f4a8b0", fontSize: "0.55rem" }}>✦</span>
                <span style={{ color: "#fbd4d9", fontWeight: 800 }}>
                  Ücretsiz Kargo
                </span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  · Tüm Siparişlerde
                </span>
              </span>
              <span style={{ color: "#7a3d4a", fontSize: "0.5rem" }}>◆</span>

              {/* Item 3 */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0 2.5rem",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#f4a8b0", fontSize: "0.55rem" }}>✦</span>
                <span style={{ color: "#fbd4d9", fontWeight: 800 }}>
                  3 Al 2 Öde
                </span>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>
                  · Sınırlı Süre
                </span>
              </span>
              <span style={{ color: "#7a3d4a", fontSize: "0.5rem" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filters & Products */}
      <section className="section-pad">
        <div className="gb-container">
          {/* Sort bar */}
          <div
            className="hero-fade-1"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "2.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #f0e8e4",
              position: "relative",
              zIndex: 10,
            }}
          >
            <p className="text-sm text-[#737373]">
              <span className="font-semibold text-[#2d2d2d]">
                {sorted.length}
              </span>{" "}
              ürün gösteriliyor
            </p>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-[#b76e79]" />
              <div style={{ minWidth: "220px", position: "relative", zIndex: 20 }}>
                <GBSelect
                  name="sortBy"
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  options={[
                    { value: "default", label: "Varsayılan Sıralama" },
                    { value: "price-asc", label: "Fiyat: Düşükten Yüksek'e" },
                    { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
                    { value: "name", label: "İsme Göre (A-Z)" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
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
