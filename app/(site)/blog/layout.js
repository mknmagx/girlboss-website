import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Blog – Güzellik Notları & Koku Rehberleri",
  description:
    "GIRLBOSS blogunda güzellik ipuçları, body mist kullanım rehberleri, koku trendleri ve ilham verici içerikler. Kendine güvenen kadın için yazıyoruz.",
  keywords: [
    "body mist blog",
    "güzellik ipuçları",
    "koku rehberi",
    "parfüm uygulama",
    "girlboss blog",
    "kadın güzellik",
    "body mist nasıl kullanılır",
  ],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "Blog – Güzellik Notları | GIRLBOSS",
    description:
      "Güzellik ipuçları, koku rehberleri ve GIRLBOSS dünyasından haberler.",
    url: `${BASE_URL}/blog`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – Güzellik Notları | GIRLBOSS",
    description: "Güzellik ipuçları, koku rehberleri ve GIRLBOSS dünyasından haberler.",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
