"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Heart, ShoppingBag, LogOut, Settings,
  ChevronRight, MapPin, Phone, Mail, Edit3, Check, X,
  Star, Sparkles, Clock, Plus, Trash2, Home, Briefcase, Building2,
} from "lucide-react";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { products } from "@/lib/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import Link from "next/link";
import GBInput from "@/lib/components/ui/GBInput";
import GBButton from "@/lib/components/ui/GBButton";

const TABS = [
  { id: "profil", label: "Profilim", icon: User },
  { id: "siparisler", label: "Siparişlerim", icon: Package },
  { id: "favoriler", label: "Favorilerim", icon: Heart },
  { id: "adresler", label: "Adreslerim", icon: MapPin },
  { id: "ayarlar", label: "Ayarlar", icon: Settings },
];

/* Demo orders */
const DEMO_ORDERS = [
  {
    id: "GB-2026-001",
    date: "08 Mart 2026",
    status: "Teslim Edildi",
    statusColor: "#16a34a",
    statusBg: "#f0fdf4",
    items: [products[0], products[2]],
    total: products[0].price + products[2].price,
  },
  {
    id: "GB-2026-002",
    date: "02 Mart 2026",
    status: "Kargoda",
    statusColor: "#b76e79",
    statusBg: "#fff0f3",
    items: [products[1]],
    total: products[1].price,
  },
];

