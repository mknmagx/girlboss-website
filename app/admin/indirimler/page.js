"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus, Edit2, Trash2, Tag, Package, ShoppingCart, Gift, Star,
  ToggleLeft, ToggleRight, Copy, Check, AlertCircle, Search,
  ChevronDown, CalendarDays, Percent, Hash,
} from "lucide-react";
import {
  getDiscounts, createDiscount, updateDiscount, deleteDiscount, getProducts,
} from "@/lib/firebase/firestore";
import DataTable from "@/lib/components/admin/DataTable";
import AdminModal from "@/lib/components/admin/AdminModal";
import GBButton from "@/lib/components/ui/GBButton";
import GBInput from "@/lib/components/ui/GBInput";
import GBSelect from "@/lib/components/ui/GBSelect";
import AdminGuard from "@/lib/components/admin/AdminGuard";

// ─── Type meta ───────────────────────────────────────
const TYPE_META = {
  product:     { label: "Ürün İndirimi",      color: "#b76e79", bg: "#fff0f3",  icon: Package },
  cart_coupon: { label: "Kupon Kodu",         color: "#7c3aed", bg: "#f5f3ff",  icon: Tag },
  threshold:   { label: "Sepet Tutarı",       color: "#0891b2", bg: "#ecfeff",  icon: ShoppingCart },
  bxgy:        { label: "X Al Y Öde",         color: "#16a34a", bg: "#f0fdf4",  icon: Gift },
  first_order: { label: "İlk Sipariş",        color: "#ea580c", bg: "#fff7ed",  icon: Star },
};

const EMPTY_FORM = {
  type: "",
  name: "",
  description: "",
  active: true,
  startDate: "",
  endDate: "",
  // product / bxgy
  productIds: [],
  // product / cart_coupon / threshold
  discountType: "percentage",
  value: "",
  // cart_coupon
  code: "",
  minCartAmount: "",
  usageLimit: "",
  publicVisible: false,
  // bxgy
  buyQty: "3",
  getQty: "1",
};

// ─── TypeBadge ────────────────────────────────────────
function TypeBadge({ type }) {
  const m = TYPE_META[type];
  if (!m) return null;
  const Icon = m.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}
    >
      <Icon size={10} />
      {m.label}
    </span>
  );
}

// ─── ActiveToggle ─────────────────────────────────────
function ActiveToggle({ active, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
      style={{ color: active ? "#16a34a" : "#a3a3a3" }}
    >
      {active
        ? <ToggleRight size={22} className="text-green-500" />
        : <ToggleLeft size={22} className="text-[#d4d4d4]" />
      }
      {active ? "Aktif" : "Pasif"}
    </button>
  );
}

// ─── Value display helpers ────────────────────────────
function formatValue(d) {
  if (d.type === "bxgy") return `${d.buyQty} al ${d.buyQty - d.getQty} öde`;
  if (d.discountType === "percentage") return `%${d.value}`;
  return `₺${d.value}`;
}

// ─── ProductPicker ────────────────────────────────────
function ProductPicker({ products, selected, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };
  return (
    <div>
      <div className="relative mb-2">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün ara…"
          className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#f0e8e4] focus:outline-none focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10"
        />
      </div>
      <div className="border border-[#f0e8e4] rounded-xl overflow-hidden max-h-52 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-[#a3a3a3] py-6">Ürün bulunamadı</p>
        ) : (
          filtered.map((p) => {
            const checked = selected.includes(p.id);
            return (
              <label
                key={p.id}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#fdf8f5] transition-colors border-b border-[#f8f4f2] last:border-0"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(p.id)}
                  className="accent-[#b76e79] w-4 h-4 shrink-0"
                />
                <div
                  className="w-6 h-6 rounded-lg shrink-0"
                  style={{ background: p.gradient || "#f0e8e4" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2d2d2d] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#a3a3a3]">₺{p.price}</p>
                </div>
                {checked && <Check size={14} className="text-[#b76e79] shrink-0" />}
              </label>
            );
          })
        )}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-[#b76e79] font-semibold mt-1">{selected.length} ürün seçili</p>
      )}
    </div>
  );
}

