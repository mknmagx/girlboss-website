"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, MapPin, CreditCard, User, Truck, RotateCcw,
  Clock, CheckCircle2, MessageSquare, Banknote, DollarSign,
  Smartphone, Edit2, Save, ExternalLink, ChevronDown, ChevronUp, Trash2,
} from "lucide-react";
import {
  getOrderById, updateOrderStatus, PAYMENT_METHOD_LABELS,
  getRefundsByOrder, updateRefundStatus, createRefundRequest, updateShippingInfo,
  getSettings, deleteOrder, getAvailableStatuses,
} from "@/lib/firebase/firestore";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";
import Link from "next/link";

// ─── Durum adımları ─────────────────────────────────────────────────────────
const STATUS_FLOW = [
  { s: "Beklemede",     icon: Clock,        color: "#c4a265" },
  { s: "Onaylandı",    icon: CheckCircle2, color: "#2563eb" },
  { s: "Hazırlanıyor", icon: Package,      color: "#9333ea" },
  { s: "Kargoda",      icon: Truck,        color: "#b76e79" },
  { s: "Teslim Edildi",icon: CheckCircle2, color: "#16a34a" },
];

function PaymentIcon({ method, size = 16 }) {
  if (method === "creditCard") return <CreditCard size={size} className="text-[#b76e79]" />;
  if (method === "transfer")   return <Banknote   size={size} className="text-[#2563eb]" />;
  if (method === "cod")        return <DollarSign size={size} className="text-[#c4a265]" />;
  return <Smartphone size={size} className="text-[#737373]" />;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [statusNote,    setStatusNote]    = useState("");
  const [showHistory,   setShowHistory]   = useState(false);
  const [stockMsg,      setStockMsg]      = useState(null);
  const [deleting,          setDeleting]          = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Kargo takip
  const [carriers,       setCarriers]       = useState([]);
  const [shippingEdit,   setShippingEdit]   = useState(false);
  const [trackingForm,   setTrackingForm]   = useState({ carrierKey: "", trackingNumber: "", customUrl: "" });
  const [trackingSaving, setTrackingSaving] = useState(false);

  // İade
  const [refunds,          setRefunds]          = useState([]);
  const [refundsLoading,   setRefundsLoading]   = useState(false);
  const [showRefundForm,   setShowRefundForm]   = useState(false);
  const [refundForm,       setRefundForm]       = useState({ reason: "", amount: "" });
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundNotes,      setRefundNotes]      = useState({});
  const [processingRefund, setProcessingRefund] = useState(null);

  useEffect(() => {
    getOrderById(id).then((data) => {
      if (!data) { router.replace("/admin/siparisler"); return; }
      setOrder(data);
      setTrackingForm({ carrierKey: data.carrierKey || "", trackingNumber: data.trackingNumber || "", customUrl: data.carrierUrl || "" });
      setLoading(false);
    });
    getSettings().then((s) => {
      if (s?.carriers?.length) setCarriers(s.carriers.filter((c) => c.enabled !== false));
    });
    setRefundsLoading(true);
    getRefundsByOrder(id).then(setRefunds).finally(() => setRefundsLoading(false));
  }, [id, router]);

  const handleStatusClick = (s) => {
    const allowed = getAvailableStatuses(order.status);
    if (!allowed.includes(s)) return;
    setPendingStatus(s);
    setStatusNote("");
  };

  const handleDeleteOrder = async () => {
    setDeleting(true);
    await deleteOrder(id);
    router.push("/admin/siparisler");
  };

  const confirmStatusChange = async () => {
    setUpdating(true);
    const result = await updateOrderStatus(id, pendingStatus, { note: statusNote, adminEmail: "" });
    setOrder((prev) => ({
      ...prev,
      status: pendingStatus,
      stockDeducted: result.stockDeducted ? true : prev.stockDeducted,
      stockRestored: result.stockRestored ? true : prev.stockRestored,
    }));
    if (result.stockDeducted) setStockMsg("Stok otomatik olarak düşüldü.");
    setPendingStatus(null);
    setStatusNote("");
    setUpdating(false);
  };

  const saveTracking = async () => {
    setTrackingSaving(true);
    const carrierObj = carriers.find((c) => c.code === trackingForm.carrierKey);
    const baseUrl = carrierObj?.trackingUrl || "";
    const finalUrl = baseUrl ? baseUrl + trackingForm.trackingNumber : trackingForm.customUrl;
    await updateShippingInfo(id, {
      carrier: carrierObj?.name || trackingForm.carrierKey,
      carrierKey: trackingForm.carrierKey,
      trackingNumber: trackingForm.trackingNumber,
      carrierUrl: finalUrl,
    });
    setOrder((prev) => ({ ...prev, carrier: carrierObj?.name || trackingForm.carrierKey, carrierKey: trackingForm.carrierKey, trackingNumber: trackingForm.trackingNumber, carrierUrl: finalUrl }));
    setShippingEdit(false);
    setTrackingSaving(false);
  };

  const approveRefund = async (refundId) => {
    setProcessingRefund(refundId);
    await updateRefundStatus(id, refundId, "Onaylandı", refundNotes[refundId] || "");
    setRefunds((prev) => prev.map((r) => r.id === refundId ? { ...r, status: "Onaylandı" } : r));
    setOrder((prev) => ({ ...prev, status: "İade Onaylandı" }));
    setProcessingRefund(null);
  };

  const rejectRefund = async (refundId) => {
    setProcessingRefund(refundId);
    await updateRefundStatus(id, refundId, "Reddedildi", refundNotes[refundId] || "");
    setRefunds((prev) => prev.map((r) => r.id === refundId ? { ...r, status: "Reddedildi" } : r));
    setOrder((prev) => ({ ...prev, status: "İade Reddedildi" }));
    setProcessingRefund(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const isCancelled    = order.status === "İptal Edildi";
  const isRefundState  = ["İade Talep Edildi", "İade Onaylandı", "İade Reddedildi"].includes(order.status);
  const currentFlowIdx = STATUS_FLOW.findIndex((f) => f.s === order.status);

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3">
        <Link href="/admin/siparisler">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-[#2d2d2d] flex flex-wrap items-center gap-3">
            Sipariş #{id.slice(0, 8).toUpperCase()}
            <StatusBadge status={order.status} />
            {order.isManual && (
              <span className="text-[11px] font-semibold text-[#a3a3a3] bg-[#fdf8f5] border border-[#f0e8e4] px-2 py-0.5 rounded-full">Manuel</span>
            )}
          </h1>
          <p className="text-xs text-[#a3a3a3] mt-0.5">
            {order.createdAt ? new Date(order.createdAt).toLocaleString("tr-TR") : "—"}
          </p>
        </div>
        {/* Sipariş silme */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Sil
          </button>
        ) : (
          <div className="shrink-0 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
            <span className="text-xs text-red-700 font-semibold">Kalıcı olarak silinecek!</span>
            <button
              onClick={handleDeleteOrder}
              disabled={deleting}
              className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "Siliniyor…" : "Evet, Sil"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs font-semibold text-[#737373] hover:text-[#2d2d2d] transition-colors"
            >
              İptal
            </button>
          </div>
        )}
      </div>

      {/* ── UYARILAR ── */}
      {stockMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={15} /> {stockMsg}
        </div>
      )}
      {order.stockDeducted && !stockMsg && (
        <div className="bg-[#f0fdf4] border border-green-100 text-green-700 text-xs rounded-xl px-4 py-2.5 flex items-center gap-2">
          <CheckCircle2 size={13} /> Stok, sipariş hazırlanırken otomatik düşüldü.
        </div>
      )}

      {/* ── DURUM AKIŞ TİMLİNE ── */}
      {!isCancelled && !isRefundState && (
        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
          <h3 className="text-sm font-bold text-[#2d2d2d] mb-5">Sipariş Akışı</h3>
          <div className="flex items-start justify-between overflow-x-auto pb-1">
            {STATUS_FLOW.map((step, idx) => {
              const Icon  = step.icon;
              const done   = idx <= currentFlowIdx;
              const active = idx === currentFlowIdx;
              return (
                <div key={step.s} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center gap-1.5 min-w-14">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ background: done ? step.color : "#f0e8e4", boxShadow: active ? `0 0 0 5px ${step.color}25` : "none" }}
                    >
                      <Icon size={15} color={done ? "#fff" : "#c4c4c4"} />
                    </div>
                    <span className="text-[10px] text-center leading-tight px-1" style={{ color: done ? step.color : "#a3a3a3", fontWeight: done ? 700 : 400 }}>
                      {step.s}
                    </span>
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div className="h-0.5 w-10 sm:w-14 mx-0.5 mb-5 rounded-full shrink-0 transition-all duration-300" style={{ background: idx < currentFlowIdx ? step.color : "#f0e8e4" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DURUM GÜNCELLE ── */}
      <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
        <h3 className="text-sm font-bold text-[#2d2d2d] mb-3">Durumu Güncelle</h3>
        {(() => {
          const available = getAvailableStatuses(order.status);
          if (available.length === 0) {
            return (
              <p className="text-xs text-[#a3a3a3] italic">
                Bu sipariş terminal durumda, başka durum güncellemesi yapılamaz.
              </p>
            );
          }
          return (
            <div className="flex flex-wrap gap-2">
              {available.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusClick(s)}
                  disabled={updating}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    pendingStatus === s
                      ? "bg-[#fff0f3] text-[#b76e79] border-[#b76e79]"
                      : s === "İptal Edildi"
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                      : "bg-[#fdf8f5] text-[#525252] hover:bg-[#fff0f3] border-[#f0e8e4]"
                  } disabled:opacity-50`}
                >
                  {s === "İptal Edildi" ? "⚠️ İptal Et" : `→ ${s}`}
                </button>
              ))}
            </div>
          );
        })()}

        {pendingStatus && (
          <div className="mt-4 bg-[#fdf8f5] rounded-xl p-4 space-y-3 border border-[#f0e8e4]">
            <p className="text-xs font-semibold text-[#525252]">
              <span className="text-[#b76e79]">"{pendingStatus}"</span> durumuna geçmek üzeresiniz:
            </p>
            <GBTextarea placeholder="Durum notu (isteğe bağlı)…" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2} />
            {pendingStatus === "Hazırlanıyor" && !order.stockDeducted && (
              <p className="text-xs text-amber-600">⚠ Bu adıma geçildiğinde stok otomatik düşülecek.</p>
            )}
            {(pendingStatus === "İptal Edildi" || pendingStatus === "İade Onaylandı") && order.stockDeducted && !order.stockRestored && (
              <p className="text-xs text-blue-600">↩ Bu adımda stok otomatik geri eklenecek.</p>
            )}
            <div className="flex gap-2">
              <GBButton variant="primary" size="sm" onClick={confirmStatusChange} loading={updating}>
                Onayla → {pendingStatus}
              </GBButton>
              <GBButton variant="ghost" size="sm" onClick={() => setPendingStatus(null)}>İptal</GBButton>
            </div>
          </div>
        )}

        {order.statusHistory?.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setShowHistory((v) => !v)} className="text-xs text-[#a3a3a3] hover:text-[#737373] flex items-center gap-1 transition-colors">
              {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Durum geçmişi ({order.statusHistory.length})
            </button>
            {showHistory && (
              <div className="mt-3 space-y-2 border-l-2 border-[#f0e8e4] pl-4">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="text-xs text-[#737373]">
                    <span className="font-bold text-[#2d2d2d]">{h.status}</span>
                    <span className="text-[#d4d4d4] mx-1.5">·</span>
                    <span>{new Date(h.at).toLocaleString("tr-TR")}</span>
                    {h.by && h.by !== "system" && <><span className="text-[#d4d4d4] mx-1.5">·</span><span className="text-[#b76e79]">{h.by}</span></>}
                    {h.note && <p className="italic text-[#a3a3a3] mt-0.5">{h.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── KARGO & TAKİP ── */}
      <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
            <Truck size={14} className="text-[#b76e79]" /> Kargo & Takip
          </h3>
          {!shippingEdit && (
            <button onClick={() => setShippingEdit(true)} className="text-xs text-[#b76e79] font-semibold hover:underline flex items-center gap-1">
              <Edit2 size={12} /> {order.trackingNumber ? "Düzenle" : "Bilgi Gir"}
            </button>
          )}
        </div>

        {!shippingEdit ? (
          order.trackingNumber ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#a3a3a3] mb-0.5">Kargo Firması</p>
                  <p className="font-semibold text-[#2d2d2d]">{order.carrier || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a3a3a3] mb-0.5">Takip Numarası</p>
                  <p className="font-bold text-[#b76e79] font-mono tracking-wider">{order.trackingNumber}</p>
                </div>
              </div>
              {order.shippedAt && (
                <p className="text-xs text-[#a3a3a3]">Kargoya verildi: {new Date(order.shippedAt).toLocaleString("tr-TR")}</p>
              )}
              {order.carrierUrl && (
                <a href={order.carrierUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#b76e79] hover:bg-[#a05d6a] rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={12} /> Kargo Takip Sayfası
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#a3a3a3]">Kargo bilgisi henüz girilmedi.</p>
          )
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#525252] mb-1.5">Kargo Firması</label>
                <select
                  value={trackingForm.carrierKey}
                  onChange={(e) => setTrackingForm((f) => ({ ...f, carrierKey: e.target.value, customUrl: "" }))}
                  className="w-full border border-[#f0e8e4] rounded-xl px-3 py-2.5 text-sm text-[#2d2d2d] bg-white focus:outline-none focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10 transition-all"
                >
                  <option value="">Seçin…</option>
                  {carriers.length === 0 && <option value="" disabled>Önce Ayarlar &gt; Kargo bölümünden firma ekleyin</option>}
                  {carriers.map((c) => <option key={c.code} value={c.code}>{c.name}{c.estimatedDays ? ` (${c.estimatedDays} gün)` : ""}</option>)}
                </select>
              </div>
              <GBInput label="Takip Numarası" value={trackingForm.trackingNumber} onChange={(e) => setTrackingForm((f) => ({ ...f, trackingNumber: e.target.value }))} placeholder="Örn: 12345678901" />
            </div>
            {trackingForm.carrierKey && !carriers.find((c) => c.code === trackingForm.carrierKey)?.trackingUrl && (
              <GBInput label="Takip Linki (tam URL)" value={trackingForm.customUrl} onChange={(e) => setTrackingForm((f) => ({ ...f, customUrl: e.target.value }))} placeholder="https://..." />
            )}
            {trackingForm.carrierKey && trackingForm.trackingNumber && carriers.find((c) => c.code === trackingForm.carrierKey)?.trackingUrl && (
              <p className="text-[11px] text-[#737373] bg-[#fdf8f5] rounded-lg px-3 py-2 break-all">
                Önizleme: {carriers.find((c) => c.code === trackingForm.carrierKey)?.trackingUrl}{trackingForm.trackingNumber}
              </p>
            )}
            <div className="flex gap-2">
              <GBButton variant="primary" size="sm" loading={trackingSaving} icon={<Save size={13} />} onClick={saveTracking}>Kaydet</GBButton>
              <GBButton variant="ghost" size="sm" onClick={() => setShippingEdit(false)}>İptal</GBButton>
            </div>
          </div>
        )}
      </div>

      {/* ── MÜŞTERİ + TESLİMAT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
          <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2 mb-4">
            <User size={14} className="text-[#b76e79]" /> Müşteri Bilgileri
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-[#a3a3a3]">Ad Soyad:</span>{" "}<span className="font-semibold">{order.customerName || `${order.delivery?.ad || ""} ${order.delivery?.soyad || ""}`.trim() || "—"}</span></p>
            <p><span className="text-[#a3a3a3]">E-posta:</span>{" "}<span className="font-semibold">{order.email || "—"}</span></p>
            <p><span className="text-[#a3a3a3]">Telefon:</span>{" "}<span className="font-semibold">{order.phone || order.delivery?.telefon || "—"}</span></p>
            {order.uid && (
              <Link href={`/admin/kullanicilar/${order.uid}`} className="text-xs text-[#b76e79] font-semibold hover:underline inline-block mt-1">
                Profili görüntüle →
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
          <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[#b76e79]" /> Teslimat Adresi
          </h3>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{order.address || order.delivery?.adres || "—"}</p>
            <p className="text-[#737373]">{[order.district || order.delivery?.ilce, order.city || order.delivery?.sehir].filter(Boolean).join(" / ")}</p>
            <p className="text-[#a3a3a3]">{order.postalCode || order.delivery?.postakodu || ""}</p>
          </div>
        </div>
      </div>

      {/* ── ÖDEME BİLGİLERİ ── */}
      <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
        <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2 mb-4">
          <PaymentIcon method={order.paymentMethod} size={14} /> Ödeme Bilgileri
        </h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-[#a3a3a3]">Ödeme Yöntemi</p>
            <p className="font-semibold mt-0.5">{PAYMENT_METHOD_LABELS?.[order.paymentMethod] || order.paymentMethod || "—"}</p>
          </div>
          {order.paymentMethod === "creditCard" && order.use3DSecure != null && (
            <div><p className="text-xs text-[#a3a3a3]">3D Secure</p><p className="font-semibold mt-0.5">{order.use3DSecure ? "Aktif" : "Pasif"}</p></div>
          )}
          {(order.codFee || 0) > 0 && (
            <div><p className="text-xs text-[#a3a3a3]">Kapıda Ödeme Ücreti</p><p className="font-semibold mt-0.5">₺{Number(order.codFee).toFixed(2)}</p></div>
          )}
          {order.estimatedDelivery && (
            <div><p className="text-xs text-[#a3a3a3]">Tahmini Teslimat</p><p className="font-semibold mt-0.5">{order.estimatedDelivery} iş günü</p></div>
          )}
        </div>
      </div>

      {/* ── SİPARİŞ ÜRÜNLERİ ── */}
      <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
        <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2 mb-4">
          <Package size={14} className="text-[#b76e79]" /> Sipariş Ürünleri
        </h3>
        <div className="space-y-2.5">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#fdf8f5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0" style={{ background: item.gradient || "#f0e8e4" }}>
                  {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2d2d2d]">{item.name}</p>
                  <p className="text-[11px] text-[#a3a3a3]">{item.volume ? `${item.volume} · ` : ""}× {item.qty}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#2d2d2d] shrink-0">
                ₺{((item.price || 0) * (item.qty || 1)).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#f0e8e4] space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[#737373]">Ara Toplam</span><span className="font-semibold">₺{(order.subtotal || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#737373]">Kargo</span><span className="font-semibold">{order.shipping === 0 ? "Ücretsiz" : `₺${(order.shipping || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}</span></div>
          {(order.codFee || 0) > 0 && <div className="flex justify-between text-sm"><span className="text-[#737373]">Kapıda Ödeme Ücreti</span><span className="font-semibold">₺{Number(order.codFee).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span></div>}
          {(order.discount || 0) > 0 && <div className="flex justify-between text-sm"><span className="text-[#737373]">İndirim</span><span className="font-semibold text-green-600">-₺{Number(order.discount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span></div>}
          <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[#f0e8e4]">
            <span>Toplam</span>
            <span className="text-[#b76e79]">₺{(order.total || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* ── İADE YÖNETİMİ ── */}
      <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
            <RotateCcw size={14} className="text-[#b76e79]" /> İade Yönetimi
          </h3>
          <button onClick={() => setShowRefundForm((v) => !v)} className="text-xs text-[#b76e79] font-semibold hover:underline flex items-center gap-1">
            {showRefundForm ? <><ChevronUp size={12} /> Kapat</> : <><MessageSquare size={12} /> Yeni Talep</>}
          </button>
        </div>

        {showRefundForm && (
          <div className="bg-[#fdf8f5] rounded-xl p-4 mb-4 space-y-3 border border-[#f0e8e4]">
            <GBTextarea label="İade Sebebi" value={refundForm.reason} onChange={(e) => setRefundForm((f) => ({ ...f, reason: e.target.value }))} placeholder="İade sebebini açıklayın…" rows={2} />
            <GBInput label="İade Tutarı (₺)" type="number" value={refundForm.amount} onChange={(e) => setRefundForm((f) => ({ ...f, amount: e.target.value }))} placeholder={String(order.total || "")} />
            <div className="flex gap-2">
              <GBButton variant="primary" size="sm" loading={refundSubmitting} onClick={async () => {
                if (!refundForm.reason.trim()) return;
                setRefundSubmitting(true);
                await createRefundRequest(id, { reason: refundForm.reason, amount: Number(refundForm.amount) || order.total, requestedBy: "admin" });
                setRefunds((prev) => [...prev, { id: Date.now().toString(), ...refundForm, status: "Beklemede", createdAt: new Date().toISOString() }]);
                setOrder((prev) => ({ ...prev, status: "İade Talep Edildi" }));
                setRefundForm({ reason: "", amount: "" });
                setShowRefundForm(false);
                setRefundSubmitting(false);
              }}>İade Talebi Oluştur</GBButton>
              <GBButton variant="ghost" size="sm" onClick={() => setShowRefundForm(false)}>İptal</GBButton>
            </div>
          </div>
        )}

        {refundsLoading ? (
          <p className="text-sm text-[#a3a3a3]">Yükleniyor…</p>
        ) : refunds.length === 0 ? (
          <p className="text-sm text-[#a3a3a3]">Henüz iade talebi bulunmuyor.</p>
        ) : (
          <div className="space-y-3">
            {refunds.map((r) => (
              <div key={r.id} className="bg-[#fdf8f5] rounded-xl p-4 border border-[#f0e8e4]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.status === "Beklemede" ? "bg-amber-100 text-amber-700" : r.status === "Onaylandı" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>
                  <span className="text-[11px] text-[#a3a3a3]">{new Date(r.createdAt).toLocaleString("tr-TR")}</span>
                </div>
                <p className="text-sm font-semibold text-[#2d2d2d] mb-1">{r.reason}</p>
                {r.amount && <p className="text-xs text-[#737373]">Talep: ₺{Number(r.amount).toFixed(2)}</p>}
                {r.adminNote && <p className="text-xs italic text-[#737373] mt-1">Admin notu: {r.adminNote}</p>}
                {r.status === "Beklemede" && (
                  <div className="mt-3 space-y-2">
                    <GBTextarea placeholder="Admin notu (isteğe bağlı)…" value={refundNotes[r.id] || ""} onChange={(e) => setRefundNotes((prev) => ({ ...prev, [r.id]: e.target.value }))} rows={1} />
                    <div className="flex gap-2">
                      <GBButton variant="primary" size="sm" loading={processingRefund === r.id} onClick={() => approveRefund(r.id)}>Onayla</GBButton>
                      <GBButton variant="danger"  size="sm" loading={processingRefund === r.id} onClick={() => rejectRefund(r.id)}>Reddet</GBButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SİPARİŞ NOTU ── */}
      {order.note && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-2">
            <MessageSquare size={14} /> Sipariş Notu
          </h3>
          <p className="text-sm text-amber-800">{order.note}</p>
        </div>
      )}
    </div>
  );
}
