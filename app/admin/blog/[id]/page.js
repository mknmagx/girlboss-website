"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, ImagePlus, X, Loader2 } from "lucide-react";
import { getBlogPosts, createBlogPost, updateBlogPost } from "@/lib/firebase/firestore";
import { uploadBlogImage, deleteBlogImage } from "@/lib/firebase/storage";
import { useAuth } from "@/lib/hooks/useAuth";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";
import GBSelect from "@/lib/components/ui/GBSelect";
import Link from "next/link";

const CATEGORIES = [
  { value: "İpuçları", label: "İpuçları" },
  { value: "Güzellik İpuçları", label: "Güzellik İpuçları" },
  { value: "Trendler", label: "Trendler" },
  { value: "Sürdürülebilirlik", label: "Sürdürülebilirlik" },
  { value: "Rehber", label: "Rehber" },
  { value: "Hakkımızda", label: "Hakkımızda" },
];

const BLOCK_TYPES = [
  { value: "intro", label: "Giriş (Intro)" },
  { value: "heading", label: "Başlık (Heading)" },
  { value: "paragraph", label: "Paragraf" },
  { value: "tip", label: "İpucu (Tip)" },
];

const COVER_EMOJIS = ["🌸", "✨", "🌿", "🔥", "💎", "🧴", "🌺", "💐", "🌙", "☀️", "🍃", "💫", "🦋", "🎀", "💝"];

const GRADIENTS = [
  { value: "linear-gradient(135deg, #b76e79, #e890a8)", label: "Rose" },
  { value: "linear-gradient(135deg, #c97432, #e8960a)", label: "Amber" },
  { value: "linear-gradient(135deg, #3d7a5c, #6bb88a)", label: "Yeşil" },
  { value: "linear-gradient(135deg, #5b3fa0, #8b6fd4)", label: "Mor" },
  { value: "linear-gradient(135deg, #e0407b, #f472b6)", label: "Pembe" },
  { value: "linear-gradient(135deg, #2563eb, #60a5fa)", label: "Mavi" },
  { value: "linear-gradient(135deg, #0891b2, #67e8f9)", label: "Cyan" },
  { value: "linear-gradient(135deg, #b76e79, #c97432)", label: "Rose-Amber" },
];

