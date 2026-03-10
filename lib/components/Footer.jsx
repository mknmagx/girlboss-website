"use client";

import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Moon, Sun } from "lucide-react";
import { brand } from "@/lib/data/products";
import { useTheme } from "@/lib/hooks/useTheme";
import Link from "next/link";

export default function Footer() {
  const { isDark, toggle } = useTheme();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main footer */}
      <div className="gb-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #b76e79, #e890a8)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em]">{brand.name}</span>
            </Link>
            <p className="text-sm text-[#888] leading-relaxed mb-6 max-w-xs">
              Kendine güvenen, güçlü ve zarif kadınlar için tasarlanmış lüks body mist koleksiyonu.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b76e79] transition-colors">
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">Mağaza</h4>
            <ul className="space-y-3">
              {[
                { label: "Tüm Ürünler", href: "/urunler" },
                { label: "Yeni Gelenler", href: "/urunler" },
                { label: "Çok Satanlar", href: "/urunler" },
                { label: "Hediye Setleri", href: "/urunler" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">Kurumsal</h4>
            <ul className="space-y-3">
              {[
                { label: "Hakkımızda", href: "/hakkimizda" },
                { label: "Blog", href: "/blog" },
                { label: "İletişim", href: "/iletisim" },
                { label: "SSS", href: "/iletisim" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors">
                    {item.label}
                  </Link>
                </li>
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
        <div className="gb-container" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p className="text-xs text-[#555]">© 2026 {brand.name}. Tüm hakları saklıdır.</p>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: isDark ? 'rgba(183,110,121,0.25)' : 'rgba(255,255,255,0.08)',
              color: isDark ? '#e890a8' : '#888',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s',
              letterSpacing: '0.04em',
            }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? 'Açık Tema' : 'Koyu Tema'}
          </button>

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
