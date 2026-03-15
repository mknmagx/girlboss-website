"use client";

import { useEffect, useState, useMemo } from "react";
import { getOrders, deleteOrder } from "@/lib/firebase/firestore";
import DataTable from "@/lib/components/admin/DataTable";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import StatsCard from "@/lib/components/admin/StatsCard";
import { useRouter } from "next/navigation";
import {
  Trash2, ShoppingBag, TrendingUp, Clock, CheckCircle2,
  XCircle, Package, RotateCcw, Truck,
} from "lucide-react";

const STATUS_FILTERS = [
  "Tümü", "Beklemede", "Onaylandı", "Hazırlanıyor",
  "Kargoda", "Teslim Edildi", "İptal Edildi",
  "İade Talep Edildi", "İade Onaylandı",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setConfirmDeleteId(null);
    setDeletingId(null);
  };

  // ── Analitik hesaplamalar ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active   = ["Beklemede", "Onaylandı", "Hazırlanıyor", "Kargoda"];
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalRevenue   = orders.filter((o) => o.status === "Teslim Edildi").reduce((s, o) => s + (o.total || 0), 0);
    const activeCount    = orders.filter((o) => active.includes(o.status)).length;
    const pendingCount   = orders.filter((o) => o.status === "Beklemede").length;
    const deliveredCount = orders.filter((o) => o.status === "Teslim Edildi").length;
    const cancelledCount = orders.filter((o) => o.status === "İptal Edildi").length;
    const refundCount    = orders.filter((o) => ["İade Talep Edildi", "İade Onaylandı"].includes(o.status)).length;
    const monthRevenue   = orders
      .filter((o) => o.status === "Teslim Edildi" && o.createdAt && new Date(o.createdAt) >= thisMonth)
      .reduce((s, o) => s + (o.total || 0), 0);
    const todayOrders    = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= today).length;

    return { totalRevenue, activeCount, pendingCount, deliveredCount, cancelledCount, refundCount, monthRevenue, todayOrders };
  }, [orders]);

  const statusCount = useMemo(() => {
    const map = {};
    for (const o of orders) map[o.status] = (map[o.status] || 0) + 1;
    return map;
  }, [orders]);

  const filtered = statusFilter === "Tümü" ? orders : orders.filter((o) => o.status === statusFilter);

  const columns = [
    {
      key: "id",
      label: "Sipariş No",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[#b76e79]">
          #{row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "Müşteri",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-[#2d2d2d]">{row.customerName || "—"}</p>
          <p className="text-[11px] text-[#a3a3a3]">{row.email || ""}</p>
        </div>
      ),
    },
    {
      key: "total",
      label: "Tutar",
      sortable: true,
      width: "120px",
      render: (row) => (
        <span className="font-bold text-[#2d2d2d]">
          ₺{(row.total || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "items",
      label: "Ürün",
      width: "65px",
      render: (row) => (
        <span className="text-sm text-[#525252]">{(row.items || []).length} adet</span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      width: "145px",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "paymentMethod",
      label: "Ödeme",
      width: "110px",
      render: (row) => {
        const labels = { creditCard: "Kart", transfer: "Havale", cod: "Kapıda" };
        return (
          <span className="text-xs text-[#737373]">{labels[row.paymentMethod] || row.paymentMethod || "—"}</span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Tarih",
      sortable: true,
      width: "115px",
      render: (row) => (
        <div>
          <p className="text-xs text-[#525252] font-medium">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString("tr-TR") : "—"}
          </p>
          <p className="text-[10px] text-[#a3a3a3]">
            {row.createdAt ? new Date(row.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}
          </p>
        </div>
      ),
    },
    {
      key: "_delete",
      label: "",
      width: "80px",
      render: (row) =>
        confirmDeleteId === row.id ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => handleDelete(e, row.id)}
              disabled={deletingId === row.id}
              className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {deletingId === row.id ? "…" : "Sil"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
              className="text-[11px] text-[#737373] hover:text-[#2d2d2d] transition-colors"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(row.id); }}
            className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Siparişi sil"
          >
            <Trash2 size={14} />
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── BAŞLIK ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Siparişler</h1>
          <p className="text-sm text-[#737373] mt-0.5">
            {orders.length} toplam · bugün {stats.todayOrders} yeni
          </p>
        </div>
      </div>

      {/* ── ANALİTİK KARTLAR ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-[#fdf8f5] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <StatsCard
            title="Toplam Ciro"
            value={`₺${stats.totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}`}
            subtitle="Teslim edilen siparişler"
            icon={TrendingUp}
            color="#16a34a"
          />
          <StatsCard
            title="Bu Ay Ciro"
            value={`₺${stats.monthRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}`}
            subtitle={new Date().toLocaleString("tr-TR", { month: "long", year: "numeric" })}
            icon={ShoppingBag}
            color="#b76e79"
          />
          <StatsCard
            title="Aktif Sipariş"
            value={stats.activeCount}
            subtitle="Beklemede + işlemde"
            icon={Package}
            color="#9333ea"
          />
          <StatsCard
            title="Beklemede"
            value={stats.pendingCount}
            subtitle="Onay bekliyor"
            icon={Clock}
            color="#c4a265"
          />
          <StatsCard
            title="Teslim Edildi"
            value={stats.deliveredCount}
            subtitle="Tamamlanan siparişler"
            icon={CheckCircle2}
            color="#2563eb"
          />
          <StatsCard
            title="İptal / İade"
            value={stats.cancelledCount + stats.refundCount}
            subtitle={`${stats.cancelledCount} iptal · ${stats.refundCount} iade`}
            icon={XCircle}
            color="#ef4444"
          />
        </div>
      )}

      {/* ── FİLTRE PILL'LERİ ── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const count = s === "Tümü" ? orders.length : (statusCount[s] || 0);
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-[#b76e79] text-white"
                  : "bg-white text-[#737373] border border-[#f0e8e4] hover:bg-[#fdf8f5]"
              }`}
            >
              {s}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0 rounded-full ${
                  statusFilter === s ? "bg-white/25 text-white" : "bg-[#f0e8e4] text-[#737373]"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TABLO ── */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchKeys={["customerName", "email", "id"]}
          searchPlaceholder="Sipariş ara… (ad, e-posta, ID)"
          pageSize={15}
          onRowClick={(row) => router.push(`/admin/siparisler/${row.id}`)}
        />
      )}
    </div>
  );
}
