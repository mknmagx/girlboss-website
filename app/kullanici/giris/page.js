"use client";

import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";

export default function GirisPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) { router.replace("/kullanici"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login({ email, password });
    setLoading(false);
    if (result.ok) {
      router.push("/kullanici");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      <section className="page-hero" style={{ paddingBottom: '5rem' }}>
        <div className="gb-container-narrow">
          <div className="hero-fade text-center mb-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #b76e79, #e890a8)' }}>
              <Sparkles size={24} color="white" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#2d2d2d] mb-2">Hoş Geldin</h1>
            <p className="text-sm text-[#737373]">Hesabına giriş yap ve alışverişe devam et.</p>
          </div>

          <div className="hero-fade-1">
            <div className="bg-white rounded-3xl border border-[#f0e8e4] shadow-[0_2px_20px_rgba(0,0,0,0.04)]" style={{ padding: '2rem' }}>
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
                  <a href="#" style={{ fontSize: '0.75rem', color: '#b76e79', fontWeight: '600', textDecoration: 'none' }}>Şifremi Unuttum</a>
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

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#f0e8e4' }} />
                <span style={{ fontSize: '0.625rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>veya</span>
                <div style={{ flex: 1, height: '1px', background: '#f0e8e4' }} />
              </div>

              {/* Social login */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <GBButton variant="social" size="md" fullWidth
                  icon={
                    <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  }
                  style={{ 
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8f5f2';
                    e.currentTarget.style.borderColor = '#d8b8aa';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(66, 133, 244, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e8d8d3';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                  }}>
                  Google ile Giriş Yap
                </GBButton>
                <GBButton variant="social" size="md" fullWidth
                  icon={
                    <svg style={{ width: 16, height: 16, fill: '#1877F2', flexShrink: 0 }} viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  }
                  style={{ 
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8f5f2';
                    e.currentTarget.style.borderColor = '#d8b8aa';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(24, 119, 242, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e8d8d3';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                  }}>
                  Facebook ile Giriş Yap
                </GBButton>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-[#737373]">
              Hesabın yok mu? <Link href="/kullanici/kayit" className="text-[#b76e79] font-bold hover:underline">Kayıt Ol</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
