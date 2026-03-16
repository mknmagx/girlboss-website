"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, TrendingUp, TrendingDown, RotateCcw, Package,
  AlertTriangle, CheckCircle, PlusCircle, Save,
} from "lucide-react";
import Link from "next/link";
import {
  getProductById, getStockLogs, updateStockWithLog,
} from "@/lib/firebase/firestore";
import { useAdmin } from "@/lib/hooks/useAdmin";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBSelect from "@/lib/components/ui/GBSelect";
import StatusBadge from "@/lib/components/admin/StatusBadge";

const LOG_TYPES = {
  in:          { label: "Stok Girişi",    icon: TrendingUp,   color: "#16a34a", bg: "#f0fdf4" },
  out:         { label: "Stok Çıkışı",   icon: TrendingDown, color: "#dc2626", bg: "#fef2f2" },
  adjustment:  { label: "Düzeltme",      icon: RotateCcw,    color: "#2563eb", bg: "#eff6ff" },
  order:       { label: "Sipariş",       icon: Package,      color: "#b76e79", bg: "#fff0f3" },
  manual:      { label: "Manuel",        icon: RotateCcw,    color: "#737373", bg: "#f5f5f5" },
};

function stockStatus(stock) {
  if (stock <= 0)  return { label: "Tükendi",    color: "#dc2626", bg: "#fef2f2", icon: AlertTriangle };
  if (stock < 10)  return { label: "Kritik",     color: "#c4a265", bg: "#fffbf0", icon: AlertTriangle };
  if (stock < 25)  return { label: "Düşük",      color: "#d97706", bg: "#fff7ed", icon: AlertTriangle };
  return            { label: "Yeterli",           color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle };
}

