/**
 * Firebase Admin Firestore Helpers — SERVER-SIDE ONLY
 * Yalnızca Server Components, API Routes ve Server Actions'da kullanın.
 * "use client" olan dosyalara import etmeyin.
 */

import { adminDb } from "./admin";

// ═══════════════════════════════════════════════════
//   PRODUCTS
// ═══════════════════════════════════════════════════

export async function getProductsServer() {
  const snap = await adminDb
    .collection("products")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getProductBySlugServer(slug) {
  const snap = await adminDb
    .collection("products")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return { ...snap.docs[0].data(), id: snap.docs[0].id };
}

// ═══════════════════════════════════════════════════
//   REVIEWS  (products/{productId}/reviews)
// ═══════════════════════════════════════════════════

export async function getProductReviewsServer(productId) {
  const snap = await adminDb
    .collection("products")
    .doc(productId)
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

// ═══════════════════════════════════════════════════
//   SETTINGS
// ═══════════════════════════════════════════════════

export async function getSettingsServer() {
  const snap = await adminDb.collection("settings").doc("site").get();
  return snap.exists ? snap.data() : null;
}

// ═══════════════════════════════════════════════════
//   BLOG
// ═══════════════════════════════════════════════════

export async function getBlogPostsServer() {
  const snap = await adminDb
    .collection("blog")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getBlogPostBySlugServer(slug) {
  const snap = await adminDb
    .collection("blog")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return { ...snap.docs[0].data(), id: snap.docs[0].id };
}
