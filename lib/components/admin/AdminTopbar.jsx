"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="h-16 border-b border-[#f0e8e4] bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-[#2d2d2d]">Yönetim Paneli</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Visit site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#b76e79] transition-colors"
        >
          <ExternalLink size={13} />
          Siteyi Gör
        </Link>

        {/* Notifications placeholder */}
        <button className="relative w-9 h-9 rounded-full bg-[#fdf8f5] flex items-center justify-center hover:bg-[#fff0f3] transition-colors">
          <Bell size={15} className="text-[#737373]" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#f0e8e4]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}
          >
            {user?.ad?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#2d2d2d] leading-none">{user?.ad} {user?.soyad}</p>
            <p className="text-[10px] text-[#b76e79] font-medium mt-0.5 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors ml-1"
            title="Çıkış Yap"
          >
            <LogOut size={14} className="text-[#a3a3a3] hover:text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
