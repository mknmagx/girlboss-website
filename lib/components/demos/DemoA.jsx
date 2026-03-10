"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Star, ChevronRight, Sparkles, Heart } from "lucide-react";
import { products, brand } from "@/lib/data/products";
import { useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DEMO A — "Noir Velvet"
   Victoria's Secret Dark Luxe Style
   Dark backgrounds, rose gold accents, dramatic animations
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" },
  }),
};

// ─── Navbar ─────────────────────────────────
function NavbarDark() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold tracking-[0.3em] text-shimmer cursor-pointer"
        >
          {brand.name}
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["Koleksiyon", "Hakkımızda", "Blog", "İletişim"].map((item, i) => (
            <motion.a
              key={item}
              href="#"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-sm tracking-[0.15em] uppercase text-[#a3a3a3] hover:text-[#d4a0a7] transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#b76e79] transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2"
          >
            <Heart size={20} className="text-[#a3a3a3] hover:text-[#d4a0a7] transition-colors" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2"
          >
            <ShoppingBag size={20} className="text-[#a3a3a3] hover:text-[#d4a0a7] transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b76e79] rounded-full text-[10px] text-white flex items-center justify-center">0</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ───────────────────────────
function HeroDark() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden gradient-bg-animated">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#b76e79]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(183,110,121,0.15) 0%, transparent 60%)",
      }} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6"
        >
          <Sparkles size={32} className="text-[#b76e79] mx-auto mb-4" />
          <p className="text-sm tracking-[0.4em] uppercase text-[#d4a0a7]">
            Lüks Body Mist Koleksiyonu
          </p>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.2em] text-shimmer mb-6"
        >
          {brand.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-xl md:text-2xl text-[#a3a3a3] font-light tracking-widest mb-10 max-w-xl"
        >
          {brand.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(183,110,121,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-[#b76e79] text-white text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[#c4587a] transition-colors duration-300"
          >
            Koleksiyonu Keşfet
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 border border-[#b76e79]/40 text-[#d4a0a7] text-sm tracking-[0.2em] uppercase rounded-full hover:border-[#b76e79] hover:bg-[#b76e79]/10 transition-all duration-300"
          >
            Hikayemiz
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border border-[#b76e79]/40 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2.5 bg-[#b76e79] rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Product Card Dark ─────────────────────
function ProductCardDark({ product, index }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#2d2d2d] hover:border-[#b76e79]/40 transition-all duration-500"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#b76e79] text-white text-[10px] tracking-[0.2em] uppercase rounded-full">
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
      >
        <Heart size={16} className="text-[#a3a3a3] hover:text-[#b76e79]" />
      </motion.button>

      {/* Product Visual */}
      <div
        className="relative h-72 flex items-center justify-center overflow-hidden"
        style={{ background: product.gradient }}
      >
        <motion.div
          className="w-24 h-48 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl"
          whileHover={{ rotateY: 15, rotateZ: -3 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))`,
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-3">
            <div className="w-4 h-4 rounded-full mb-2" style={{ background: product.color }} />
            <div className="text-[8px] tracking-[0.2em] uppercase text-white/80 font-semibold text-center">
              {brand.name}
            </div>
            <div className="text-[6px] tracking-wider text-white/60 text-center mt-1">
              {product.name}
            </div>
          </div>
        </motion.div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent opacity-60" />
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className="fill-[#c4a265] text-[#c4a265]" />
          ))}
          <span className="text-[10px] text-[#737373] ml-1">(128)</span>
        </div>

        <h3 className="text-lg font-semibold text-white tracking-wide mb-1">{product.name}</h3>
        <p className="text-xs text-[#737373] tracking-wider uppercase mb-3">{product.tagline}</p>
        <p className="text-xs text-[#a3a3a3] line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

        {/* Notes */}
        <div className="flex gap-2 mb-4">
          {Object.entries(product.notes).map(([key, val]) => (
            <span
              key={key}
              className="text-[9px] px-2 py-1 rounded-full bg-[#1f1f1f] text-[#a3a3a3] border border-[#2d2d2d]"
            >
              {val}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-[#d4a0a7]">₺{product.price}</span>
            <span className="text-[10px] text-[#525252] ml-1">/ {product.volume}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#b76e79] hover:bg-[#c4587a] text-white text-xs tracking-wider uppercase rounded-full transition-colors"
          >
            <ShoppingBag size={14} />
            Sepete Ekle
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Products Section ───────────────────────
function ProductSectionDark() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #b76e79 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.4em] uppercase text-[#b76e79] mb-4">Koleksiyon</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide mb-4">
            Kendini <span className="text-shimmer">Keşfet</span>
          </h2>
          <p className="text-[#737373] max-w-lg mx-auto">
            Her biri özel olarak formüle edilmiş 6 eşsiz koku. Hangisi senin ruhunun yansıması?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCardDark key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feature Banner ─────────────────────────
function FeatureBannerDark() {
  return (
    <section className="py-20 bg-[#0f0f0f] relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(183,110,121,0.08) 0%, transparent 50%)",
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: "✦", title: "Vegan & Cruelty-Free", desc: "Hayvan testine hayır. Doğanın gücüyle formüle edildi." },
            { icon: "❋", title: "Uzun Süre Kalıcı", desc: "12 saate kadar kalıcı koku. Günün her anında yanınızda." },
            { icon: "◆", title: "Premium Formül", desc: "Fransız parfüm ustaları ile geliştirilmiş özel formülasyon." },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-[#b76e79]">{item.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-2">{item.title}</h3>
              <p className="text-sm text-[#737373]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────
function CTASectionDark() {
  return (
    <section className="py-24 relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #1a0a10, #0a0a0a)",
    }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 50%, rgba(183,110,121,0.12) 0%, transparent 50%)",
      }} />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center px-6 relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Kendine Bir <span className="text-shimmer">Lüks</span> Hediye Et
        </h2>
        <p className="text-[#a3a3a3] mb-10 text-lg">
          İlk siparişinde %15 indirim kazanmak için üye ol.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="flex-1 px-6 py-3 bg-[#1f1f1f] border border-[#2d2d2d] rounded-full text-white placeholder-[#525252] focus:outline-none focus:border-[#b76e79] transition-colors text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#b76e79] text-white text-sm tracking-wider uppercase rounded-full hover:bg-[#c4587a] transition-colors"
          >
            Katıl
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────
function FooterDark() {
  return (
    <footer className="py-12 bg-[#0a0a0a] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-bold tracking-[0.3em] text-shimmer">{brand.name}</div>
          <div className="flex gap-8">
            {["Ürünler", "Hakkımızda", "İletişim", "SSS"].map((item) => (
              <a key={item} href="#" className="text-xs tracking-wider uppercase text-[#525252] hover:text-[#d4a0a7] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-[#404040]">© 2026 {brand.name}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════
export default function DemoA() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <NavbarDark />
      <HeroDark />
      <ProductSectionDark />
      <FeatureBannerDark />
      <CTASectionDark />
      <FooterDark />
    </div>
  );
}
