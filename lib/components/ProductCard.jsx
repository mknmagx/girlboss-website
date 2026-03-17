"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Heart,
  ArrowRight,
  Sparkles,
  Flame,
  Crown,
} from "lucide-react";
import { brand } from "@/lib/data/products";
import { useState } from "react";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
import { useDiscounts } from "@/lib/hooks/useDiscounts";

const BADGE_STYLES = {
  Bestseller: {
    background: "linear-gradient(135deg, #c97432, #e8960a)",
    icon: <Flame size={9} />,
    shadow: "0 2px 10px rgba(201,116,50,0.35)",
  },
  Yeni: {
    background: "linear-gradient(135deg, #b76e79, #e890a8)",
    icon: <Sparkles size={9} />,
    shadow: "0 2px 10px rgba(183,110,121,0.35)",
  },
  Premium: {
    background: "linear-gradient(135deg, #6b3fa0, #a855f7)",
    icon: <Crown size={9} />,
    shadow: "0 2px 10px rgba(107,63,160,0.35)",
  },
  Favoriler: {
    background: "linear-gradient(135deg, #e0407b, #f472b6)",
    icon: <Heart size={9} />,
    shadow: "0 2px 10px rgba(224,64,123,0.35)",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const { addItem, inCart } = useCart();
  const { getProductDiscount } = useDiscounts();
  const fav = isFavorite(product.id);
  const added = inCart(product.id);
  const disc = getProductDiscount(product.id, Number(product.price));

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(183,110,121,0.14)] transition-all duration-500 border border-[#f0e8e4] hover:border-[#fecdd3] relative">
        {/* Badge */}
        {product.badge &&
          (() => {
            const bs = BADGE_STYLES[product.badge] ?? BADGE_STYLES.Yeni;
            return (
              <div
                style={{
                  position: "absolute",
                  top: "0.875rem",
                  left: "0.875rem",
                  zIndex: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.625rem",
                  background: bs.background,
                  boxShadow: bs.shadow,
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                  color: "#ffffff",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}
              >
                {bs.icon}
                <span>{product.badge}</span>
              </div>
            );
          })()}

        {/* Discount badge */}
        {disc && (
          <div
            style={{
              position: "absolute",
              top: product.badge ? "2.75rem" : "0.875rem",
              left: "0.875rem",
              zIndex: 10,
              display: "inline-flex",
              alignItems: "center",
              padding: "0.2rem 0.5rem",
              background: "#dc2626",
              borderRadius: "9999px",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            -%{disc.percent}
          </div>
        )}

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          title={fav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            size={14}
            className="text-[#b76e79]"
            fill={fav ? "#b76e79" : "none"}
          />
        </motion.button>

        {/* Product Visual */}
        <div
          className="relative overflow-hidden flex items-end justify-center"
          style={{ background: product.gradient, height: "17rem" }}
        >
          {product.images?.[0] ? (
            <div style={{ position: "relative", width: "75%", height: "92%" }}>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority={index < 3}
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI0MCwyNDAsMC41KSIvPjwvc3ZnPg=="
                draggable={false}
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom",
                  pointerEvents: "none",
                  transform: isHovered
                    ? "scale(1.06) translateY(-4px)"
                    : "scale(1) translateY(0)",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.18))",
                }}
              />
            </div>
          ) : (
            /* Fallback placeholder when no image is set */
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-18 h-40 rounded-xl bg-white/25 backdrop-blur-sm border border-white/40 shadow-2xl">
                <div className="h-full flex flex-col items-center justify-center p-2.5">
                  <div
                    className="w-4 h-4 rounded-full mb-2"
                    style={{
                      background: product.color,
                      boxShadow: `0 0 16px ${product.color}50`,
                    }}
                  />
                  <div className="text-[7px] tracking-[0.12em] uppercase text-white/90 font-bold text-center leading-tight">
                    {brand.name}
                  </div>
                  <div className="text-[5px] tracking-wider text-white/70 text-center mt-0.5">
                    {product.name}
                  </div>
                  <div className="text-[5px] text-white/50 mt-auto">
                    {product.volume}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick view overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="absolute bottom-3 left-3 right-3"
              >
                <Link
                  href={`/urunler/${product.slug}`}
                  className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-[#2d2d2d] text-[11px] tracking-wider font-semibold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-sm"
                >
                  <ArrowRight size={13} />
                  Hızlı Bakış
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Info */}
        <div style={{ padding: "1.25rem" }}>
          {/* Title & Rating */}
          <div className="flex items-center justify-between mb-1">
            <Link
              href={`/urunler/${product.slug}`}
              className="text-[15px] font-bold text-[#2d2d2d] truncate pr-2 hover:text-[#b76e79] transition-colors"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={11} className="fill-[#c4a265] text-[#c4a265]" />
              <span className="text-[11px] text-[#737373] font-medium">
                4.8
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[10px] text-[#b76e79] tracking-[0.12em] uppercase font-semibold mb-2">
            {product.tagline}
          </p>

          {/* Notes */}
          <div className="flex flex-wrap gap-1 mb-3">
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
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-extrabold text-[#2d2d2d]">
                  ₺{Number(disc ? disc.discountedPrice : product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
                {disc ? (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>
                    -%{disc.percent}
                  </span>
                ) : (() => {
                  const orig = product.originalPrice;
                  if (!orig || orig <= product.price) return null;
                  const pct = Math.round(((orig - product.price) / orig) * 100);
                  return (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: "#fff0f3", color: "#b76e79" }}>
                      -%{pct}
                    </span>
                  );
                })()}
              </div>
              {disc ? (
                <span className="text-[10px] text-[#c5bfbf] line-through font-medium">
                  ₺{Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
              ) : (product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-[#c5bfbf] line-through font-medium">
                  ₺{Number(product.originalPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
              ))}
            </div>
            <GBButton
              variant={added ? "secondary" : "primary"}
              size="sm"
              icon={<ShoppingBag size={11} />}
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
            >
              {added ? "Sepette" : "Sepete Ekle"}
            </GBButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
