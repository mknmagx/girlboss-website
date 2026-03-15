"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, MessageSquare, Upload, X, Loader2, ImageOff, GripVertical } from "lucide-react";
import { getProductById, createProduct, updateProduct } from "@/lib/firebase/firestore";
import { uploadProductImage, deleteProductImage } from "@/lib/firebase/storage";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";
import GBSelect from "@/lib/components/ui/GBSelect";
import Link from "next/link";

const BADGE_OPTIONS = [
  { value: "", label: "Rozet Yok" },
  { value: "Bestseller", label: "Bestseller" },
  { value: "Yeni", label: "Yeni" },
  { value: "Premium", label: "Premium" },
  { value: "Favoriler", label: "Favoriler" },
];

const emptyForm = {
  name: "", slug: "", tagline: "", taglineEn: "",
  price: "", originalPrice: "", description: "", descriptionEn: "",
  notesTop: "", notesMid: "", notesBase: "",
  notesTopEn: "", notesMidEn: "", notesBaseEn: "",
  ingredients: "",
  features: "",
  rating: "4.8", reviewCount: "0",
  color: "#b76e79", gradient: "",
  volume: "250ml", badge: "", stock: "100",
  active: true,
};

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "yeni";
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]); // array of URL strings
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  // Stable product ID for storage path (even before Firestore doc is created)
  const [storageId] = useState(() => isNew ? `new-${Date.now()}` : params.id);

  useEffect(() => {
    if (isNew) return;
    getProductById(params.id).then((p) => {
      if (!p) { router.replace("/admin/urunler"); return; }
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        tagline: p.tagline || "",
        taglineEn: p.taglineEn || "",
        price: String(p.price || ""),
        originalPrice: String(p.originalPrice || ""),
        description: p.description || "",
        descriptionEn: p.descriptionEn || "",
        notesTop: p.notes?.top || "",
        notesMid: p.notes?.middle || "",
        notesBase: p.notes?.base || "",
        notesTopEn: p.notesEn?.top || "",
        notesMidEn: p.notesEn?.middle || "",
        notesBaseEn: p.notesEn?.base || "",
        ingredients: p.ingredients || "",
        features: (p.features || []).map((f) => `${f.icon}:${f.text}`).join("\n"),
        rating: String(p.rating ?? 4.8),
        reviewCount: String(p.reviewCount ?? 0),
        color: p.color || "#b76e79",
        gradient: p.gradient || "",
        volume: p.volume || "250ml",
        badge: p.badge || "",
        stock: String(p.stock ?? 100),
        active: p.active !== false,
      });
      setImages(p.images || []);
      setLoading(false);
    });
  }, [isNew, params.id, router]);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) { setUploadError("Yalnızca JPEG, PNG, WebP veya GIF yükleyebilirsiniz."); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError("Dosya boyutu 10 MB'ı geçemez."); return; }
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadProductImage(storageId, file);
      setImages((prev) => [...prev, url]);
    } catch {
      setUploadError("Görsel yüklenirken hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleImageDelete(url) {
    setImages((prev) => prev.filter((u) => u !== url));
    await deleteProductImage(url);
  }

  function moveImage(from, to) {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Ürün adı zorunludur."); return; }
    if (!form.slug.trim()) { setError("Slug zorunludur."); return; }
    if (!form.price || isNaN(Number(form.price))) { setError("Geçerli bir fiyat girin."); return; }

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        tagline: form.tagline.trim(),
        taglineEn: form.taglineEn.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        description: form.description.trim(),
        descriptionEn: form.descriptionEn.trim(),
        notes: { top: form.notesTop, middle: form.notesMid, base: form.notesBase },
        notesEn: { top: form.notesTopEn, middle: form.notesMidEn, base: form.notesBaseEn },
        ingredients: form.ingredients.trim() || null,
        features: form.features
          .split("\n")
          .map((line) => {
            const [icon, ...rest] = line.trim().split(":");
            return { icon: icon.trim(), text: rest.join(":").trim() };
          })
          .filter((f) => f.icon && f.text),
        rating: Number(form.rating) || 0,
        reviewCount: Number(form.reviewCount) || 0,
        color: form.color,
        gradient: form.gradient,
        volume: form.volume,
        badge: form.badge || null,
        stock: Number(form.stock) || 0,
        images: images,
        active: form.active,
      };

      if (isNew) {
        await createProduct(data);
      } else {
        await updateProduct(params.id, data);
      }
      router.push("/admin/urunler");
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/urunler">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">
            {isNew ? "Yeni Ürün" : "Ürün Düzenle"}
          </h1>
          {!isNew && <p className="text-xs text-[#a3a3a3] mt-0.5">{params.id}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Temel Bilgiler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Ürün Adı" value={form.name} onChange={set("name")} placeholder="Velvet Rose" />
            <GBInput label="Slug" value={form.slug} onChange={set("slug")} placeholder="velvet-rose" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Slogan (TR)" value={form.tagline} onChange={set("tagline")} placeholder="Kadifemsi Zarafet" />
            <GBInput label="Slogan (EN)" value={form.taglineEn} onChange={set("taglineEn")} placeholder="Velvety Elegance" />
          </div>
          <GBTextarea label="Açıklama (TR)" value={form.description} onChange={set("description")} rows={3} />
          <GBTextarea label="Açıklama (EN)" value={form.descriptionEn} onChange={set("descriptionEn")} rows={3} />
          <GBTextarea
            label="İçindekiler (INCI)"
            value={form.ingredients}
            onChange={set("ingredients")}
            rows={2}
            placeholder="AQUA, PEG-40 HYDROGENATED CASTOR OIL, PARFUM, ..."
          />
        </section>

        {/* Notes */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Koku Notaları</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBInput label="Üst Nota (TR)" value={form.notesTop} onChange={set("notesTop")} />
            <GBInput label="Orta Nota (TR)" value={form.notesMid} onChange={set("notesMid")} />
            <GBInput label="Alt Nota (TR)" value={form.notesBase} onChange={set("notesBase")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBInput label="Üst Nota (EN)" value={form.notesTopEn} onChange={set("notesTopEn")} />
            <GBInput label="Orta Nota (EN)" value={form.notesMidEn} onChange={set("notesMidEn")} />
            <GBInput label="Alt Nota (EN)" value={form.notesBaseEn} onChange={set("notesBaseEn")} />
          </div>
        </section>

        {/* Pricing & stock */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Fiyat & Stok</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBInput label="Fiyat (₺)" type="number" value={form.price} onChange={set("price")} placeholder="449.90" />
            <GBInput label="Eski Fiyat (₺)" type="number" value={form.originalPrice} onChange={set("originalPrice")} placeholder="539.90" />
            <GBInput label="Hacim" value={form.volume} onChange={set("volume")} placeholder="250ml" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBInput label="Stok" type="number" value={form.stock} onChange={set("stock")} placeholder="100" />
            <GBInput label="Ortalama Puan" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set("rating")} placeholder="4.8" />
            <GBInput label="Değerlendirme Sayısı" type="number" value={form.reviewCount} onChange={set("reviewCount")} placeholder="0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBSelect
              label="Rozet"
              value={form.badge}
              onChange={set("badge")}
              options={BADGE_OPTIONS}
            />
            <GBInput label="Renk" type="color" value={form.color} onChange={set("color")} />
            <GBInput label="Gradient CSS" value={form.gradient} onChange={set("gradient")} placeholder="linear-gradient(135deg, ...)" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4"
              style={{ accentColor: "#b76e79" }}
            />
            <span className="text-sm text-[#525252]">Aktif (sitede görünür)</span>
          </label>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Özellikler & Görseller</h3>
          <GBTextarea
            label="Ürün Özellikleri (her satıra bir özellik — format: ikon:metin)"
            value={form.features}
            onChange={set("features")}
            rows={3}
            placeholder={"leaf:%100 Vegan\nclock:12s Kalıcılık\nshield:Dermatolog Onaylı"}
          />

          {/* Image upload */}
          <div>
            <p className="text-xs font-semibold text-[#525252] mb-3">
              Ürün Görselleri
              <span className="text-[#a3a3a3] font-normal ml-1">({images.length} görsel • ilk görsel ana resim olarak kullanılır)</span>
            </p>

            {/* Existing image thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {images.map((url, idx) => (
                  <div key={url} className="relative group rounded-xl overflow-hidden border border-[#f0e8e4] aspect-square bg-[#fdf8f5]">
                    <img src={url} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
                    {/* Order badge */}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    {/* Controls overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx > 0 && (
                        <button type="button" onClick={() => moveImage(idx, idx - 1)}
                          className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-[#2d2d2d] flex items-center justify-center text-xs font-bold transition-colors"
                          title="Sola taşı">←</button>
                      )}
                      <button type="button" onClick={() => handleImageDelete(url)}
                        className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                        title="Sil">
                        <X size={13} />
                      </button>
                      {idx < images.length - 1 && (
                        <button type="button" onClick={() => moveImage(idx, idx + 1)}
                          className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-[#2d2d2d] flex items-center justify-center text-xs font-bold transition-colors"
                          title="Sağa taşı">→</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden" onChange={handleImageUpload} />
            <button type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#f0e8e4] hover:border-[#b76e79] text-sm text-[#737373] hover:text-[#b76e79] transition-all w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? (
                <><Loader2 size={15} className="animate-spin" /> Yükleniyor…</>
              ) : (
                <><Upload size={15} /> Görsel Yükle (JPEG, PNG, WebP)</>
              )}
            </button>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>
            )}
            {images.length === 0 && !uploading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-[#a3a3a3]">
                <ImageOff size={13} /> Henüz görsel eklenmedi. Görsel yükle veya sürükle bırak.
              </div>
            )}
          </div>
        </section>

        {/* Reviews management */}
        {!isNew && (
          <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2d2d2d]">Değerlendirmeler</h3>
                <p className="text-xs text-[#a3a3a3] mt-0.5">Ürüne ait müşteri değerlendirmelerini yönet</p>
              </div>
              <Link href={`/admin/urunler/${params.id}/degerlendirmeler`}>
                <GBButton variant="outline" size="sm" icon={<MessageSquare size={14} />}>Yönet</GBButton>
              </Link>
            </div>
          </section>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/urunler" className="flex-1">
            <GBButton variant="outline" size="md" fullWidth>İptal</GBButton>
          </Link>
          <div className="flex-1">
            <GBButton type="submit" variant="primary" size="md" fullWidth icon={<Save size={15} />} disabled={saving}>
              {saving ? "Kaydediliyor…" : isNew ? "Ürün Oluştur" : "Değişiklikleri Kaydet"}
            </GBButton>
          </div>
        </div>
      </form>
    </div>
  );
}
