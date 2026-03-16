"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Star, Heart, ArrowRight, Sparkles, Play,
  ChevronDown, Menu, X, MapPin, Phone, Mail, Instagram,
  Facebook, Twitter, Leaf, Clock, Award, Shield
} from "lucide-react";
import { products, brand } from "@/lib/data/products";
import { useRef, useState } from "react";

/* ===========================================================
   GIRLBOSS — Rose Luxe Theme (Production)
   =========================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Navbar ──────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Ürünler", "Hikaye", "Blog", "İletişim"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-3 sm:mx-5 mt-3 sm:mt-4 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl glass-effect-light">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.a href="/" whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5 cursor-pointer">
            <img src="/icon.png" alt="GIRLBOSS" className="h-10 w-auto" />
            <span className="text-lg font-bold tracking-[0.2em] text-[#2d2d2d]">{brand.name}</span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((item, i) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="text-sm text-[#525252] hover:text-[#b76e79] transition-colors duration-300 font-medium"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <motion.button whileHover={{ scale: 1.1 }} className="hidden sm:flex w-10 h-10 rounded-full bg-white/80 shadow-sm items-center justify-center">
              <Heart size={16} className="text-[#b76e79]" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="relative w-10 h-10 rounded-full bg-[#b76e79] shadow-sm flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2d2d2d] rounded-full text-[9px] text-white flex items-center justify-center font-bold">0</span>
            </motion.button>
            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
              {menuOpen ? <X size={18} className="text-[#2d2d2d]" /> : <Menu size={18} className="text-[#2d2d2d]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mx-3 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-[#f0e8e4] overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {links.map((item) => (
                <a key={item} href="#" onClick={() => setMenuOpen(false)} className="text-base font-medium text-[#2d2d2d] hover:text-[#b76e79] transition-colors py-1">
                  {item}
                </a>
              ))}
              <div className="h-px bg-[#f0e8e4]" />
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-[#fdf8f5] text-[#b76e79] text-sm font-semibold rounded-xl">Giriş Yap</button>
                <button className="flex-1 py-2.5 bg-[#b76e79] text-white text-sm font-semibold rounded-xl">Kayıt Ol</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── Hero ────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0 gradient-bg-blush" />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #b76e79 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #c4a265 0%, transparent 70%)" }}
        />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Play button */}
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }} className="mb-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
            style={{ boxShadow: "0 0 0 15px rgba(255,255,255,0.2), 0 0 0 30px rgba(255,255,255,0.1)" }}
          >
            <Play size={24} className="text-[#b76e79] ml-1" />
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#b76e79]" />
          <p className="text-xs tracking-[0.4em] uppercase text-[#b76e79] font-semibold">Yeni Koleksiyon 2026</p>
          <div className="h-px w-8 bg-[#b76e79]" />
        </motion.div>

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#2d2d2d] mb-4 leading-[0.95]">
          Kokunla<br />
          <span className="bg-linear-to-r from-[#b76e79] via-[#c4587a] to-[#e890a8] bg-clip-text text-transparent">Hükmet</span>
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-base md:text-lg text-[#737373] font-light mb-10 max-w-md leading-relaxed">
          Kendine güvenen kadınlar için tasarlanmış 6 eşsiz body mist. Her biri bir hikaye, her biri bir güç.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-col sm:flex-row gap-4">
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(183,110,121,0.3)" }} whileTap={{ scale: 0.95 }}
            className="group px-10 py-4 bg-linear-to-r from-[#b76e79] to-[#c4587a] text-white text-sm tracking-wider font-semibold rounded-full flex items-center gap-2 shadow-lg">
            Koleksiyonu Gör
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white/80 text-[#2d2d2d] text-sm tracking-wider font-semibold rounded-full shadow-sm hover:bg-white transition-colors">
            Hakkımızda
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={20} className="text-[#b76e79]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Section Divider (decorative) ────────── */
function Divider({ bg = "#fdf8f5" }) {
  return (
    <div className="relative h-16 sm:h-24 overflow-hidden" style={{ background: bg }}>
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

/* ─── Product Card ────────────────────────── */
function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(183,110,121,0.14)] transition-all duration-500 border border-[#f0e8e4] hover:border-[#fecdd3]">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-linear-to-r from-[#b76e79] to-[#e890a8] text-white text-[10px] tracking-wider font-bold uppercase rounded-full">
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors">
          <Heart size={14} className="text-[#b76e79]" />
        </motion.button>

        {/* Product Visual */}
        <div className="relative h-64 sm:h-72 overflow-hidden" style={{ background: product.gradient }}>
          <motion.div
            animate={isHovered ? { scale: 1.08, y: -8 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[72px] h-40 rounded-xl bg-white/25 backdrop-blur-sm border border-white/40 shadow-2xl">
              <div className="h-full flex flex-col items-center justify-center p-2.5">
                <div className="w-4 h-4 rounded-full mb-2" style={{ background: product.color, boxShadow: `0 0 16px ${product.color}50` }} />
                <div className="text-[7px] tracking-[0.12em] uppercase text-white/90 font-bold text-center leading-tight">{brand.name}</div>
                <div className="text-[5px] tracking-wider text-white/70 text-center mt-0.5">{product.name}</div>
                <div className="text-[5px] text-white/50 mt-auto">{product.volume}</div>
              </div>
            </div>
          </motion.div>

          {/* Quick view overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                className="absolute bottom-3 left-3 right-3">
                <button className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-[#2d2d2d] text-[11px] tracking-wider font-semibold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-sm">
                  <ArrowRight size={13} />Hızlı Bakış
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Info */}
        <div className="p-4 sm:p-5">
          {/* Title & Rating */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold text-[#2d2d2d] truncate pr-2">{product.name}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={11} className="fill-[#c4a265] text-[#c4a265]" />
              <span className="text-[11px] text-[#737373] font-medium">4.8</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[10px] text-[#b76e79] tracking-[0.12em] uppercase font-semibold mb-2">{product.tagline}</p>

          {/* Notes */}
          <div className="flex flex-wrap gap-1 mb-3">
            {Object.values(product.notes).map((val, i) => (
              <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf8f5] text-[#8a8a8a] border border-[#f0e8e4]">{val}</span>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-[#f3efed]">
            <span className="text-base font-bold text-[#2d2d2d]">₺{product.price}</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#b76e79] hover:bg-[#a35e68] text-white text-[10px] tracking-wider font-bold uppercase rounded-full transition-colors flex items-center gap-1.5">
              <ShoppingBag size={11} />Sepete Ekle
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Products Section ────────────────────── */
function ProductsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#fdf8f5]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
            <Sparkles size={14} className="text-[#b76e79]" />
            <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">6 Eşsiz Koku</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d2d2d] mb-4">
            Hangi Koku{" "}
            <span className="bg-linear-to-r from-[#b76e79] to-[#c4587a] bg-clip-text text-transparent">Senin?</span>
          </h2>
          <p className="text-[#737373] max-w-lg mx-auto text-sm leading-relaxed">
            Her biri özenle hazırlanmış, kendine güvenen kadınlara ilham veren koleksiyonumuz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Section ────────────────────── */
function FeaturesSection() {
  const feats = [
    { icon: <Leaf size={24} />, title: "Doğal & Vegan", desc: "Tüm ürünlerimiz %100 vegan ve cruelty-free. Doğaya saygılı güzellik." },
    { icon: <Clock size={24} />, title: "12 Saat Kalıcılık", desc: "Premium formülasyonumuz sayesinde kokunuz sabahtan akşama kadar sizinle." },
    { icon: <Award size={24} />, title: "Premium Kalite", desc: "Fransa'nın en saygın parfüm evleriyle ortak geliştirilen özel bileşimler." },
    { icon: <Shield size={24} />, title: "Dermatolojik Test", desc: "Tüm ürünlerimiz dermatolojik olarak test edilmiş ve onaylanmıştır." },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-3">
            Neden <span className="bg-linear-to-r from-[#b76e79] to-[#c4587a] bg-clip-text text-transparent">GIRLBOSS?</span>
          </h2>
          <p className="text-[#737373] max-w-md mx-auto text-sm">Kalite, güvenilirlik ve zarafetin buluşma noktası.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {feats.map((f, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fdf8f5] text-[#b76e79] mb-5 group-hover:bg-[#b76e79] group-hover:text-white transition-all duration-300 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-[#2d2d2d] mb-2">{f.title}</h3>
              <p className="text-sm text-[#737373] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Section ───────────────────────── */
function StatsSection() {
  return (
    <section className="py-16 sm:py-20 bg-linear-to-r from-[#b76e79] to-[#c4587a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {[
            { number: "50K+", label: "Mutlu Müşteri" },
            { number: "6", label: "Eşsiz Koku" },
            { number: "12h", label: "Kalıcılık" },
            { number: "%100", label: "Vegan" },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1">{s.number}</div>
              <div className="text-xs sm:text-sm tracking-wider uppercase text-white/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonial ─────────────────────────── */
function TestimonialSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#fdf8f5]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-[#c4a265] text-[#c4a265]" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl md:text-3xl text-[#2d2d2d] font-light leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;Velvet Rose hayatımda denediğim en güzel body mist. Kokusu inanılmaz kalıcı ve her seferinde iltifat alıyorum.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#b76e79] to-[#e890a8] flex items-center justify-center text-white font-bold text-sm">AK</div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#2d2d2d]">Ayşe K.</p>
              <p className="text-xs text-[#a3a3a3]">İstanbul</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA / Newsletter ────────────────────── */
function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center px-5 sm:px-8">
        <div className="bg-[#fdf8f5] rounded-3xl p-8 sm:p-14 border border-[#f0e8e4]">
          <Sparkles size={28} className="text-[#b76e79] mx-auto mb-5" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2d2d2d] mb-4">
            İlk Siparişinde{" "}
            <span className="bg-linear-to-r from-[#b76e79] to-[#c4587a] bg-clip-text text-transparent">%15 İndirim</span>
          </h2>
          <p className="text-[#737373] mb-8 text-sm max-w-sm mx-auto">
            E-bültenimize katıl, özel fırsatlar ve yeni ürünlerden ilk sen haberdar ol.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="E-posta adresin"
              className="flex-1 px-5 py-3.5 rounded-full border border-[#e5e5e5] bg-white text-[#2d2d2d] placeholder-[#a3a3a3] focus:outline-none focus:border-[#b76e79] transition-colors text-sm" />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-linear-to-r from-[#b76e79] to-[#c4587a] text-white text-sm font-semibold tracking-wider rounded-full shadow-sm whitespace-nowrap">
              Katıl ✨
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <img src="/icon.png" alt="GIRLBOSS" className="h-10 w-auto" />
              <span className="text-lg font-bold tracking-[0.2em]">{brand.name}</span>
            </div>
            <p className="text-sm text-[#888] leading-relaxed mb-6 max-w-xs">
              Kendine güvenen, güçlü ve zarif kadınlar için tasarlanmış lüks body mist koleksiyonu.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b76e79] transition-colors">
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">Mağaza</h4>
            <ul className="space-y-3">
              {["Tüm Ürünler", "Yeni Gelenler", "Çok Satanlar", "Hediye Setleri"].map((item) => (
                <li key={item}><a href="#" className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">Kurumsal</h4>
            <ul className="space-y-3">
              {["Hakkımızda", "Blog", "Kariyer", "Bayilik"].map((item) => (
                <li key={item}><a href="#" className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <MapPin size={14} className="text-[#b76e79] shrink-0" /> İstanbul, Türkiye
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <Phone size={14} className="text-[#b76e79] shrink-0" /> +90 555 123 4567
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <Mail size={14} className="text-[#b76e79] shrink-0" /> info@girlboss.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#555]">© 2026 {brand.name}. Tüm hakları saklıdır.</p>
          <div className="flex gap-5">
            {["Gizlilik Politikası", "Kullanım Şartları", "KVKK"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#555] hover:text-[#d4a0a7] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===========================================================
   Main Export
   =========================================================== */
export default function DemoC() {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />
      <Hero />
      <ProductsSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
