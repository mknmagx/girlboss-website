"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, seedProducts } from "@/lib/firebase/firestore";
import { Save, Upload, Plus, Trash2, CreditCard, Package, Truck, Building2, ShieldCheck } from "lucide-react";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import AdminModal from "@/lib/components/admin/AdminModal";
import { products as hardcodedProducts } from "@/lib/data/products";

const DEFAULT_CARRIERS = [
  { name: "Yurtiçi Kargo", code: "yurtici", enabled: true,  estimatedDays: "1-2", trackingUrl: "" },
  { name: "MNG Kargo",     code: "mng",     enabled: false, estimatedDays: "1-2", trackingUrl: "" },
  { name: "Aras Kargo",    code: "aras",    enabled: false, estimatedDays: "2-3", trackingUrl: "" },
  { name: "Sürat Kargo",   code: "surat",   enabled: false, estimatedDays: "1-2", trackingUrl: "" },
  { name: "PTT Kargo",     code: "ptt",     enabled: false, estimatedDays: "2-4", trackingUrl: "" },
];

const DEFAULT_PM = {
  creditCard:    { enabled: true,  cards: ["VISA", "MC", "AMEX", "TROY"], provider: "İyzico" },
  cashOnDelivery:{ enabled: true,  fee: 15 },
  bankTransfer:  { enabled: false, bankName: "", iban: "", accountHolder: "" },
};

const defaultSettings = {
  brandName: "GIRLBOSS",
  brandTagline: "Kokunla Hükmet",
  contactEmail: "",
  contactPhone: "",
  instagramUrl: "",
  facebookUrl: "",
  shippingCost: 29.90,
  freeShippingThreshold: 500,
  carriers: DEFAULT_CARRIERS,
  paymentMethods: DEFAULT_PM,
  couponCode: "GIRLBOSS10",
  couponDiscount: 10,  authProviders: {
    emailPassword: true,
    google: true,
    apple: true,
    forgotPassword: true,
  },};

