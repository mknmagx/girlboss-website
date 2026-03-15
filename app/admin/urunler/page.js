"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProducts, deleteProduct } from "@/lib/firebase/firestore";
import DataTable from "@/lib/components/admin/DataTable";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import AdminModal from "@/lib/components/admin/AdminModal";
import GBButton from "@/lib/components/ui/GBButton";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const load = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteProduct(deleteModal.id);
    setDeleteModal(null);
    load();
  };

  const columns = [
    {
      key: "name",
      label: "Ürün",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: row.gradient || "#f0e8e4" }} />
          <div>
            <p className="font-semibold text-[#2d2d2d] text-sm">{row.name}</p>
            <p className="text-[11px] text-[#a3a3a3]">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Fiyat",
      sortable: true,
      width: "100px",
      render: (row) => <span className="font-bold">₺{(row.price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>,
    },
    {
      key: "stock",
      label: "Stok",
      sortable: true,
      width: "80px",
      render: (row) => (
        <span className={`font-semibold ${(row.stock || 0) < 10 ? "text-amber-600" : "text-[#2d2d2d]"}`}>
          {row.stock || 0}
        </span>
      ),
    },
    {
      key: "active",
      label: "Durum",
      width: "100px",
      render: (row) => <StatusBadge status={row.active !== false ? "Aktif" : "Pasif"} />,
    },
    {
      key: "badge",
      label: "Rozet",
      width: "100px",
      render: (row) => row.badge ? <span className="text-xs text-[#b76e79] font-medium">{row.badge}</span> : <span className="text-xs text-[#a3a3a3]">—</span>,
    },
    {
      key: "actions",
      label: "",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/urunler/${row.id}`}>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#fdf8f5] transition-colors">
              <Edit size={14} className="text-[#737373]" />
            </button>
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteModal(row); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} className="text-[#a3a3a3] hover:text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Ürünler</h1>
          <p className="text-sm text-[#737373] mt-1">{products.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni">
          <GBButton variant="primary" size="sm" icon={<Plus size={15} />}>
            Yeni Ürün
          </GBButton>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKeys={["name", "slug", "badge"]}
          searchPlaceholder="Ürün ara…"
          pageSize={10}
        />
      )}

      {/* Delete confirmation */}
      <AdminModal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Ürünü Sil" maxWidth="24rem">
        <p className="text-sm text-[#525252] mb-4">
          <strong>{deleteModal?.name}</strong> ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex gap-3">
          <GBButton variant="outline" size="sm" fullWidth onClick={() => setDeleteModal(null)}>İptal</GBButton>
          <GBButton variant="danger" size="sm" fullWidth onClick={handleDelete}>Sil</GBButton>
        </div>
      </AdminModal>
    </div>
  );
}
