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
import { company } from "@/lib/config/company";

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

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "GIRLBOSS İletişim",
    url: `https://${company.domain}/iletisim`,
    description: `${company.brandName} müşteri hizmetleri ile iletişime geçin.`,
    mainEntity: {
      "@type": "Organization",
      name: company.brandName,
      telephone: company.phone,
      email: company.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Yakuplu Mah. Dereboyu Cad. No:4/1",
        addressLocality: "Beylikdüzü",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
    },
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center relative z-10">
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <MessageCircle size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Bize Ulaşın</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2d2d2d] mb-4 sm:mb-6">
              İletişime{" "}
              <span className="gb-gradient-text">Geçin</span>
            </h1>
            <p className="text-[#737373] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto px-2">
              Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazın.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-pad">
        <div className="gb-container">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-8 lg:gap-16 items-start">
            {/* Info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-2 md:order-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2d2d2d] mb-4 sm:mb-6">İletişim Bilgileri</h2>
              <div className="flex flex-col gap-4 sm:gap-6">
                {[
                  { icon: <MapPin size={20} />, label: "Adres", value: company.address },
                  { icon: <Phone size={20} />, label: "Telefon", value: company.phone },
                  { icon: <Mail size={20} />, label: "E-posta", value: company.email },
                  { icon: <Clock size={20} />, label: "Çalışma Saatleri", value: company.workingHours },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#b76e79]/10 text-[#b76e79] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs tracking-wider uppercase text-[#a3a3a3] font-semibold mb-0.5">{item.label}</p>
                      <p className="text-xs sm:text-sm text-[#2d2d2d] whitespace-pre-line leading-relaxed overflow-wrap-break-word">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8 sm:mt-10 rounded-2xl overflow-hidden border border-[#f0e8e4] h-40 sm:h-48 bg-[#f0e8e4] flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin size={24} className="text-[#b76e79] mx-auto mb-2" />
                  <p className="text-xs text-[#a3a3a3]">Harita yakında eklenecek</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="order-1 md:order-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#f0e8e4] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-5 sm:p-6 lg:p-10">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2d2d2d] mb-2">Mesaj Gönderin</h2>
                <p className="text-xs sm:text-sm text-[#737373] mb-6 sm:mb-8">En kısa sürede size dönüş yapacağız.</p>

                <form className="flex flex-col gap-4 sm:gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                    rows={4}
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
