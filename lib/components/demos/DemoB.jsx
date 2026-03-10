"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Star, Heart, ArrowRight, Leaf, Clock, Award } from "lucide-react";
import { products, brand } from "@/lib/data/products";
import { useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DEMO B — "Soft Petal"
   Dior/Gucci Minimalist Light Elegance
   White/cream backgrounds, serif fonts, lots of whitespace
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: "easeOut" },
  }),
};

// ─── Navbar ─────────────────────────────────
function NavbarLight() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#f0e8e4]"
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-2xl tracking-[0.35em] text-[#2d2d2d] cursor-pointer"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {brand.name}
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {["Koleksiyon", "Dünyamız", "Journal", "İletişim"].map((item, i) => (
            <motion.a
              key={item}
              href="#"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-xs tracking-[0.2em] uppercase text-[#737373] hover:text-[#b76e79] transition-colors duration-300"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <motion.button whileHover={{ scale: 1.1 }} className="p-1">
            <Heart size={18} className="text-[#a3a3a3] hover:text-[#b76e79] transition-colors" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="relative p-1">
            <ShoppingBag size={18} className="text-[#a3a3a3] hover:text-[#b76e79] transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#b76e79] rounded-full text-[9px] text-white flex items-center justify-center">0</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ───────────────────────────
function HeroLight() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#fdf8f5]">
      {/* Soft gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-30" style={{
        background: "radial-gradient(circle, #fecdd3 0%, transparent 70%)",
      }} />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-20" style={{
        background: "radial-gradient(circle, #f7e7ce 0%, transparent 70%)",
      }} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-8"
      >
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-xs tracking-[0.5em] uppercase text-[#b76e79] mb-8"
        >
          Lüks Body Mist Koleksiyonu
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl md:text-7xl lg:text-8xl text-[#2d2d2d] mb-6 leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400 }}
        >
          {brand.name}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="w-16 h-px bg-[#b76e79] mb-8"
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="text-lg md:text-xl text-[#737373] font-light tracking-wider mb-12 max-w-md"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {brand.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col sm:flex-row gap-5"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group px-10 py-4 bg-[#2d2d2d] text-white text-xs tracking-[0.25em] uppercase flex items-center gap-3 hover:bg-[#404040] transition-colors"
          >
            Keşfet
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 border border-[#d4d4d4] text-[#525252] text-xs tracking-[0.25em] uppercase hover:border-[#b76e79] hover:text-[#b76e79] transition-all"
          >
            Hikayemiz
          </motion.button>
        </motion.div>

        {/* Scroll line */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#a3a3a3] rotate-90 origin-center">Scroll</span>
          <motion.div
            animate={{ height: [20, 40, 20] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px bg-[#b76e79]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Product Card Light ─────────────────────
function ProductCardLight({ product, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      className="group"
    >
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 items-stretch bg-white border border-[#f0e8e4] overflow-hidden hover:shadow-[0_20px_60px_rgba(183,110,121,0.08)] transition-all duration-700`}>
        {/* Product Visual */}
        <div
          className="relative w-full md:w-1/2 h-80 md:h-120 flex items-center justify-center overflow-hidden"
          style={{ background: product.gradient }}
        >
          {product.badge && (
            <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-white text-[#2d2d2d] text-[10px] tracking-[0.2em] uppercase">
              {product.badge}
            </div>
          )}

          <motion.div
            className="w-20 h-44 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 shadow-xl bottle-float"
            whileHover={{ scale: 1.05 }}
          >
            <div className="h-full flex flex-col items-center justify-center p-3">
              <div className="w-3 h-3 rounded-full mb-2" style={{ background: product.color }} />
              <div className="text-[7px] tracking-[0.15em] uppercase text-white/90 font-medium text-center">
                {brand.name}
              </div>
              <div className="text-[5px] tracking-wider text-white/70 text-center mt-0.5">
                {product.name}
              </div>
            </div>
          </motion.div>

          {/* Hover arrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
          >
            <ArrowRight size={16} className="text-[#2d2d2d]" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className="fill-[#c4a265] text-[#c4a265]" />
            ))}
            <span className="text-[10px] text-[#a3a3a3] ml-2">4.8 (128 değerlendirme)</span>
          </div>

          <h3
            className="text-2xl md:text-3xl text-[#2d2d2d] mb-2 tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {product.name}
          </h3>
          <p className="text-xs tracking-[0.2em] uppercase text-[#b76e79] mb-5">{product.tagline}</p>
          <p className="text-sm text-[#737373] leading-relaxed mb-6">{product.description}</p>

          {/* Notes */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(product.notes).map(([key, val]) => (
              <div key={key} className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#a3a3a3] block mb-1">
                  {key === "top" ? "Üst" : key === "middle" ? "Orta" : "Alt"} Nota
                </span>
                <span className="text-xs text-[#525252] bg-[#fdf8f5] px-3 py-1.5 inline-block">
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-2xl text-[#2d2d2d]" style={{ fontFamily: "Georgia, serif" }}>
                ₺{product.price}
              </span>
              <span className="text-xs text-[#a3a3a3] ml-2">{product.volume}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-[#2d2d2d] text-white text-[11px] tracking-[0.15em] uppercase hover:bg-[#404040] transition-colors"
            >
              <ShoppingBag size={14} />
              Sepete Ekle
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Products Section ───────────────────────
function ProductSectionLight() {
  return (
    <section className="py-24 bg-[#fdf8f5]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.5em] uppercase text-[#b76e79] mb-5">La Collection</p>
          <h2
            className="text-4xl md:text-5xl text-[#2d2d2d] mb-4"
            style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
          >
            Koleksiyonumuz
          </h2>
          <div className="w-12 h-px bg-[#b76e79] mx-auto mb-6" />
          <p className="text-[#737373] max-w-md mx-auto text-sm leading-relaxed">
            Her biri benzersiz bir hikaye anlatan altı eşsiz koku. Zarafeti teninde hisset.
          </p>
        </motion.div>

        <div className="space-y-12">
          {products.map((product, i) => (
            <ProductCardLight key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Story Section ────────────────────
function BrandStoryLight() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { icon: <Leaf size={24} />, title: "Doğal & Vegan", desc: "Tüm ürünlerimiz %100 vegan ve cruelty-free formüllere sahiptir. Doğaya saygılı güzellik." },
            { icon: <Clock size={24} />, title: "12 Saat Kalıcılık", desc: "Premium formülasyonumuz sayesinde kokunuz sabahtan geceye kadar sizinle." },
            { icon: <Award size={24} />, title: "Premium Kalite", desc: "Fransa'nın en saygın parfüm evleriyle ortak geliştirilen özel bileşimler." },
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
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#e5e5e5] text-[#b76e79] mb-6 group-hover:border-[#b76e79] transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-lg text-[#2d2d2d] mb-3 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                {item.title}
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ─────────────────────
function NewsletterLight() {
  return (
    <section className="py-24 bg-[#f8e8e8]/30">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-xl mx-auto text-center px-6"
      >
        <p className="text-xs tracking-[0.5em] uppercase text-[#b76e79] mb-4">Bülten</p>
        <h2
          className="text-3xl md:text-4xl text-[#2d2d2d] mb-4"
          style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
        >
          Güzellik Dünyamıza Katılın
        </h2>
        <p className="text-sm text-[#737373] mb-10 leading-relaxed">
          İlk siparişinizde %15 indirim ve yeni ürünlerden ilk siz haberdar olun.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="flex-1 px-6 py-3.5 border border-[#e5e5e5] bg-white text-[#2d2d2d] placeholder-[#a3a3a3] focus:outline-none focus:border-[#b76e79] transition-colors text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 bg-[#2d2d2d] text-white text-xs tracking-[0.2em] uppercase hover:bg-[#404040] transition-colors"
          >
            Abone Ol
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────
function FooterLight() {
  return (
    <footer className="py-12 bg-white border-t border-[#f0e8e4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div
            className="text-xl tracking-[0.35em] text-[#2d2d2d]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {brand.name}
          </div>
          <div className="flex gap-8">
            {["Ürünler", "Hakkımızda", "İletişim", "Gizlilik"].map((item) => (
              <a key={item} href="#" className="text-[11px] tracking-wider uppercase text-[#a3a3a3] hover:text-[#b76e79] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-[#d4d4d4]">© 2026 {brand.name}</p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════
export default function DemoB() {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <NavbarLight />
      <HeroLight />
      <ProductSectionLight />
      <BrandStoryLight />
      <NewsletterLight />
      <FooterLight />
    </div>
  );
}
