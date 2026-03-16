"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, Clock, Flame, Leaf, BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CATEGORY_STYLES = {
  "İpuçları": { background: 'linear-gradient(135deg, #b76e79, #e890a8)', icon: <Sparkles size={9} />, shadow: '0 2px 8px rgba(183,110,121,0.3)' },
  "Güzellik İpuçları": { background: 'linear-gradient(135deg, #b76e79, #e890a8)', icon: <Sparkles size={9} />, shadow: '0 2px 8px rgba(183,110,121,0.3)' },
  "Trendler": { background: 'linear-gradient(135deg, #c97432, #e8960a)', icon: <Flame size={9} />, shadow: '0 2px 8px rgba(201,116,50,0.3)' },
  "Sürdürülebilirlik": { background: 'linear-gradient(135deg, #3d7a5c, #6bb88a)', icon: <Leaf size={9} />, shadow: '0 2px 8px rgba(61,122,92,0.3)' },
  "Rehber": { background: 'linear-gradient(135deg, #5b3fa0, #8b6fd4)', icon: <BookOpen size={9} />, shadow: '0 2px 8px rgba(91,63,160,0.3)' },
  "Hakkımızda": { background: 'linear-gradient(135deg, #e0407b, #f472b6)', icon: <Heart size={9} />, shadow: '0 2px 8px rgba(224,64,123,0.3)' },
};
const DEFAULT_CATEGORY_STYLE = { background: 'linear-gradient(135deg, #b76e79, #e890a8)', icon: <Sparkles size={9} />, shadow: '0 2px 8px rgba(183,110,121,0.3)' };

export default function BlogListClient({ posts }) {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <Sparkles size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Blog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#2d2d2d] mb-6">
              Güzellik{" "}
              <span className="gb-gradient-text">Notları</span>
            </h1>
            <p className="text-[#737373] text-sm leading-relaxed" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Güzellik ipuçları, koku rehberleri ve GIRLBOSS dünyasından haberler.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-pad">
        <div className="gb-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {posts.map((post, i) => (
              <motion.article key={post.id || post.slug} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <Link href={`/blog/${post.slug}`} className="block">
                <div className="bg-white rounded-3xl overflow-hidden border border-[#f0e8e4] hover:border-[#fecdd3] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(183,110,121,0.1)] group">
                  {/* Cover image or gradient fallback */}
                  <div className="h-48 relative overflow-hidden" style={{ background: post.gradient || 'linear-gradient(135deg, #b76e79, #e890a8)' }}>
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>{post.coverEmoji || '📝'}</span>
                      </div>
                    )}
                  {/* Category badge */}
                  {(() => {
                    const cs = CATEGORY_STYLES[post.category] ?? DEFAULT_CATEGORY_STYLE;
                    return (
                      <div style={{
                        position: 'absolute',
                        top: '0.875rem',
                        left: '0.875rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.625rem',
                        background: cs.background,
                        boxShadow: cs.shadow,
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap',
                        color: '#ffffff',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        lineHeight: 1.4,
                      }}>
                        {cs.icon}
                        <span>{post.category}</span>
                      </div>
                    );
                  })()}
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-3 mb-3 text-[11px] text-[#a3a3a3]">
                      <span className="flex items-center gap-1"><Calendar size={11} />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2d2d2d] mb-2 group-hover:text-[#b76e79] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#737373] leading-relaxed mb-4">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#b76e79] tracking-wider uppercase group-hover:gap-2.5 transition-all">
                      Devamını Oku <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
