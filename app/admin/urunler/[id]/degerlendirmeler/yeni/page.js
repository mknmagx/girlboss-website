"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Save } from "lucide-react";
import { createProductReview } from "@/lib/firebase/firestore";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function todayTR() {
  const d = new Date();
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

const emptyForm = {
  name: "",
  rating: 5,
  title: "",
  body: "",
  helpful: "0",
  images: "",
  approved: true,
};

export default function AdminAddReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Ad zorunludur."); return; }
    if (!form.body.trim()) { setError("Değerlendirme metni zorunludur."); return; }

    setSaving(true);
    try {
      await createProductReview(id, {
        name: form.name.trim(),
        avatar: form.name.trim()[0].toUpperCase(),
        rating: Number(form.rating),
        title: form.title.trim() || null,
        body: form.body.trim(),
        date: todayTR(),
        helpful: Number(form.helpful) || 0,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        approved: form.approved,
      });
      router.push(`/admin/urunler/${id}/degerlendirmeler`);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/admin/urunler/${id}/degerlendirmeler`}>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Değerlendirme Ekle</h1>
          <p className="text-xs text-[#a3a3a3] mt-0.5">Manuel müşteri değerlendirmesi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Değerlendirme Bilgileri</h3>

          <GBInput label="Müşteri Adı" value={form.name} onChange={set("name")} placeholder="Ayşe K." />

          {/* Star rating picker */}
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-1.5">Puan</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, rating: s })}
                  className="p-1 rounded transition-transform active:scale-90"
                >
                  <Star
                    size={26}
                    className={
                      s <= form.rating
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "fill-[#e5e7eb] text-[#e5e7eb]"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <GBInput label="Başlık (isteğe bağlı)" value={form.title} onChange={set("title")} placeholder="Harika bir ürün!" />
          <GBTextarea label="Değerlendirme Metni" value={form.body} onChange={set("body")} rows={4} placeholder="Ürün hakkındaki detaylı görüşünüzü yazın…" />

          <div className="grid grid-cols-2 gap-4">
            <GBInput label="Faydalı oyu" type="number" min="0" value={form.helpful} onChange={set("helpful")} placeholder="0" />
          </div>

          <GBTextarea
            label="Görsel URL'leri (her satıra bir URL, isteğe bağlı)"
            value={form.images}
            onChange={set("images")}
            rows={2}
            placeholder={"/products/review1.jpg\n/products/review2.jpg"}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.approved}
              onChange={(e) => setForm({ ...form, approved: e.target.checked })}
              className="w-4 h-4"
              style={{ accentColor: "#b76e79" }}
            />
            <span className="text-sm text-[#525252]">Onaylı (sitede görünür)</span>
          </label>
        </section>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
        )}

        <div className="flex gap-3">
          <Link href={`/admin/urunler/${id}/degerlendirmeler`} className="flex-1">
            <GBButton variant="outline" size="md" fullWidth>İptal</GBButton>
          </Link>
          <div className="flex-1">
            <GBButton type="submit" variant="primary" size="md" fullWidth icon={<Save size={15} />} disabled={saving}>
              {saving ? "Kaydediliyor…" : "Değerlendirme Ekle"}
            </GBButton>
          </div>
        </div>
      </form>
    </div>
  );
}
