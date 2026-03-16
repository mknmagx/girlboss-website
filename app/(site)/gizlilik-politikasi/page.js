"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
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
    title: "1. Veri Sorumlusu",
    content: `${company.brandName} markası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatını taşıyan ${company.legalName} tarafından işletilmektedir.

Unvan   : ${company.legalName}
Adres   : ${company.address}
E-posta : ${company.kvkkEmail}
Telefon : ${company.phone}`,
  },
  {
    title: "2. Toplanan Kişisel Veriler",
    content: `Şirketimiz aşağıdaki kişisel verilerinizi işleyebilir:

• Kimlik verileri: Ad, soyad
• İletişim verileri: E-posta adresi, telefon numarası, teslimat adresi
• Hesap verileri: Kullanıcı adı, şifreli hesap bilgileri
• Ödeme verileri: Kart bilgileri (yalnızca ödeme altyapı sağlayıcısı tarafından işlenir; Şirketimiz kart numarası saklamaz)
• İşlem verileri: Sipariş geçmişi, fatura bilgileri
• Kullanım verileri: Site gezinme bilgileri, çerez verileri, IP adresi`,
  },
  {
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    content: `Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

• Siparişlerinizin alınması, hazırlanması ve teslimatının gerçekleştirilmesi
• Müşteri hizmetleri sunulması ve şikayetlerin yönetimi
• Fatura ve muhasebe yükümlülüklerinin yerine getirilmesi
• Yasal yükümlülüklerin karşılanması (vergi mevzuatı, ticaret hukuku vb.)
• Kullanıcı hesaplarının oluşturulması ve yönetilmesi
• İzin verilmesi halinde ticari elektronik ileti (e-posta, SMS) gönderilmesi
• Site güvenliğinin ve işlevselliğinin sağlanması`,
  },
  {
    title: "4. Hukuki Dayanak",
    content: `Kişisel verileriniz KVKK'nın 5. maddesi kapsamında;

• Bir sözleşmenin kurulması veya ifası için zorunlu olması (sipariş, teslimat),
• Şirketin hukuki yükümlülüklerini yerine getirmesi,
• Meşru menfaatlerimiz kapsamında (site güvenliği, hizmet iyileştirme),
• Açık rızanız (pazarlama iletişimleri için)

hukuki dayanakları çerçevesinde işlenmektedir.`,
  },
  {
    title: "5. Kişisel Verilerin Aktarılması",
    content: `Kişisel verileriniz; sipariş teslimatı için kargo firmalarına, ödeme altyapısı için iyzico'ya, e-posta/SMS altyapısı için teknoloji sağlayıcılarına, yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına aktarılabilir. Yurt dışına veri aktarımı KVKK'nın 9. maddesi uyarınca gerekli güvenceler sağlandığında gerçekleştirilir.`,
  },
  {
    title: "6. Veri Saklama Süreleri",
    content: `Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili yasal yükümlülükler kapsamında saklanır:

• Muhasebe ve fatura kayıtları: 10 yıl (Türk Ticaret Kanunu)
• Sipariş ve sözleşme bilgileri: 10 yıl
• Pazarlama izinleri ve iletişim kayıtları: İzin geri alınana kadar, azami 3 yıl
• Hesap bilgileri: Hesap silinene kadar + 2 yıl`,
  },
  {
    title: "7. Çerezler (Cookies)",
    content: `Sitemiz; oturum yönetimi, tercih hatırlama ve analitik amacıyla çerez kullanmaktadır.

• Zorunlu çerezler: Sitenin temel işlevleri için gereklidir.
• Analitik çerezler: Ziyaretçi davranışlarını anonim olarak analiz eder.
• Pazarlama çerezleri: Kişiselleştirilmiş reklamlar için kullanılır (onayınıza tabidir).

Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu, bazı site özelliklerini etkileyebilir.`,
  },
  {
    title: "8. Veri Güvenliği",
    content: `Kişisel verilerinizi yetkisiz erişim, kayıp veya ifşaya karşı korumak amacıyla SSL/TLS şifreleme, güvenli sunucu altyapısı ve erişim kontrolleri gibi teknik ve idari tedbirler uygulanmaktadır. Ödeme işlemleri PCI-DSS uyumlu iyzico altyapısı üzerinden gerçekleştirilir.`,
  },
  {
    title: "9. İlgili Kişi Hakları",
    content: `KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşleniyorsa bilgi talep etme
• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme
• Eksik veya yanlış işlenmişse düzeltilmesini isteme
• KVKK kapsamında silinmesini veya yok edilmesini isteme
• Otomatik sistemler aracılığıyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme
• Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme

Taleplerinizi ${company.kvkkEmail} adresine iletebilirsiniz. Başvurular 30 gün içinde sonuçlandırılır.`,
  },
  {
    title: "10. Güncellemeler",
    content: `Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler e-posta veya site üzerinden duyurulur. Son güncelleme tarihi: 1 Mart 2026.`,
  },
];

export default function GizlilikPolitikasiPage() {
  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 hero-bg-static" />
        <div className="gb-container text-center relative z-10">
          <div className="hero-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b76e79]/10 rounded-full mb-5">
              <Shield size={14} className="text-[#b76e79]" />
              <span className="text-[11px] tracking-wider text-[#b76e79] font-bold uppercase">Hukuki Metin</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2d2d2d] mb-4 sm:mb-6">
              Gizlilik{" "}
              <span className="gb-gradient-text">Politikası</span>
            </h1>
            <p className="text-[#737373] text-xs sm:text-sm leading-relaxed max-w-lg mx-auto px-2">
              Kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklamaktayız.
              6698 sayılı KVKK kapsamında hazırlanmıştır.
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
              Bu politika ile ilgili sorularınız için{" "}
              <a href={`mailto:${company.kvkkEmail}`} className="text-[#b76e79] font-semibold hover:underline">
                {company.kvkkEmail}
              </a>{" "}
              adresine yazabilirsiniz.
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
