"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Search, User, MapPin,
  Package, ShoppingBag, CheckCircle2, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getProducts, getAllUsers, createOrder, updateStockWithLog,
} from "@/lib/firebase/firestore";
import { useAdmin } from "@/lib/hooks/useAdmin";
import GBInput from "@/lib/components/ui/GBInput";
import GBButton from "@/lib/components/ui/GBButton";
import GBSelect from "@/lib/components/ui/GBSelect";

const SHIPPING_COST = 29.9;
const FREE_SHIPPING_THRESHOLD = 500;

function Field({ label, error, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-[#525252] mb-1">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function AdminNewOrderPage() {
  const router = useRouter();
  const { user: adminUser, loading: authLoading } = useAdmin();

  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [customerType, setCustomerType] = useState("registered");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ ad: "", soyad: "", email: "", telefon: "" });

  const [delivery, setDelivery] = useState({ adres: "", sehir: "", ilce: "", postakodu: "" });

  const [items, setItems] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);

  const [status, setStatus] = useState("Beklemede");
  const [note, setNote] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);

  useEffect(() => {
    getProducts().then(setAllProducts);
    getAllUsers().then(setAllUsers);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const filteredUsers = allUsers.filter((u) => {
    const q = userSearch.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.ad?.toLowerCase().includes(q) || u.soyad?.toLowerCase().includes(q);
  });

  const filteredProducts = allProducts.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  const addProductToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setShowProductSearch(false);
    setProductSearch("");
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setG = (k) => (e) => setGuestInfo((f) => ({ ...f, [k]: e.target.value }));
  const setD = (k) => (e) => setDelivery((f) => ({ ...f, [k]: e.target.value }));
  const clearError = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });

  function validate() {
    const e = {};
    if (customerType === "registered" && !selectedUser) e.customer = "Bir kullanıcı seçin.";
    if (customerType === "guest") {
      if (!guestInfo.ad.trim()) e.guestAd = "Ad zorunludur.";
      if (!guestInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email))
        e.guestEmail = "Geçerli e-posta girin.";
    }
    if (items.length === 0) e.items = "En az bir ürün eklemelisiniz.";
    if (!delivery.adres.trim()) e.adres = "Adres zorunludur.";
    if (!delivery.sehir.trim()) e.sehir = "Şehir zorunludur.";
    if (!delivery.ilce.trim()) e.ilce = "İlçe zorunludur.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const customer = customerType === "registered"
        ? { uid: selectedUser.uid, email: selectedUser.email, ad: selectedUser.ad, soyad: selectedUser.soyad, telefon: selectedUser.telefon || "" }
        : { uid: null, email: guestInfo.email, ad: guestInfo.ad, soyad: guestInfo.soyad, telefon: guestInfo.telefon };

      const orderId = await createOrder({
        uid: customer.uid || null,
        email: customer.email,
        isGuest: !customer.uid,
        isManual: true,
        createdByAdmin: adminUser?.email || "",
        status,
        note,
        delivery: {
          ad: customer.ad,
          soyad: customer.soyad,
          email: customer.email,
          telefon: customer.telefon,
          adres: delivery.adres,
          sehir: delivery.sehir,
          ilce: delivery.ilce,
          postakodu: delivery.postakodu,
        },
        items: items.map((i) => ({
          id: i.id, name: i.name, slug: i.slug, price: i.price, qty: i.qty,
          tagline: i.tagline || "", volume: i.volume || "",
          gradient: i.gradient || "", images: i.images || [],
        })),
        subtotal, shipping, total,
      });

      // Deduct stock and write logs
      for (const item of items) {
        const product = allProducts.find((p) => p.id === item.id);
        if (product) {
          const newStock = Math.max(0, (product.stock ?? 0) - item.qty);
          await updateStockWithLog(item.id, {
            newStock,
            delta: -item.qty,
            type: "order",
            note: `Manuel sipariş #${orderId.slice(0, 8).toUpperCase()}`,
            adminEmail: adminUser?.email || "",
          });
          setAllProducts((prev) => prev.map((p) => p.id === item.id ? { ...p, stock: newStock } : p));
        }
      }

      setNewOrderId(orderId);
      setSuccess(true);
    } catch {
      setErrors({ submit: "Sipariş oluşturulurken bir hata oluştu." });
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={30} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#2d2d2d] mb-2">Sipariş Oluşturuldu!</h2>
        <p className="text-sm text-[#737373] mb-1">Sipariş No: <strong>#{newOrderId?.slice(0, 8).toUpperCase()}</strong></p>
        <p className="text-sm text-[#a3a3a3] mb-8">Stoklar otomatik olarak güncellendi.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href={`/admin/siparisler/${newOrderId}`}><GBButton variant="primary">Siparişi Görüntüle</GBButton></Link>
          <GBButton variant="outline" onClick={() => router.push("/admin/siparisler")}>Tüm Siparişler</GBButton>
          <GBButton variant="ghost" onClick={() => {
            setSuccess(false); setItems([]); setSelectedUser(null);
            setGuestInfo({ ad: "", soyad: "", email: "", telefon: "" });
            setDelivery({ adres: "", sehir: "", ilce: "", postakodu: "" });
            setNote(""); setNewOrderId(null);
          }}>Yeni Sipariş</GBButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/siparisler">
          <button type="button" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Manuel Sipariş Oluştur</h1>
          <p className="text-sm text-[#a3a3a3] mt-0.5">Telefon veya mağaza siparişleri için</p>
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <AlertCircle size={15} />
          <span className="text-sm">{errors.submit}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-5">

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}>
                <User size={13} className="text-white" />
              </div>
              <h2 className="text-sm font-bold text-[#2d2d2d]">Müşteri Bilgileri</h2>
            </div>
            <div className="flex gap-2 mb-4">
              {[{ value: "registered", label: "Kayıtlı Kullanıcı" }, { value: "guest", label: "Misafir / Yeni" }].map(({ value, label }) => (
                <button key={value} type="button"
                  onClick={() => { setCustomerType(value); setSelectedUser(null); clearError("customer"); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{ background: customerType === value ? "linear-gradient(135deg, #b76e79, #c4587a)" : "#f5f0ee", color: customerType === value ? "#fff" : "#525252" }}>
                  {label}
                </button>
              ))}
            </div>

            {customerType === "registered" ? (
              <>
                <div className="relative">
                  <GBInput label="Kullanıcı Ara" value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setSelectedUser(null); clearError("customer"); }}
                    icon={<Search size={15} />} placeholder="İsim veya e-posta ile ara…" />
                  {userSearch && !selectedUser && (
                    <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#f0e8e4] rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {filteredUsers.length === 0
                        ? <p className="text-xs text-[#a3a3a3] px-4 py-3">Kullanıcı bulunamadı.</p>
                        : filteredUsers.map((u) => (
                          <button key={u.uid} type="button"
                            onClick={() => { setSelectedUser(u); setUserSearch(`${u.ad} ${u.soyad} (${u.email})`); clearError("customer"); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-[#fdf8f5] border-b border-[#f0e8e4] last:border-0">
                            <p className="text-sm font-semibold text-[#2d2d2d]">{u.ad} {u.soyad}</p>
                            <p className="text-xs text-[#737373]">{u.email}</p>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                {selectedUser && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                      <User size={14} className="text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2d2d2d]">{selectedUser.ad} {selectedUser.soyad}</p>
                      <p className="text-xs text-[#737373]">{selectedUser.email}</p>
                    </div>
                    <button type="button" onClick={() => { setSelectedUser(null); setUserSearch(""); }}
                      className="text-[#a3a3a3] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                )}
                {errors.customer && <p className="text-xs text-red-500 mt-2">{errors.customer}</p>}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <GBInput label="Ad *" value={guestInfo.ad} onChange={setG("ad")} error={errors.guestAd} />
                <GBInput label="Soyad" value={guestInfo.soyad} onChange={setG("soyad")} />
                <GBInput label="E-posta *" type="email" value={guestInfo.email} onChange={setG("email")} error={errors.guestEmail} />
                <GBInput label="Telefon" value={guestInfo.telefon} onChange={setG("telefon")} />
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}>
                <MapPin size={13} className="text-white" />
              </div>
              <h2 className="text-sm font-bold text-[#2d2d2d]">Teslimat Adresi</h2>
            </div>
            <div className="space-y-3">
              <Field label="Adres *" error={errors.adres}>
                <textarea value={delivery.adres}
                  onChange={(e) => { setD("adres")(e); clearError("adres"); }}
                  rows={2} className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#b76e79] transition-colors"
                  placeholder="Mahalle, sokak, bina no, daire…" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Şehir *" error={errors.sehir}>
                  <input value={delivery.sehir} onChange={(e) => { setD("sehir")(e); clearError("sehir"); }}
                    className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-[#b76e79] transition-colors" />
                </Field>
                <Field label="İlçe *" error={errors.ilce}>
                  <input value={delivery.ilce} onChange={(e) => { setD("ilce")(e); clearError("ilce"); }}
                    className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-[#b76e79] transition-colors" />
                </Field>
                <Field label="Posta Kodu">
                  <input value={delivery.postakodu} onChange={setD("postakodu")}
                    className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm focus:outline-none focus:border-[#b76e79] transition-colors" />
                </Field>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}>
                  <Package size={13} className="text-white" />
                </div>
                <h2 className="text-sm font-bold text-[#2d2d2d]">Ürünler</h2>
              </div>
              <button type="button" onClick={() => setShowProductSearch((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #b76e79, #c4587a)" }}>
                <Plus size={13} /> Ürün Ekle
              </button>
            </div>

            {showProductSearch && (
              <div className="mb-4 relative">
                <GBInput placeholder="Ürün adı ile ara…" value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)} icon={<Search size={15} />} />
                {productSearch && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#f0e8e4] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.length === 0
                      ? <p className="text-xs text-[#a3a3a3] px-4 py-3">Ürün bulunamadı.</p>
                      : filteredProducts.map((product) => (
                        <button key={product.id} type="button" onClick={() => addProductToCart(product)}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-[#fdf8f5] border-b border-[#f0e8e4] last:border-0">
                          <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: product.gradient || "#f0e8e4" }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#2d2d2d] truncate">{product.name}</p>
                            <p className="text-xs text-[#a3a3a3]">₺{product.price} • {product.volume}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(product.stock ?? 0) > 10 ? "bg-green-50 text-green-700" : (product.stock ?? 0) > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                            {product.stock ?? 0} stok
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {errors.items && <p className="text-xs text-red-500 mb-3">{errors.items}</p>}

            {items.length === 0 ? (
              <div className="text-center py-8 text-[#a3a3a3]">
                <ShoppingBag size={28} className="mx-auto mb-2 text-[#e0b4be]" />
                <p className="text-sm">Henüz ürün eklenmedi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[#fdf8f5] rounded-xl">
                    <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: item.gradient || "#f0e8e4" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2d2d2d] truncate">{item.name}</p>
                      <p className="text-xs text-[#a3a3a3]">₺{item.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center border border-[#e5e5e5] rounded-full overflow-hidden bg-white">
                      <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] text-lg leading-none">−</button>
                      <span className="w-8 h-7 flex items-center justify-center text-xs font-bold">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] text-lg leading-none">+</button>
                    </div>
                    <span className="text-sm font-bold text-[#2d2d2d] w-20 text-right">₺{(item.price * item.qty).toFixed(2)}</span>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-[#d4d4d4] hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <h2 className="text-sm font-bold text-[#2d2d2d] mb-3">Sipariş Notu (opsiyonel)</h2>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#b76e79] transition-colors"
              placeholder="Müşteri notu, özel talimat, vs." />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <h2 className="text-sm font-bold text-[#2d2d2d] mb-3">Başlangıç Durumu</h2>
            <GBSelect value={status} onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "Beklemede", label: "Beklemede" },
                { value: "Onaylandı", label: "Onaylandı" },
                { value: "Hazırlanıyor", label: "Hazırlanıyor" },
                { value: "Kargoda", label: "Kargoda" },
                { value: "Teslim Edildi", label: "Teslim Edildi" },
              ]} />
          </div>

          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <h2 className="text-sm font-bold text-[#2d2d2d] mb-4">Sipariş Özeti</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-[#737373]">Ara Toplam ({items.reduce((s, i) => s + i.qty, 0)} ürün)</span>
                <span className="font-semibold">₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Kargo</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "Ücretsiz" : `₺${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="h-px bg-[#f0e8e4]" />
              <div className="flex justify-between font-bold text-base">
                <span>Toplam</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mb-5 select-none">
              <input type="checkbox" checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)}
                className="w-4 h-4" style={{ accentColor: "#b76e79" }} />
              <span className="text-xs text-[#525252] font-medium">Kargo ücretsiz uygula</span>
            </label>

            <GBButton type="submit" variant="primary" size="lg" fullWidth
              loading={submitting} disabled={submitting || items.length === 0}
              icon={submitting ? null : <Plus size={16} />}>
              {submitting ? "Oluşturuluyor…" : "Siparişi Oluştur"}
            </GBButton>

            <p className="text-[11px] text-[#a3a3a3] text-center mt-3">
              Onaylandığında stoklar otomatik güncellenir.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}