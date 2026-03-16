"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Flame,
  Leaf,
  BookOpen,
  Heart,
  ChevronRight,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";

/* ─── Animation ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Category Styles ────────────────────────────────────── */
const CATEGORY_STYLES = {
  "İpuçları":         { background: "linear-gradient(135deg, #b76e79, #e890a8)", icon: <Sparkles size={10} />, shadow: "0 2px 10px rgba(183,110,121,0.35)" },
  "Güzellik İpuçları":{ background: "linear-gradient(135deg, #b76e79, #e890a8)", icon: <Sparkles size={10} />, shadow: "0 2px 10px rgba(183,110,121,0.35)" },
  "Trendler":         { background: "linear-gradient(135deg, #c97432, #e8960a)", icon: <Flame size={10} />,    shadow: "0 2px 10px rgba(201,116,50,0.35)" },
  "Sürdürülebilirlik":{ background: "linear-gradient(135deg, #3d7a5c, #6bb88a)", icon: <Leaf size={10} />,    shadow: "0 2px 10px rgba(61,122,92,0.35)" },
  "Rehber":           { background: "linear-gradient(135deg, #5b3fa0, #8b6fd4)", icon: <BookOpen size={10} />, shadow: "0 2px 10px rgba(91,63,160,0.35)" },
  "Hakkımızda":       { background: "linear-gradient(135deg, #e0407b, #f472b6)", icon: <Heart size={10} />,   shadow: "0 2px 10px rgba(224,64,123,0.35)" },
};
const DEFAULT_CATEGORY_STYLE = { background: "linear-gradient(135deg, #b76e79, #e890a8)", icon: <Sparkles size={10} />, shadow: "0 2px 10px rgba(183,110,121,0.35)" };

/* ─── Content Block Renderer ─────────────────────────────── */
function ContentBlock({ block, index }) {
  switch (block.type) {
    case "intro":
      return (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={index}
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.85,
            color: "#525252",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #f0e8e4",
            fontStyle: "italic",
          }}
        >
          {block.text}
        </motion.p>
      );

    case "heading":
      return (
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={index}
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#2d2d2d",
            marginTop: "2.5rem",
            marginBottom: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "4px",
              height: "1.25rem",
              borderRadius: "4px",
              background: "linear-gradient(180deg, #b76e79, #e890a8)",
              flexShrink: 0,
            }}
          />
          {block.text}
        </motion.h2>
      );

    case "paragraph":
      return (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={index}
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.9,
            color: "#525252",
            marginBottom: "1.5rem",
          }}
        >
          {block.text}
        </motion.p>
      );

    case "tip":
      return (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={index}
          className="px-4 sm:px-6"
          style={{
            background: "linear-gradient(135deg, #fdf2f4, #fce8ed)",
            border: "1px solid #fecdd3",
            borderLeft: "4px solid #b76e79",
            borderRadius: "1rem",
            paddingTop: "1.125rem",
            paddingBottom: "1.125rem",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#b76e79",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <Sparkles size={11} />
            {block.title}
          </p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#4a4a4a", margin: 0 }}>
            {block.text}
          </p>
        </motion.div>
      );

    default:
      return null;
  }
}

