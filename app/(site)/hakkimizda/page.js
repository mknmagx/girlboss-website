"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Heart, Users, Leaf, Award, Globe } from "lucide-react";
import { brand } from "@/lib/data/products";
import { company } from "@/lib/config/company";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import GBButton from "@/lib/components/ui/GBButton";
import BizKimizReel from "@/lib/components/BizKimizReel";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HakkimizdaPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://girlboss.com.tr/#organization",
    name: company.brandName,
    legalName: company.legalName,
    description: company.brandDescription,
    url: `https://${company.domain}`,
    logo: `https://${company.domain}/icon.png`,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Yakuplu Mah. Dereboyu Cad. No:4/1",
      addressLocality: "Beylikdüzü",
      addressRegion: "İstanbul",
      postalCode: "34524",
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Navbar />

      {/* Hero */}
      <section
        className="page-hero"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div className="absolute inset-0 hero-bg-static" />
        <div
          className="gb-container text-center"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <Sparkles size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">
                Hikayemiz
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#2d2d2d] mb-6">
              Kokunla <span className="gb-gradient-text">Hükmet</span>
            </h1>
            <p
              className="text-[#737373] text-base leading-relaxed"
              style={{
                maxWidth: "36rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              GIRLBOSS, kendine güvenen, cesur ve zarif kadınlar için doğdu. Her
              bir koku, bir kadının farklı yüzünü temsil eder — güçlü, romantik,
              gizemli ya da masumane.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad" style={{ background: "#ffffff" }}>
        <div className="gb-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(1.5rem, 5vw, 5rem)",
              alignItems: "center",
            }}
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Image
                src="https://res.cloudinary.com/dnfmvs2ci/image/upload/v1773692693/mkngroup/girlboss/ujVczZ4iADvctbNhH0dij_VEDJcJaE_arhup8.png"
                alt="Biz Kimiz"
                width={500}
                height={500}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "1rem",
                  display: "block",
                  height: "auto",
                }}
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#b76e79] font-bold mb-4">
                Biz Kimiz?
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-6 leading-tight">
                Bir Tutkunun
                <br />
                Kokuya Dönüşmesi
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
                className="text-sm text-[#737373] leading-relaxed"
              >
                <p>
                  GIRLBOSS, 2024 yılında İstanbul'da bir hayalin gerçeğe
                  dönüşmesiyle başladı. Kurucu Ekibimiz, kadınların kendilerini
                  ifade etmelerinin en güçlü yollarından birinin koku olduğuna
                  inanarak bu yolculuğa çıktı.
                </p>
                <p>
                  Fransa'nın en saygın parfüm evleriyle iş birliği yaparak, %100
                  vegan ve cruelty-free body mist koleksiyonumuzu oluşturduk.
                  Her bir ürün, kadının farklı bir yönünü — gücünü, zarafetini,
                  gizemini veya masumiyetini — kokuyla anlatıyor.
                </p>
                <p>
                  Sadece bir body mist markası olmaktan çok daha fazlası.
                  GIRLBOSS, bir yaşam felsefesi. &ldquo;Kokunla Hükmet&rdquo;
                  sloganımız, her kadının kendi gücünü keşfetmesi ve onu dünyaya
                  göstermesi için bir çağrı.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: "#fdf8f5" }}>
        <div className="gb-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: "3.5rem" }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-5">
              Değerlerimiz
            </h2>
            <p
              className="text-[#737373] text-sm"
              style={{
                maxWidth: "28rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Her şeyin merkezinde bu inaçlar var.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: <Heart size={28} />,
                title: "Kadın Gücü",
                desc: "Her kadının kendine özgü gücüne inanıyoruz. Ürünlerimiz bu gücü kutlamak için tasarlanıyor.",
              },
              {
                icon: <Leaf size={28} />,
                title: "Doğaya Saygı",
                desc: "%100 vegan, cruelty-free ve sürdürülebilir ambalajlar. Doğaya zarar vermeden güzellik.",
              },
              {
                icon: <Award size={28} />,
                title: "Premium Kalite",
                desc: "Fransa'dan gelen bileşenler, uzman parfümörler ve dermatolojik testler. Kaliteden asla taviz vermiyoruz.",
              },
              {
                icon: <Users size={28} />,
                title: "Topluluk",
                desc: "50.000'den fazla GIRLBOSS kadınıyla birlikte büyüyen, birbirini destekleyen bir topluluk.",
              },
              {
                icon: <Globe size={28} />,
                title: "Sürdürülebilirlik",
                desc: "Geri dönüştürülebilir ambalajlar, karbon nötr üretim ve çevreci lojistik çözümler.",
              },
              {
                icon: <Sparkles size={28} />,
                title: "İnovasyon",
                desc: "Sürekli AR-GE çalışmaları ve yeni koku keşifleriyle sektörün öncüsü olma vizyonu.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-3xl border border-[#f0e8e4] hover:border-[#fecdd3] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(183,110,121,0.1)] group"
                style={{ padding: "2rem" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#fdf8f5] text-[#b76e79] flex items-center justify-center mb-5 group-hover:bg-[#b76e79] group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-pad-lg"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(to right, #b76e79, #c4587a)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="gb-container-narrow text-center relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Hazır mısın?
            </h2>
            <p
              className="text-white/70 mb-8 text-sm"
              style={{
                maxWidth: "28rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Sen de GIRLBOSS ailesine katıl ve kokunla dünyayı fethet.
            </p>
            <GBButton variant="white" size="lg" href="/urunler">
              Koleksiyonu Keşfet
            </GBButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