// ─── Form field helpers ───────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-[#525252] mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
function FieldRow({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}
function SectionTitle({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider text-[#b76e79] mt-5 mb-3 pb-1 border-b border-[#f0e8e4]">
      {children}
    </p>
  );
}

// ─── DiscountForm ─────────────────────────────────────
function DiscountForm({ form, setForm, products, editMode }) {
  const f = (key) => (e) => {
    const val = e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  if (!editMode && !form.type) {
    return (
      <div>
        <p className="text-sm text-[#737373] mb-4">İndirim türünü seçin:</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <button
                key={key}
                onClick={() => setForm((p) => ({ ...p, type: key }))}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-[#f0e8e4] hover:border-[#b76e79] transition-colors text-center"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: meta.bg }}
                >
                  <Icon size={20} style={{ color: meta.color }} />
                </div>
                <p className="text-sm font-bold text-[#2d2d2d]">{meta.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Type Badge */}
      <div className="flex items-center gap-2">
        <TypeBadge type={form.type} />
        {!editMode && (
          <button
            onClick={() => setForm((p) => ({ ...p, type: "" }))}
            className="text-xs text-[#a3a3a3] hover:text-[#b76e79] underline"
          >
            değiştir
          </button>
        )}
      </div>

      <SectionTitle>Genel Bilgiler</SectionTitle>

      <div>
        <Label required>İndirim Adı</Label>
        <GBInput
          placeholder="Yaz İndirimi 2026"
          value={form.name}
          onChange={f("name")}
        />
      </div>

      <div>
        <Label>Açıklama (müşteriye gösterilir)</Label>
        <textarea
          value={form.description}
          onChange={f("description")}
          placeholder="Bu indirim hakkında kısa bir açıklama…"
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-xl border border-[#e5e5e5] focus:outline-none focus:border-[#b76e79] focus:ring-2 focus:ring-[#b76e79]/10 resize-none"
        />
      </div>

      {/* ── TYPE: PRODUCT ── */}
      {form.type === "product" && (
        <>
          <SectionTitle>İndirim Değeri</SectionTitle>
          <FieldRow>
            <div>
              <Label required>İndirim Türü</Label>
              <GBSelect
                value={form.discountType}
                onChange={f("discountType")}
                options={[
                  { value: "percentage", label: "Yüzde (%)" },
                  { value: "fixed", label: "Sabit Tutar (₺)" },
                ]}
              />
            </div>
            <div>
              <Label required>Değer</Label>
              <GBInput
                type="number"
                min="0"
                placeholder={form.discountType === "percentage" ? "15" : "50"}
                value={form.value}
                onChange={f("value")}
              />
            </div>
          </FieldRow>
          <SectionTitle>Geçerli Ürünler</SectionTitle>
          <Label required>Bu indirim hangi ürünlere uygulanacak?</Label>
          <ProductPicker
            products={products}
            selected={form.productIds}
            onChange={(ids) => setForm((p) => ({ ...p, productIds: ids }))}
          />
        </>
      )}

      {/* ── TYPE: CART COUPON ── */}
      {form.type === "cart_coupon" && (
        <>
          <SectionTitle>Kupon Detayları</SectionTitle>
          <div>
            <Label required>Kupon Kodu</Label>
            <div className="relative">
              <GBInput
                placeholder="YAZI2026"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
          <FieldRow>
            <div>
              <Label required>İndirim Türü</Label>
              <GBSelect
                value={form.discountType}
                onChange={f("discountType")}
                options={[
                  { value: "percentage", label: "Yüzde (%)" },
                  { value: "fixed", label: "Sabit Tutar (₺)" },
                ]}
              />
            </div>
            <div>
              <Label required>Değer</Label>
              <GBInput
                type="number"
                min="0"
                placeholder={form.discountType === "percentage" ? "10" : "50"}
                value={form.value}
                onChange={f("value")}
              />
            </div>
          </FieldRow>
          <FieldRow>
            <div>
              <Label>Min. Sepet Tutarı (₺)</Label>
              <GBInput
                type="number"
                min="0"
                placeholder="200"
                value={form.minCartAmount}
                onChange={f("minCartAmount")}
              />
            </div>
            <div>
              <Label>Kullanım Limiti</Label>
              <GBInput
                type="number"
                min="0"
                placeholder="Limitsiz"
                value={form.usageLimit}
                onChange={f("usageLimit")}
              />
            </div>
          </FieldRow>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.publicVisible}
              onChange={f("publicVisible")}
              className="accent-[#b76e79] w-4 h-4"
            />
            <span className="text-sm text-[#525252]">Sepet sayfasında genel banner olarak göster</span>
          </label>
        </>
      )}

      {/* ── TYPE: THRESHOLD ── */}
      {form.type === "threshold" && (
        <>
          <SectionTitle>Eşik Koşulu</SectionTitle>
          <div>
            <Label required>Min. Sepet Tutarı (₺)</Label>
            <GBInput
              type="number"
              min="0"
              placeholder="500"
              value={form.minCartAmount}
              onChange={f("minCartAmount")}
            />
            <p className="text-[11px] text-[#a3a3a3] mt-1">
              Müşterinin sepeti bu tutara ulaşınca indirim otomatik uygulanır.
            </p>
          </div>
          <FieldRow>
            <div>
              <Label required>İndirim Türü</Label>
              <GBSelect
                value={form.discountType}
                onChange={f("discountType")}
                options={[
                  { value: "percentage", label: "Yüzde (%)" },
                  { value: "fixed", label: "Sabit Tutar (₺)" },
                ]}
              />
            </div>
            <div>
              <Label required>Değer</Label>
              <GBInput
                type="number"
                min="0"
                placeholder={form.discountType === "percentage" ? "10" : "50"}
                value={form.value}
                onChange={f("value")}
              />
            </div>
          </FieldRow>
        </>
      )}

      {/* ── TYPE: BXGY ── */}
      {form.type === "bxgy" && (
        <>
          <SectionTitle>Al-Öde Koşulları</SectionTitle>
          <FieldRow>
            <div>
              <Label required>Kaç Alınsın</Label>
              <GBInput
                type="number"
                min="2"
                placeholder="3"
                value={form.buyQty}
                onChange={f("buyQty")}
              />
              <p className="text-[11px] text-[#a3a3a3] mt-1">Müşteri kaç ürün alsın?</p>
            </div>
            <div>
              <Label required>Kaçı Bedava</Label>
              <GBInput
                type="number"
                min="1"
                placeholder="1"
                value={form.getQty}
                onChange={f("getQty")}
              />
              <p className="text-[11px] text-[#a3a3a3] mt-1">Kaç tanesi ücretsiz olsun?</p>
            </div>
          </FieldRow>
          <div className="bg-[#f0fdf4] rounded-xl p-3 text-[13px] text-[#16a34a] font-semibold">
            → Müşteri {form.buyQty || "?"} ürün alır,{" "}
            {(Number(form.buyQty) - Number(form.getQty)) || "?"} ürün fiyatı öder.
            En ucuz{" "}
            {form.getQty || "?"} ürün bedavadır.
          </div>
          <SectionTitle>Geçerli Ürünler (opsiyonel)</SectionTitle>
          <p className="text-xs text-[#737373] -mt-1 mb-2">
            Boş bırakırsanız tüm ürünlere uygulanır.
          </p>
          <ProductPicker
            products={products}
            selected={form.productIds}
            onChange={(ids) => setForm((p) => ({ ...p, productIds: ids }))}
          />
        </>
      )}

      {/* ── TYPE: FIRST_ORDER ── */}
      {form.type === "first_order" && (
        <>
          <SectionTitle>İlk Sipariş İndirimi</SectionTitle>
          <p className="text-xs text-[#737373] -mt-1 mb-2">
            Daha önce hiç sipariş vermemiş müşterilere otomatik uygulanır. Kod girilmesi gerekmez.
          </p>
          <FieldRow>
            <div>
              <Label required>İndirim Türü</Label>
              <GBSelect
                value={form.discountType}
                onChange={f("discountType")}
                options={[
                  { value: "percentage", label: "Yüzde (%)" },
                  { value: "fixed", label: "Sabit Tutar (₺)" },
                ]}
              />
            </div>
            <div>
              <Label required>Değer</Label>
              <GBInput
                type="number"
                min="0"
                placeholder={form.discountType === "percentage" ? "10" : "50"}
                value={form.value}
                onChange={f("value")}
              />
            </div>
          </FieldRow>
          <div className="bg-[#fff7ed] rounded-xl p-3 text-[13px] text-[#ea580c] font-semibold">
            → Müşterinin sipariş geçmişi sıfırsa indirim otomatik uygulanır; kupon kodu gerekmez.
          </div>
        </>
      )}

      {/* ── Dates & Status ── */}
      <SectionTitle>Geçerlilik & Durum</SectionTitle>
      <FieldRow>
        <div>
          <Label>Başlangıç Tarihi</Label>
          <GBInput
            type="date"
            value={form.startDate}
            onChange={f("startDate")}
          />
        </div>
        <div>
          <Label>Bitiş Tarihi</Label>
          <GBInput
            type="date"
            value={form.endDate}
            onChange={f("endDate")}
          />
        </div>
      </FieldRow>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.active}
          onChange={f("active")}
          className="accent-[#b76e79] w-4 h-4"
        />
        <span className="text-sm font-semibold text-[#2d2d2d]">Aktif</span>
      </label>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────
export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [modal, setModal] = useState(null); // null | { mode: "create" | "edit", data?: {} }
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const [disc, prods] = await Promise.all([getDiscounts(), getProducts()]);
      setDiscounts(disc);
      setProducts(prods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return discounts;
    return discounts.filter((d) => d.type === filter);
  }, [discounts, filter]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setModal({ mode: "create" });
  };
  const openEdit = (row) => {
    setForm({
      ...EMPTY_FORM,
      ...row,
      productIds: row.productIds || [],
      startDate: row.startDate?.slice(0, 10) || "",
      endDate: row.endDate?.slice(0, 10) || "",
      minCartAmount: row.minCartAmount ?? "",
      usageLimit: row.usageLimit ?? "",
      value: row.value ?? "",
      buyQty: String(row.buyQty ?? 3),
      getQty: String(row.getQty ?? 1),
    });
    setFormError("");
    setModal({ mode: "edit", id: row.id });
  };

  const validate = () => {
    if (!form.name.trim()) return "İndirim adı zorunludur.";
    if (!form.type) return "İndirim türü seçiniz.";
    if (form.type !== "bxgy") {
      if (!form.value || Number(form.value) <= 0) return "Geçerli bir indirim değeri girin.";
      if (form.discountType === "percentage" && Number(form.value) > 100)
        return "Yüzde değeri 100'den fazla olamaz.";
    }
    if (form.type === "product" && form.productIds.length === 0)
      return "En az bir ürün seçiniz.";
    if (form.type === "cart_coupon" && !form.code.trim())
      return "Kupon kodu zorunludur.";
    if (form.type === "threshold" && (!form.minCartAmount || Number(form.minCartAmount) <= 0))
      return "Minimum sepet tutarı zorunludur.";
    if (form.type === "first_order" && (!form.value || Number(form.value) <= 0))
      return "Geçerli bir indirim değeri girin.";
    if (form.type === "bxgy") {
      if (Number(form.buyQty) < 2) return "Alınacak ürün sayısı en az 2 olmalıdır.";
      if (Number(form.getQty) < 1) return "Bedava ürün sayısı en az 1 olmalıdır.";
      if (Number(form.getQty) >= Number(form.buyQty)) return "Bedava ürün sayısı alınacak ürün sayısından az olmalıdır.";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError("");
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        description: form.description.trim(),
        active: form.active,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      if (form.type !== "bxgy") {
        payload.discountType = form.discountType;
        payload.value = Number(form.value);
      }
      if (form.type === "product") {
        payload.productIds = form.productIds;
      }
      if (form.type === "cart_coupon") {
        payload.code = form.code.trim().toUpperCase();
        payload.minCartAmount = form.minCartAmount ? Number(form.minCartAmount) : null;
        payload.usageLimit = form.usageLimit ? Number(form.usageLimit) : null;
        payload.publicVisible = form.publicVisible;
      }
      if (form.type === "threshold") {
        payload.minCartAmount = Number(form.minCartAmount);
      }
      // first_order: only discountType + value (already added above since type !== "bxgy")
      if (form.type === "bxgy") {
        payload.buyQty = Number(form.buyQty);
        payload.getQty = Number(form.getQty);
        payload.productIds = form.productIds;
      }

      if (modal.mode === "create") {
        await createDiscount(payload);
      } else {
        await updateDiscount(modal.id, payload);
      }
      setModal(null);
      await load();
    } catch {
      setFormError("Kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (row) => {
    await updateDiscount(row.id, { active: !row.active });
    load();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDiscount(deleteModal.id);
      setDeleteModal(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  // ── Summary stats ──
  const stats = useMemo(() => {
    const now = Date.now();
    const parseStart = (s) => s && (/^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T00:00:00") : new Date(s));
    const parseEnd   = (s) => s && (/^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T23:59:59") : new Date(s));
    const activeAll = discounts.filter((d) => {
      if (!d.active) return false;
      const start = parseStart(d.startDate);
      const end   = parseEnd(d.endDate);
      if (start && start.getTime() > now) return false;
      if (end   && end.getTime()   < now) return false;
      return true;
    });
    return {
      total: discounts.length,
      active: activeAll.length,
      byType: Object.fromEntries(
        Object.keys(TYPE_META).map((t) => [t, discounts.filter((d) => d.type === t).length])
      ),
    };
  }, [discounts]);

  const columns = [
    {
      key: "name",
      label: "İndirim Adı",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#2d2d2d] text-sm">{row.name}</p>
          {row.description && (
            <p className="text-[11px] text-[#a3a3a3] truncate max-w-[200px]">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "Tür",
      width: "140px",
      render: (row) => <TypeBadge type={row.type} />,
    },
    {
      key: "value",
      label: "Değer",
      sortable: true,
      width: "120px",
      render: (row) => (
        <span className="font-bold text-[#2d2d2d]">{formatValue(row)}</span>
      ),
    },
    {
      key: "code",
      label: "Kod / Koşul",
      width: "160px",
      render: (row) => {
        if (row.type === "cart_coupon" && row.code) {
          return (
            <code className="text-xs bg-[#f5f3ff] text-[#7c3aed] font-bold px-2 py-0.5 rounded-lg">
              {row.code}
            </code>
          );
        }
        if (row.type === "threshold" && row.minCartAmount) {
          return <span className="text-xs text-[#0891b2]">min. ₺{row.minCartAmount}</span>;
        }
        if (row.type === "product" && row.productIds?.length) {
          return <span className="text-xs text-[#737373]">{row.productIds.length} ürün</span>;
        }
        return <span className="text-xs text-[#d4d4d4]">—</span>;
      },
    },
    {
      key: "endDate",
      label: "Bitiş",
      width: "110px",
      render: (row) => {
        if (!row.endDate) return <span className="text-xs text-[#a3a3a3]">Süresiz</span>;
        const expired = new Date(row.endDate) < new Date();
        return (
          <span className={`text-xs font-medium ${expired ? "text-red-500" : "text-[#2d2d2d]"}`}>
            {new Date(row.endDate).toLocaleDateString("tr-TR")}
          </span>
        );
      },
    },
    {
      key: "active",
      label: "Durum",
      width: "100px",
      render: (row) => (
        <ActiveToggle active={row.active} onChange={() => handleToggleActive(row)} />
      ),
    },
    {
      key: "_actions",
      label: "",
      width: "80px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a3a3a3] hover:text-[#b76e79] hover:bg-[#fff0f3] transition-colors"
            title="Düzenle"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteModal(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a3a3a3] hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sil"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminGuard section="discounts">
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2d2d2d]">İndirim Yönetimi</h1>
            <p className="text-sm text-[#737373] mt-1">
              Ürün indirimleri, kupon kodları, sepet eşiği ve X Al Y Öde kampanyaları
            </p>
          </div>
          <GBButton variant="primary" icon={<Plus size={15} />} onClick={openCreate}>
            Yeni İndirim
          </GBButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Toplam", value: stats.total, color: "#2d2d2d" },
            { label: "Aktif", value: stats.active, color: "#16a34a" },
            { label: "Ürün", value: stats.byType.product ?? 0, color: "#b76e79" },
            { label: "Kupon", value: stats.byType.cart_coupon ?? 0, color: "#7c3aed" },
            { label: "Otomatik", value: (stats.byType.threshold ?? 0) + (stats.byType.bxgy ?? 0), color: "#0891b2" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#f0e8e4] p-4 text-center">
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{loading ? "—" : s.value}</p>
              <p className="text-xs text-[#737373] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "all", label: "Tümü" },
            ...Object.entries(TYPE_META).map(([k, m]) => ({ key: k, label: m.label })),
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === tab.key
                  ? "bg-[#b76e79] text-white"
                  : "bg-white border border-[#f0e8e4] text-[#737373] hover:border-[#b76e79] hover:text-[#b76e79]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-[#a3a3a3] text-sm">Yükleniyor…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#f0e8e4] p-16 text-center">
            <div className="w-12 h-12 bg-[#fff0f3] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag size={22} className="text-[#e0b4be]" />
            </div>
            <p className="text-sm font-semibold text-[#2d2d2d] mb-1">İndirim bulunamadı</p>
            <p className="text-xs text-[#a3a3a3] mb-4">Yeni bir indirim kampanyası oluşturun.</p>
            <GBButton variant="primary" size="sm" icon={<Plus size={13} />} onClick={openCreate}>
              Yeni İndirim
            </GBButton>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            searchKeys={["name", "code", "description"]}
            searchPlaceholder="İndirim ara…"
            pageSize={15}
          />
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "Yeni İndirim Oluştur" : "İndirimi Düzenle"}
        maxWidth="40rem"
      >
        {modal && (
          <>
            <DiscountForm
              form={form}
              setForm={setForm}
              products={products}
              editMode={modal.mode === "edit"}
            />
            {formError && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{formError}</p>
              </div>
            )}
            {form.type && (
              <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[#f0e8e4]">
                <GBButton variant="ghost" onClick={() => setModal(null)}>İptal</GBButton>
                <GBButton variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Kaydediliyor…" : "Kaydet"}
                </GBButton>
              </div>
            )}
          </>
        )}
      </AdminModal>

      {/* ── Delete Confirm Modal ── */}
      <AdminModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="İndirimi Sil"
        maxWidth="28rem"
      >
        {deleteModal && (
          <>
            <p className="text-sm text-[#525252]">
              <strong className="text-[#2d2d2d]">{deleteModal.name}</strong> adlı indirim kampanyası kalıcı olarak silinecek.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <GBButton variant="ghost" onClick={() => setDeleteModal(null)}>İptal</GBButton>
              <GBButton
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Siliniyor…" : "Sil"}
              </GBButton>
            </div>
          </>
        )}
      </AdminModal>
    </AdminGuard>
  );
}
