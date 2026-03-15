"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { getBlogPosts, createBlogPost, updateBlogPost } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBTextarea from "@/lib/components/ui/GBTextarea";
import Link from "next/link";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  published: false,
  tags: "",
};

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = params.id === "yeni";
  const [form, setForm] = useState({ ...emptyForm, author: user?.ad || "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    // Load existing post
    getBlogPosts().then((posts) => {
      const post = posts.find((p) => p.id === params.id);
      if (!post) { router.replace("/admin/blog"); return; }
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        coverImage: post.coverImage || "",
        author: post.author || "",
        published: post.published || false,
        tags: (post.tags || []).join(", "),
      });
      setLoading(false);
    });
  }, [isNew, params.id, router]);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

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
        content: form.content.trim(),
        coverImage: form.coverImage.trim(),
        author: form.author.trim(),
        published: form.published,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
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
        <section className="bg-white rounded-2xl border border-[#f0e8e4] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2d2d2d]">İçerik</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Başlık" value={form.title} onChange={set("title")} placeholder="Blog yazısı başlığı" />
            <GBInput label="Slug" value={form.slug} onChange={set("slug")} placeholder="blog-yazisi-slug" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GBInput label="Yazar" value={form.author} onChange={set("author")} />
            <GBInput label="Etiketler (virgülle)" value={form.tags} onChange={set("tags")} placeholder="koku, body mist, bakım" />
          </div>
          <GBInput label="Kapak Görseli URL" value={form.coverImage} onChange={set("coverImage")} />
          <GBTextarea label="Özet" value={form.excerpt} onChange={set("excerpt")} rows={2} />
          <GBTextarea label="İçerik" value={form.content} onChange={set("content")} rows={12} />

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