const TABS = [
  { id: "genel",      label: "Genel" },
  { id: "kargo",      label: "Ödeme & Kargo" },
  { id: "kupon",      label: "Kupon" },  { id: "giris",      label: "Giri\u015f & G\u00fcvenlik" },  { id: "veri",       label: "Veri" },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState(defaultSettings);
  const [tab, setTab] = useState("genel");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seedModal, setSeedModal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) {
        setForm({
          ...defaultSettings,
          ...data,
          carriers: data.carriers ?? DEFAULT_CARRIERS,
          paymentMethods: {
            ...DEFAULT_PM,
            ...(data.paymentMethods ?? {}),
            creditCard: { ...DEFAULT_PM.creditCard, ...(data.paymentMethods?.creditCard ?? {}) },
            cashOnDelivery: { ...DEFAULT_PM.cashOnDelivery, ...(data.paymentMethods?.cashOnDelivery ?? {}) },
            bankTransfer: { ...DEFAULT_PM.bankTransfer, ...(data.paymentMethods?.bankTransfer ?? {}) },
          },          authProviders: {
            ...defaultSettings.authProviders,
            ...(data.authProviders ?? {}),
          },        });
      }
      setLoading(false);
    });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  /* helpers for nested payment methods */
  const setPm = (method, field) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((f) => ({
      ...f,
      paymentMethods: {
        ...f.paymentMethods,
        [method]: { ...f.paymentMethods[method], [field]: val },
      },
    }));
  };
  const togglePmCard = (card) => {
    const cards = form.paymentMethods.creditCard.cards ?? [];
    const next = cards.includes(card) ? cards.filter((c) => c !== card) : [...cards, card];
    setForm((f) => ({
      ...f,
      paymentMethods: { ...f.paymentMethods, creditCard: { ...f.paymentMethods.creditCard, cards: next } },
    }));
  };

  /* helpers for carriers */
  const setCarrier = (idx, field, val) =>
    setForm((f) => {
      const carriers = f.carriers.map((c, i) => (i === idx ? { ...c, [field]: val } : c));
      return { ...f, carriers };
    });
  const addCarrier = () =>
    setForm((f) => ({
      ...f,
      carriers: [...f.carriers, { name: "", code: "", enabled: true, estimatedDays: "1-2", trackingUrl: "" }],
    }));
  const removeCarrier = (idx) =>
    setForm((f) => ({
      ...f,
      carriers: f.carriers.filter((_, i) => i !== idx),
    }));

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedProducts(hardcodedProducts);
      setSeeded(true);
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
      setSeedModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Ayarlar</h1>
          <p className="text-sm text-[#737373] mt-1">Site geneli yapılandırma</p>
        </div>
        <GBButton variant="primary" size="sm" icon={<Save size={15} />} onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Kaydet"}
        </GBButton>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#fdf8f5] border border-[#f0e8e4] rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-white text-[#b76e79] shadow-sm border border-[#f0e8e4]"
                : "text-[#737373] hover:text-[#2d2d2d]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GENEL TAB ── */}
      {tab === "genel" && (
        <>
          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#2d2d2d]">Marka Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GBInput label="Marka Adı" value={form.brandName} onChange={set("brandName")} />
              <GBInput label="Slogan" value={form.brandTagline} onChange={set("brandTagline")} />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#2d2d2d]">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GBInput label="E-posta" type="email" value={form.contactEmail} onChange={set("contactEmail")} />
              <GBInput label="Telefon" value={form.contactPhone} onChange={set("contactPhone")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GBInput label="Instagram URL" value={form.instagramUrl} onChange={set("instagramUrl")} />
              <GBInput label="Facebook URL" value={form.facebookUrl} onChange={set("facebookUrl")} />
            </div>
          </section>
        </>
      )}

      {/* ── KARGO & ÖDEME TAB ── */}
      {tab === "kargo" && (
        <>
          {/* Shipping costs */}
          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
              <Truck size={15} className="text-[#b76e79]" /> Kargo Ücretleri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GBInput label="Standart Kargo Ücreti (₺)" type="number" value={form.shippingCost} onChange={set("shippingCost")} />
              <GBInput label="Ücretsiz Kargo Limiti (₺)" type="number" value={form.freeShippingThreshold} onChange={set("freeShippingThreshold")} />
            </div>
          </section>

          {/* Carriers */}
          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
                <Building2 size={15} className="text-[#b76e79]" /> Kargo Firmaları
              </h3>
              <GBButton variant="outline" size="sm" icon={<Plus size={13} />} onClick={addCarrier}>Firma Ekle</GBButton>
            </div>

            <div className="space-y-3">
              {form.carriers.map((carrier, idx) => (
                <div key={idx} className="border border-[#f0e8e4] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={carrier.enabled}
                        onChange={(e) => setCarrier(idx, "enabled", e.target.checked)}
                        className="w-4 h-4"
                        style={{ accentColor: "#b76e79" }}
                      />
                      <span className="text-sm font-semibold text-[#2d2d2d]">{carrier.name || "Yeni Firma"}</span>
                    </label>
                    {carrier.enabled && (
                      <span className="text-[10px] bg-[#e8f7ee] text-[#3d9e6a] px-2 py-0.5 rounded-full font-bold">Aktif</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCarrier(idx)}
                      className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <GBInput label="Firma Adı" value={carrier.name} onChange={(e) => setCarrier(idx, "name", e.target.value)} placeholder="Yurtiçi Kargo" />
                    <GBInput label="Kod" value={carrier.code} onChange={(e) => setCarrier(idx, "code", e.target.value)} placeholder="yurtici" />
                    <GBInput label="Tahmini Süre" value={carrier.estimatedDays} onChange={(e) => setCarrier(idx, "estimatedDays", e.target.value)} placeholder="1-2 gün" />
                    <GBInput label="Takip URL" value={carrier.trackingUrl} onChange={(e) => setCarrier(idx, "trackingUrl", e.target.value)} placeholder="https://…" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment methods */}
          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-5">
            <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
              <CreditCard size={15} className="text-[#b76e79]" /> Ödeme Yöntemleri
            </h3>

            {/* Credit card */}
            <div className="border border-[#f0e8e4] rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.paymentMethods.creditCard.enabled}
                  onChange={(e) => setPm("creditCard", "enabled")(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: "#b76e79" }}
                />
                <span className="text-sm font-semibold text-[#2d2d2d]">Kredi / Banka Kartı</span>
              </label>
              {form.paymentMethods.creditCard.enabled && (
                <div className="pl-6 space-y-3">
                  <GBInput label="Ödeme Sağlayıcı" value={form.paymentMethods.creditCard.provider} onChange={setPm("creditCard", "provider")} placeholder="İyzico, PayTR, Stripe…" />
                  <div>
                    <p className="text-xs font-medium text-[#525252] mb-2">Kabul Edilen Kartlar</p>
                    <div className="flex flex-wrap gap-3">
                      {["VISA", "MC", "AMEX", "TROY"].map((card) => (
                        <label key={card} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(form.paymentMethods.creditCard.cards ?? []).includes(card)}
                            onChange={() => togglePmCard(card)}
                            className="w-3.5 h-3.5"
                            style={{ accentColor: "#b76e79" }}
                          />
                          <span className="text-xs font-bold text-[#525252]">{card}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cash on delivery */}
            <div className="border border-[#f0e8e4] rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.paymentMethods.cashOnDelivery.enabled}
                  onChange={(e) => setPm("cashOnDelivery", "enabled")(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: "#b76e79" }}
                />
                <span className="text-sm font-semibold text-[#2d2d2d]">Kapıda Ödeme</span>
              </label>
              {form.paymentMethods.cashOnDelivery.enabled && (
                <div className="pl-6">
                  <GBInput
                    label="Hizmet Bedeli (₺)"
                    type="number"
                    min="0"
                    value={form.paymentMethods.cashOnDelivery.fee}
                    onChange={setPm("cashOnDelivery", "fee")}
                    placeholder="15"
                  />
                </div>
              )}
            </div>

            {/* Bank transfer */}
            <div className="border border-[#f0e8e4] rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.paymentMethods.bankTransfer.enabled}
                  onChange={(e) => setPm("bankTransfer", "enabled")(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: "#b76e79" }}
                />
                <span className="text-sm font-semibold text-[#2d2d2d]">Havale / EFT</span>
              </label>
              {form.paymentMethods.bankTransfer.enabled && (
                <div className="pl-6 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <GBInput label="Banka Adı" value={form.paymentMethods.bankTransfer.bankName} onChange={setPm("bankTransfer", "bankName")} placeholder="Ziraat Bankası" />
                    <GBInput label="Hesap Sahibi" value={form.paymentMethods.bankTransfer.accountHolder} onChange={setPm("bankTransfer", "accountHolder")} placeholder="GIRLBOSS TİC. A.Ş." />
                  </div>
                  <GBInput label="IBAN" value={form.paymentMethods.bankTransfer.iban} onChange={setPm("bankTransfer", "iban")} placeholder="TR00 0000 0000 0000 0000 0000 00" />
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── KUPON TAB ── */}
      {tab === "kupon" && (
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Kupon Ayarları</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Kupon Kodu" value={form.couponCode} onChange={set("couponCode")} />
            <GBInput label="İndirim Oranı (%)" type="number" value={form.couponDiscount} onChange={set("couponDiscount")} />
          </div>
        </section>
      )}

      {/* ── GİRİŞ & GÜVENLİK TAB ── */}
      {tab === "giris" && (
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-5">
          <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#b76e79]" /> Giriş Yöntemleri
          </h3>
          <p className="text-xs text-[#737373]">
            Kullanıcıların giriş yapabileceği / kayıt olabileceği yöntemleri açıp kapatın.
          </p>

          {/* Email / Şifre */}
          <div className="border border-[#f0e8e4] rounded-xl p-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#2d2d2d]">E-posta & Şifre</p>
                <p className="text-xs text-[#a3a3a3]">Geleneksel e-posta / şifre ile kayıt ve giriş</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.authProviders.emailPassword}
                  onChange={(e) => setForm((f) => ({ ...f, authProviders: { ...f.authProviders, emailPassword: e.target.checked } }))}
                  className="sr-only"
                  id="ap-email"
                />
                <label htmlFor="ap-email" className="flex items-center cursor-pointer">
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.authProviders.emailPassword ? "bg-[#b76e79]" : "bg-[#e5e7eb]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow mt-1 transition-transform ${form.authProviders.emailPassword ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>
            </label>

            {/* Şifremi Unuttum alt seçeneği */}
            {form.authProviders.emailPassword && (
              <div className="pl-4 border-l-2 border-[#f0e8e4]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-[#525252]">Şifremi Unuttum Akışı</p>
                    <p className="text-xs text-[#a3a3a3]">Kullanıcılar e-posta ile şifre sıfırlama maili alabilsin</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={form.authProviders.forgotPassword}
                      onChange={(e) => setForm((f) => ({ ...f, authProviders: { ...f.authProviders, forgotPassword: e.target.checked } }))}
                      className="sr-only"
                      id="ap-forgot"
                    />
                    <label htmlFor="ap-forgot" className="flex items-center cursor-pointer">
                      <div className={`w-9 h-5 rounded-full transition-colors ${form.authProviders.forgotPassword ? "bg-[#b76e79]" : "bg-[#e5e7eb]"}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow mt-1 transition-transform ${form.authProviders.forgotPassword ? "translate-x-5" : "translate-x-1"}`} />
                      </div>
                    </label>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Google */}
          <div className="border border-[#f0e8e4] rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-[#2d2d2d]">Google</p>
                  <p className="text-xs text-[#a3a3a3]">Google hesabıyla tek tıkla giriş</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.authProviders.google}
                  onChange={(e) => setForm((f) => ({ ...f, authProviders: { ...f.authProviders, google: e.target.checked } }))}
                  className="sr-only"
                  id="ap-google"
                />
                <label htmlFor="ap-google" className="flex items-center cursor-pointer">
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.authProviders.google ? "bg-[#b76e79]" : "bg-[#e5e7eb]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow mt-1 transition-transform ${form.authProviders.google ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>
            </label>
          </div>

          {/* Apple */}
          <div className="border border-[#f0e8e4] rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <svg style={{ width: 20, height: 20, fill: '#000', flexShrink: 0 }} viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-[#2d2d2d]">Apple</p>
                  <p className="text-xs text-[#a3a3a3]">Apple ID ile giriş (iOS/macOS kullanıcıları)</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.authProviders.apple}
                  onChange={(e) => setForm((f) => ({ ...f, authProviders: { ...f.authProviders, apple: e.target.checked } }))}
                  className="sr-only"
                  id="ap-apple"
                />
                <label htmlFor="ap-apple" className="flex items-center cursor-pointer">
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.authProviders.apple ? "bg-[#b76e79]" : "bg-[#e5e7eb]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow mt-1 transition-transform ${form.authProviders.apple ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>
            </label>
          </div>

          {!form.authProviders.emailPassword && !form.authProviders.google && !form.authProviders.apple && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              ⚠️ En az bir giriş yöntemi aktif olmalıdır.
            </p>
          )}
        </section>
      )}

      {/* ── VERİ TAB ── */}
      {tab === "veri" && (
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Veri Yönetimi</h3>
          <p className="text-xs text-[#737373]">
            Hardcoded ürün verilerini Firestore'a aktarın. Bu işlem yalnızca bir kez yapılmalıdır.
          </p>
          <GBButton
            variant={seeded ? "outline" : "secondary"}
            size="sm"
            icon={<Upload size={15} />}
            onClick={() => setSeedModal(true)}
            disabled={seeded}
          >
            {seeded ? "Ürünler Aktarıldı ✓" : "Ürünleri Firestore'a Aktar"}
          </GBButton>
        </section>
      )}

      {/* Seed confirmation modal */}
      <AdminModal open={seedModal} onClose={() => setSeedModal(false)} title="Ürünleri Aktar" maxWidth="24rem">
        <p className="text-sm text-[#525252] mb-4">
          {hardcodedProducts.length} ürün Firestore'a aktarılacak. Bu işlem mevcut ürünleri silmez, yeni kayıtlar oluşturur. Devam etmek istiyor musunuz?
        </p>
        <div className="flex gap-3">
          <GBButton variant="outline" size="sm" fullWidth onClick={() => setSeedModal(false)}>İptal</GBButton>
          <GBButton variant="primary" size="sm" fullWidth onClick={handleSeed} disabled={seeding}>
            {seeding ? "Aktarılıyor…" : "Aktar"}
          </GBButton>
        </div>
      </AdminModal>
    </div>
  );
}
