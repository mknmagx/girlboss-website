"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Star,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  getProductById,
  getProductReviews,
  deleteProductReview,
  updateProductReview,
} from "@/lib/firebase/firestore";
import GBButton from "@/lib/components/ui/GBButton";

export default function AdminProductReviewsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    async function load() {
      const p = await getProductById(id);
      if (!p) { router.replace("/admin/urunler"); return; }
      setProduct(p);
      setReviews(await getProductReviews(id));
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function handleToggleApproved(review) {
    setBusyId(review.id);
    await updateProductReview(id, review.id, { approved: !review.approved });
    setReviews((prev) =>
      prev.map((r) => r.id === review.id ? { ...r, approved: !r.approved } : r)
    );
    setBusyId(null);
  }

  async function handleDelete(reviewId) {
    if (!confirm("Bu değerlendirme silinecek. Emin misiniz?")) return;
    setBusyId(reviewId);
    await deleteProductReview(id, reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setBusyId(null);
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 size={28} className="animate-spin text-[#b76e79]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/admin/urunler/${id}`}>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Değerlendirmeler</h1>
          <p className="text-xs text-[#a3a3a3] mt-0.5 truncate">{product?.name}</p>
        </div>
        <Link href={`/admin/urunler/${id}/degerlendirmeler/yeni`}>
          <GBButton variant="primary" size="sm" icon={<Plus size={14} />}>Ekle</GBButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Toplam", value: reviews.length },
          { label: "Ortalama Puan", value: avgRating },
          { label: "Onaylı", value: reviews.filter((r) => r.approved !== false).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#f0e8e4] p-4 text-center">
            <div className="text-2xl font-extrabold text-[#2d2d2d]">{s.value}</div>
            <div className="text-xs text-[#a3a3a3] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#f0e8e4] p-10 text-center text-[#a3a3a3] text-sm">
          Henüz değerlendirme yok.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border p-4 flex gap-4 items-start transition-opacity ${
                r.approved === false ? "opacity-60 border-[#f0e8e4]" : "border-[#f0e8e4]"
              }`}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#b76e79] to-[#d4a0a7] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {r.avatar || (r.name?.[0] ?? "?")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#2d2d2d]">{r.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={s <= r.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[#e5e7eb] fill-[#e5e7eb]"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#a3a3a3]">{r.date}</span>
                  {r.approved === false && (
                    <span className="text-[10px] bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded-full font-medium">Gizli</span>
                  )}
                </div>
                {r.title && (
                  <p className="text-xs font-medium text-[#525252] mt-1">{r.title}</p>
                )}
                <p className="text-xs text-[#737373] mt-0.5 line-clamp-2">{r.body}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleToggleApproved(r)}
                  disabled={busyId === r.id}
                  title={r.approved === false ? "Onayla" : "Gizle"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#f0e8e4] hover:bg-[#fdf8f5] transition-colors disabled:opacity-40"
                >
                  {busyId === r.id ? (
                    <Loader2 size={13} className="animate-spin text-[#b76e79]" />
                  ) : r.approved === false ? (
                    <Eye size={13} className="text-[#737373]" />
                  ) : (
                    <EyeOff size={13} className="text-[#737373]" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={busyId === r.id}
                  title="Sil"
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#f0e8e4] hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
