"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Sparkles, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { brand } from "@/lib/data/products";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";

const navLinks = [
  { label: "Ürünler", href: "/urunler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count: favCount } = useFavorites();
  const { count: cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-3 sm:mx-5 mt-3 sm:mt-4 rounded-2xl glass-effect-light" style={{ padding: '0.75rem 2rem' }}>
        <div className="gb-container" style={{ maxWidth: '80rem', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #b76e79, #e890a8)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-[#2d2d2d]">{brand.name}</span>
            </motion.div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm text-[#525252] hover:text-[#b76e79] transition-colors duration-300 font-medium">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <Link href="/favoriler">
              <motion.div whileHover={{ scale: 1.1 }} className="relative hidden sm:flex w-10 h-10 rounded-full bg-white/80 shadow-sm items-center justify-center cursor-pointer">
                <Heart size={16} className="text-[#b76e79]" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b76e79] rounded-full text-[9px] text-white flex items-center justify-center font-bold">{favCount}</span>
                )}
              </motion.div>
            </Link>
            <Link href="/sepet">
              <motion.div whileHover={{ scale: 1.1 }} className="relative w-10 h-10 rounded-full bg-[#b76e79] shadow-sm flex items-center justify-center cursor-pointer">
                <ShoppingBag size={16} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2d2d2d] rounded-full text-[9px] text-white flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </motion.div>
            </Link>

            {/* User menu / auth */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    background: "white", border: "1.5px solid #f0e8e4",
                    borderRadius: "9999px", padding: "0.25rem 0.75rem 0.25rem 0.25rem",
                    cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "1.75rem", height: "1.75rem", borderRadius: "9999px",
                      background: "linear-gradient(135deg, #b76e79, #e890a8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 800, color: "#fff",
                    }}
                  >
                    {user?.ad?.[0]?.toUpperCase() || "G"}
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#2d2d2d" }}>
                    {user?.ad}
                  </span>
                  <ChevronDown size={12} style={{ color: "#a3a3a3", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute", right: 0, top: "calc(100% + 0.5rem)",
                        background: "white", border: "1px solid #f0e8e4",
                        borderRadius: "1rem", padding: "0.5rem",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        minWidth: "160px", zIndex: 100,
                      }}
                    >
                      <Link
                        href="/kullanici"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.625rem 0.875rem", borderRadius: "0.75rem",
                          fontSize: "0.8125rem", fontWeight: 600, color: "#2d2d2d",
                          textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        className="hover:bg-[#fdf8f5]"
                      >
                        <User size={14} className="text-[#b76e79]" />
                        Profilim
                      </Link>
                      <div style={{ height: "1px", background: "#f0e8e4", margin: "0.25rem 0" }} />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.625rem 0.875rem", borderRadius: "0.75rem",
                          fontSize: "0.8125rem", fontWeight: 600, color: "#e53e3e",
                          background: "none", border: "none", cursor: "pointer", width: "100%",
                          transition: "background 0.15s",
                        }}
                        className="hover:bg-red-50"
                      >
                        <LogOut size={14} />
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/kullanici/giris" className="hidden sm:flex">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    background: "white", border: "1.5px solid #f0e8e4",
                    borderRadius: "9999px", padding: "0.375rem 0.875rem",
                    fontSize: "0.8125rem", fontWeight: 600, color: "#2d2d2d",
                    cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  <User size={13} style={{ color: "#b76e79" }} />
                  Giriş Yap
                </motion.div>
              </Link>
            )}

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
              {navLinks.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="text-base font-medium text-[#2d2d2d] hover:text-[#b76e79] transition-colors py-1">
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#f0e8e4]" />
              {/* Favoriler & Sepet shortcuts */}
              <div className="flex gap-3">
                <Link
                  href="/favoriler"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 bg-[#fff0f3] text-[#b76e79] text-sm font-semibold rounded-xl text-center flex items-center justify-center gap-1.5"
                >
                  <Heart size={14} />
                  Favoriler
                  {favCount > 0 && (
                    <span className="w-4 h-4 bg-[#b76e79] rounded-full text-[9px] text-white flex items-center justify-center font-bold shrink-0">{favCount}</span>
                  )}
                </Link>
                <Link
                  href="/sepet"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 bg-[#fdf8f5] text-[#2d2d2d] text-sm font-semibold rounded-xl text-center flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} />
                  Sepet
                  {cartCount > 0 && (
                    <span className="w-4 h-4 bg-[#2d2d2d] rounded-full text-[9px] text-white flex items-center justify-center font-bold shrink-0">{cartCount}</span>
                  )}
                </Link>
              </div>
              <div className="h-px bg-[#f0e8e4]" />
              {isLoggedIn ? (
                <div className="flex gap-3">
                  <Link href="/kullanici" onClick={() => setMenuOpen(false)} className="flex-1 py-2.5 bg-[#fdf8f5] text-[#b76e79] text-sm font-semibold rounded-xl text-center">Profilim</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); router.push("/"); }} className="flex-1 py-2.5 bg-[#fff0f0] text-red-500 text-sm font-semibold rounded-xl text-center border-none cursor-pointer">Çıkış Yap</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/kullanici/giris" className="flex-1 py-2.5 bg-[#fdf8f5] text-[#b76e79] text-sm font-semibold rounded-xl text-center">Giriş Yap</Link>
                  <Link href="/kullanici/kayit" className="flex-1 py-2.5 bg-[#b76e79] text-white text-sm font-semibold rounded-xl text-center">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