/* ─── Related Card ───────────────────────────────────────── */
function RelatedCard({ post, index }) {
  const cs = CATEGORY_STYLES[post.category] ?? DEFAULT_CATEGORY_STYLE;
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}>
      <Link href={`/blog/${post.slug}`} className="block group">
        <div
          style={{
            background: "#fff",
            border: "1px solid #f0e8e4",
            borderRadius: "1.25rem",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
          className="hover:border-[#fecdd3] hover:shadow-[0_8px_28px_rgba(183,110,121,0.12)]"
        >
          <div
            style={{
              height: "9rem",
              background: post.gradient,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {post.coverImage ? (
              <Image src={post.coverImage} alt={post.title} fill sizes="100vw" style={{ objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "2rem", opacity: 0.55 }}>{post.coverEmoji}</span>
            )}
            <div
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.2rem 0.55rem",
                background: cs.background,
                boxShadow: cs.shadow,
                borderRadius: "9999px",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {cs.icon}
              <span>{post.category}</span>
            </div>
          </div>

          <div style={{ padding: "1rem 1.125rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.6875rem",
                color: "#a3a3a3",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Calendar size={10} />
                {post.date}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={10} />
                {post.readTime}
              </span>
            </div>
            <h4
              style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.4, margin: 0 }}
              className="group-hover:text-[#b76e79] transition-colors"
            >
              {post.title}
            </h4>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Blog Detail Client ─────────────────────────────────── */
export default function BlogDetailClient({ post, related, prevPost, nextPost }) {
  const cs = CATEGORY_STYLES[post.category] ?? DEFAULT_CATEGORY_STYLE;

  const BASE_URL = "https://girlboss.com.tr";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "GIRLBOSS", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "GIRLBOSS",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.png` },
    },
    image: `${BASE_URL}/og-image.jpg`,
    keywords: post.tags?.join(", ") ?? "body mist, güzellik",
    articleSection: post.category,
    inLanguage: "tr-TR",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div className="gb-container" style={{ paddingTop: "6.5rem", paddingBottom: "0.75rem" }}>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-[#a3a3a3]"
        >
          <Link href="/" className="hover:text-[#b76e79] transition-colors">Ana Sayfa</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-[#b76e79] transition-colors">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-[#2d2d2d] font-medium line-clamp-1" style={{ maxWidth: "18rem" }}>{post.title}</span>
        </motion.nav>
      </div>

      {/* ── Hero Cover ───────────────────────────────────── */}
      <section className="pb-8 sm:pb-12">
        <div className="gb-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1.25rem] sm:rounded-[1.75rem]"
            style={{
              overflow: "hidden",
              background: post.gradient,
              position: "relative",
              minHeight: "clamp(13rem, 48vw, 22rem)",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                style={{
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "7rem",
                  opacity: 0.18,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {post.coverEmoji}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)",
              }}
            />

            <div className="px-5 sm:px-10" style={{ position: "relative", zIndex: 10, paddingTop: "1.5rem", paddingBottom: "1.75rem", width: "100%" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.75rem",
                  background: cs.background,
                  boxShadow: cs.shadow,
                  borderRadius: "9999px",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                {cs.icon}
                <span>{post.category}</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.2rem, 5.5vw, 2.375rem)",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.25,
                  marginBottom: "0.875rem",
                  maxWidth: "44rem",
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {post.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Calendar size={13} />
                  {post.date}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Clock size={13} />
                  {post.readTime} okuma
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Article Body ─────────────────────────────────── */}
      <section className="pb-12 sm:pb-16">
        <div className="gb-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr min(680px, 100%) 1fr",
              gap: "0 2rem",
            }}
          >
            <div style={{ gridColumn: "2" }}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ marginBottom: "2rem" }}
              >
                <Link
                  href="/blog"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#b76e79",
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <ArrowLeft size={13} />
                  Bloga Dön
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="px-4 sm:px-6"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#737373",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  paddingTop: "1.125rem",
                  paddingBottom: "1.125rem",
                  background: "#fff",
                  border: "1px solid #f0e8e4",
                  borderRadius: "1rem",
                  borderLeft: "4px solid #e890a8",
                }}
              >
                {post.excerpt}
              </motion.p>

              {Array.isArray(post.content) && post.content.map((block, i) => (
                <ContentBlock key={i} block={block} index={i + 2} />
              ))}

              {post.tags && post.tags.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={(Array.isArray(post.content) ? post.content.length : 0) + 3}
                  style={{
                    marginTop: "2.5rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid #f0e8e4",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <Tag size={13} style={{ color: "#a3a3a3", flexShrink: 0 }} />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: "#f5eff0",
                        border: "1px solid #fecdd3",
                        borderRadius: "9999px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#b76e79",
                        letterSpacing: "0.04em",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Prev / Next Navigation */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={(Array.isArray(post.content) ? post.content.length : 0) + 4}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10"
              >
                {prevPost && (
                  <Link href={`/blog/${prevPost.slug}`} style={{ textDecoration: "none" }} className="group">
                    <div
                      style={{
                        padding: "1rem 1.25rem",
                        background: "#fff",
                        border: "1px solid #f0e8e4",
                        borderRadius: "1rem",
                        transition: "all 0.25s ease",
                      }}
                      className="hover:border-[#fecdd3] hover:shadow-[0_4px_16px_rgba(183,110,121,0.1)]"
                    >
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.375rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <ArrowLeft size={10} /> Önceki Yazı
                      </p>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.35, margin: 0 }} className="group-hover:text-[#b76e79] transition-colors">
                        {prevPost.title}
                      </p>
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} style={{ textDecoration: "none" }} className="group">
                    <div
                      style={{
                        padding: "1rem 1.25rem",
                        background: "#fff",
                        border: "1px solid #f0e8e4",
                        borderRadius: "1rem",
                        transition: "all 0.25s ease",
                      }}
                      className="hover:border-[#fecdd3] hover:shadow-[0_4px_16px_rgba(183,110,121,0.1)] sm:text-right"
                    >
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.375rem", display: "flex", alignItems: "center", gap: "0.25rem" }} className="sm:justify-end">
                        Sonraki Yazı <ArrowRight size={10} />
                      </p>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.35, margin: 0 }} className="group-hover:text-[#b76e79] transition-colors">
                        {nextPost.title}
                      </p>
                    </div>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Posts ─────────────────────────────────── */}
      <section
        className="pt-10 sm:pt-16 pb-14 sm:pb-20"
        style={{
          borderTop: "1px solid #f0e8e4",
          background: "#fff",
        }}
      >
        <div className="gb-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ marginBottom: "2.5rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 1rem",
                background: "rgba(183,110,121,0.08)",
                borderRadius: "9999px",
                marginBottom: "1rem",
              }}
            >
              <Sparkles size={13} style={{ color: "#b76e79" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b76e79" }}>
                Diğer Yazılar
              </span>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#2d2d2d" }}>
              Bunları da{" "}
              <span className="gb-gradient-text">Okuyabilirsiniz</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rPost, i) => (
              <RelatedCard key={rPost.id || rPost.slug} post={rPost} index={i} />
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            style={{ textAlign: "center", marginTop: "2.5rem" }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
                color: "#fff",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hover:opacity-90 hover:scale-105"
            >
              Tüm Yazıları Gör <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
