"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
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
    title: "1. Teslimat Koşulları",
    content: `1.1 Siparişleriniz, ödemenin onaylanmasının ardından 1–3 iş günü içinde hazırlanarak kargo firmamıza teslim edilir.

1.2 Türkiye genelinde standart teslimat süresi 2–5 iş günüdür. Yoğun kampanya dönemlerinde bu süre uzayabilir; kargo takip numarası ile sipariş durumunuzu takip edebilirsiniz.

1.3 Teslimat ücreti, sipariş tutarı 500 TL ve üzerinde olan alışverişlerde ücretsizdir. Bu tutarın altındaki siparişler için kargo ücreti ödeme adımında gösterilir.

1.4 Sipariş sonrası kargo takip bilgileriniz kayıtlı e-posta adresinize iletilir.

1.5 Teslimat adresi hatalı veya eksik girildiğinde doğabilecek kargo ücretleri ve gecikmeler alıcıya aittir.`,
  },
  {
    title: "2. Teslimat Yapılmayan Durumlar",
    content: `2.1 Kargo firması, teslimat adresinde teslim yapamadığı takdirde ürünü en yakın şube veya kargo noktasında bekletir. Teslim alma süresi 3 iş günüdür.

2.2 Bu süre içinde ürün teslim alınmaz ise Şirketimize iade edilir; yeniden gönderim ücreti alıcıya ait olmak üzere tekrar kargo yapılır.`,
  },
  {
    title: "3. İade Hakkı ve Koşulları",
    content: `3.1 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, ürünü teslim tarihinden itibaren 14 (on dört) gün içinde, herhangi bir gerekçe göstermeksizin iade etme hakkına sahipsiniz.

3.2 İade edilecek ürünlerin aşağıdaki koşulları sağlaması gerekmektedir:
• Kullanılmamış, açılmamış ve orijinal ambalajında olması
• Bandrolü, etiketi veya koruyucu bandının bozulmamış olması
• Tüm aksesuarlar ile birlikte eksiksiz olarak gönderilmesi
• Ürün faturasının iade paketine eklenmesi

3.3 Kozmetik ve kişisel bakım ürünlerinde, hijyen gerekçesiyle ambalajı açılmış veya kullanılmış ürünler iade kapsamı dışındadır. Bu durum TKHK'nın 15/1-c maddesi gereğince cayma hakkının istisnası olup tüketiciye sipariş öncesi bildirilmektedir.`,
  },
  {
    title: "4. Cayma Hakkı Bildirimi",
    content: `Cayma hakkınızı kullanmak istediğinizde:

• İletişim formu üzerinden veya ${company.email} adresine e-posta göndererek bize bildirin.
• Bildiriminizde sipariş numarası, iade etmek istediğiniz ürün(ler) ve iade gerekçesini belirtin.
• Onay sonrası ürünü, bildirim tarihinden itibaren 10 gün içinde kargoya teslim edin.

İade kargo ücreti tüketiciye aittir; ancak hatalı veya hasarlı ürün gönderimleri nedeniyle yapılan iadelerde kargo ücreti Şirketimiz tarafından karşılanır.`,
  },
  {
    title: "5. Geri Ödeme",
    content: `5.1 İade talebiniz onaylandıktan ve ürün Şirketimize ulaştıktan sonra, 14 gün içinde ödemeniz kullandığınız ödeme yöntemiyle iade edilir.

5.2 Kredi kartı iadelerinde tutarın hesabınıza yansıma süresi bankanıza göre değişebilir (genellikle 3–10 iş günü).

5.3 Banka havalesi ile yapılan ödemelerde iade, bildirilen IBAN numarasına yapılır.`,
  },
  {
    title: "6. Değişim",
    content: `Ürün değişim talepleri için ${company.email} adresinden bizimle iletişime geçebilirsiniz. Değişim; ürünün kullanılmamış, orijinal ambalajında ve beraberinde fatura ile gönderilmesi koşuluyla mümkündür. Stok durumuna göre değişim veya iade-yeniden sipariş seçenekleri sunulur.`,
  },
  {
    title: "7. Hasarlı veya Hatalı Ürün",
    content: `Teslim aldığınız ürün hasarlı, bozuk veya yanlış gönderilmişse, teslim tarihinden itibaren 3 gün içinde ${company.email} adresine fotoğraflı bildirimde bulunun. Sorunun teyidi sonrasında yeni ürün gönderilir veya tam iade yapılır; kargo ücreti Şirketimiz tarafından karşılanır.`,
  },
  {
    title: "8. İletişim",
    content: `Teslimat ve iade süreçlerine ilişkin sorularınız için:

E-posta: ${company.email}
Telefon: ${company.phone}
Çalışma Saatleri: Pzt–Cum 09:00–18:00`,
  },
];

export default function TeslimatIadePage() {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center relative z-10">
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <Truck size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Hukuki Metin</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2d2d2d] mb-4 sm:mb-6">
              Teslimat ve{" "}
              <span className="gb-gradient-text">İade Şartları</span>
            </h1>
            <p className="text-[#737373] text-xs sm:text-sm leading-relaxed max-w-lg mx-auto px-2">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
              Yönetmeliği kapsamındaki haklarınız hakkında bilgi edinebilirsiniz.
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
              İade ve teslimat süreçleri hakkında sorularınız için{" "}
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
