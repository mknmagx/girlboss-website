import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";
import { createUserDoc, getUserDoc } from "./firestore";

// ── Sign Up ──────────────────────────────────────────
export async function signUp({ email, password, ad, soyad }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  // Create Firestore user document (role defaults to "customer")
  await createUserDoc(uid, {
    email,
    ad: ad.trim(),
    soyad: (soyad || "").trim(),
    telefon: "",
    role: "customer",
    disabled: false,
    createdAt: new Date().toISOString(),
  });

  return credential.user;
}

// ── Sign In ──────────────────────────────────────────
export async function signIn({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ── Google Sign In ───────────────────────────────────
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if Firestore user doc already exists
  const existing = await getUserDoc(user.uid);
  if (!existing) {
    await createUserDoc(user.uid, {
      email: user.email,
      ad: user.displayName?.split(" ")[0] || "",
      soyad: user.displayName?.split(" ").slice(1).join(" ") || "",
      telefon: user.phoneNumber || "",
      role: "customer",
      disabled: false,
      createdAt: new Date().toISOString(),
    });
  }

  return user;
}

// ── Password Reset ───────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Sign Out ─────────────────────────────────────────
export async function signOut() {
  await firebaseSignOut(auth);
}

// ── Auth State Listener ──────────────────────────────
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
