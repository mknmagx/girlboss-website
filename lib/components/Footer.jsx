"use client";

import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Moon,
  Sun,
} from "lucide-react";
import { brand } from "@/lib/data/products";
import { company } from "@/lib/config/company";
import { useTheme } from "@/lib/hooks/useTheme";
import Link from "next/link";

export default function Footer() {
  const { isDark, toggle } = useTheme();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main footer */}
      <div
        className="gb-container"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Image
                src="/icon.png"
                alt="GIRLBOSS"
                width={40}
                height={40}
                className="h-10 w-auto"
                style={{ width: "auto" }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-[0.2em] leading-tight">
                  {brand.name}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#e890a8] font-medium ">
                  Be Bold Be You
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#888] leading-relaxed mb-6 max-w-xs">
              Kendine güvenen, güçlü ve zarif kadınlar için tasarlanmış lüks
              body mist koleksiyonu.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b76e79] transition-colors"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">
              Mağaza
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Tüm Ürünler", href: "/urunler" },
                { label: "Yeni Gelenler", href: "/urunler" },
                { label: "Çok Satanlar", href: "/urunler" },
                { label: "Hediye Setleri", href: "/urunler" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">
              Kurumsal
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Hakkımızda", href: "/hakkimizda" },
                { label: "Blog", href: "/blog" },
                { label: "İletişim", href: "/iletisim" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">
              Yasal
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
                { label: "Teslimat ve İade", href: "/teslimat-iade" },
                {
                  label: "Mesafeli Satış Sözleşmesi",
                  href: "/mesafeli-satis-sozlesmesi",
                },
                { label: "KVKK", href: "/gizlilik-politikasi" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#888] hover:text-[#d4a0a7] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-white/90">
              İletişim
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <MapPin size={14} className="text-[#b76e79] shrink-0" />{" "}
                {company.addressShort}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <Phone size={14} className="text-[#b76e79] shrink-0" />{" "}
                {company.phone}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#888]">
                <Mail size={14} className="text-[#b76e79] shrink-0" />{" "}
                {company.email}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div
          className="gb-container"
          style={{
            paddingTop: "1.25rem",
            paddingBottom: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p className="text-xs text-[#555]">
            © {company.copyrightYear} {company.brandName}. Tüm hakları saklıdır.
            <br />
            <span className="text-[10px] text-[#444]">{company.legalName}</span>
          </p>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.875rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: isDark
                ? "rgba(183,110,121,0.25)"
                : "rgba(255,255,255,0.08)",
              color: isDark ? "#e890a8" : "#888",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.25s",
              letterSpacing: "0.04em",
            }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? "Açık Tema" : "Koyu Tema"}
          </button>

          <div className="flex flex-wrap gap-4 sm:gap-5">
            {[
              { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
              { label: "Teslimat ve İade", href: "/teslimat-iade" },
              {
                label: "Mesafeli Satış Sözleşmesi",
                href: "/mesafeli-satis-sozlesmesi",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-[#555] hover:text-[#d4a0a7] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* iyzico logoları */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo_band_colored@1X.png"
              alt="Visa Mastercard Troy"
              width={144}
              height={22}
              style={{ height: "22px", width: "auto", opacity: 0.85 }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
