"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, batchUpdateStock } from "@/lib/firebase/firestore";
import { Save, AlertTriangle, Eye } from "lucide-react";
import GBButton from "@/lib/components/ui/GBButton";

export default function AdminStockPage() {
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      const initial = {};
      data.forEach((p) => { initial[p.id] = String(p.stock ?? 0); });
      setStocks(initial);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updates = products.map((p) => ({
      id: p.id,
      stock: Number(stocks[p.id]) || 0,
    }));
    await batchUpdateStock(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-3 border-[#b76e79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lowStockCount = products.filter((p) => Number(stocks[p.id] || 0) < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d2d2d]">Stok Yönetimi</h1>
          <p className="text-sm text-[#737373] mt-1">{products.length} ürün</p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertTriangle size={13} /> {lowStockCount} düşük stok
            </span>
          )}
          <GBButton
            variant="primary"
            size="sm"
            icon={<Save size={15} />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Tümünü Kaydet"}
          </GBButton>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#f0e8e4] overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-max md:min-w-fit">
          <thead>
            <tr className="bg-[#fdf8f5] border-b border-[#f0e8e4]">
              <th className="text-left text-xs font-semibold text-[#737373] px-3 md:px-5 py-3">Ürün</th>
              <th className="text-left text-xs font-semibold text-[#737373] px-3 md:px-5 py-3 w-20 md:w-24">Fiyat</th>
              <th className="text-left text-xs font-semibold text-[#737373] px-3 md:px-5 py-3 w-32 md:w-40">Stok Adedi</th>
              <th className="text-left text-xs font-semibold text-[#737373] px-3 md:px-5 py-3 w-20 md:w-24">Durum</th>
              <th className="text-left text-xs font-semibold text-[#737373] px-5 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = Number(stocks[p.id] || 0);
              const isLow = stock < 10;
              return (
                <tr key={p.id} className={`border-b border-[#f0e8e4] last:border-0 ${isLow ? "bg-amber-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: p.gradient || "#f0e8e4" }} />
                      <div>
                        <p className="font-semibold text-[#2d2d2d]">{p.name}</p>
                        <p className="text-[11px] text-[#a3a3a3]">{p.volume}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-bold text-[#2d2d2d]">
                    ₺{(p.price || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min="0"
                      value={stocks[p.id] || ""}
                      onChange={(e) => setStocks({ ...stocks, [p.id]: e.target.value })}
                      className={`w-24 px-3 py-1.5 rounded-lg border text-sm font-semibold text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79]/20 ${
                        isLow ? "border-amber-300 bg-amber-50" : "border-[#f0e8e4] bg-white"
                      }`}
                    />
                  </td>
                  <td className="px-5 py-3">
                    {stock === 0 ? (
                      <span className="text-xs font-semibold text-red-500">Tükendi</span>
                    ) : isLow ? (
                      <span className="text-xs font-semibold text-amber-600">Düşük</span>
                    ) : (
                      <span className="text-xs font-semibold text-green-600">Yeterli</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/stok/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b76e79] hover:text-[#c4587a] transition-colors">
                      <Eye size={13} /> Detay
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