export default function AdminStockDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: adminUser } = useAdmin();

  const [product, setProduct] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  /* Adjustment form */
  const [adjType, setAdjType] = useState("in");
  const [adjAmount, setAdjAmount] = useState("");
  const [adjNote, setAdjNote] = useState("");
  const [adjSaving, setAdjSaving] = useState(false);
  const [adjError, setAdjError] = useState("");
  const [adjSuccess, setAdjSuccess] = useState(false);

  const load = async () => {
    const p = await getProductById(id);
    if (!p) { router.replace("/admin/stok"); return; }
    setProduct(p);
    setLoading(false);
  };

  const loadLogs = async () => {
    const data = await getStockLogs(id);
    setLogs(data);
    setLogsLoading(false);
  };

  useEffect(() => { load(); loadLogs(); }, [id]);

  async function handleAdjustment(e) {
    e.preventDefault();
    const amount = parseInt(adjAmount, 10);
    if (!amount || amount <= 0) { setAdjError("Geçerli bir miktar girin."); return; }

    setAdjSaving(true);
    setAdjError("");
    try {
      const currentStock = product.stock ?? 0;
      let delta, newStock;

      if (adjType === "in") {
        delta = amount;
        newStock = currentStock + amount;
      } else if (adjType === "out") {
        delta = -amount;
        newStock = Math.max(0, currentStock - amount);
      } else {
        // adjustment: set to exact value
        delta = amount - currentStock;
        newStock = amount;
      }

      await updateStockWithLog(id, {
        newStock,
        delta,
        type: adjType,
        note: adjNote,
        adminEmail: adminUser?.email || "",
      });

      setProduct((prev) => ({ ...prev, stock: newStock }));
      await loadLogs();
      setAdjAmount("");
      setAdjNote("");
      setAdjSuccess(true);
      setTimeout(() => setAdjSuccess(false), 3000);
    } catch {
      setAdjError("Stok güncellenirken hata oluştu.");
    } finally {
      setAdjSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const status = stockStatus(product.stock ?? 0);
  const StatusIcon = status.icon;

  /* Mini sparkline data — last 20 logs reversed for chronological order */
  const sparkData = [...logs].reverse().slice(-20).map((l) => l.newStock ?? 0);
  const sparkMax = Math.max(...sparkData, 1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/stok">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: product.gradient || "#f0e8e4" }} />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#2d2d2d] truncate">{product.name}</h1>
            <p className="text-xs text-[#a3a3a3]">{product.volume} · {product.slug}</p>
          </div>
        </div>
        <Link href={`/admin/urunler/${id}`}>
          <GBButton variant="outline" size="sm">Ürünü Düzenle</GBButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left: Stats + History */}
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#f0e8e4] p-4 text-center">
              <p className="text-xs text-[#a3a3a3] mb-1">Mevcut Stok</p>
              <p className="text-3xl font-extrabold text-[#2d2d2d]">{product.stock ?? 0}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color: status.color, background: status.bg }}>
                <StatusIcon size={11} />{status.label}
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-[#f0e8e4] p-4 text-center">
              <p className="text-xs text-[#a3a3a3] mb-1">Toplam Hareket</p>
              <p className="text-3xl font-extrabold text-[#2d2d2d]">{logs.length}</p>
              <p className="text-xs text-[#a3a3a3] mt-1">kayıt</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#f0e8e4] p-4 text-center">
              <p className="text-xs text-[#a3a3a3] mb-1">Son Hareket</p>
              <p className="text-xl font-extrabold text-[#2d2d2d]">
                {logs[0]
                  ? new Date(logs[0].createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
                  : "—"}
              </p>
              <p className="text-xs text-[#a3a3a3] mt-1">
                {logs[0] ? new Date(logs[0].createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}
              </p>
            </div>
          </div>

          {/* Sparkline */}
          {sparkData.length > 1 && (
            <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
              <h3 className="text-sm font-bold text-[#2d2d2d] mb-4">Stok Trendi (son {sparkData.length} hareket)</h3>
              <div className="relative h-24 flex items-end gap-1">
                {sparkData.map((v, i) => {
                  const h = Math.max(4, Math.round((v / sparkMax) * 96));
                  const isLow = v < 10;
                  return (
                    <div key={i} className="flex-1 rounded-t-sm relative group"
                      style={{ height: `${h}px`, background: isLow ? "#fca5a5" : "linear-gradient(to top, #b76e79, #e890a8)" }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#2d2d2d] text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {v}
                      </div>
                    </div>
                  );
                })}
                {/* Baseline */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#f0e8e4]" />
              </div>
            </div>
          )}

          {/* Movement History */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f0e8e4] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2d2d2d]">Hareket Geçmişi</h3>
              <span className="text-xs text-[#a3a3a3]">{logs.length} kayıt</span>
            </div>

            {logsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-10">
                <Package size={28} className="text-[#d4d4d4] mx-auto mb-2" />
                <p className="text-sm text-[#a3a3a3]">Henüz stok hareketi yok.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0e8e4]">
                {logs.map((log) => {
                  const t = LOG_TYPES[log.type] || LOG_TYPES.manual;
                  const LogIcon = t.icon;
                  const isPositive = (log.delta ?? 0) >= 0;
                  return (
                    <div key={log.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#fdf8f5] transition-colors">
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: t.bg }}>
                        <LogIcon size={15} style={{ color: t.color }} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[#2d2d2d]">{t.label}</span>
                          <span className="text-xs text-[#a3a3a3]">→</span>
                          <span className="text-sm font-bold"
                            style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
                            {isPositive ? "+" : ""}{log.delta ?? 0}
                          </span>
                          <span className="text-xs text-[#a3a3a3]">
                            (yeni stok: <strong className="text-[#2d2d2d]">{log.newStock ?? "—"}</strong>)
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-xs text-[#737373] mt-0.5 truncate">{log.note}</p>
                        )}
                        {log.adminEmail && (
                          <p className="text-[11px] text-[#a3a3a3]">{log.adminEmail}</p>
                        )}
                      </div>
                      {/* Date */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-[#525252]">
                          {new Date(log.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[11px] text-[#a3a3a3]">
                          {new Date(log.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Adjustment Form */}
        <div className="sticky top-20 space-y-4">
          <form onSubmit={handleAdjustment} className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}>
                <PlusCircle size={13} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#2d2d2d]">Stok Hareketi Ekle</h3>
            </div>

            {adjSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl px-3 py-2 mb-4 text-xs font-semibold">
                <CheckCircle size={13} /> Stok güncellendi!
              </div>
            )}
            {adjError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl px-3 py-2 mb-4 text-xs">
                <AlertTriangle size={13} /> {adjError}
              </div>
            )}

            {/* Type selector */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#525252] mb-2">Hareket Türü</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "in",         label: "Giriş",      icon: TrendingUp },
                  { value: "out",        label: "Çıkış",      icon: TrendingDown },
                  { value: "adjustment", label: "Düzelt",     icon: RotateCcw },
                ].map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setAdjType(value)}
                    className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: adjType === value ? "linear-gradient(135deg, #b76e79, #c4587a)" : "#f5f0ee",
                      color: adjType === value ? "#fff" : "#525252",
                    }}>
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-3">
              <GBInput
                label={adjType === "adjustment" ? "Yeni Stok Miktarı *" : "Miktar *"}
                type="number"
                min="1"
                value={adjAmount}
                onChange={(e) => { setAdjAmount(e.target.value); setAdjError(""); }}
                placeholder={adjType === "adjustment" ? "Hedef stok adedi" : "Kaç adet?"}
              />
              {adjType === "adjustment" && (
                <p className="text-xs text-[#a3a3a3] mt-1">Mevcut: {product.stock ?? 0} adet</p>
              )}
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#525252] mb-1">Not (opsiyonel)</label>
              <textarea value={adjNote} onChange={(e) => setAdjNote(e.target.value)} rows={2}
                className="w-full rounded-xl border border-[#e5e5e5] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#b76e79] transition-colors"
                placeholder="Tedarikçi adı, fatura no, vs." />
            </div>

            {/* Preview */}
            {adjAmount && parseInt(adjAmount) > 0 && (
              <div className="mb-4 p-3 bg-[#fdf8f5] rounded-xl text-sm">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Mevcut stok</span>
                  <span className="font-bold">{product.stock ?? 0}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[#737373]">Değişim</span>
                  <span className="font-bold" style={{
                    color: adjType === "in" ? "#16a34a" : adjType === "out" ? "#dc2626" : "#2563eb"
                  }}>
                    {adjType === "in" ? `+${adjAmount}` : adjType === "out" ? `-${adjAmount}` : `→ ${adjAmount}`}
                  </span>
                </div>
                <div className="h-px bg-[#f0e8e4] my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-[#2d2d2d]">Yeni stok</span>
                  <span className="text-[#b76e79]">
                    {adjType === "in"
                      ? (product.stock ?? 0) + parseInt(adjAmount)
                      : adjType === "out"
                      ? Math.max(0, (product.stock ?? 0) - parseInt(adjAmount))
                      : parseInt(adjAmount)
                    }
                  </span>
                </div>
              </div>
            )}

            <GBButton type="submit" variant="primary" size="md" fullWidth
              loading={adjSaving} disabled={adjSaving} icon={<Save size={15} />}>
              {adjSaving ? "Kaydediliyor…" : "Hareketi Kaydet"}
            </GBButton>
          </form>

          {/* Quick product info */}
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-4 space-y-2 text-sm">
            <h3 className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-3">Ürün Bilgisi</h3>
            <div className="flex justify-between"><span className="text-[#737373]">Fiyat</span><span className="font-bold">₺{(product.price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-[#737373]">Hacim</span><span className="font-semibold">{product.volume || "—"}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-[#737373]">Durum</span>
              <StatusBadge status={product.active === false ? "inactive" : "active"} />
            </div>
            {product.updatedAt && (
              <div className="flex justify-between">
                <span className="text-[#737373]">Son güncelleme</span>
                <span className="font-semibold text-[11px] text-right">
                  {new Date(product.updatedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
