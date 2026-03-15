"use client";

import { useAdmin } from "@/lib/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Wraps admin pages — redirects unauthorized users.
 * @param {string} section - Permission section key (e.g. "products", "orders")
 */
export default function AdminGuard({ children, section }) {
  const { user, loading, isLoggedIn, hasAdminAccess, can } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace("/kullanici/giris");
      return;
    }
    if (!hasAdminAccess) {
      router.replace("/");
      return;
    }
    if (section && !can(section)) {
      router.replace("/admin");
    }
  }, [loading, isLoggedIn, hasAdminAccess, section, can, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#b76e79]" />
          <span className="text-sm text-[#737373]">Yükleniyor…</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !hasAdminAccess) return null;
  if (section && !can(section)) return null;

  return children;
}
