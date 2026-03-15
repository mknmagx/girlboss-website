"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import StatsCard from "@/lib/components/admin/StatsCard";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import { getProducts, getOrders, getAllUsers } from "@/lib/firebase/firestore";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, orders, users] = await Promise.all([
          getProducts(),
          getOrders(),
          getAllUsers(),
        ]);

        const revenue = orders
          .filter((o) => o.status !== "İptal Edildi")
          .reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
          products: products.length,
          orders: orders.length,
          users: users.length,
          revenue,
        });

        setRecentOrders(orders.slice(0, 5));
        setLowStock(products.filter((p) => (p.stock || 0) < 10));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Dashboard</h1>
        <p className="text-sm text-[#737373] mt-1">Genel bakış ve istatistikler</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Toplam Ürün" value={stats.products} icon={Package} color="#b76e79" />
        <StatsCard title="Toplam Sipariş" value={stats.orders} icon={ShoppingCart} color="#6b3fa0" />
        <StatsCard title="Kullanıcılar" value={stats.users} icon={Users} color="#c4a265" />
        <StatsCard
          title="Toplam Gelir"
          value={`₺${stats.revenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          color="#065F46"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-[#f0e8e4] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2d2d2d]">Son Siparişler</h3>
            <Link href="/admin/siparisler" className="text-[11px] md:text-xs text-[#b76e79] font-semibold hover:underline">
              Tümünü Gör
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#a3a3a3] py-4 text-center">Henüz sipariş yok.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/siparisler/${order.id}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#fdf8f5] transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2d2d]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#a3a3a3]">{order.customerName || order.email || "—"}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-bold text-[#2d2d2d]">
                      ₺{(order.total || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-2xl border border-[#f0e8e4] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 md:p-5">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2 min-w-0">
              <AlertTriangle size={14} className="text-amber-500 shrink-0" />
              <span className="truncate">Düşük Stok</span>
            </h3>
            <Link href="/admin/stok" className="text-[11px] md:text-xs text-[#b76e79] font-semibold hover:underline whitespace-nowrap">
              Yönetim
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-[#a3a3a3] py-4 text-center">Tüm ürünlerin stoku yeterli.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-amber-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ background: product.gradient || "#f0e8e4" }}
                    />
                    <p className="text-sm font-semibold text-[#2d2d2d]">{product.name}</p>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{product.stock || 0} adet</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
