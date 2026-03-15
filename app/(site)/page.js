"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Leaf,
  Clock,
  Award,
  Shield,
  Star,
} from "lucide-react";
import { brand } from "@/lib/data/products";
import { getProducts } from "@/lib/firebase/firestore";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import ProductCard from "@/lib/components/ProductCard";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Hero — Product Showcase Data ───────── */
function toReelProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    color: p.color,
    image: p.images?.[0] ?? null,
  };
}

/* ─── ProductShowcase — Editorial Card ───── */
function ProductShowcase({ products: items, current }) {
  const p = items[current];
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "clamp(380px, 55vh, 620px)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 28, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          exit={{ opacity: 0, y: -22 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "rgba(255,255,255,0.13)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: "32px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            width: "clamp(220px, 22vw, 280px)",
            boxShadow:
              "0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {p.image && (
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  height: "clamp(160px, 28vh, 280px)",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  filter: `drop-shadow(0 20px 45px ${p.color}80)`,
                }}
              />
            </motion.div>
          )}
          <div style={{ marginTop: "1.5rem" }}>
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: p.color,
                fontWeight: 800,
                marginBottom: "6px",
              }}
            >
              Body Mist · Girlboss
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {p.name}
            </p>
            <p
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.72)",
                marginTop: "5px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {p.tagline}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Hero ────────────────────────────────── */
