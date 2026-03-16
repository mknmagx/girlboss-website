"use client";

import { useState } from "react";
import AdminGuard from "@/lib/components/admin/AdminGuard";
import AdminSidebar from "@/lib/components/admin/AdminSidebar";
import AdminTopbar from "@/lib/components/admin/AdminTopbar";

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f8f5f2]">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar onMenuToggle={() => setMobileSidebarOpen((v) => !v)} />
          <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
