"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function AdminModal({ open, onClose, title, children, maxWidth = "32rem" }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl border border-[#f0e8e4] shadow-2xl w-[calc(100%-2rem)] overflow-y-auto"
        style={{ maxWidth, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e8e4]">
          <h3 className="text-base font-bold text-[#2d2d2d]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#fdf8f5] transition-colors"
          >
            <X size={16} className="text-[#737373]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
