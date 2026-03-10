"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import { useState } from "react";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";
import GBSelect from "@/lib/components/ui/GBSelect";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '' });
  const set = (k) => (v) => setForm({ ...form, [k]: typeof v === 'string' ? v : v.target.value });

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <MessageCircle size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Bize Ulaşın</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#2d2d2d] mb-6">
              İletişime{" "}
              <span className="gb-gradient-text">Geçin</span>
            </h1>
            <p className="text-[#737373] text-sm leading-relaxed" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazın.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-pad">
        <div className="gb-container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '4rem', alignItems: 'start' }}>
            {/* Info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl font-extrabold text-[#2d2d2d] mb-6">İletişim Bilgileri</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: <MapPin size={20} />, label: "Adres", value: "Nişantaşı, Teşvikiye Cad.\nNo: 42, Şişli / İstanbul" },
                  { icon: <Phone size={20} />, label: "Telefon", value: "+90 555 123 4567" },
                  { icon: <Mail size={20} />, label: "E-posta", value: "info@girlboss.com" },
                  { icon: <Clock size={20} />, label: "Çalışma Saatleri", value: "Pzt - Cum: 09:00 - 18:00\nCmt: 10:00 - 14:00" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#b76e79]/10 text-[#b76e79] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs tracking-wider uppercase text-[#a3a3a3] font-semibold mb-0.5">{item.label}</p>
                      <p className="text-sm text-[#2d2d2d] whitespace-pre-line leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-10 rounded-2xl overflow-hidden border border-[#f0e8e4] h-48 bg-[#f0e8e4] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-[#b76e79] mx-auto mb-2" />
                  <p className="text-xs text-[#a3a3a3]">Harita yakında eklenecek</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <div className="bg-white rounded-3xl border border-[#f0e8e4] shadow-[0_2px_20px_rgba(0,0,0,0.04)]" style={{ padding: '2.5rem' }}>
                <h2 className="text-2xl font-extrabold text-[#2d2d2d] mb-2">Mesaj Gönderin</h2>
                <p className="text-sm text-[#737373] mb-8">En kısa sürede size dönüş yapacağız.</p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    <GBInput label="Ad Soyad" name="ad" value={form.ad} onChange={set('ad')} placeholder="Adınız Soyadınız" />
                    <GBInput label="E-posta" type="email" name="email" value={form.email} onChange={set('email')} placeholder="ornek@email.com" icon={<Mail size={16} />} />
                  </div>

                  <GBSelect
                    label="Konu"
                    name="konu"
                    value={form.konu}
                    onChange={set('konu')}
                    options={[
                      { value: 'genel', label: 'Genel Bilgi' },
                      { value: 'siparis', label: 'Sipariş Sorgusu' },
                      { value: 'urun', label: 'Ürün Bilgisi' },
                      { value: 'isbirligi', label: 'İş Birliği Teklifi' },
                      { value: 'sikayet', label: 'Şikayet / İade' },
                    ]}
                  />

                  <GBTextarea
                    label="Mesajınız"
                    name="mesaj"
                    rows={5}
                    value={form.mesaj}
                    onChange={set('mesaj')}
                    placeholder="Mesajınızı buraya yazın..."
                    maxLength={500}
                    showCount
                  />

                  <GBButton type="submit" variant="primary" size="lg" fullWidth icon={<Send size={16} />}>
                    Gönder
                  </GBButton>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
