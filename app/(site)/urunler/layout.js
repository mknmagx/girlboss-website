import { products } from "@/lib/data/products";
import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export const metadata = {
  title: "Tüm Ürünler – Body Mist Koleksiyonu",
  description:
    "GIRLBOSS lüks body mist koleksiyonunu keşfet. Lunara, Velvet Shimmer, Secret Romantic ve daha fazlası. %100 vegan, dermatolog onaylı, 12 saat kalıcılık.",
  keywords: [
    "body mist satın al",
    "kadın body mist",
    "lüks body mist koleksiyonu",
    "girlboss ürünler",
    "vegan body mist türkiye",
    "kalıcı koku",
    "body mist fiyat",
  ],
  alternates: {
    canonical: `${BASE_URL}/urunler`,
  },
  openGraph: {
    title: "Tüm Ürünler – GIRLBOSS Body Mist Koleksiyonu",
    description:
      "6 eşsiz lüks body mist. Kendine güvenen kadınlar için tasarlandı. %100 vegan, dermatolog onaylı.",
    url: `${BASE_URL}/urunler`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tüm Ürünler – GIRLBOSS Body Mist Koleksiyonu",
    description: "6 eşsiz lüks body mist. %100 vegan, dermatolog onaylı.",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "GIRLBOSS Body Mist Koleksiyonu",
  description: "6 eşsiz lüks body mist. %100 vegan, dermatolog onaylı.",
  url: `${BASE_URL}/urunler`,
  mainEntity: {
    "@type": "ItemList",
    name: "GIRLBOSS Ürünleri",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/urunler/${p.slug}`,
      name: p.name,
    })),
  },
};

export default function UrunlerLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
