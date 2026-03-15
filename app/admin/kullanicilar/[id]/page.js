"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, ShoppingCart, Calendar } from "lucide-react";
import { getUserDoc, updateUserDoc, getOrdersByUser } from "@/lib/firebase/firestore";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import GBButton from "@/lib/components/ui/GBButton";
import GBSelect from "@/lib/components/ui/GBSelect";
import Link from "next/link";

const ROLE_OPTIONS = [
  { value: "customer", label: "Müşteri" },
  { value: "editor", label: "Editör" },
  { value: "admin", label: "Admin" },
];

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("customer");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getUserDoc(id), getOrdersByUser(id)]).then(([u, o]) => {
      if (!u) { router.replace("/admin/kullanicilar"); return; }
      setUser(u);
      setRole(u.role || "customer");
      setOrders(o);
      setLoading(false);
    });
  }, [id, router]);

  const handleSaveRole = async () => {
    setSaving(true);
    await updateUserDoc(id, { role });
    setUser((prev) => ({ ...prev, role }));
    setSaving(false);
  };

  const handleToggleDisable = async () => {
    const newVal = !user.disabled;
    await updateUserDoc(id, { disabled: newVal });
    setUser((prev) => ({ ...prev, disabled: newVal }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const totalSpent = orders
    .filter((o) => o.status !== "İptal Edildi")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/kullanicilar">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">{user.ad} {user.soyad}</h1>
          <p className="text-xs text-[#a3a3a3] mt-0.5">{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User info */}
        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Kullanıcı Bilgileri</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-[#b76e79]" />
              <span>{user.ad} {user.soyad}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-[#b76e79]" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-[#b76e79]" />
              <span>{user.telefon || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-[#b76e79]" />
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "—"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f0e8e4] space-y-3">
            <GBSelect label="Rol" value={role} onChange={(val) => setRole(val)} options={ROLE_OPTIONS} />
            <GBButton variant="primary" size="sm" fullWidth onClick={handleSaveRole} disabled={saving}>
              {saving ? "Kaydediliyor…" : "Rolü Güncelle"}
            </GBButton>
            <GBButton
              variant={user.disabled ? "primary" : "danger"}
              size="sm"
              fullWidth
              onClick={handleToggleDisable}
            >
              {user.disabled ? "Hesabı Aktifleştir" : "Hesabı Devre Dışı Bırak"}
            </GBButton>
          </div>
        </div>

        {/* Order history */}
        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
          <h3 className="text-sm font-bold text-[#2d2d2d] mb-3 flex items-center gap-2">
            <ShoppingCart size={14} className="text-[#b76e79]" />
            Sipariş Geçmişi ({orders.length})
          </h3>
          <p className="text-xs text-[#a3a3a3] mb-4">
            Toplam harcama: <strong className="text-[#2d2d2d]">₺{totalSpent.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</strong>
          </p>
          {orders.length === 0 ? (
            <p className="text-sm text-[#a3a3a3] py-4 text-center">Sipariş yok.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/siparisler/${o.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#fdf8f5] transition-colors"
                >
                  <div>
                    <p className="text-xs font-mono font-semibold text-[#b76e79]">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-[11px] text-[#a3a3a3]">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("tr-TR") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">₺{(o.total || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
