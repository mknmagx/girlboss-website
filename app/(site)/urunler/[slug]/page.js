import { notFound } from "next/navigation";
import {
  getProductBySlugServer,
  getProductReviewsServer,
  getProductsServer,
  getSettingsServer,
} from "@/lib/firebase/adminFirestore";
import ProductClient from "./ProductClient";

// ISR: sayfayi her saat yeniden olustur
export const revalidate = 3600;

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  const product = await getProductBySlugServer(slug);
  if (!product) return notFound();

  const [allProds, reviews, settings] = await Promise.all([
    getProductsServer(),
    getProductReviewsServer(product.id),
    getSettingsServer(),
  ]);

  const related = allProds
    .filter((x) => x.id !== product.id && x.active !== false)
    .slice(0, 3);

  const approvedReviews = reviews.filter((r) => r.approved !== false);

  return (
    <ProductClient
      product={product}
      related={related}
      reviews={approvedReviews}
      settings={settings}
    />
  );
}