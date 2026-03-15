"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/hooks/useAdmin";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, FileText, ChevronLeft, ChevronRight, Sparkles, Plus,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, section: "dashboard" },
  { label: "Ürünler", href: "/admin/urunler", icon: Package, section: "products" },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart, section: "orders", action: { href: "/admin/siparisler/yeni", title: "Yeni Sipariş" } },
  { label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users, section: "users" },
  { label: "Stok", href: "/admin/stok", icon: BarChart3, section: "stock" },
  { label: "Blog", href: "/admin/blog", icon: FileText, section: "blog" },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings, section: "settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { can } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col border-r border-[#f0e8e4] bg-white transition-all duration-300"
      style={{ width: collapsed ? "4.5rem" : "16rem" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[#f0e8e4]">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #b76e79, #e890a8)" }}>
          <Sparkles size={13} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-[0.15em] text-[#2d2d2d]">
            GIRLBOSS <span className="text-[10px] font-medium text-[#b76e79] tracking-normal">Admin</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.filter((item) => can(item.section)).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <div key={item.href} className="flex items-center gap-1">
              <Link
                href={item.href}
                className={`flex-1 flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#fff0f3] text-[#b76e79] shadow-sm"
                    : "text-[#525252] hover:bg-[#fdf8f5] hover:text-[#2d2d2d]"
                }`}
                style={{ padding: collapsed ? "0.625rem" : "0.625rem 0.875rem" }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className={active ? "text-[#b76e79]" : "text-[#a3a3a3]"} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
              {!collapsed && item.action && (
                <Link href={item.action.href} title={item.action.title}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#a3a3a3] hover:text-[#b76e79] hover:bg-[#fff0f3] transition-colors shrink-0">
                  <Plus size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-[#f0e8e4]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded-xl text-xs text-[#a3a3a3] hover:text-[#525252] hover:bg-[#fdf8f5] transition-colors"
          style={{ padding: "0.5rem" }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Küçült</span></>}
        </button>
      </div>
    </aside>
  );
}
