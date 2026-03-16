import { products } from "@/lib/data/products";
import { getBlogPostsServer } from "@/lib/firebase/adminFirestore";
import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export default async function sitemap() {
  const now = new Date().toISOString();

  /* ── Static pages ── */
  const staticRoutes = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/urunler`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/mesafeli-satis-sozlesmesi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/teslimat-iade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* ── Product detail pages ── */
  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/urunler/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  /* ── Blog post pages (from Firestore) ── */
  let blogRoutes = [];
  try {
    const allPosts = await getBlogPostsServer();
    blogRoutes = allPosts
      .filter((p) => p.published !== false)
      .map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
