"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns,
  data,
  searchPlaceholder = "Ara…",
  searchKeys = [],
  pageSize = 10,
  onRowClick,
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "tr")
        : String(bv).localeCompare(String(av), "tr");
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {/* Search bar */}
      {searchKeys.length > 0 && (
        <div className="mb-4 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#f0e8e4] bg-white text-sm text-[#2d2d2d] placeholder:text-[#c4a0a7] focus:outline-none focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10 transition-all"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-[#f0e8e4] overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#e0d5d0] scrollbar-track-[#fdf8f5]" style={{ scrollBehavior: 'smooth' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fdf8f5] border-b border-[#f0e8e4]">
                {columns.map((col) => (
                  <th
                    key={col.key || col.label}
                    className={`text-left text-xs font-semibold text-[#737373] px-4 py-3 ${col.sortable ? "cursor-pointer select-none hover:text-[#2d2d2d]" : ""}`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 md:px-4 py-8 text-center text-[#a3a3a3] text-sm">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id || row.uid || i}
                    className={`border-b border-[#f0e8e4] last:border-0 transition-colors ${onRowClick ? "cursor-pointer hover:bg-[#fdf8f5]" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.key || col.label} className="px-3 md:px-4 py-3 text-[#2d2d2d] text-sm">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[#a3a3a3]">
            {sorted.length} sonuçtan {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} arası
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  i === page ? "bg-[#b76e79] text-white" : "text-[#737373] hover:bg-[#fdf8f5]"
                }`}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, page - 2), page + 3)}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:bg-[#fdf8f5] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
