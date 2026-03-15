import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, startAfter,
  getDocs, onSnapshot, addDoc, serverTimestamp, writeBatch,
} from "firebase/firestore";
import { db } from "./config";

// ═══════════════════════════════════════════════════
//   USERS
// ═══════════════════════════════════════════════════

export async function createUserDoc(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getAllUsers() {
  const snap = await getDocs(
    query(collection(db, "users"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }));
}

export async function getUsersByRole(role) {
  const snap = await getDocs(
    query(collection(db, "users"), where("role", "==", role))
  );
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }));
}

// ═══════════════════════════════════════════════════
//   PRODUCTS
// ═══════════════════════════════════════════════════

export async function getProducts() {
  const snap = await getDocs(
    query(collection(db, "products"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getProductBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, "products"), where("slug", "==", slug), limit(1))
  );
  return snap.empty ? null : { ...snap.docs[0].data(), id: snap.docs[0].id };
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

export async function createProduct(data) {
  const ref = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

// ═══════════════════════════════════════════════════
//   ORDERS
// ═══════════════════════════════════════════════════

export const ORDER_STATUSES = [
  "Beklemede",
  "Onaylandı",
  "Hazırlanıyor",
  "Kargoda",
  "Teslim Edildi",
  "İptal Edildi",
  "İade Talep Edildi",
  "İade Onaylandı",
  "İade Reddedildi",
];

export const PAYMENT_METHOD_LABELS = {
  creditCard: "Kredi / Banka Kartı",
  transfer: "Havale / EFT",
  cod: "Kapıda Ödeme",
};

export async function createOrder(data) {
  const { delivery } = data;
  const ref = await addDoc(collection(db, "orders"), {
    ...data,
    // Flat fields for easy querying/display in admin
    customerName: data.customerName || (delivery ? `${delivery.ad || ""} ${delivery.soyad || ""}`.trim() : ""),
    phone: data.phone || delivery?.telefon || "",
    address: data.address || delivery?.adres || "",
    city: data.city || delivery?.sehir || "",
    district: data.district || delivery?.ilce || "",
    postalCode: data.postalCode || delivery?.postakodu || "",
    discount: data.discount ?? 0,
    status: data.status || "Beklemede",
    stockDeducted: false,
    statusHistory: [{
      status: data.status || "Beklemede",
      at: new Date().toISOString(),
      by: data.createdByAdmin || "system",
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getOrders() {
  const snap = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getOrderById(id) {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

export async function getOrdersByUser(uid) {
  const snap = await getDocs(
    query(collection(db, "orders"), where("uid", "==", uid), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

// Sıralı durum akışı tanımları
const _MAIN_FLOW = ["Beklemede", "Onaylandı", "Hazırlanıyor", "Kargoda", "Teslim Edildi"];
const _TERMINAL = ["İptal Edildi", "İade Onaylandı", "İade Reddedildi"];

/**
 * Mevcut durumdan geçilebilecek geçerli durumları döndürür.
 * Geri gidemez; teslim öncesi her zaman iptal edilebilir.
 */
export function getAvailableStatuses(currentStatus) {
  if (_TERMINAL.includes(currentStatus)) return [];
  if (currentStatus === "İade Talep Edildi") return ["İade Onaylandı", "İade Reddedildi"];
  if (currentStatus === "Teslim Edildi") return ["İade Talep Edildi"];
  const idx = _MAIN_FLOW.indexOf(currentStatus);
  if (idx !== -1 && idx < _MAIN_FLOW.length - 1) {
    return [_MAIN_FLOW[idx + 1], "İptal Edildi"];
  }
  return [];
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, "orders", id));
}

/**
 * Update order status. If transitioning to "Hazırlanıyor" and stock hasn't
 * been deducted yet, automatically deducts stock for each order item.
 * Returns { stockDeducted: boolean } so the caller can show feedback.
 */
export async function updateShippingInfo(orderId, { carrier, carrierKey, trackingNumber, carrierUrl, shippedAt }) {
  await updateDoc(doc(db, "orders", orderId), {
    carrier: carrier || "",
    carrierKey: carrierKey || "",
    trackingNumber: trackingNumber || "",
    carrierUrl: carrierUrl || "",
    shippedAt: shippedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateOrderStatus(id, newStatus, { adminEmail = "", note = "" } = {}) {
  const orderSnap = await getDoc(doc(db, "orders", id));
  if (!orderSnap.exists()) throw new Error("Order not found");
  const order = orderSnap.data();

  // Sıralı geçiş doğrulaması
  const allowed = getAvailableStatuses(order.status);
  if (!allowed.includes(newStatus)) {
    throw new Error(`"${order.status}" durumundan "${newStatus}" durumuna geçilemez.`);
  }

  const batch = writeBatch(db);
  const historyEntry = { status: newStatus, at: new Date().toISOString(), by: adminEmail || "system", note };
  const updatePayload = {
    status: newStatus,
    updatedAt: new Date().toISOString(),
    statusHistory: [...(order.statusHistory || []), historyEntry],
  };

  let stockDeducted = false;
  // Auto-deduct stock when entering "Hazırlanıyor" for the first time
  if (newStatus === "Hazırlanıyor" && !order.stockDeducted) {
    updatePayload.stockDeducted = true;
    stockDeducted = true;
    for (const item of order.items || []) {
      const productSnap = await getDoc(doc(db, "products", item.id));
      if (!productSnap.exists()) continue;
      const currentStock = productSnap.data().stock ?? 0;
      const newStock = Math.max(0, currentStock - (item.qty || 1));
      batch.update(doc(db, "products", item.id), {
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });
      // Write stock log
      const logRef = doc(collection(db, "products", item.id, "stockLogs"));
      batch.set(logRef, {
        type: "order",
        delta: -(item.qty || 1),
        newStock,
        note: `Sipariş #${id.slice(0, 8).toUpperCase()} hazırlamaya alındı`,
        adminEmail: adminEmail || "auto",
        orderId: id,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // If cancelled/refunded after stock was deducted → restore stock
  if (
    (newStatus === "İptal Edildi" || newStatus === "İade Onaylandı") &&
    order.stockDeducted &&
    !order.stockRestored
  ) {
    updatePayload.stockRestored = true;
    for (const item of order.items || []) {
      const productSnap = await getDoc(doc(db, "products", item.id));
      if (!productSnap.exists()) continue;
      const currentStock = productSnap.data().stock ?? 0;
      const newStock = currentStock + (item.qty || 1);
      batch.update(doc(db, "products", item.id), {
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });
      const logRef = doc(collection(db, "products", item.id, "stockLogs"));
      batch.set(logRef, {
        type: newStatus === "İptal Edildi" ? "cancel_restore" : "refund_restore",
        delta: item.qty || 1,
        newStock,
        note: `Sipariş #${id.slice(0, 8).toUpperCase()} - ${newStatus} nedeniyle stok geri eklendi`,
        adminEmail: adminEmail || "auto",
        orderId: id,
        createdAt: new Date().toISOString(),
      });
    }
  }

  batch.update(doc(db, "orders", id), updatePayload);
  await batch.commit();
  return { stockDeducted };
}

// ═══════════════════════════════════════════════════
//   REFUNDS — orders/{orderId}/refunds subcollection
// ═══════════════════════════════════════════════════

export async function createRefundRequest(orderId, data) {
  const ref = await addDoc(collection(db, "orders", orderId, "refunds"), {
    ...data,
    status: "Beklemede",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  // Update order with refund request info
  await updateDoc(doc(db, "orders", orderId), {
    hasRefundRequest: true,
    refundStatus: "Beklemede",
    status: "İade Talep Edildi",
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getRefundsByOrder(orderId) {
  const snap = await getDocs(
    query(collection(db, "orders", orderId, "refunds"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function updateRefundStatus(orderId, refundId, status, adminNote = "") {
  await updateDoc(doc(db, "orders", orderId, "refunds", refundId), {
    status,
    adminNote,
    resolvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(doc(db, "orders", orderId), {
    refundStatus: status,
    updatedAt: new Date().toISOString(),
  });
  // Cascade order status
  const newOrderStatus = status === "Onaylandı" ? "İade Onaylandı" : status === "Reddedildi" ? "İade Reddedildi" : undefined;
  if (newOrderStatus) {
    await updateOrderStatus(orderId, newOrderStatus, { adminEmail: "admin", note: adminNote });
  }
}

// ═══════════════════════════════════════════════════
//   ORDER REVIEWS — orders/{orderId}/reviews
// ═══════════════════════════════════════════════════

export async function createOrderItemReview(orderId, productId, data) {
  // Write to order's reviews subcollection
  const orderReviewRef = doc(collection(db, "orders", orderId, "reviews"), productId);
  await setDoc(orderReviewRef, {
    ...data,
    orderId,
    productId,
    createdAt: new Date().toISOString(),
  });
  // Also write to product's reviews subcollection
  await createProductReview(productId, {
    ...data,
    orderId,
    verified: true,
  });
}

export async function getOrderReviews(orderId) {
  const snap = await getDocs(collection(db, "orders", orderId, "reviews"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

// ═══════════════════════════════════════════════════
//   STOCK
// ═══════════════════════════════════════════════════

export async function updateStock(productId, stock) {
  await updateDoc(doc(db, "products", productId), {
    stock: Number(stock),
    updatedAt: new Date().toISOString(),
  });
}

export async function batchUpdateStock(updates) {
  const batch = writeBatch(db);
  for (const { id, stock } of updates) {
    batch.update(doc(db, "products", id), {
      stock: Number(stock),
      updatedAt: new Date().toISOString(),
    });
  }
  await batch.commit();
}

// ═══════════════════════════════════════════════════
//   BLOG
// ═══════════════════════════════════════════════════

export async function getBlogPosts() {
  const snap = await getDocs(
    query(collection(db, "blog"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getBlogPostBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, "blog"), where("slug", "==", slug), limit(1))
  );
  return snap.empty ? null : { ...snap.docs[0].data(), id: snap.docs[0].id };
}

export async function createBlogPost(data) {
  const ref = await addDoc(collection(db, "blog"), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateBlogPost(id, data) {
  await updateDoc(doc(db, "blog", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBlogPost(id) {
  await deleteDoc(doc(db, "blog", id));
}

// ═══════════════════════════════════════════════════
//   SETTINGS (site-wide config)
// ═══════════════════════════════════════════════════

const SETTINGS_DOC = "site";

export async function getSettings() {
  const snap = await getDoc(doc(db, "settings", SETTINGS_DOC));
  return snap.exists() ? snap.data() : null;
}

export async function updateSettings(data) {
  await setDoc(doc(db, "settings", SETTINGS_DOC), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

// ═══════════════════════════════════════════════════
//   REAL-TIME LISTENERS
// ═══════════════════════════════════════════════════

export function onProductsSnapshot(callback) {
  return onSnapshot(
    query(collection(db, "products"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
  );
}

export function onOrdersSnapshot(callback) {
  return onSnapshot(
    query(collection(db, "orders"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((d) => ({ ...d.data(), id: d.id })))
  );
}

// ═══════════════════════════════════════════════════
//   REVIEWS subcollection: products/{productId}/reviews
// ═══════════════════════════════════════════════════

export async function getProductReviews(productId) {
  const snap = await getDocs(
    query(
      collection(db, "products", productId, "reviews"),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function createProductReview(productId, data) {
  const ref = await addDoc(collection(db, "products", productId, "reviews"), {
    ...data,
    helpful: data.helpful ?? 0,
    approved: data.approved !== false,
    createdAt: new Date().toISOString(),
  });
  await _recalcProductRating(productId);
  return ref.id;
}

export async function updateProductReview(productId, reviewId, data) {
  await updateDoc(doc(db, "products", productId, "reviews", reviewId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await _recalcProductRating(productId);
}

export async function deleteProductReview(productId, reviewId) {
  await deleteDoc(doc(db, "products", productId, "reviews", reviewId));
  await _recalcProductRating(productId);
}

async function _recalcProductRating(productId) {
  const snap = await getDocs(
    query(collection(db, "products", productId, "reviews"), where("approved", "!=", false))
  );
  const approved = snap.docs.map((d) => d.data());
  const count = approved.length;
  const rating =
    count > 0
      ? Math.round((approved.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10
      : 0;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const c = approved.filter((r) => r.rating === stars).length;
    return { stars, count: c, pct: count > 0 ? Math.round((c / count) * 100) : 0 };
  });
  await updateDoc(doc(db, "products", productId), {
    rating,
    reviewCount: count,
    ratingBreakdown: breakdown,
    updatedAt: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════
//   STOCK LOGS — products/{productId}/stockLogs
// ═══════════════════════════════════════════════════

export async function addStockLog(productId, data) {
  const ref = await addDoc(collection(db, "products", productId, "stockLogs"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getStockLogs(productId) {
  const snap = await getDocs(
    query(
      collection(db, "products", productId, "stockLogs"),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

/**
 * Update product stock AND write a log entry atomically.
 * type: "in" | "out" | "adjustment" | "order" | "manual"
 */
export async function updateStockWithLog(productId, { newStock, delta, type, note, adminEmail }) {
  const batch = writeBatch(db);
  batch.update(doc(db, "products", productId), {
    stock: Number(newStock),
    updatedAt: new Date().toISOString(),
  });
  const logRef = doc(collection(db, "products", productId, "stockLogs"));
  batch.set(logRef, {
    type,
    delta: Number(delta),
    newStock: Number(newStock),
    note: note || "",
    adminEmail: adminEmail || "",
    createdAt: new Date().toISOString(),
  });
  await batch.commit();
}

// ═══════════════════════════════════════════════════
//   SEED PRODUCTS (one-time migration)
// ═══════════════════════════════════════════════════

export async function seedProducts(productsArray) {
  const productRefs = [];

  // 1. Create all product documents (strip numeric id + reviews)
  const productBatch = writeBatch(db);
  for (const p of productsArray) {
    // eslint-disable-next-line no-unused-vars
    const { reviews, id: _numericId, ...productData } = p;
    const ref = doc(collection(db, "products"));
    productRefs.push({ ref, reviews: reviews || [] });
    productBatch.set(ref, {
      ...productData,
      stock: p.stock ?? 100,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  await productBatch.commit();

  // 2. Seed reviews into subcollections
  for (const { ref, reviews } of productRefs) {
    if (reviews.length === 0) continue;
    const reviewBatch = writeBatch(db);
    for (const review of reviews) {
      // eslint-disable-next-line no-unused-vars
      const { id: _numericId, ...reviewData } = review;
      const reviewRef = doc(collection(db, "products", ref.id, "reviews"));
      reviewBatch.set(reviewRef, {
        ...reviewData,
        approved: true,
        helpful: reviewData.helpful ?? 0,
        createdAt: new Date().toISOString(),
      });
    }
    await reviewBatch.commit();
  }
}
