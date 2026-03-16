import { getBlogPostBySlugServer } from "@/lib/firebase/adminFirestore";
import { company } from "@/lib/config/company";

const BASE_URL = `https://${company.domain}`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugServer(slug);

  if (!post) {
    return {
      title: "Yazı Bulunamadı",
      robots: { index: false },
    };
  }

  const title = `${post.title} | ${company.brandName} Blog`;
  const description = post.excerpt;
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;

  return {
    title,
    description,
    keywords: post.tags
      ? [...post.tags, "girlboss blog", "güzellik", "body mist"]
      : ["girlboss blog", "güzellik", "body mist"],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      authors: [company.brandName],
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export default function BlogSlugLayout({ children }) {
  return children;
}
