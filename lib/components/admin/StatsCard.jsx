"use client";

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "#b76e79", trend }) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0e8e4] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          {Icon && <Icon size={18} style={{ color }} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-[#2d2d2d]">{value}</p>
      <p className="text-xs text-[#737373] mt-0.5">{title}</p>
      {subtitle && <p className="text-[10px] text-[#a3a3a3] mt-1">{subtitle}</p>}
    </div>
  );
}
