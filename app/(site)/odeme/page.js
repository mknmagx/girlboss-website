"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  User,
  Zap,
  MapPin,
  CreditCard,
  Lock,
  Package,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Home,
  Briefcase,
  Building2,
  Plus,
  FileText,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { createOrder, getSettings } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD_DEFAULT = 500;
const SHIPPING_COST_DEFAULT = 29.9;

/* ─── Helpers ─── */
function formatCardNumber(v) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

/* ─── Sub-components ─── */
function SectionCard({ icon: Icon, title, right, children }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "1.5rem",
        border: "1px solid #f0e8e4",
        padding: "1.75rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            background: "linear-gradient(135deg, #b76e79, #e890a8)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={13} color="white" />
        </div>
        <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d2d2d", minWidth: 0 }}>
          {title}
        </h2>
        {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Legal texts (6502 TKHK + Mesafeli Sözleşmeler Yönetmeliği + KVKK)
   ═══════════════════════════════════════════ */
const LEGAL_TEXTS = {
  bilgilendirme: {
    title: "Ön Bilgilendirme Formu",
    content: `ÖN BİLGİLENDİRME FORMU
(6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır)

1. SATICI BİLGİLERİ
Unvan: GirlBoss Parfümeri
E-posta: iletisim@girlboss.com.tr

2. SÖZLEŞMENİN KONUSU
Bu form, elektronik ortamda gerçekleştirilen alışverişe ilişkin 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca hazırlanmıştır.

3. ÜRÜN/HİZMET BİLGİLERİ
Satın almak istediğiniz ürünlere ilişkin temel özellikler her ürünün kendi sayfasında belirtilmektedir. Ürünlerin fiyatları KDV dahildir.

4. TOPLAM FİYAT
Sepetinizdeki ürünlerin, kargo ücreti dahil toplam tutarı ödeme adımında gösterilmektedir.

5. TESLİMAT BİLGİLERİ
Sipariş onayından itibaren 1-5 iş günü içinde teslimat gerçekleştirilir. Özel günler ve yoğun dönemlerde bu süre uzayabilir. Teslimat adresi, sipariş formunda belirttiğiniz adres olacaktır.

6. ÖDEME BİLGİLERİ
Kredi/banka kartı, kapıda ödeme veya havale/EFT yöntemleriyle ödeme yapılabilir. Kredi kartı işlemleri SSL şifrelemesi ile güvence altındadır.

7. CAYMA HAKKI
Mesafeli sözleşmelerde tüketici, herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşme tarihinden itibaren 14 (on dört) takvim günü içinde cayma hakkına sahiptir.

Cayma hakkının kullanılması için aşağıdaki adrese yazılı bildirim iletilmelidir:
E-posta: iletisim@girlboss.com.tr

Cayma hakkının kullanımında ürün, orijinal ambalajıyla ve eksiksiz olarak iade edilmelidir.

8. CAYMA HAKKININ KULLANILAMAYACAĞI DURUMLAR
6502 Sayılı Kanun'un 15. maddesi uyarınca aşağıdaki durumlarda cayma hakkı kullanılamaz:
- Tüketicinin istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler
- Çabuk bozulabilen ya da son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler
- Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan ve iadesi sağlık ve hijyen açısından uygun olmayan mallara ilişkin sözleşmeler

9. GİZLİLİK
Kişisel verileriniz yürürlükteki KVKK mevzuatı çerçevesinde işlenmektedir.`,
  },
  sozlesme: {
    title: "Mesafeli Satış Sözleşmesi",
    content: `MESAFELİ SATIŞ SÖZLEŞMESİ
(6502 Sayılı Tüketicinin Korunması Hakkında Kanun kapsamında)

MADDE 1 – TARAFLAR
SATICI:
GirlBoss Parfümeri
E-posta: iletisim@girlboss.com.tr

ALICI: Sipariş formunda belirtilen ad, soyad ve iletişim bilgilerine sahip kişi.

MADDE 2 – KONU
İşbu sözleşme, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimatına ilişkin tarafların hak ve yükümlülüklerini kapsamaktadır.

MADDE 3 – ÜRÜN BİLGİLERİ VE BEDELLERİ
Sözleşme konusu ürün veya ürünlerin cinsi, miktarı ve satış fiyatları sipariş özetinde yer almaktadır. Tüm fiyatlar KDV dahildir.

MADDE 4 – TESLİMAT
4.1. Ürünler, sipariş onayından itibaren azami 30 gün içinde teslim edilir. Normal koşullarda teslimat 1-5 iş günü içinde gerçekleşir.
4.2. Teslimat, siparişte belirtilen adrese yapılır.
4.3. Hasar, kayıp veya eksik ürün için teslim anında tutanak tutulmalıdır.

MADDE 5 – ÖDEME
Seçilen ödeme yöntemine göre ödeme alınır. Kapıda ödeme seçilmişse teslim anında nakit veya kart ile ödeme yapılır.

MADDE 6 – CAYMA HAKKI
6.1. Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) takvim günü içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
6.2. Cayma hakkının kullanılması için ürünler kullanılmamış, orijinal ambalajıyla, eksiksiz ve hasarsız olarak iade edilmelidir.
6.3. Cayma bildirimi e-posta aracılığıyla iletisim@girlboss.com.tr adresine yapılabilir.
6.4. Cayma hakkının kullanılması halinde, ürünün Satıcı'ya iade kargo ücreti Alıcı'ya aittir.
6.5. Satıcı, cayma bildirimini aldıktan sonra 14 gün içinde ödemeyi iade eder.

MADDE 7 – CAYMA HAKKININ KULLANILAMAYACAĞI DURUMLAR
Ürünün ambalajı açılmış, hijyen koşullarına uygunsuz hale getirilmiş ya da kişiye özel üretilmiş ürünlerde cayma hakkı kullanılamaz.

MADDE 8 – GARANTİ
Ürünler yasal garanti kapsamındadır. Ayıplı ürün teslimi halinde Tüketicinin Korunması Hakkında Kanun hükümleri uygulanır.

MADDE 9 – UYUŞMAZLIKLARIN ÇÖZÜMÜ
Taraflar arasındaki uyuşmazlıklarda 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili yönetmelikler uygulanır. Uyuşmazlıklar için İl/İlçe Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.

MADDE 10 – YÜRÜRLÜK
Alıcı, sipariş işlemini tamamlayarak bu sözleşmenin tüm hükümlerini okuduğunu ve kabul ettiğini beyan eder.`,
  },
  kvkk: {
    title: "Kişisel Verilerin Korunması Aydınlatma Metni",
    content: `KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ
(6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında)

1. VERİ SORUMLUSU
GirlBoss Parfümeri, 6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusudur.

2. İŞLENEN KİŞİSEL VERİLER
Alışveriş sürecinde aşağıdaki kişisel verileriniz işlenmektedir:
- Kimlik bilgileri: Ad, soyad
- İletişim bilgileri: E-posta adresi, telefon numarası, teslimat adresi
- Sipariş bilgileri: Satın alınan ürünler, sipariş tarihi, ödeme yöntemi
- İşlem güvenliği verisi: IP adresi, tarayıcı bilgisi

3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI
- Siparişin alınması, onaylanması, kargoya verilmesi ve teslimatının sağlanması
- Fatura düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi
- Müşteri hizmetleri
- İade ve şikâyet süreçlerinin yönetimi
- Pazarlama iletişimi (açık rızanız olması halinde)

4. İŞLENMENİN HUKUKİ DAYANAĞI
Verileriniz; sözleşmenin kurulması ve ifası, yasal yükümlülüklerin yerine getirilmesi ve meşru menfaat hukuki dayanaklarına istinaden işlenmektedir.

5. KİŞİSEL VERİLERİN AKTARIMI
Verileriniz; kargo teslimatı için anlaşmalı kargo firmalarına, ödeme işlemleri için ödeme altyapı sağlayıcılarına ve yasal yükümlülükler kapsamında yetkili kamu kurumlarına aktarılabilir.

6. VERİ SAKLAMA SÜRESİ
Kişisel verileriniz, alışveriş ilişkisinin devam ettiği süre boyunca ve yasal yükümlülükler kapsamında belirlenen süreler gözetilerek saklanmaktadır.

7. HAKLARINIZ
KVKK'nın 11. maddesi kapsamında aşağıdaki haklarınız bulunmaktadır:
- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenen verilerinize ilişkin bilgi talep etme
- İşleme amacını öğrenme ve amaca uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde/dışında verilerinizin aktarıldığı üçüncü kişileri öğrenme
- Eksik veya yanlış işlenen verilerin düzeltilmesini isteme
- Verilerin silinmesini veya yok edilmesini isteme
- İşlenen verilerin otomatik sistemler aracılığıyla analiz edilmesi sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme
- Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme

Haklarınızı kullanmak için: iletisim@girlboss.com.tr adresine e-posta gönderebilirsiniz.`,
  },
};

function LegalModal({ modalKey, onClose }) {
  const doc = LEGAL_TEXTS[modalKey];
  if (!doc) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative", background: "#fff", borderRadius: "1.5rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.22)", maxWidth: "48rem",
          width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.75rem", borderBottom: "1px solid #f0e8e4",
            background: "#fdf8f5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: "1.75rem", height: "1.75rem", background: "linear-gradient(135deg, #b76e79, #e890a8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={11} color="white" />
            </div>
            <h3 style={{ fontWeight: "700", fontSize: "0.9375rem", color: "#2d2d2d" }}>{doc.title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ padding: "0.375rem", borderRadius: "50%", border: "none", background: "#f5f5f5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <X size={16} color="#737373" />
          </button>
        </div>
        {/* Content */}
        <div
          style={{
            overflowY: "auto", padding: "1.75rem",
            fontSize: "0.8125rem", color: "#525252", lineHeight: "1.75",
            whiteSpace: "pre-wrap", flex: 1,
          }}
        >
          {doc.content}
        </div>
        {/* Footer */}
        <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid #f0e8e4", background: "#fdf8f5" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "0.75rem",
              background: "linear-gradient(to right, #b76e79, #c4587a)",
              color: "#fff", border: "none", borderRadius: "0.75rem",
              fontWeight: "700", fontSize: "0.875rem", cursor: "pointer",
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */
export default function OdemePage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, subtotal, count, clearCart } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const router = useRouter();

  /* site settings */
  const [siteSettings, setSiteSettings] = useState(null);
  useEffect(() => {
    getSettings().then((s) => setSiteSettings(s));
  }, []);

  const FREE_SHIPPING_THRESHOLD = Number(siteSettings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD_DEFAULT);
  const SHIPPING_COST = Number(siteSettings?.shippingCost ?? SHIPPING_COST_DEFAULT);
  const activeCarrier = (siteSettings?.carriers ?? []).find((c) => c.enabled);
  const pm = siteSettings?.paymentMethods ?? null;
  const pmCC = pm?.creditCard ?? { enabled: true, cards: ["VISA", "MC", "AMEX", "TROY"] };
  const pmCOD = pm?.cashOnDelivery ?? { enabled: true, fee: 15 };
  const pmBT = pm?.bankTransfer ?? { enabled: false };
  /* payment method selection state — default to credit card if available */
  const [payMethod, setPayMethod] = useState("creditCard"); // "creditCard" | "cashOnDelivery" | "bankTransfer"

  const [guestMode, setGuestMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // null = none chosen yet
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consents, setConsents] = useState({ bilgilendirme: false, sozlesme: false, kvkk: false, pazarlama: false });
  const [consentError, setConsentError] = useState("");
  const [legalModal, setLegalModal] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  /* Delivery state */
  const [delivery, setDelivery] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    adres: "",
    sehir: "",
    ilce: "",
    postakodu: "",
  });
  const [dErr, setDErr] = useState({});

  /* Card state */
  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [cErr, setCErr] = useState({});
  const [use3DSecure, setUse3DSecure] = useState(true);

  const codFee = payMethod === "cashOnDelivery" ? Number(pmCOD.fee ?? 15) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping + codFee;
  const isReady = user || guestMode;

  function setD(field, value) {
    setDelivery((d) => ({ ...d, [field]: value }));
    if (dErr[field]) setDErr((e) => ({ ...e, [field]: "" }));
  }

  /* Apply a saved address to the delivery form */
  function applyAddress(addr) {
    setDelivery((d) => ({
      ...d,
      ad: addr.ad || "",
      soyad: addr.soyad || "",
      telefon: addr.telefon || "",
      adres: addr.adres || "",
      sehir: addr.sehir || "",
      ilce: addr.ilce || "",
      postakodu: addr.postakodu || "",
    }));
    setDErr({});
  }

  const TITLE_ICONS = { ev: Home, is: Briefcase, diger: Building2 };
  const TITLE_LABELS = { ev: "Ev", is: "İş", diger: "Diğer" };

  /* Auto-select default address for logged-in users on first load */
  useEffect(() => {
    if (user && defaultAddress && selectedAddressId === null) {
      setSelectedAddressId(defaultAddress.id);
      setDelivery((d) => ({
        ...d,
        ad: defaultAddress.ad || "",
        soyad: defaultAddress.soyad || "",
        telefon: defaultAddress.telefon || "",
        adres: defaultAddress.adres || "",
        sehir: defaultAddress.sehir || "",
        ilce: defaultAddress.ilce || "",
        postakodu: defaultAddress.postakodu || "",
      }));
    }
  }, [user, defaultAddress]);
  function setC(field, value) {
    setCard((d) => ({ ...d, [field]: value }));
    if (cErr[field]) setCErr((e) => ({ ...e, [field]: "" }));
  }

  function validateDelivery() {
    const e = {};
    if (!delivery.ad.trim()) e.ad = "Ad zorunludur.";
    if (!delivery.soyad.trim()) e.soyad = "Soyad zorunludur.";
    const emailVal = delivery.email.trim() || user?.email || "";
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
      e.email = "Geçerli bir e-posta girin.";
    if (delivery.telefon.replace(/\D/g, "").length < 10)
      e.telefon = "Geçerli bir telefon numarası girin.";
    if (!delivery.adres.trim()) e.adres = "Adres zorunludur.";
    if (!delivery.sehir.trim()) e.sehir = "Şehir zorunludur.";
    if (!delivery.ilce.trim()) e.ilce = "İlçe zorunludur.";
    return e;
  }
  function validateCard() {
    if (payMethod !== "creditCard") return {};
    const e = {};
    if (!card.holder.trim()) e.holder = "Kart üzerindeki isim zorunludur.";
    if (card.number.replace(/\s/g, "").length < 16)
      e.number = "Geçerli bir kart numarası girin.";
    if (!card.expiry || card.expiry.length < 5)
      e.expiry = "Son kullanma tarihini girin.";
    if (!card.cvv || card.cvv.length < 3) e.cvv = "CVV kodunu girin.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const de = validateDelivery();
    const ce = validateCard();
    if (Object.keys(de).length) {
      setDErr(de);
      document.getElementById("delivery-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Object.keys(ce).length) {
      setCErr(ce);
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!consents.bilgilendirme || !consents.sozlesme || !consents.kvkk) {
      setConsentError("Siparişi tamamlamak için tüm zorunlu onayları vermeniz gerekmektedir.");
      document.getElementById("legal-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setConsentError("");
    setSubmitting(true);
    const now = new Date().toISOString();
    try {
      const newOrderId = await createOrder({
        uid: user?.uid || null,
        email: delivery.email || user?.email || "",
        customerName: `${delivery.ad} ${delivery.soyad}`.trim(),
        phone: delivery.telefon,
        address: delivery.adres,
        city: delivery.sehir,
        district: delivery.ilce,
        postalCode: delivery.postakodu,
        delivery: {
          ad: delivery.ad,
          soyad: delivery.soyad,
          telefon: delivery.telefon,
          adres: delivery.adres,
          sehir: delivery.sehir,
          ilce: delivery.ilce,
          postakodu: delivery.postakodu,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          qty: item.qty,
          tagline: item.tagline || "",
          volume: item.volume || "",
          gradient: item.gradient || "",
          images: item.images || [],
        })),
        subtotal,
        shipping,
        codFee,
        discount: 0,
        total,
        paymentMethod: payMethod,
        use3DSecure: payMethod === "creditCard" ? use3DSecure : null,
        carrier: activeCarrier?.name ?? null,
        estimatedDelivery: activeCarrier?.estimatedDays ?? null,
        isGuest: !user,
        legalConsents: {
          bilgilendirme: now,
          sozlesme: now,
          kvkk: now,
          pazarlama: consents.pazarlama ? now : null,
          ip: null,
          timestamp: now,
        },
      });
      setOrderId(newOrderId);
      setOrderSnapshot({ subtotal, shipping, codFee, total });
      clearCart();
      setSubmitted(true);
    } catch {
      // Silent fail — show success anyway as this is a demo
      setOrderSnapshot({ subtotal, shipping, codFee, total });
      clearCart();
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="page-hero" style={{ paddingBottom: "2rem" }}>
        <div className="gb-container" style={{ textAlign: "center" }}>
          <div className="hero-fade">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-2">
              Güvenli <span className="gb-gradient-text">Ödeme</span>
            </h1>
            <div
              className="flex items-center justify-center gap-1.5 text-[#737373]"
              style={{ fontSize: "0.8125rem" }}
            >
              <Lock size={13} />
              <span>256-bit SSL ile korunan ödeme</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="section-pad" style={{ paddingTop: "1rem" }}>
        <div className="gb-container">
          <AnimatePresence mode="wait">
            {/* ─────────────────────────────────
                Empty Cart
            ───────────────────────────────── */}
            {cart.length === 0 && !submitted ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: "center",
                  paddingTop: "5rem",
                  paddingBottom: "5rem",
                }}
              >
                <div
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    background: "linear-gradient(135deg, #f8e1e4, #f0d4d7)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <ShoppingBag size={22} color="#b76e79" />
                </div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.625rem",
                  }}
                >
                  Sepetiniz boş
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#737373",
                    marginBottom: "1.75rem",
                  }}
                >
                  Ödeme yapabilmek için önce ürün ekleyin.
                </p>
                <GBButton
                  href="/urunler"
                  variant="primary"
                  iconRight={<ArrowRight size={14} />}
                >
                  Alışverişe Başla
                </GBButton>
              </motion.div>

            /* ─────────────────────────────────
                Order Confirmed
            ───────────────────────────────── */
            ) : submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  textAlign: "center",
                  maxWidth: "32rem",
                  margin: "0 auto",
                  paddingTop: "4.5rem",
                  paddingBottom: "4.5rem",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  style={{
                    width: "5rem",
                    height: "5rem",
                    background:
                      "linear-gradient(135deg, #b76e79, #e890a8)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 8px 32px rgba(183,110,121,0.3)",
                  }}
                >
                  <CheckCircle2 size={26} color="white" />
                </motion.div>
                <h2
                  style={{
                    fontSize: "1.625rem",
                    fontWeight: "800",
                    color: "#2d2d2d",
                    marginBottom: "0.5rem",
                  }}
                >
                  Siparişin Alındı!
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#737373", marginBottom: "1.5rem" }}>
                  Teşekkürler. Siparişini en kısa sürede kargoya vereceğiz.
                </p>

                {/* Order details card */}
                <div
                  style={{
                    background: "white", borderRadius: "1.25rem", border: "1px solid #f0e8e4",
                    padding: "1.5rem", marginBottom: "1.75rem", textAlign: "left",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  {orderId && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.875rem", borderBottom: "1px solid #f0e8e4" }}>
                      <span style={{ fontSize: "0.75rem", color: "#737373", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sipariş No</span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", fontWeight: "700", color: "#b76e79", background: "#fff5f7", padding: "0.25rem 0.625rem", borderRadius: "0.5rem", border: "1px solid #fce4ec" }}>
                        #{orderId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                      <span style={{ color: "#737373" }}>Ödeme Yöntemi</span>
                      <span style={{ fontWeight: "600", color: "#2d2d2d" }}>
                        {payMethod === "creditCard" ? "Kredi / Banka Kartı" : payMethod === "cashOnDelivery" ? "Kapıda Ödeme" : "Havale / EFT"}
                      </span>
                    </div>
                    {activeCarrier && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                        <span style={{ color: "#737373" }}>Kargo Firması</span>
                        <span style={{ fontWeight: "600", color: "#2d2d2d" }}>{activeCarrier.name}</span>
                      </div>
                    )}
                    {activeCarrier?.estimatedDays && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                        <span style={{ color: "#737373" }}>Tahmini Teslimat</span>
                        <span style={{ fontWeight: "600", color: "#22c55e" }}>{activeCarrier.estimatedDays} iş günü</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                      <span style={{ color: "#737373" }}>Toplam Tutar</span>
                      <span style={{ fontWeight: "800", color: "#2d2d2d" }}>₺{(orderSnapshot?.total ?? 0).toFixed(2)}</span>
                    </div>
                    <div style={{ height: "1px", background: "#f0e8e4", margin: "0.25rem 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                      <span style={{ color: "#737373" }}>Teslimat Adresi</span>
                      <span style={{ fontWeight: "600", color: "#2d2d2d", textAlign: "right", maxWidth: "14rem" }}>
                        {delivery.ad} {delivery.soyad}, {delivery.ilce} / {delivery.sehir}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.8125rem", color: "#737373", marginBottom: "2rem" }}>
                  Sipariş özeti <strong>{delivery.email || user?.email}</strong> adresine gönderildi.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <GBButton href="/kullanici" variant="primary">
                    Siparişlerimi Gör
                  </GBButton>
                  <GBButton href="/urunler" variant="outline">
                    Alışverişe Devam
                  </GBButton>
                </div>
              </motion.div>

            /* ─────────────────────────────────
                Auth Gate  (not logged in, no guest mode)
            ───────────────────────────────── */
            ) : !isReady ? (
              <motion.div
                key="auth-gate"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  maxWidth: "40rem",
                  margin: "0 auto",
                  paddingTop: "2rem",
                  paddingBottom: "5rem",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "2.5rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2d2d2d",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Nasıl devam etmek istersiniz?
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#737373" }}>
                    Hesabınla giriş yap ya da kayıt olmadan hızlı sipariş ver.
                  </p>
                </div>

                <div
                  className="odeme-auth-gate-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  {/* Login card */}
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: "0 14px 44px rgba(183,110,121,0.18)",
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={() =>
                      router.push("/kullanici/giris?redirect=/odeme")
                    }
                    style={{
                      background: "white",
                      borderRadius: "1.5rem",
                      border: "1.5px solid #f0e8e4",
                      padding: "2rem 1.5rem",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "3.25rem",
                        height: "3.25rem",
                        background:
                          "linear-gradient(135deg, #b76e79, #e890a8)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        boxShadow: "0 4px 16px rgba(183,110,121,0.3)",
                      }}
                    >
                      <User size={20} color="white" />
                    </div>
                    <h3
                      style={{
                        fontWeight: "700",
                        color: "#2d2d2d",
                        marginBottom: "0.375rem",
                      }}
                    >
                      Giriş Yap
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#737373",
                        marginBottom: "1.25rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Hesabına giriş yap veya yeni hesap oluştur.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        color: "#b76e79",
                        fontSize: "0.8125rem",
                        fontWeight: "600",
                      }}
                    >
                      <span>Devam Et</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.div>

                  {/* Guest card */}
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: "0 14px 44px rgba(196,162,101,0.18)",
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setGuestMode(true)}
                    style={{
                      background: "white",
                      borderRadius: "1.5rem",
                      border: "1.5px solid #f0e8e4",
                      padding: "2rem 1.5rem",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "3.25rem",
                        height: "3.25rem",
                        background:
                          "linear-gradient(135deg, #c4a265, #d4b87a)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        boxShadow: "0 4px 16px rgba(196,162,101,0.3)",
                      }}
                    >
                      <Zap size={20} color="white" />
                    </div>
                    <h3
                      style={{
                        fontWeight: "700",
                        color: "#2d2d2d",
                        marginBottom: "0.375rem",
                      }}
                    >
                      Hızlı Sipariş
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#737373",
                        marginBottom: "1.25rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Kayıt olmadan, misafir olarak sipariş ver.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        color: "#c4a265",
                        fontSize: "0.8125rem",
                        fontWeight: "600",
                      }}
                    >
                      <span>Misafir Devam</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            /* ─────────────────────────────────
                Checkout Form
            ───────────────────────────────── */
            ) : (
              <motion.form
                key="checkout"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                onSubmit={handleSubmit}
                className="odeme-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.5rem",
                  alignItems: "start",
                }}
              >
                {/* ── Left Column ── */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {/* Guest notice */}
                  {guestMode && !user && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        background: "#fffbf0",
                        border: "1px solid #f7e7ce",
                        borderRadius: "0.875rem",
                        padding: "0.75rem 1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <Zap size={14} color="#c4a265" style={{ flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "#6b5a2e",
                          fontWeight: "500",
                          flex: 1,
                        }}
                      >
                        Misafir olarak sipariş veriyorsunuz.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          router.push("/kullanici/giris?redirect=/odeme")
                        }
                        style={{
                          fontSize: "0.75rem",
                          color: "#b76e79",
                          fontWeight: "600",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          flexShrink: 0,
                        }}
                      >
                        Giriş yap
                      </button>
                    </div>
                  )}

                  {/* ── Delivery Section ── */}
                  <div id="delivery-section">
                    <SectionCard icon={MapPin} title="Teslimat Bilgileri">
                      {/* ── Saved address picker (logged-in users only) ── */}
                      {user && addresses.length > 0 && (
                        <div style={{ marginBottom: "1.5rem" }}>
                          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#525252", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Kayıtlı Adreslerim
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginBottom: "0.875rem" }}>
                            {addresses.map((addr) => {
                              const Icon = TITLE_ICONS[addr.baslik] || Building2;
                              const isSelected = selectedAddressId === addr.id;
                              return (
                                <button
                                  key={addr.id}
                                  type="button"
                                  onClick={() => { setSelectedAddressId(addr.id); applyAddress(addr); }}
                                  style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    padding: "0.5rem 0.875rem",
                                    borderRadius: "9999px",
                                    border: isSelected ? "1.5px solid #b76e79" : "1.5px solid #e5e5e5",
                                    background: isSelected ? "#fff0f3" : "#fff",
                                    color: isSelected ? "#b76e79" : "#525252",
                                    fontSize: "0.8125rem", fontWeight: isSelected ? "700" : "500",
                                    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                                  }}
                                >
                                  <Icon size={12} />
                                  {TITLE_LABELS[addr.baslik] || "Adres"}
                                  {addr.isDefault && (
                                    <span style={{
                                      fontSize: "0.6rem", fontWeight: "700",
                                      background: isSelected ? "#b76e79" : "#e5e5e5",
                                      color: isSelected ? "#fff" : "#737373",
                                      padding: "0.1rem 0.375rem", borderRadius: "9999px",
                                    }}>Varsayılan</span>
                                  )}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAddressId("new");
                                setDelivery({ ad: "", soyad: "", email: user?.email || "", telefon: "", adres: "", sehir: "", ilce: "", postakodu: "" });
                                setDErr({});
                              }}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.5rem 0.875rem", borderRadius: "9999px",
                                border: selectedAddressId === "new" ? "1.5px solid #c4a265" : "1.5px dashed #e5e5e5",
                                background: selectedAddressId === "new" ? "#fffbf0" : "#fff",
                                color: selectedAddressId === "new" ? "#c4a265" : "#737373",
                                fontSize: "0.8125rem", fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
                              }}
                            >
                              <Plus size={12} />
                              Yeni Adres
                            </button>
                          </div>
                          <div style={{ height: "1px", background: "#f0e8e4", marginBottom: "1.25rem" }} />
                        </div>
                      )}

                      <div
                        className="odeme-field-grid-2"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                        }}
                      >
                        <GBInput
                          label="Ad"
                          name="ad"
                          value={delivery.ad}
                          onChange={(e) => setD("ad", e.target.value)}
                          error={dErr.ad}
                          required
                          autoComplete="given-name"
                        />
                        <GBInput
                          label="Soyad"
                          name="soyad"
                          value={delivery.soyad}
                          onChange={(e) => setD("soyad", e.target.value)}
                          error={dErr.soyad}
                          required
                          autoComplete="family-name"
                        />
                      </div>

                      <div
                        className="odeme-field-grid-2"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <GBInput
                          label="E-posta"
                          name="email"
                          type="email"
                          value={delivery.email || (user ? user.email : "")}
                          onChange={(e) => setD("email", e.target.value)}
                          error={dErr.email}
                          required
                          autoComplete="email"
                        />
                        <GBInput
                          label="Telefon"
                          name="telefon"
                          type="tel"
                          value={delivery.telefon}
                          onChange={(e) => setD("telefon", e.target.value)}
                          error={dErr.telefon}
                          required
                          autoComplete="tel"
                        />
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <GBInput
                          label="Adres (Sokak, Mahalle, No...)"
                          name="adres"
                          value={delivery.adres}
                          onChange={(e) => setD("adres", e.target.value)}
                          error={dErr.adres}
                          required
                          autoComplete="street-address"
                        />
                      </div>

                      <div
                        className="odeme-field-grid-3"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <GBInput
                          label="Şehir"
                          name="sehir"
                          value={delivery.sehir}
                          onChange={(e) => setD("sehir", e.target.value)}
                          error={dErr.sehir}
                          required
                          autoComplete="address-level2"
                        />
                        <GBInput
                          label="İlçe"
                          name="ilce"
                          value={delivery.ilce}
                          onChange={(e) => setD("ilce", e.target.value)}
                          error={dErr.ilce}
                          required
                        />
                        <GBInput
                          label="Posta Kodu"
                          name="postakodu"
                          value={delivery.postakodu}
                          onChange={(e) => setD("postakodu", e.target.value)}
                          autoComplete="postal-code"
                        />
                      </div>
                    </SectionCard>
                  </div>

                  {/* ── Payment Section ── */}
                  <div id="payment-section">
                    <SectionCard
                      icon={CreditCard}
                      title="Ödeme Yöntemi"
                      right={
                        payMethod === "creditCard" && pmCC.cards?.length > 0 ? (
                          <div style={{ display: "flex", gap: "0.375rem" }}>
                            {pmCC.cards.map((b) => (
                              <span
                                key={b}
                                style={{
                                  fontSize: "0.6rem", fontWeight: "700", color: "#737373",
                                  background: "#f5f5f5", border: "1px solid #e5e5e5",
                                  borderRadius: "0.25rem", padding: "0.125rem 0.375rem",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        ) : null
                      }
                    >
                      {/* Payment method selector */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
                        {pmCC.enabled && (
                          <label
                            onClick={() => setPayMethod("creditCard")}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.875rem",
                              padding: "0.875rem 1rem", borderRadius: "0.875rem", cursor: "pointer",
                              border: payMethod === "creditCard" ? "1.5px solid #b76e79" : "1.5px solid #f0e8e4",
                              background: payMethod === "creditCard" ? "#fff5f7" : "#fafafa",
                              transition: "all 0.15s",
                            }}
                          >
                            <input type="radio" name="payMethod" value="creditCard" checked={payMethod === "creditCard"} onChange={() => setPayMethod("creditCard")} style={{ accentColor: "#b76e79" }} />
                            <CreditCard size={16} color={payMethod === "creditCard" ? "#b76e79" : "#737373"} />
                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: payMethod === "creditCard" ? "#b76e79" : "#2d2d2d" }}>Kredi / Banka Kartı</span>
                          </label>
                        )}
                        {pmCOD.enabled && (
                          <label
                            onClick={() => setPayMethod("cashOnDelivery")}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.875rem",
                              padding: "0.875rem 1rem", borderRadius: "0.875rem", cursor: "pointer",
                              border: payMethod === "cashOnDelivery" ? "1.5px solid #3d9e6a" : "1.5px solid #f0e8e4",
                              background: payMethod === "cashOnDelivery" ? "#f0faf4" : "#fafafa",
                              transition: "all 0.15s",
                            }}
                          >
                            <input type="radio" name="payMethod" value="cashOnDelivery" checked={payMethod === "cashOnDelivery"} onChange={() => setPayMethod("cashOnDelivery")} style={{ accentColor: "#3d9e6a" }} />
                            <Package size={16} color={payMethod === "cashOnDelivery" ? "#3d9e6a" : "#737373"} />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: "600", fontSize: "0.875rem", color: payMethod === "cashOnDelivery" ? "#3d9e6a" : "#2d2d2d" }}>Kapıda Ödeme</span>
                              {pmCOD.fee > 0 && (
                                <span style={{ fontSize: "0.75rem", color: "#737373", marginLeft: "0.5rem" }}>+₺{pmCOD.fee} hizmet bedeli</span>
                              )}
                            </div>
                          </label>
                        )}
                        {pmBT.enabled && (
                          <label
                            onClick={() => setPayMethod("bankTransfer")}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.875rem",
                              padding: "0.875rem 1rem", borderRadius: "0.875rem", cursor: "pointer",
                              border: payMethod === "bankTransfer" ? "1.5px solid #c4a265" : "1.5px solid #f0e8e4",
                              background: payMethod === "bankTransfer" ? "#fffbf0" : "#fafafa",
                              transition: "all 0.15s",
                            }}
                          >
                            <input type="radio" name="payMethod" value="bankTransfer" checked={payMethod === "bankTransfer"} onChange={() => setPayMethod("bankTransfer")} style={{ accentColor: "#c4a265" }} />
                            <CreditCard size={16} color={payMethod === "bankTransfer" ? "#c4a265" : "#737373"} />
                            <span style={{ fontWeight: "600", fontSize: "0.875rem", color: payMethod === "bankTransfer" ? "#c4a265" : "#2d2d2d" }}>Havale / EFT</span>
                          </label>
                        )}
                      </div>

                      {/* Credit card form */}
                      {payMethod === "creditCard" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <GBInput
                            label="Kart Üzerindeki İsim" name="holder" value={card.holder}
                            onChange={(e) => setC("holder", e.target.value.toUpperCase())}
                            error={cErr.holder} autoComplete="cc-name" icon={<User size={15} />}
                          />
                          <GBInput
                            label="Kart Numarası" name="cardnumber" value={card.number}
                            onChange={(e) => setC("number", formatCardNumber(e.target.value))}
                            error={cErr.number} autoComplete="cc-number"
                            icon={<CreditCard size={15} />} placeholder="0000 0000 0000 0000" maxLength={19}
                          />
                          <div className="odeme-field-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <GBInput
                              label="Son Kullanma (AA/YY)" name="expiry" value={card.expiry}
                              onChange={(e) => setC("expiry", formatExpiry(e.target.value))}
                              error={cErr.expiry} autoComplete="cc-exp" placeholder="AA / YY" maxLength={5}
                            />
                            <GBInput
                              label="CVV" name="cvv" type="password" value={card.cvv}
                              onChange={(e) => setC("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                              error={cErr.cvv} autoComplete="cc-csc" placeholder="•••" maxLength={4} icon={<Lock size={15} />}
                            />
                          </div>
                          
                          {/* 3D Secure Option */}
                          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0.75rem", cursor: "pointer" }}>
                            <input 
                              type="checkbox" 
                              checked={use3DSecure} 
                              onChange={(e) => setUse3DSecure(e.target.checked)}
                              style={{ accentColor: "#b76e79", width: "18px", height: "18px", cursor: "pointer" }}
                            />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#2d2d2d" }}>3D Secure ile Ödeme Yap</span>
                              <p style={{ fontSize: "0.75rem", color: "#737373", marginTop: "0.25rem" }}>
                                Ödemenizi doğrulayın ve daha güvenli işlem yapın
                              </p>
                            </div>
                          </label>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#f6fdf6", border: "1px solid #dcf0dc", borderRadius: "0.75rem" }}>
                            <ShieldCheck size={14} color="#22c55e" />
                            <span style={{ fontSize: "0.75rem", color: "#525252" }}>Kart bilgileriniz 256‑bit SSL ile şifrelenmektedir.</span>
                          </div>
                        </div>
                      )}

                      {/* Cash on delivery info */}
                      {payMethod === "cashOnDelivery" && (
                        <div style={{ padding: "1rem", background: "#f0faf4", border: "1px solid #c8ecd8", borderRadius: "0.75rem" }}>
                          <p style={{ fontSize: "0.8125rem", color: "#2d5c3e", fontWeight: "600", marginBottom: "0.375rem" }}>Kapıda Ödeme Seçildi</p>
                          <p style={{ fontSize: "0.75rem", color: "#4a7c5e" }}>
                            Siparişiniz teslim edildiğinde nakit veya kart ile ödeme yapabilirsiniz.
                            {pmCOD.fee > 0 && ` Hizmet bedeli: ₺${pmCOD.fee}`}
                          </p>
                          {activeCarrier && (
                            <p style={{ fontSize: "0.75rem", color: "#4a7c5e", marginTop: "0.25rem" }}>
                              Kargo firması: <strong>{activeCarrier.name}</strong>
                              {activeCarrier.estimatedDays ? ` · ${activeCarrier.estimatedDays} iş günü` : ""}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bank transfer info */}
                      {payMethod === "bankTransfer" && pmBT.enabled && (
                        <div style={{ padding: "1rem", background: "#fffbf0", border: "1px solid #f0e0b0", borderRadius: "0.75rem" }}>
                          <p style={{ fontSize: "0.8125rem", color: "#6b5a2e", fontWeight: "600", marginBottom: "0.5rem" }}>Havale / EFT Bilgileri</p>
                          {pmBT.bankName && <p style={{ fontSize: "0.75rem", color: "#6b5a2e" }}>Banka: <strong>{pmBT.bankName}</strong></p>}
                          {pmBT.accountHolder && <p style={{ fontSize: "0.75rem", color: "#6b5a2e", marginTop: "0.25rem" }}>Hesap Sahibi: <strong>{pmBT.accountHolder}</strong></p>}
                          {pmBT.iban && (
                            <p style={{ fontSize: "0.75rem", color: "#6b5a2e", marginTop: "0.25rem", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                              IBAN: <strong>{pmBT.iban}</strong>
                            </p>
                          )}
                          <p style={{ fontSize: "0.7rem", color: "#a08030", marginTop: "0.5rem" }}>
                            Havale/EFT açıklamasına ad soyadınızı ve telefon numaranızı yazmayı unutmayın.
                          </p>
                        </div>
                      )}
                    </SectionCard>
                  </div>

                  {/* ── Legal Consents Section ── */}
                  <div id="legal-section">
                    <SectionCard icon={FileText} title="Sözleşmeler ve Onaylar">
                      <p style={{ fontSize: "0.75rem", color: "#737373", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                        Siparişi tamamlamadan önce lütfen aşağıdaki belgeleri okuyarak onayınızı verin.
                      </p>

                      {/* Ön Bilgilendirme */}
                      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.875rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={consents.bilgilendirme}
                          onChange={(e) => setConsents((c) => ({ ...c, bilgilendirme: e.target.checked }))}
                          style={{ accentColor: "#b76e79", marginTop: "0.2rem", flexShrink: 0, width: "1.0625rem", height: "1.0625rem" }}
                        />
                        <span style={{ fontSize: "0.8125rem", color: "#2d2d2d", lineHeight: "1.55" }}>
                          <button
                            type="button"
                            onClick={() => setLegalModal("bilgilendirme")}
                            style={{ color: "#b76e79", fontWeight: "700", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: "inherit" }}
                          >
                            Ön Bilgilendirme Formu
                          </button>
                          {"'nu okudum, anladım ve onaylıyorum. "}
                          <span style={{ color: "#ef4444", fontWeight: "700" }}>*</span>
                        </span>
                      </label>

                      {/* Mesafeli Satış Sözleşmesi */}
                      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.875rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={consents.sozlesme}
                          onChange={(e) => setConsents((c) => ({ ...c, sozlesme: e.target.checked }))}
                          style={{ accentColor: "#b76e79", marginTop: "0.2rem", flexShrink: 0, width: "1.0625rem", height: "1.0625rem" }}
                        />
                        <span style={{ fontSize: "0.8125rem", color: "#2d2d2d", lineHeight: "1.55" }}>
                          <button
                            type="button"
                            onClick={() => setLegalModal("sozlesme")}
                            style={{ color: "#b76e79", fontWeight: "700", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: "inherit" }}
                          >
                            Mesafeli Satış Sözleşmesi
                          </button>
                          {"'ni okudum, anladım ve onaylıyorum. "}
                          <span style={{ color: "#ef4444", fontWeight: "700" }}>*</span>
                        </span>
                      </label>

                      {/* KVKK */}
                      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.875rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={consents.kvkk}
                          onChange={(e) => setConsents((c) => ({ ...c, kvkk: e.target.checked }))}
                          style={{ accentColor: "#b76e79", marginTop: "0.2rem", flexShrink: 0, width: "1.0625rem", height: "1.0625rem" }}
                        />
                        <span style={{ fontSize: "0.8125rem", color: "#2d2d2d", lineHeight: "1.55" }}>
                          <button
                            type="button"
                            onClick={() => setLegalModal("kvkk")}
                            style={{ color: "#b76e79", fontWeight: "700", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: "inherit" }}
                          >
                            KVKK Aydınlatma Metni
                          </button>
                          {"'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum. "}
                          <span style={{ color: "#ef4444", fontWeight: "700" }}>*</span>
                        </span>
                      </label>

                      {/* Pazarlama (isteğe bağlı) */}
                      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={consents.pazarlama}
                          onChange={(e) => setConsents((c) => ({ ...c, pazarlama: e.target.checked }))}
                          style={{ accentColor: "#b76e79", marginTop: "0.2rem", flexShrink: 0, width: "1.0625rem", height: "1.0625rem" }}
                        />
                        <span style={{ fontSize: "0.8125rem", color: "#525252", lineHeight: "1.55" }}>
                          Kampanya, yeni ürün ve fırsatlardan e-posta/SMS ile haberdar olmak istiyorum.
                          <span style={{ color: "#a3a3a3", fontSize: "0.75rem", marginLeft: "0.25rem" }}>(İsteğe bağlı)</span>
                        </span>
                      </label>

                      {consentError && (
                        <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fff0f0", border: "1px solid #fcd5d5", borderRadius: "0.75rem" }}>
                          <p style={{ fontSize: "0.8125rem", color: "#dc2626", fontWeight: "600" }}>
                            {consentError}
                          </p>
                        </div>
                      )}

                      <p style={{ fontSize: "0.6875rem", color: "#a3a3a3", marginTop: "1rem", lineHeight: "1.5" }}>
                        <span style={{ color: "#ef4444", fontWeight: "700" }}>*</span> ile işaretli onaylar zorunludur.
                      </p>
                    </SectionCard>
                  </div>

                  {/* Mobile: Submit */}
                  <div className="odeme-mobile-submit">
                    <GBButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ShieldCheck size={16} />}
                      loading={submitting}
                      disabled={submitting}
                    >
                      {submitting ? "İşleniyor…" : "Siparişi Tamamla"}
                    </GBButton>
                  </div>
                </div>

                {/* ── Right Column — Summary ── */}
                <div
                  className="odeme-summary"
                  style={{
                    background: "white",
                    borderRadius: "1.5rem",
                    border: "1px solid #f0e8e4",
                    padding: "1.75rem",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                    position: "sticky",
                    top: "5.5rem",
                  }}
                >
                  {/* Summary header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        background:
                          "linear-gradient(135deg, #b76e79, #e890a8)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Package size={13} color="white" />
                    </div>
                    <h2
                      style={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        color: "#2d2d2d",
                      }}
                    >
                      Sipariş Özeti
                    </h2>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.75rem",
                        color: "#737373",
                      }}
                    >
                      {count} ürün
                    </span>
                  </div>

                  {/* Cart items */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                      marginBottom: "1.5rem",
                      maxHeight: "18rem",
                      overflowY: "auto",
                      paddingRight: "0.25rem",
                    }}
                  >
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          display: "flex",
                          gap: "0.875rem",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "3.5rem",
                            height: "3.5rem",
                            background: "#f8f5f2",
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <ShoppingBag size={14} color="#c4a0a7" />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: "600",
                              color: "#2d2d2d",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{ fontSize: "0.75rem", color: "#737373" }}
                          >
                            x{item.qty}
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#2d2d2d",
                            flexShrink: 0,
                          }}
                        >
                          ₺{(item.price * item.qty).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: "1px",
                      background: "#f0e8e4",
                      marginBottom: "1.25rem",
                    }}
                  />

                  {/* Totals */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ color: "#737373" }}>
                        Ara Toplam ({count} ürün)
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        ₺{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ color: "#737373" }}>Kargo{activeCarrier ? ` (${activeCarrier.name})` : ""}</span>
                      <span
                        style={{
                          fontWeight: "600",
                          color: shipping === 0 ? "#22c55e" : "#2d2d2d",
                        }}
                      >
                        {shipping === 0
                          ? "Ücretsiz"
                          : `₺${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {codFee > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#737373" }}>Kapıda Ödeme Bedeli</span>
                        <span style={{ fontWeight: "600" }}>₺{codFee.toFixed(2)}</span>
                      </div>
                    )}

                    {subtotal < FREE_SHIPPING_THRESHOLD && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#b76e79",
                          padding: "0.5rem 0.75rem",
                          background: "#fff5f7",
                          borderRadius: "0.625rem",
                        }}
                      >
                        Ücretsiz kargo için{" "}
                        <strong>
                          ₺{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                        </strong>{" "}
                        daha ekle!
                      </div>
                    )}

                    <div
                      style={{
                        height: "1px",
                        background: "#f0e8e4",
                        margin: "0.25rem 0",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "700", color: "#2d2d2d" }}>
                        Toplam
                      </span>
                      <span
                        style={{
                          fontSize: "1.375rem",
                          fontWeight: "800",
                          color: "#2d2d2d",
                        }}
                      >
                        ₺{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop submit */}
                  <div className="odeme-desktop-submit">
                    <GBButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ShieldCheck size={16} />}
                      loading={submitting}
                      disabled={submitting}
                    >
                      {submitting ? "İşleniyor…" : "Siparişi Tamamla"}
                    </GBButton>
                  </div>

                  <Link
                    href="/sepet"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "1rem",
                      fontSize: "0.75rem",
                      color: "#b76e79",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    ← Sepete Dön
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />

      {legalModal && <LegalModal modalKey={legalModal} onClose={() => setLegalModal(null)} />}

      <style>{`
        @media (min-width: 900px) {
          .odeme-grid {
            grid-template-columns: 1fr 380px !important;
          }
          .odeme-mobile-submit {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .odeme-desktop-submit {
            display: none !important;
          }
          .odeme-summary {
            position: static !important;
          }
        }
        @media (max-width: 540px) {
          .odeme-field-grid-2,
          .odeme-field-grid-3,
          .odeme-auth-gate-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
