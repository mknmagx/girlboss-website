"use client";

const statusColors = {
  "Beklemede": { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  "Onaylandı": { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  "Hazırlanıyor": { bg: "#E0E7FF", text: "#3730A3", border: "#A5B4FC" },
  "Kargoda": { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
  "Teslim Edildi": { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  "İptal Edildi": { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
  // Product
  "Aktif": { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  "Pasif": { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
  // Blog
  "Yayında": { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  "Taslak": { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  // Role
  "admin": { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
  "editor": { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  "customer": { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
};

export default function StatusBadge({ status }) {
  const colors = statusColors[status] || { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" };

  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {status}
    </span>
  );
}
