"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { getBlogPosts, deleteBlogPost } from "@/lib/firebase/firestore";
import DataTable from "@/lib/components/admin/DataTable";
import StatusBadge from "@/lib/components/admin/StatusBadge";
import AdminModal from "@/lib/components/admin/AdminModal";
import GBButton from "@/lib/components/ui/GBButton";
import Link from "next/link";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const load = async () => {
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteBlogPost(deleteModal.id);
    setDeleteModal(null);
    load();
  };

  const columns = [
    {
      key: "title",
      label: "Başlık",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#2d2d2d] text-sm">{row.title}</p>
          <p className="text-[11px] text-[#a3a3a3]">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "author",
      label: "Yazar",
      width: "120px",
      render: (row) => <span className="text-sm text-[#525252]">{row.author || "—"}</span>,
    },
    {
      key: "status",
      label: "Durum",
      width: "100px",
      render: (row) => <StatusBadge status={row.published ? "Yayında" : "Taslak"} />,
    },
    {
      key: "createdAt",
      label: "Tarih",
      sortable: true,
      width: "110px",
      render: (row) => (
        <span className="text-xs text-[#a3a3a3]">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("tr-TR") : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/blog/${row.id}`}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Blog</h1>
          <p className="text-sm text-[#737373] mt-1">{posts.length} yazı</p>
        </div>
        <Link href="/admin/blog/yeni">
          <GBButton variant="primary" size="sm" icon={<Plus size={15} />}>
            Yeni Yazı
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
          data={posts}
          searchKeys={["title", "slug", "author"]}
          searchPlaceholder="Yazı ara…"
          pageSize={10}
        />
      )}

      <AdminModal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Yazıyı Sil" maxWidth="24rem">
        <p className="text-sm text-[#525252] mb-4">
          <strong>{deleteModal?.title}</strong> yazısını silmek istediğinize emin misiniz?
        </p>
        <div className="flex gap-3">
          <GBButton variant="outline" size="sm" fullWidth onClick={() => setDeleteModal(null)}>İptal</GBButton>
          <GBButton variant="danger" size="sm" fullWidth onClick={handleDelete}>Sil</GBButton>
        </div>
      </AdminModal>
    </div>
  );
}