function Hero({ products: dbProducts }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0.4, 0.85], [1, 0]);
  const [current, setCurrent] = useState(0);

  const reelProducts = dbProducts.map(toReelProduct);

  useEffect(() => {
    if (!reelProducts.length) return;
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % reelProducts.length),
      3600,
    );
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelProducts.length]);

  const product = reelProducts[current] || reelProducts[0] || null;

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/8529808-uhd_3840_2160_25fps.mp4"
        />
        {/* Soft overlay to keep text legible */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(253, 232, 238, 0.42)" }}
        />
      </motion.div>

      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #b76e79 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #c4a265 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 min-h-screen flex items-center"
      >
        <div className="gb-container w-full">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-28 lg:py-0 lg:min-h-screen">
            {/* ── LEFT: Text ── */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6 justify-center lg:justify-start"
              >
                <div className="h-px w-8 bg-white/70" />
                <p className="text-xs tracking-[0.4em] uppercase text-white font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
                  Yeni Koleksiyon 2026
                </p>
                <div className="h-px w-8 bg-white/70" />
              </motion.div>

              <h1
                className="hero-fade-1 text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-6 leading-[0.95]"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.22)" }}
              >
                Kokunla
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(to right, #ff2d6b, #ff5e9b, #ff9ec8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: "drop-shadow(0 2px 12px rgba(255,45,107,0.45))",
                  }}
                >
                  Hükmet
                </span>
              </h1>

              <p
                className="hero-fade-2 text-base md:text-lg font-light mb-10 max-w-md leading-relaxed mx-auto lg:mx-0"
                style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 12px rgba(0,0,0,0.28)" }}
              >
                Kendine güvenen kadınlar için tasarılanmış {reelProducts.length > 0 ? reelProducts.length : 6} eşsiz body mist.
                Her biri bir hikaye, her biri bir güç.
              </p>

              <div className="hero-fade-3 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <GBButton
                  variant="primary"
                  size="lg"
                  href="/urunler"
                  iconRight={<ArrowRight size={16} />}
                >
                  Koleksiyonu Gör
                </GBButton>
                <GBButton variant="white" size="lg" href="/hakkimizda">
                  Hakkımızda
                </GBButton>
              </div>

              {/* Dot navigator */}
              {reelProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 mt-10 justify-center lg:justify-start"
                >
                  {reelProducts.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrent(i)}
                      aria-label={p.name}
                      style={{
                        width: i === current ? "1.75rem" : "0.5rem",
                        height: "0.5rem",
                        borderRadius: "9999px",
                        background: i === current ? "#ff2d6b" : "rgba(255,255,255,0.45)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.7)",
                      marginLeft: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {String(current + 1).padStart(2, "0")} /{" "}
                    {String(reelProducts.length).padStart(2, "0")}
                  </span>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Editorial Product Card ── */}
            {product && <ProductShowcase products={reelProducts} current={current} />}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-[#b76e79]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Products Section ────────────────────── */
function ProductsSection({ products: dbProducts }) {
  return (
    <section className="section-pad" style={{ background: "#fdf8f5" }}>
      <div className="gb-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: "3.5rem" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
            <Sparkles size={14} className="text-[#b76e79]" />
            <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">
              {dbProducts.length} Eşsiz Koku
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2d2d2d] mb-6">
            Hangi Koku <span className="gb-gradient-text">Senin?</span>
          </h2>
          <p
            className="text-[#737373] text-sm leading-relaxed"
            style={{
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Her biri özenle hazırlanmış, kendine güvenen kadınlara ilham veren
            koleksiyonumuz.
          </p>
        </motion.div>

        {dbProducts.length === 0 ? (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#f0e8e4] animate-pulse" style={{ height: "420px" }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {dbProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Features Section ────────────────────── */
function FeaturesSection() {
  const feats = [
    {
      icon: <Leaf size={24} />,
      title: "Doğal & Vegan",
      desc: "Tüm ürünlerimiz %100 vegan ve cruelty-free. Doğaya saygılı güzellik.",
    },
    {
      icon: <Clock size={24} />,
      title: "12 Saat Kalıcılık",
      desc: "Premium formülasyonumuz sayesinde kokunuz sabahtan akşama kadar sizinle.",
    },
    {
      icon: <Award size={24} />,
      title: "Premium Kalite",
      desc: "Fransa'nın en saygın parfüm evleriyle ortak geliştirilen özel bileşimler.",
    },
    {
      icon: <Shield size={24} />,
      title: "Dermatolojik Test",
      desc: "Tüm ürünlerimiz dermatolojik olarak test edilmiş ve onaylanmıştır.",
    },
  ];

  return (
    <section className="section-pad" style={{ background: "#ffffff" }}>
      <div className="gb-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: "3.5rem" }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-5">
            Neden <span className="gb-gradient-text">GIRLBOSS?</span>
          </h2>
          <p
            className="text-[#737373] text-sm"
            style={{
              maxWidth: "28rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Kalite, güvenilirlik ve zarafetin buluşma noktası.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {feats.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fdf8f5] text-[#b76e79] mb-5 group-hover:bg-[#b76e79] group-hover:text-white transition-all duration-300 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-[#2d2d2d] mb-2">
                {f.title}
              </h3>
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
    <section
      className="section-pad"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to right, #b76e79, #c4587a)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="gb-container relative z-10 flex justify-center">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "3.5rem 4rem",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {[
            { number: "50K+", label: "Mutlu Müşteri" },
            { number: "6", label: "Eşsiz Koku" },
            { number: "12h", label: "Kalıcılık" },
            { number: "%100", label: "Vegan" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">
                {s.number}
              </div>
              <div className="text-xs sm:text-sm tracking-wider uppercase text-white/70">
                {s.label}
              </div>
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
    <section className="section-pad-lg" style={{ background: "#fdf8f5" }}>
      <div className="gb-container-narrow text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-[#c4a265] text-[#c4a265]"
              />
            ))}
          </div>
          <blockquote
            className="text-xl sm:text-2xl md:text-3xl text-[#2d2d2d] font-light leading-relaxed mb-8"
            style={{ fontFamily: "Georgia, serif" }}
          >
            &ldquo;Velvet Rose hayatımda denediğim en güzel body mist. Kokusu
            inanılmaz kalıcı ve her seferinde iltifat alıyorum.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
              }}
            >
              AK
            </div>
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
  const [email, setEmail] = useState("");
  return (
    <section className="section-pad-lg" style={{ background: "#ffffff" }}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="gb-container-narrow text-center"
      >
        <div
          className="bg-[#fdf8f5] rounded-3xl border border-[#f0e8e4]"
          style={{ padding: "2rem" }}
        >
          <Sparkles size={28} className="text-[#b76e79] mx-auto mb-5" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2d2d2d] mb-6">
            İlk Siparişinde{" "}
            <span className="gb-gradient-text">%15 İndirim</span>
          </h2>
          <p
            className="text-[#737373] mb-8 text-sm"
            style={{
              maxWidth: "24rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            E-bültenimize katıl, özel fırsatlar ve yeni ürünlerden ilk sen
            haberdar ol.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              maxWidth: "28rem",
              marginLeft: "auto",
              marginRight: "auto",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <GBInput
                name="newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresin"
              />
            </div>
            <GBButton variant="primary" size="md" onClick={() => {}}>
              Katıl ✨
            </GBButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ===========================================================
   Main Page
   =========================================================== */
export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => setProducts(data.filter((p) => p.active !== false)));
  }, []);

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />
      <Hero products={products} />
      <ProductsSection products={products} />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
