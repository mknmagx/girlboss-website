"use client";

import Image from "next/image";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";

export default function GirisPage() {
  const { login, loginWithGoogle, sendPasswordReset, authProviders, isLoggedIn } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Şifremi unuttum modal state
  const [resetModal, setResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState(null); // null | "ok" | "error"
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  if (isLoggedIn) { router.replace("/kullanici"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login({ email, password });
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

  const handleApple = async () => {
    setError("");
    setLoading(true);
    const result = await loginWithApple();
    setLoading(false);
    if (result.ok) {
      router.push("/kullanici");
    } else {
      setError(result.error);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetStatus(null);
    const result = await sendPasswordReset(resetEmail);
    setResetLoading(false);
    if (result.ok) {
      setResetStatus("ok");
      setResetMsg("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } else {
      setResetStatus("error");
      setResetMsg(result.error);
    }
  };

  const hasSocialProviders = authProviders.google || authProviders.apple;

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      <section className="page-hero" style={{ paddingBottom: '5rem' }}>
        <div className="gb-container-narrow">
          <div className="hero-fade text-center mb-10">
            <div className="flex justify-center mb-5">
              <Image src="/icon.png" alt="GIRLBOSS" width={56} height={56} className="h-14 w-auto" style={{ width: 'auto' }} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#2d2d2d] mb-2">Hoş Geldin</h1>
            <p className="text-sm text-[#737373]">Hesabına giriş yap ve alışverişe devam et.</p>
          </div>

          <div className="hero-fade-1">
            <div className="bg-white rounded-3xl border border-[#f0e8e4] shadow-[0_2px_20px_rgba(0,0,0,0.04)]" style={{ padding: '2rem' }}>

              {/* E-posta & Şifre formu */}
              {authProviders.emailPassword && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <GBInput
                    label="E-posta"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    icon={<Mail size={16} />}
                    autoComplete="email"
                  />

                  <GBInput
                    label="Şifre"
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    iconRight={
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ display: 'flex', alignItems: 'center', color: showPw ? '#b76e79' : '#c4a0a7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    autoComplete="current-password"
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: '1rem', height: '1rem', accentColor: '#b76e79' }} />
                      <span style={{ fontSize: '0.75rem', color: '#737373' }}>Beni hatırla</span>
                    </label>
                    {authProviders.forgotPassword && (
                      <button
                        type="button"
                        onClick={() => { setResetEmail(email); setResetModal(true); setResetStatus(null); setResetMsg(""); }}
                        style={{ fontSize: '0.75rem', color: '#b76e79', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Şifremi Unuttum
                      </button>
                    )}
                  </div>

                  {error && (
                    <p style={{ fontSize: '0.8125rem', color: '#e53e3e', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '0.75rem', padding: '0.625rem 0.875rem' }}>
                      {error}
                    </p>
                  )}

                  <GBButton type="submit" variant="primary" size="lg" fullWidth iconRight={<ArrowRight size={16} />} disabled={loading}>
                    {loading ? "Giriş Yapılıyor…" : "Giriş Yap"}
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

              {/* Social login */}
              {hasSocialProviders && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: authProviders.emailPassword ? 0 : 0 }}>
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
                      Google ile Giriş Yap
                    </GBButton>
                  )}

                </div>
              )}
            </div>

            <p className="text-center mt-6 text-sm text-[#737373]">
              Hesabın yok mu? <Link href="/kullanici/kayit" className="text-[#b76e79] font-bold hover:underline">Kayıt Ol</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Şifremi Unuttum Modal ── */}
      {resetModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setResetModal(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', width: '100%', maxWidth: '26rem', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setResetModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3' }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#2d2d2d', marginBottom: '0.5rem' }}>Şifremi Unuttum</h2>
            <p style={{ fontSize: '0.8125rem', color: '#737373', marginBottom: '1.5rem' }}>
              E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
            </p>

            {resetStatus === "ok" ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: 600 }}>✓ Mail Gönderildi</p>
                <p style={{ fontSize: '0.8125rem', color: '#4ade80', marginTop: '0.25rem' }}>{resetMsg}</p>
                <button
                  type="button"
                  onClick={() => setResetModal(false)}
                  style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <GBInput
                  label="E-posta"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  icon={<Mail size={16} />}
                  autoComplete="email"
                />
                {resetStatus === "error" && (
                  <p style={{ fontSize: '0.8125rem', color: '#e53e3e', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '0.75rem', padding: '0.625rem 0.875rem' }}>
                    {resetMsg}
                  </p>
                )}
                <GBButton type="submit" variant="primary" size="md" fullWidth disabled={resetLoading}>
                  {resetLoading ? "Gönderiliyor…" : "Sıfırlama Maili Gönder"}
                </GBButton>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
