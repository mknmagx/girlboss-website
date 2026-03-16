"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import { company } from "@/lib/config/company";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sections = [
  {
    title: "1. Taraflar",
    content: `Satıcı Bilgileri:
Unvan      : ${company.legalName}
Marka      : ${company.brandName} (Tescilli Marka)
Adres      : ${company.address}
Telefon    : ${company.phone}
E-posta    : ${company.email}
Web Sitesi : ${company.website}

Alıcı Bilgileri:
Adı, soyadı, e-posta adresi, teslimat adresi ve telefon numarası sipariş formunda beyan edilen bilgilerden oluşmaktadır.`,
  },
  {
    title: "2. Sözleşmenin Konusu",
    content: `İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde, Alıcı'nın ${company.website} üzerinden elektronik ortamda sipariş verdiği ürün(ler)in satışı ve teslimatına ilişkin Satıcı ve Alıcı'nın hak ve yükümlülüklerini belirlemektedir.`,
  },
  {
    title: "3. Sözleşme Konusu Ürün(ler)",
    content: `Sözleşme konusu ürün(ler), Alıcı'nın sipariş formunda seçtiği, adı, miktarı, satış fiyatı ve ödeme bilgileri sipariş özeti sayfasında gösterilen mal(lar)dır. Ürün ile ilgili tüm bilgiler (özellikler, fiyat, kampanya koşulları) sipariş tamamlanmadan önce Alıcı'ya sunulur ve Alıcı bu bilgileri onaylamış sayılır.`,
  },
  {
    title: "4. Ödeme Bilgileri",
    content: `Ürün bedeli, sipariş öncesinde Alıcı'ya açıkça bildirilir. Ödeme; kredi kartı, banka kartı veya havale/EFT yöntemleriyle iyzico ödeme altyapısı üzerinden güvenli biçimde gerçekleştirilir. Kart bilgileri Satıcı tarafından saklanmaz; tüm ödeme işlemleri PCI-DSS uyumlu iyzico sistemleri tarafından yönetilir.

Kredi kartı ile yapılan ödemelerde taksit imkânı bankaya ve kampanya koşullarına göre değişebilir.`,
  },
  {
    title: "5. Teslimat Koşulları",
    content: `5.1 Ürün(ler), ödemenin onaylanmasının ardından 1–3 iş günü içinde hazırlanarak anlaşmalı kargo firması aracılığıyla Alıcı'nın belirttiği teslimat adresine gönderilir.

5.2 Türkiye genelinde tahmini teslimat süresi 2–5 iş günüdür. Kargo şirketi, hava koşulları veya yoğun dönemler gibi mücbir sebepler göz önüne alındığında bu süre uzayabilir.

5.3 Teslimat ücreti, 500 TL ve üzerindeki siparişlerde ücretsizdir; bu tutarın altındaki siparişlerde teslimat ücreti sipariş ödeme adımında açıkça gösterilir.

5.4 Satıcı, Alıcı'ya sipariş kargo takip numarasını e-posta ile bildirir.`,
  },
  {
    title: "6. Cayma Hakkı",
    content: `6.1 Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.

6.2 Cayma hakkı bildiriminin ${company.email} adresine yazılı olarak yapılması yeterlidir. Bildirim sonrası ürün 10 gün içinde Satıcı'ya iade edilir.

6.3 Cayma hakkının kullanılması halinde Satıcı, ürünün kendisine ulaşmasından itibaren 14 gün içinde ödemeyi iade eder.

6.4 İade kargo ücreti, Alıcı tarafından karşılanır. Yanlış veya hasarlı ürün gönderiminden kaynaklanan iadelerde kargo ücreti Satıcı'ya aittir.`,
  },
  {
    title: "7. Cayma Hakkının İstisnaları",
    content: `Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (c) bendi uyarınca; teslimden sonra ambalajı açılan, bant veya etiketi bozulan kozmetik ürünler ve kişisel bakım ürünleri sağlık veya hijyen gerekçesiyle cayma hakkı kapsamı dışındadır.

Bu durum Alıcı'ya sipariş tamamlanmadan önce açıkça bildirilmekte olup Alıcı, siparişi onaylamakla bu istisnayı kabul etmiş sayılır.`,
  },
  {
    title: "8. Garanti ve Ürün Uygunluğu",
    content: `Satıcı, tüm ürünlerinin ilgili mevzuat ve Türk Standartları Enstitüsü standartlarına uygun olduğunu taahhüt eder. Ürünlerde ayıp tespit edilmesi halinde Alıcı, 6502 sayılı Kanun'un 11. maddesi kapsamındaki seçimlik haklarını kullanabilir:

• Ücretsiz onarım talep etme
• Değişim talep etme
• Sözleşmeden dönme (tam iade)
• Bedelin indirilmesini talep etme`,
  },
  {
    title: "9. Kişisel Verilerin Korunması",
    content: `Alıcı'ya ait kişisel veriler 6698 sayılı Kişisel Verilerin Korunması Kanunu ve Gizlilik Politikamız kapsamında işlenmektedir. Ayrıntılar için web sitemizin Gizlilik Politikası sayfasını inceleyebilirsiniz.`,
  },
  {
    title: "10. Uyuşmazlık Çözümü",
    content: `Bu Sözleşme'den doğabilecek uyuşmazlıklarda, 6502 sayılı Kanun kapsamında aşağıdaki başvuru yolları mevcuttur:

• Tüketici hakem heyetleri (yürürlükteki parasal sınırlar dahilinde)
• Tüketici mahkemeleri

Yetkili tüketici hakem heyeti ve tüketici mahkemesi olarak Alıcı'nın yerleşim yeri veya Satıcı'nın bulunduğu yer mahkemeleri yetkilidir.`,
  },
  {
    title: "11. Yürürlük",
    content: `Alıcı, sipariş formunu onaylamakla işbu Sözleşme'nin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan eder. Sözleşme, elektronik ortamda kurulan ön bilgilendirme formunun Alıcı tarafından onaylanmasıyla birlikte kurulmuş sayılır.

Son güncelleme: 1 Mart 2026`,
  },
];

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center relative z-10">
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <FileText size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Hukuki Metin</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2d2d2d] mb-4 sm:mb-6">
              Mesafeli Satış{" "}
              <span className="gb-gradient-text">Sözleşmesi</span>
            </h1>
            <p className="text-[#737373] text-xs sm:text-sm leading-relaxed max-w-lg mx-auto px-2">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
              Yönetmeliği kapsamında hazırlanmıştır.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="gb-container">
          <div className="max-w-3xl mx-auto">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="mb-10"
              >
                <h2 className="text-lg font-extrabold text-[#2d2d2d] mb-3 pb-2 border-b border-[#f0e8e4]">
                  {sec.title}
                </h2>
                <p className="text-sm text-[#737373] leading-relaxed whitespace-pre-line">{sec.content}</p>
              </motion.div>
            ))}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 p-5 bg-[#b76e79]/5 border border-[#b76e79]/15 rounded-2xl text-sm text-[#737373] leading-relaxed"
            >
              Bu sözleşme hakkında sorularınız için{" "}
              <a href={`mailto:${company.email}`} className="text-[#b76e79] font-semibold hover:underline">
                {company.email}
              </a>{" "}
              adresine yazabilir ya da{" "}
              <a href="/iletisim" className="text-[#b76e79] font-semibold hover:underline">
                iletişim formunu
              </a>{" "}
              kullanabilirsiniz.
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
