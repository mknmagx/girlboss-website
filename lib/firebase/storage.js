import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Upload a product image file to Firebase Storage.
 * Path: products/{productId}/{timestamp}.{ext}
 * Returns the public download URL.
 */
export async function uploadProductImage(productId, file) {
  const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}.${ext || "jpg"}`;
  const storageRef = ref(storage, `products/${productId}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}

/**
 * Delete a product image by its full download URL.
 * Silently ignores errors (e.g. file already deleted).
 */
export async function deleteProductImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore — already deleted or not a Storage URL
  }
}

/**
 * Upload a blog cover image to Firebase Storage.
 * Path: blog/{slug}/{timestamp}.{ext}
 * Returns the public download URL.
 */
export async function uploadBlogImage(slug, file) {
  const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}.${ext || "jpg"}`;
  const storageRef = ref(storage, `blog/${slug}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}

/**
 * Delete a blog image by its full download URL.
 * Silently ignores errors.
 */
export async function deleteBlogImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore
  }
}