export default function KullaniciPage() {
  const { user, isLoggedIn, loading, logout, updateProfile } = useAuth();
  const { count: cartCount } = useCart();
  const { favorites } = useFavorites();
  const { addresses, addAddress, updateAddress, removeAddress, setDefault } = useAddresses();
  const favProducts = products.filter((p) => favorites.includes(p.id));
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profil");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  if (loading) return null;

  if (!isLoggedIn) {
    return (
      <div className="bg-[#fdf8f5] min-h-screen">
        <Navbar />
        <section className="page-hero" style={{ paddingBottom: "5rem", textAlign: "center" }}>
          <div className="gb-container-narrow">
            <div
              style={{
                width: "5rem", height: "5rem", borderRadius: "9999px",
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 8px 32px rgba(183,110,121,0.25)",
              }}
            >
              <User size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#2d2d2d] mb-2">Hesabım</h1>
            <p className="text-sm text-[#737373] mb-10">Devam etmek için giriş yapın.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/kullanici/giris">
                <GBButton variant="primary" size="lg" icon={<User size={16} />}>Giriş Yap</GBButton>
              </Link>
              <Link href="/kullanici/kayit">
                <GBButton variant="secondary" size="lg">Kayıt Ol</GBButton>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const startEdit = () => {
    setForm({ ad: user.ad, soyad: user.soyad, telefon: user.telefon || "", email: user.email });
    setEditing(true);
    setSaved(false);
  };

  const saveEdit = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#fdf8f5] text-[#2d2d2d] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: "2rem" }}>
        <div className="gb-container">
          <div className="hero-fade flex flex-wrap sm:flex-nowrap items-center gap-4">
            {/* Avatar */}
            <div
              style={{
                width: "5rem", height: "5rem", borderRadius: "9999px",
                background: "linear-gradient(135deg, #b76e79, #e890a8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(183,110,121,0.25)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                {user.ad?.[0]?.toUpperCase() || "G"}
              </span>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-[#b76e79] font-bold mb-1">Hoş Geldin</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d]">
                {user.ad} {user.soyad}
              </h1>
              <p className="text-sm text-[#a3a3a3] mt-0.5">{user.email}</p>
            </div>
            <div className="ml-auto">
              <GBButton variant="ghost" size="sm" icon={<LogOut size={14} />} onClick={() => { logout(); router.push("/"); }}>
                Çıkış
              </GBButton>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
            {[
              { icon: Package, label: "Sipariş", value: DEMO_ORDERS.length },
              { icon: Heart, label: "Favori", value: favProducts.length },
              { icon: ShoppingBag, label: "Sepet", value: cartCount },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-[#f0e8e4] py-3 px-2 sm:p-4 text-center"
              >
                <Icon size={18} className="text-[#b76e79] mx-auto mb-1" />
                <div className="text-xl font-extrabold text-[#2d2d2d]">{value}</div>
                <div className="text-[10px] text-[#a3a3a3] tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="section-pad">
        <div className="gb-container flex flex-col lg:grid lg:items-start" style={{ gap: "2rem", gridTemplateColumns: "220px 1fr" }}>

          {/* Sidebar — horizontal scroll on mobile, sticky vertical on desktop */}
          <div className="bg-white rounded-2xl lg:rounded-3xl border border-[#f0e8e4] lg:sticky" style={{ top: "7rem" }}>
            {/* Mobile: horizontal scroll strip */}
            <div className="flex lg:hidden overflow-x-auto gap-1 p-2" style={{ scrollbarWidth: "none" }}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-0"
                  style={{
                    background: activeTab === id ? "linear-gradient(135deg, #fff0f3, #fde8ee)" : "transparent",
                    color: activeTab === id ? "#b76e79" : "#737373",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-0"
                style={{ background: "transparent", color: "#e53e3e", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <LogOut size={13} />
                Çıkış
              </button>
            </div>

            {/* Desktop: vertical list */}
            <div className="hidden lg:block p-3">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    width: "100%", padding: "0.75rem 1rem",
                    borderRadius: "0.875rem", border: "none", cursor: "pointer",
                    background: activeTab === id ? "linear-gradient(135deg, #fff0f3, #fde8ee)" : "transparent",
                    color: activeTab === id ? "#b76e79" : "#525252",
                    fontWeight: activeTab === id ? 700 : 500,
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={16} />
                  {label}
                  {activeTab === id && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
                </button>
              ))}
              <div style={{ height: "1px", background: "#f0e8e4", margin: "0.5rem 0" }} />
              <button
                onClick={() => { logout(); router.push("/"); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  width: "100%", padding: "0.75rem 1rem",
                  borderRadius: "0.875rem", border: "none", cursor: "pointer",
                  background: "transparent", color: "#e53e3e",
                  fontWeight: 500, fontSize: "0.875rem", transition: "all 0.2s",
                }}
              >
                <LogOut size={16} />
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* Content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profil" && (
                <ProfileTab
                  user={user} editing={editing} form={form} saved={saved}
                  setForm={setForm} startEdit={startEdit} saveEdit={saveEdit}
                  cancelEdit={() => setEditing(false)}
                />
              )}
              {activeTab === "siparisler" && <OrdersTab orders={DEMO_ORDERS} />}
              {activeTab === "favoriler" && <FavoritesTab products={favProducts} />}
              {activeTab === "adresler" && <AddressesTab addresses={addresses} addAddress={addAddress} updateAddress={updateAddress} removeAddress={removeAddress} setDefault={setDefault} />}
              {activeTab === "ayarlar" && <SettingsTab user={user} updateProfile={updateProfile} logout={logout} router={router} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══ PROFILE TAB ═══ */
function ProfileTab({ user, editing, form, saved, setForm, startEdit, saveEdit, cancelEdit }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="bg-white rounded-3xl border border-[#f0e8e4] p-5 sm:p-8">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-bold text-[#2d2d2d]">Kişisel Bilgiler</h2>
        {!editing ? (
          <GBButton variant="outline" size="sm" icon={<Edit3 size={13} />} onClick={startEdit}>Düzenle</GBButton>
        ) : (
          <div className="flex gap-2 shrink-0">
            <GBButton variant="primary" size="sm" icon={<Check size={13} />} onClick={saveEdit}>Kaydet</GBButton>
            <GBButton variant="ghost" size="sm" icon={<X size={13} />} onClick={cancelEdit}>İptal</GBButton>
          </div>
        )}
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl"
          style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Check size={14} /> Bilgileriniz kaydedildi.
        </motion.div>
      )}

      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User, label: "Ad", value: user.ad || "—" },
            { icon: User, label: "Soyad", value: user.soyad || "—" },
            { icon: Mail, label: "E-posta", value: user.email },
            { icon: Phone, label: "Telefon", value: user.telefon || "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#fdf8f5] rounded-2xl" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <Icon size={13} className="text-[#b76e79]" />
                <span className="text-[10px] tracking-wider uppercase text-[#a3a3a3] font-semibold">{label}</span>
              </div>
              <p className="text-sm font-semibold text-[#2d2d2d]">{value}</p>
            </div>
          ))}
          <div className="bg-[#fdf8f5] rounded-2xl" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <Clock size={13} className="text-[#b76e79]" />
              <span className="text-[10px] tracking-wider uppercase text-[#a3a3a3] font-semibold">Üyelik Tarihi</span>
            </div>
            <p className="text-sm font-semibold text-[#2d2d2d]">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GBInput label="Ad" name="ad" value={form.ad || ""} onChange={set("ad")} icon={<User size={16} />} />
          <GBInput label="Soyad" name="soyad" value={form.soyad || ""} onChange={set("soyad")} />
          <GBInput label="E-posta" type="email" name="email" value={form.email || ""} onChange={set("email")} icon={<Mail size={16} />} />
          <GBInput label="Telefon" name="telefon" value={form.telefon || ""} onChange={set("telefon")} icon={<Phone size={16} />} placeholder="+90 5XX XXX XX XX" />
        </div>
      )}
    </div>
  );
}

/* ═══ ORDERS TAB ═══ */
function OrdersTab({ orders }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#f0e8e4]" style={{ padding: "4rem", textAlign: "center" }}>
          <Package size={40} className="text-[#d4d4d4] mx-auto mb-3" />
          <p className="text-sm text-[#737373]">Henüz siparişiniz bulunmuyor.</p>
          <Link href="/urunler" className="text-[#b76e79] text-sm font-semibold mt-2 inline-block hover:underline">
            Alışverişe Başla →
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-[#f0e8e4] p-4 sm:p-6"
          >
            <div className="flex items-start sm:items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <p className="text-xs text-[#a3a3a3] font-medium">Sipariş No</p>
                <p className="text-sm font-bold text-[#2d2d2d]">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-[#a3a3a3] font-medium">Tarih</p>
                <p className="text-sm font-semibold text-[#2d2d2d]">{order.date}</p>
              </div>
              <span
                style={{
                  padding: "0.3rem 0.875rem",
                  borderRadius: "9999px",
                  background: order.statusBg,
                  color: order.statusColor,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                  style={{ background: item.gradient }}
                  title={item.name}
                />
              ))}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p className="text-xs text-[#737373]">
                  {order.items.map((i) => i.name).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0e8e4]">
              <span className="text-sm font-bold text-[#2d2d2d]">₺{order.total.toFixed(2)}</span>
              <div className="flex gap-2">
                <GBButton variant="outline" size="sm">Detaylar</GBButton>
                {order.status === "Teslim Edildi" && (
                  <GBButton variant="ghost" size="sm" icon={<Star size={12} />}>Değerlendir</GBButton>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ═══ FAVORITES TAB ═══ */
function FavoritesTab({ products: favProducts }) {
  if (favProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#f0e8e4]" style={{ padding: "4rem", textAlign: "center" }}>
        <Heart size={40} className="text-[#d4d4d4] mx-auto mb-3" />
        <p className="text-sm text-[#737373]">Favori listeniz boş.</p>
        <Link href="/urunler" className="text-[#b76e79] text-sm font-semibold mt-2 inline-block hover:underline">
          Ürünleri Keşfet →
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {favProducts.map((product) => (
        <Link key={product.id} href={`/urunler/${product.slug}`}>
          <div className="bg-white rounded-2xl border border-[#f0e8e4] overflow-hidden hover:border-[#fecdd3] hover:shadow-[0_8px_24px_rgba(183,110,121,0.1)] transition-all duration-300 cursor-pointer">
            <div className="h-32 flex items-center justify-center" style={{ background: product.gradient }}>
              <div className="w-10 h-20 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40" />
            </div>
            <div style={{ padding: "0.875rem" }}>
              <p className="text-sm font-bold text-[#2d2d2d] mb-0.5">{product.name}</p>
              <p className="text-[10px] text-[#b76e79] uppercase tracking-wider font-semibold">{product.tagline}</p>
              <p className="text-sm font-bold text-[#2d2d2d] mt-2">₺{product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ═══ ADDRESSES TAB ═══ */
const ADDR_TITLES = [
  { value: "ev", label: "Ev", icon: Home },
  { value: "is", label: "İş", icon: Briefcase },
  { value: "diger", label: "Diğer", icon: Building2 },
];

const EMPTY_ADDR = { baslik: "ev", ad: "", soyad: "", telefon: "", adres: "", sehir: "", ilce: "", postakodu: "", isDefault: false };

function AddressForm({ initial = EMPTY_ADDR, onSave, onCancel, saveLabel = "Kaydet" }) {
  const [form, setForm] = useState({ ...EMPTY_ADDR, ...initial });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.ad.trim()) e.ad = "Zorunlu alan.";
    if (!form.soyad.trim()) e.soyad = "Zorunlu alan.";
    if (!form.adres.trim()) e.adres = "Zorunlu alan.";
    if (!form.sehir.trim()) e.sehir = "Zorunlu alan.";
    if (!form.ilce.trim()) e.ilce = "Zorunlu alan.";
    if (form.telefon.replace(/\D/g, "").length < 10) e.telefon = "Geçerli telefon girin.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Başlık */}
      <div>
        <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#525252", marginBottom: "0.5rem" }}>Adres Başlığı</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {ADDR_TITLES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, baslik: value }))}
              style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.5rem 0.875rem", borderRadius: "9999px",
                border: form.baslik === value ? "1.5px solid #b76e79" : "1.5px solid #e5e5e5",
                background: form.baslik === value ? "#fff0f3" : "#fff",
                color: form.baslik === value ? "#b76e79" : "#737373",
                fontSize: "0.8125rem", fontWeight: "600", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <GBInput label="Ad" name="ad" value={form.ad} onChange={set("ad")} error={errors.ad} required />
        <GBInput label="Soyad" name="soyad" value={form.soyad} onChange={set("soyad")} error={errors.soyad} required />
      </div>
      <GBInput label="Telefon" name="telefon" type="tel" value={form.telefon} onChange={set("telefon")} error={errors.telefon} icon={<Phone size={15} />} />
      <GBInput label="Açık Adres" name="adres" value={form.adres} onChange={set("adres")} error={errors.adres} required />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <GBInput label="Şehir" name="sehir" value={form.sehir} onChange={set("sehir")} error={errors.sehir} required />
        <GBInput label="İlçe" name="ilce" value={form.ilce} onChange={set("ilce")} error={errors.ilce} required />
        <GBInput label="Posta Kodu" name="postakodu" value={form.postakodu} onChange={set("postakodu")} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none" }}>
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
          style={{ width: "1rem", height: "1rem", accentColor: "#b76e79" }}
        />
        <span style={{ fontSize: "0.8125rem", color: "#525252", fontWeight: "500" }}>Varsayılan adres olarak kaydet</span>
      </label>

      <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
        <GBButton variant="primary" size="md" icon={<Check size={14} />} onClick={handleSave}>{saveLabel}</GBButton>
        <GBButton variant="ghost" size="md" icon={<X size={14} />} onClick={onCancel}>İptal</GBButton>
      </div>
    </div>
  );
}

function AddressesTab({ addresses, addAddress, updateAddress, removeAddress, setDefault }) {
  const [mode, setMode] = useState(null); // null | "add" | { edit: id }

  const handleAdd = (form) => {
    addAddress(form);
    setMode(null);
  };

  const handleUpdate = (id, form) => {
    updateAddress(id, form);
    setMode(null);
  };

  const TitleIcon = (baslik) => {
    const t = ADDR_TITLES.find((x) => x.value === baslik);
    return t ? t.icon : Building2;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Add / Edit form */}
      <AnimatePresence mode="wait">
        {mode === "add" && (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border border-[#f0e8e4]"
            style={{ padding: "1.75rem" }}
          >
            <h3 className="text-base font-bold text-[#2d2d2d] mb-5">Yeni Adres Ekle</h3>
            <AddressForm onSave={handleAdd} onCancel={() => setMode(null)} saveLabel="Adresi Ekle" />
          </motion.div>
        )}

        {mode && mode.edit && (
          <motion.div
            key={`edit-${mode.edit}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border border-[#b76e79]"
            style={{ padding: "1.75rem" }}
          >
            <h3 className="text-base font-bold text-[#2d2d2d] mb-5">Adresi Düzenle</h3>
            <AddressForm
              initial={addresses.find((a) => a.id === mode.edit)}
              onSave={(form) => handleUpdate(mode.edit, form)}
              onCancel={() => setMode(null)}
              saveLabel="Değişiklikleri Kaydet"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {addresses.length === 0 && !mode ? (
        <div
          className="bg-white rounded-3xl border border-[#f0e8e4]"
          style={{ padding: "4rem", textAlign: "center" }}
        >
          <MapPin size={40} className="text-[#d4d4d4] mx-auto mb-3" />
          <p className="text-sm text-[#737373] mb-4">Kayıtlı adresiniz bulunmuyor.</p>
          <GBButton variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setMode("add")}>
            Adres Ekle
          </GBButton>
        </div>
      ) : (
        <>
          {addresses.map((addr) => {
            const Icon = TitleIcon(addr.baslik);
            return (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-white rounded-3xl border"
                style={{
                  borderColor: addr.isDefault ? "#b76e79" : "#f0e8e4",
                  padding: "1.5rem",
                  boxShadow: addr.isDefault ? "0 2px 20px rgba(183,110,121,0.1)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div
                    style={{
                      width: "2.5rem", height: "2.5rem", borderRadius: "50%",
                      background: addr.isDefault ? "linear-gradient(135deg,#b76e79,#e890a8)" : "#f5f0ee",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color={addr.isDefault ? "#fff" : "#b76e79"} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#2d2d2d" }}>
                        {ADDR_TITLES.find((t) => t.value === addr.baslik)?.label || "Adres"}
                      </span>
                      {addr.isDefault && (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: "700",
                          background: "linear-gradient(135deg,#b76e79,#c4587a)",
                          color: "#fff", padding: "0.15rem 0.5rem",
                          borderRadius: "9999px", letterSpacing: "0.05em", textTransform: "uppercase",
                        }}>Varsayılan</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#2d2d2d", marginBottom: "0.125rem" }}>
                      {addr.ad} {addr.soyad}
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "#525252" }}>{addr.adres}</p>
                    <p style={{ fontSize: "0.8125rem", color: "#525252" }}>
                      {addr.ilce}, {addr.sehir}{addr.postakodu ? ` ${addr.postakodu}` : ""}
                    </p>
                    {addr.telefon && (
                      <p style={{ fontSize: "0.8125rem", color: "#737373", marginTop: "0.25rem" }}>{addr.telefon}</p>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", flexShrink: 0 }}>
                    <GBButton
                      variant="outline"
                      size="sm"
                      icon={<Edit3 size={12} />}
                      onClick={() => setMode({ edit: addr.id })}
                    >
                      Düzenle
                    </GBButton>
                    {!addr.isDefault && (
                      <GBButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefault(addr.id)}
                        style={{ fontSize: "0.7rem" }}
                      >
                        Varsayılan Yap
                      </GBButton>
                    )}
                    <GBButton
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={12} />}
                      onClick={() => removeAddress(addr.id)}
                      style={{ color: "#e53e3e" }}
                    >
                      Sil
                    </GBButton>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add new button */}
          {!mode && (
            <button
              type="button"
              onClick={() => setMode("add")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.625rem", padding: "1.125rem",
                border: "1.5px dashed #e8c5c9", borderRadius: "1.5rem",
                background: "transparent", color: "#b76e79",
                fontSize: "0.875rem", fontWeight: "600", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Plus size={16} />
              Yeni Adres Ekle
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ═══ SETTINGS TAB ═══ */
function SettingsTab({ user, updateProfile, logout, router }) {
  const [pwForm, setPwForm] = useState({ current: "", new1: "", new2: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [notif, setNotif] = useState({ kampanya: true, siparis: true, yeniurun: false });

  const changePw = (e) => {
    e.preventDefault();
    if (!pwForm.current) return setPwMsg({ type: "error", text: "Mevcut şifreyi girin." });
    if (pwForm.new1.length < 8) return setPwMsg({ type: "error", text: "Yeni şifre en az 8 karakter olmalıdır." });
    if (pwForm.new1 !== pwForm.new2) return setPwMsg({ type: "error", text: "Şifreler eşleşmiyor." });
    setPwMsg({ type: "success", text: "Şifre başarıyla güncellendi." });
    setPwForm({ current: "", new1: "", new2: "" });
  };

  const set = (k) => (e) => setPwForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Notifications */}
      <div className="bg-white rounded-3xl border border-[#f0e8e4] p-5 sm:p-8">
        <h2 className="text-lg font-bold text-[#2d2d2d] mb-1.5">Bildirim Tercihleri</h2>
        <p className="text-xs text-[#a3a3a3] mb-5">Hangi bildirimleri almak istediğinizi seçin.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { k: "siparis", label: "Sipariş güncellemeleri", desc: "Kargo ve teslimat bildirimleri" },
            { k: "kampanya", label: "Kampanya ve indirimler", desc: "Özel fırsatları kaçırma" },
            { k: "yeniurun", label: "Yeni ürünler", desc: "Koleksiyon lansmanları" },
          ].map(({ k, label, desc }) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p className="text-sm font-semibold text-[#2d2d2d]">{label}</p>
                <p className="text-xs text-[#a3a3a3]">{desc}</p>
              </div>
              <button
                onClick={() => setNotif((n) => ({ ...n, [k]: !n[k] }))}
                style={{
                  width: "2.75rem", height: "1.5rem", borderRadius: "9999px",
                  background: notif[k] ? "linear-gradient(to right, #b76e79, #c4587a)" : "#e5e5e5",
                  position: "relative", border: "none", cursor: "pointer", transition: "background 0.25s",
                }}
              >
                <span
                  style={{
                    position: "absolute", top: "0.2rem",
                    left: notif[k] ? "calc(100% - 1.3rem)" : "0.2rem",
                    width: "1.1rem", height: "1.1rem",
                    borderRadius: "9999px", background: "#fff",
                    transition: "left 0.25s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-3xl border border-[#f0e8e4] p-5 sm:p-8">
        <h2 className="text-lg font-bold text-[#2d2d2d] mb-5">Şifre Değiştir</h2>
        <form onSubmit={changePw} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <GBInput label="Mevcut Şifre" type="password" name="current" value={pwForm.current} onChange={set("current")} />
          <GBInput label="Yeni Şifre" type="password" name="new1" value={pwForm.new1} onChange={set("new1")} hint="En az 8 karakter" />
          <GBInput label="Yeni Şifre (Tekrar)" type="password" name="new2" value={pwForm.new2} onChange={set("new2")} />
          {pwMsg && (
            <p className={`text-xs font-semibold ${pwMsg.type === "error" ? "text-red-500" : "text-green-600"}`}>
              {pwMsg.text}
            </p>
          )}
          <GBButton type="submit" variant="primary" size="md">Şifreyi Güncelle</GBButton>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-3xl border border-red-100 p-5 sm:p-8">
        <h2 className="text-base font-bold text-red-600 mb-1">Hesabı Sil</h2>
        <p className="text-xs text-[#a3a3a3] mb-4">Bu işlem geri alınamaz. Tüm verileriniz silinecek.</p>
        <GBButton variant="danger" size="sm" icon={<LogOut size={13} />} onClick={() => { logout(); router.push("/"); }}>
          Hesabı Kapat
        </GBButton>
      </div>
    </div>
  );
}
