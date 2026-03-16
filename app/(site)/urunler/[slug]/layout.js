import { products } from "@/lib/data/products";
import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

// Pre-render all product slugs at build time
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
      robots: { index: false },
    };
  }

  const title = `${product.name} – ${product.tagline} | ${company.brandName}`;
  const description = `${product.description} ${product.volume ?? "250ml"} | ₺${product.price} | ${company.brandName}.`;
  const canonicalUrl = `${BASE_URL}/urunler/${slug}`;
  const image = product.images?.[0]
    ? `${BASE_URL}${product.images[0]}`
    : `${BASE_URL}/og-image.jpg`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} body mist`,
      `${product.name} koku`,
      "girlboss body mist",
      product.notes?.top ?? "",
      product.notes?.middle ?? "",
      "lüks body mist",
      "kalıcı koku",
      "vegan body mist",
    ].filter(Boolean),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${product.name} – ${company.brandName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductSlugLayout({ children, params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) return <>{children}</>;

  const canonicalUrl = `${BASE_URL}/urunler/${slug}`;
  const images = (product.images ?? []).map((img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`
  );
  if (images.length === 0) images.push(`${BASE_URL}/og-image.jpg`);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: String(product.id),
    brand: { "@type": "Brand", name: company.brandName },
    url: canonicalUrl,
    image: images,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      seller: { "@type": "Organization", name: company.brandName },
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(product.reviews?.length
      ? {
          review: product.reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            author: { "@type": "Person", name: r.name },
            reviewBody: r.body,
            datePublished: r.date,
          })),
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Ürünler", item: `${BASE_URL}/urunler` },
      { "@type": "ListItem", position: 3, name: product.name, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
