"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserDoc } from "@/lib/firebase/firestore";
import DataTable from "@/lib/components/admin/DataTable";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import AdminModal from "@/lib/components/admin/AdminModal";
import GBButton from "@/lib/components/ui/GBButton";
import GBSelect from "@/lib/components/ui/GBSelect";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "customer", label: "Müşteri" },
  { value: "editor", label: "Editör" },
  { value: "admin", label: "Admin" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("customer");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const load = async () => {
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async () => {
    if (!editUser) return;
    setSaving(true);
    await updateUserDoc(editUser.uid, { role: editRole });
    setSaving(false);
    setEditUser(null);
    load();
  };

  const handleToggleDisable = async (user) => {
    await updateUserDoc(user.uid, { disabled: !user.disabled });
    load();
  };

  const columns = [
    {
      key: "ad",
      label: "Kullanıcı",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}
          >
            {row.ad?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2d2d2d]">{row.ad} {row.soyad}</p>
            <p className="text-[11px] text-[#a3a3a3]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rol",
      width: "100px",
      render: (row) => <StatusBadge status={row.role || "customer"} />,
    },
    {
      key: "disabled",
      label: "Durum",
      width: "100px",
      render: (row) => (
        <span className={`text-xs font-semibold ${row.disabled ? "text-red-500" : "text-green-600"}`}>
          {row.disabled ? "Devre Dışı" : "Aktif"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Kayıt Tarihi",
      sortable: true,
      width: "120px",
      render: (row) => (
        <span className="text-xs text-[#a3a3a3]">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("tr-TR") : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setEditUser(row); setEditRole(row.role || "customer"); }}
            className="text-xs font-semibold text-[#b76e79] hover:underline"
          >
            Rol Değiştir
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleDisable(row); }}
            className={`text-xs font-semibold ${row.disabled ? "text-green-600" : "text-red-500"} hover:underline`}
          >
            {row.disabled ? "Aktifleştir" : "Devre Dışı"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Kullanıcılar</h1>
        <p className="text-sm text-[#737373] mt-1">{users.length} kayıtlı kullanıcı</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          searchKeys={["ad", "soyad", "email"]}
          searchPlaceholder="Kullanıcı ara…"
          pageSize={15}
          onRowClick={(row) => router.push(`/admin/kullanicilar/${row.uid}`)}
        />
      )}

      {/* Role change modal */}
      <AdminModal open={!!editUser} onClose={() => setEditUser(null)} title="Rol Değiştir" maxWidth="24rem">
        <p className="text-sm text-[#525252] mb-4">
          <strong>{editUser?.ad} {editUser?.soyad}</strong> ({editUser?.email})
        </p>
        <GBSelect
          label="Yeni Rol"
          value={editRole}
          onChange={(val) => setEditRole(val)}
          options={ROLE_OPTIONS}
        />
        <div className="flex gap-3 mt-6">
          <GBButton variant="outline" size="sm" fullWidth onClick={() => setEditUser(null)}>İptal</GBButton>
          <GBButton variant="primary" size="sm" fullWidth onClick={handleRoleChange} disabled={saving}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </GBButton>
        </div>
      </AdminModal>
    </div>
  );
}