const emptyBlock = () => ({ type: "paragraph", text: "", title: "" });

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: [{ type: "intro", text: "", title: "" }],
  coverImage: "",
  author: "",
  published: false,
  tags: "",
  category: "İpuçları",
  gradient: "linear-gradient(135deg, #b76e79, #e890a8)",
  coverEmoji: "🌸",
  readTime: "5 dk",
  date: new Date().toISOString().split("T")[0],
  metaTitle: "",
  metaDescription: "",
  keywords: "",
};

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = params.id === "yeni";
  const [form, setForm] = useState({ ...emptyForm, author: user?.ad || "GIRLBOSS" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getBlogPosts().then((posts) => {
      const post = posts.find((p) => p.id === params.id);
      if (!post) { router.replace("/admin/blog"); return; }

      // Handle content: could be array of blocks or plain string
      let contentBlocks;
      if (Array.isArray(post.content)) {
        contentBlocks = post.content;
      } else if (typeof post.content === "string" && post.content.trim()) {
        contentBlocks = [{ type: "paragraph", text: post.content, title: "" }];
      } else {
        contentBlocks = [{ type: "intro", text: "", title: "" }];
      }

      setForm({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: contentBlocks,
        coverImage: post.coverImage || "",
        author: post.author || "",
        published: post.published || false,
        tags: (post.tags || []).join(", "),
        category: post.category || "İpuçları",
        gradient: post.gradient || "linear-gradient(135deg, #b76e79, #e890a8)",
        coverEmoji: post.coverEmoji || "🌸",
        readTime: post.readTime || "5 dk",
        date: post.date || new Date().toISOString().split("T")[0],
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        keywords: (post.keywords || []).join(", "),
      });
      setLoading(false);
    });
  }, [isNew, params.id, router]);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  // Cover image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) { setError("Görsel boyutu 5MB'den küçük olmalıdır."); return; }
    if (!file.type.startsWith("image/")) { setError("Lütfen geçerli bir görsel dosyası seçin."); return; }
    setUploading(true);
    setError("");
    try {
      const slug = form.slug.trim() || "temp-" + Date.now();
      const url = await uploadBlogImage(slug, file);
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch {
      setError("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = async () => {
    if (form.coverImage) {
      await deleteBlogImage(form.coverImage);
      setForm((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setForm({ ...form, slug });
  };

  // Content block operations
  const updateBlock = (index, field, value) => {
    const newContent = [...form.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setForm({ ...form, content: newContent });
  };

  const addBlock = (afterIndex) => {
    const newContent = [...form.content];
    newContent.splice(afterIndex + 1, 0, emptyBlock());
    setForm({ ...form, content: newContent });
  };

  const removeBlock = (index) => {
    if (form.content.length <= 1) return;
    const newContent = form.content.filter((_, i) => i !== index);
    setForm({ ...form, content: newContent });
  };

  const moveBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= form.content.length) return;
    const newContent = [...form.content];
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    setForm({ ...form, content: newContent });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) { setError("Başlık zorunludur."); return; }
    if (!form.slug.trim()) { setError("Slug zorunludur."); return; }

    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.map((b) => ({
          type: b.type,
          text: b.text.trim(),
          ...(b.title?.trim() ? { title: b.title.trim() } : {}),
        })),
        coverImage: form.coverImage.trim(),
        author: form.author.trim(),
        published: form.published,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        category: form.category,
        gradient: form.gradient,
        coverEmoji: form.coverEmoji,
        readTime: form.readTime.trim(),
        date: form.date,
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      };

      if (isNew) {
        await createBlogPost(data);
      } else {
        await updateBlogPost(params.id, data);
      }
      router.push("/admin/blog");
    } catch {
      setError("Bir hata oluştu.");
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
        <Link href="/admin/blog">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#fdf8f5] border border-[#f0e8e4] transition-colors">
            <ArrowLeft size={16} className="text-[#737373]" />
          </button>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#2d2d2d]">
          {isNew ? "Yeni Blog Yazısı" : "Yazıyı Düzenle"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Temel Bilgiler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Başlık" value={form.title} onChange={set("title")} placeholder="Blog yazısı başlığı" />
            <div className="space-y-1">
              <GBInput label="Slug" value={form.slug} onChange={set("slug")} placeholder="blog-yazisi-slug" />
              <button type="button" onClick={generateSlug} className="text-[11px] text-[#b76e79] font-semibold hover:underline">
                Başlıktan oluştur
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GBInput label="Yazar" value={form.author} onChange={set("author")} />
            <GBSelect label="Kategori" options={CATEGORIES} value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <GBInput label="Tarih" value={form.date} onChange={set("date")} placeholder="2025-01-15" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Okuma Süresi" value={form.readTime} onChange={set("readTime")} placeholder="5 dk" />
            <GBInput label="Etiketler (virgülle)" value={form.tags} onChange={set("tags")} placeholder="koku, body mist, bakım" />
          </div>
          <GBTextarea label="Özet" value={form.excerpt} onChange={set("excerpt")} rows={2} />

          {/* Cover Image Upload */}
          <div>
            <p className="text-xs font-semibold text-[#525252] mb-2">Kapak Görseli</p>
            {form.coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[#f0e8e4]" style={{ maxWidth: "24rem" }}>
                <img
                  src={form.coverImage}
                  alt="Kapak görseli"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-2 h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploading ? "border-[#b76e79] bg-[#fdf8f5]" : "border-[#f0e8e4] hover:border-[#b76e79] hover:bg-[#fdf8f5]/50"
                }`}
                style={{ maxWidth: "24rem" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 size={22} className="text-[#b76e79] animate-spin" />
                    <span className="text-xs text-[#b76e79] font-semibold">Yükleniyor…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={22} className="text-[#a3a3a3]" />
                    <span className="text-xs text-[#a3a3a3] font-semibold">Görsel seç veya sürükle</span>
                    <span className="text-[10px] text-[#c4c4c4]">PNG, JPG, WebP — max 5MB</span>
                  </>
                )}
              </label>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4"
              style={{ accentColor: "#b76e79" }}
            />
            <span className="text-sm text-[#525252]">Yayınla (hemen yayına alır)</span>
          </label>
        </section>

        {/* Style / Visual */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">Görsel Ayarlar</h3>

          {/* Gradient */}
          <div>
            <p className="text-xs font-semibold text-[#525252] mb-2">Kapak Gradient</p>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, gradient: g.value })}
                  className="transition-all"
                  style={{
                    width: "3rem",
                    height: "2rem",
                    borderRadius: "0.5rem",
                    background: g.value,
                    border: form.gradient === g.value ? "3px solid #2d2d2d" : "2px solid #f0e8e4",
                    cursor: "pointer",
                  }}
                  title={g.label}
                />
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div>
            <p className="text-xs font-semibold text-[#525252] mb-2">Kapak Emoji</p>
            <div className="flex flex-wrap gap-2">
              {COVER_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm({ ...form, coverEmoji: emoji })}
                  className="transition-all"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.5rem",
                    background: form.coverEmoji === emoji ? "#fdf2f4" : "#fff",
                    border: form.coverEmoji === emoji ? "2px solid #b76e79" : "1px solid #f0e8e4",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold text-[#525252] mb-2">Önizleme</p>
            <div
              style={{
                height: "6rem",
                borderRadius: "0.75rem",
                background: form.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                opacity: 0.6,
              }}
            >
              {form.coverEmoji}
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">SEO</h3>
          <GBInput label="Meta Başlık" value={form.metaTitle} onChange={set("metaTitle")} placeholder="Sayfa başlığı (opsiyonel, boşsa title kullanılır)" />
          <GBTextarea label="Meta Açıklama" value={form.metaDescription} onChange={set("metaDescription")} rows={2} placeholder="Arama motoru açıklaması (opsiyonel)" />
          <GBInput label="Anahtar Kelimeler (virgülle)" value={form.keywords} onChange={set("keywords")} placeholder="body mist, koku, bakım" />
        </section>

        {/* Structured Content */}
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2d2d2d]">İçerik Blokları</h3>
            <span className="text-[11px] text-[#a3a3a3]">{form.content.length} blok</span>
          </div>

          <div className="space-y-3">
            {form.content.map((block, index) => (
              <div
                key={index}
                className="border border-[#f0e8e4] rounded-xl p-4 space-y-3 bg-[#fdf8f5]/50"
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-[#a3a3a3] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#a3a3a3] mr-2">#{index + 1}</span>
                  <div className="flex-1">
                    <GBSelect
                      options={BLOCK_TYPES}
                      value={block.type}
                      onChange={(v) => updateBlock(index, "type", v)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBlock(index, -1)}
                      disabled={index === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white border border-[#f0e8e4] transition-colors disabled:opacity-30"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(index, 1)}
                      disabled={index === form.content.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white border border-[#f0e8e4] transition-colors disabled:opacity-30"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      disabled={form.content.length <= 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 border border-[#f0e8e4] transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {block.type === "tip" && (
                  <GBInput
                    label="İpucu Başlığı"
                    value={block.title || ""}
                    onChange={(e) => updateBlock(index, "title", e.target.value)}
                    placeholder="GIRLBOSS İpucu"
                  />
                )}

                <GBTextarea
                  label={block.type === "heading" ? "Başlık Metni" : "İçerik"}
                  value={block.text}
                  onChange={(e) => updateBlock(index, "text", e.target.value)}
                  rows={block.type === "heading" ? 1 : block.type === "intro" ? 3 : 4}
                  placeholder={
                    block.type === "intro" ? "Giriş paragrafı…" :
                    block.type === "heading" ? "Alt başlık…" :
                    block.type === "tip" ? "İpucu içeriği…" :
                    "Paragraf metni…"
                  }
                />

                <button
                  type="button"
                  onClick={() => addBlock(index)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b76e79] hover:underline"
                >
                  <Plus size={12} /> Altına blok ekle
                </button>
              </div>
            ))}
          </div>

          {form.content.length === 0 && (
            <button
              type="button"
              onClick={() => setForm({ ...form, content: [emptyBlock()] })}
              className="w-full py-3 border-2 border-dashed border-[#f0e8e4] rounded-xl text-sm text-[#a3a3a3] hover:border-[#b76e79] hover:text-[#b76e79] transition-colors"
            >
              <Plus size={14} className="inline mr-1" /> İlk blok ekle
            </button>
          )}
        </section>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
        )}

        <div className="flex gap-3">
          <Link href="/admin/blog" className="flex-1">
            <GBButton variant="outline" size="md" fullWidth>İptal</GBButton>
          </Link>
          <div className="flex-1">
            <GBButton type="submit" variant="primary" size="md" fullWidth icon={<Save size={15} />} disabled={saving}>
              {saving ? "Kaydediliyor…" : isNew ? "Yazı Oluştur" : "Kaydet"}
            </GBButton>
          </div>
        </div>
      </form>
    </div>
  );
}
