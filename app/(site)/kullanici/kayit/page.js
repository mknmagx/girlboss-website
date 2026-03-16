"use client";

import Image from "next/image";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { brand } from "@/lib/data/products";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";

export default function KayitPage() {
  const { register, loginWithGoogle, authProviders, isLoggedIn } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', sifre: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (isLoggedIn) { router.replace("/kullanici"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!terms) { setError("Devam etmek için kullanım şartlarını kabul edin."); return; }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.ok) {
      router.push("/kullanici");
    } else {
      setError(result.error);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.ok) {
      router.push("/kullanici");
    } else {
      setError(result.error);
    }
  };

  const hasSocialProviders = authProviders.google;

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      <section className="page-hero" style={{ paddingBottom: '5rem' }}>
        <div className="gb-container-narrow">
          <div className="hero-fade text-center mb-10">
            <div className="flex justify-center mb-5">
              <Image src="/icon.png" alt="GIRLBOSS" width={56} height={56} className="h-14 w-auto" style={{ width: 'auto' }} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#2d2d2d] mb-2">Hesap Oluştur</h1>
            <p className="text-sm text-[#737373]">{brand.name} ailesine katıl, ayrıcalıklardan yararlan.</p>
          </div>

          <div className="hero-fade-1">
            <div className="bg-white rounded-3xl border border-[#f0e8e4] shadow-[0_2px_20px_rgba(0,0,0,0.04)]" style={{ padding: '2rem' }}>

              {/* E-posta & Şifre formu */}
              {authProviders.emailPassword && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <GBInput label="Ad" name="ad" value={form.ad} onChange={set('ad')} icon={<User size={16} />} placeholder="Adınız" />
                    <GBInput label="Soyad" name="soyad" value={form.soyad} onChange={set('soyad')} placeholder="Soyadınız" />
                  </div>

                  <GBInput
                    label="E-posta"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="ornek@email.com"
                    icon={<Mail size={16} />}
                    autoComplete="email"
                  />

                  <GBInput
                    label="Şifre"
                    type={showPw ? "text" : "password"}
                    name="sifre"
                    value={form.sifre}
                    onChange={set('sifre')}
                    placeholder="En az 8 karakter"
                    icon={<Lock size={16} />}
                    hint="En az 8 karakter kullanın"
                    iconRight={
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ display: 'flex', alignItems: 'center', color: showPw ? '#b76e79' : '#c4a0a7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    autoComplete="new-password"
                  />

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#b76e79', marginTop: '0.125rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: '#737373', lineHeight: '1.6' }}>
                      <a href="#" style={{ color: '#b76e79', fontWeight: '600', textDecoration: 'none' }}>Kullanım Şartları</a>{' '}ve{' '}
                      <a href="#" style={{ color: '#b76e79', fontWeight: '600', textDecoration: 'none' }}>Gizlilik Politikası</a>&apos;nı kabul ediyorum.
                    </span>
                  </label>

                  {error && (
                    <p style={{ fontSize: '0.8125rem', color: '#e53e3e', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '0.75rem', padding: '0.625rem 0.875rem' }}>
                      {error}
                    </p>
                  )}

                  <GBButton type="submit" variant="primary" size="lg" fullWidth iconRight={<ArrowRight size={16} />} disabled={loading}>
                    {loading ? "Kaydediliyor…" : "Kayıt Ol"}
                  </GBButton>
                </form>
              )}

              {/* Divider */}
              {authProviders.emailPassword && hasSocialProviders && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#f0e8e4' }} />
                  <span style={{ fontSize: '0.625rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>veya</span>
                  <div style={{ flex: 1, height: '1px', background: '#f0e8e4' }} />
                </div>
              )}

              {/* Social kayıt */}
              {hasSocialProviders && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {authProviders.google && (
                    <GBButton variant="social" size="md" fullWidth
                      onClick={handleGoogle}
                      icon={
                        <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      }>
                      Google ile Kayıt Ol
                    </GBButton>
                  )}

                </div>
              )}
            </div>

            <p className="text-center mt-6 text-sm text-[#737373]">
              Zaten hesabın var mı? <Link href="/kullanici/giris" className="text-[#b76e79] font-bold hover:underline">Giriş Yap</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
