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
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { useRouter } from "next/navigation";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 29.9;

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
        <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d2d2d" }}>
          {title}
        </h2>
        {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */
export default function OdemePage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, subtotal, count } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const router = useRouter();

  const [guestMode, setGuestMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // null = none chosen yet
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
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
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600)); // simulated API
    setSubmitting(false);
    setSubmitted(true);
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
                    marginBottom: "0.75rem",
                  }}
                >
                  Siparişin Alındı!
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#737373",
                    marginBottom: "0.375rem",
                  }}
                >
                  Teşekkürler. Siparişini en kısa sürede kargoya vereceğiz.
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#737373",
                    marginBottom: "2.5rem",
                  }}
                >
                  Özet{" "}
                  <strong>
                    {delivery.email || user?.email}
                  </strong>{" "}
                  adresine gönderildi.
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
                      title="Ödeme Bilgileri"
                      right={
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          {["VISA", "MC", "AMEX"].map((b) => (
                            <span
                              key={b}
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: "700",
                                color: "#737373",
                                background: "#f5f5f5",
                                border: "1px solid #e5e5e5",
                                borderRadius: "0.25rem",
                                padding: "0.125rem 0.375rem",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <GBInput
                          label="Kart Üzerindeki İsim"
                          name="holder"
                          value={card.holder}
                          onChange={(e) =>
                            setC("holder", e.target.value.toUpperCase())
                          }
                          error={cErr.holder}
                          autoComplete="cc-name"
                          icon={<User size={15} />}
                        />
                        <GBInput
                          label="Kart Numarası"
                          name="cardnumber"
                          value={card.number}
                          onChange={(e) =>
                            setC("number", formatCardNumber(e.target.value))
                          }
                          error={cErr.number}
                          autoComplete="cc-number"
                          icon={<CreditCard size={15} />}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                        />
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                          }}
                        >
                          <GBInput
                            label="Son Kullanma (AA/YY)"
                            name="expiry"
                            value={card.expiry}
                            onChange={(e) =>
                              setC("expiry", formatExpiry(e.target.value))
                            }
                            error={cErr.expiry}
                            autoComplete="cc-exp"
                            placeholder="AA / YY"
                            maxLength={5}
                          />
                          <GBInput
                            label="CVV"
                            name="cvv"
                            type="password"
                            value={card.cvv}
                            onChange={(e) =>
                              setC(
                                "cvv",
                                e.target.value.replace(/\D/g, "").slice(0, 4)
                              )
                            }
                            error={cErr.cvv}
                            autoComplete="cc-csc"
                            placeholder="•••"
                            maxLength={4}
                            icon={<Lock size={15} />}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "1.25rem",
                          padding: "0.75rem 1rem",
                          background: "#f6fdf6",
                          border: "1px solid #dcf0dc",
                          borderRadius: "0.75rem",
                        }}
                      >
                        <ShieldCheck size={14} color="#22c55e" />
                        <span style={{ fontSize: "0.75rem", color: "#525252" }}>
                          Kart bilgileriniz 256‑bit SSL ile şifrelenmektedir.
                        </span>
                      </div>
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
                      <span style={{ color: "#737373" }}>Kargo</span>
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
          .odeme-grid > div:first-child > div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .odeme-grid > div:first-child > div[style*="gridTemplateColumns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[data-auth-gate] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
