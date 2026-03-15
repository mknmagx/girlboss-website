"use client";

import AdminGuard from "@/lib/components/admin/AdminGuard";
import AdminSidebar from "@/lib/components/admin/AdminSidebar";
import AdminTopbar from "@/lib/components/admin/AdminTopbar";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f8f5f2]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
