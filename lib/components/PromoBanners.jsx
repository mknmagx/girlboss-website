"use client";

/**
 * PromoBanners
 * ─────────────────────────────────────────────────────────────────────────
 * Bold, eye-catching campaign banners for the cart page.
 * Each discount type gets its own fully custom visual design:
 *
 *  threshold   → "SÜPER TASARRUF" — magenta/crimson burst with sparkle ring
 *  bxgy        → "3 AL 2 ÖDE"     — teal/emerald with layered wave shapes
 *  cart_coupon → coupon code pill  — deep violet/indigo with dashed border & scissor graphic
 *  first_order → "İLK SİPARİŞ"    — golden amber/orange with confetti dots
 *
 * Usage:
 *   import PromoBanners from "@/lib/components/PromoBanners";
 *   <PromoBanners discounts={allDiscounts} testMode={false} />
 *
 *   testMode=true  → shows ALL discounts regardless of active/date (dev preview)
 *   testMode=false → shows only active ones that match banner criteria
 */

import { motion } from "framer-motion";

// ─── helpers ────────────────────────────────────────────────────────────────
function parseStart(s) {
  if (!s) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T00:00:00") : new Date(s);
}
function parseEnd(s) {
  if (!s) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T23:59:59") : new Date(s);
}
function isActive(d) {
  if (!d.active) return false;
  const now = Date.now();
  const s = parseStart(d.startDate);
  const e = parseEnd(d.endDate);
  if (s && s.getTime() > now) return false;
  if (e && e.getTime() < now) return false;
  return true;
}

function isBannerType(d) {
  return (
    d.type === "threshold" ||
    d.type === "bxgy" ||
    d.type === "first_order" ||
    (d.type === "cart_coupon" && d.publicVisible)
  );
}

// ─── Shared animation ───────────────────────────────────────────────────────
const bannerVariants = {
  hidden: { opacity: 0, y: -14, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Pulse keyframe helper (inline because we can't use @keyframes easily) ──
// We use framer-motion animate loop instead.
function PulseRing({ color }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── THRESHOLD banner ────────────────────────────────────────────────────────
function ThresholdBanner({ d, i }) {
  const valueLabel =
    d.discountType === "percentage" ? `%${d.value} İNDİRİM` : `₺${d.value} İNDİRİM`;
  const minLabel = `₺${d.minCartAmount} üzeri sepette`;

  return (
    <motion.div
      custom={i}
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "linear-gradient(115deg, #c2185b 0%, #e91e8c 45%, #880e4f 100%)",
        boxShadow: "0 20px 50px rgba(194,24,91,0.45), 0 4px 16px rgba(194,24,91,0.3)",
        display: "flex",
        alignItems: "center",
        minHeight: "6rem",
      }}
    >
      {/* bg texture: diagonal lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "repeating-linear-gradient(-48deg,transparent,transparent 8px,rgba(255,255,255,0.04) 8px,rgba(255,255,255,0.04) 10px)",
      }} />
      {/* large ghost blob top-right */}
      <div style={{ position:"absolute", top:"-3rem", right:"-3rem", width:"12rem", height:"12rem", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
      {/* small blob bottom-left */}
      <div style={{ position:"absolute", bottom:"-2rem", left:"30%", width:"7rem", height:"7rem", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
      {/* scattered glyphs */}
      {["✦","◆","×","○","◇","✦","×"].map((g, k) => (
        <span key={k} style={{
          position:"absolute",
          top: `${[12,70,35,80,20,65,45][k]}%`,
          left: `${[5,9,38,45,72,80,90][k]}%`,
          fontSize: ["0.7rem","0.5rem","0.85rem","0.55rem","0.6rem","0.5rem","0.75rem"][k],
          color:"#fff", opacity: 0.12, pointerEvents:"none", userSelect:"none",
        }}>{g}</span>
      ))}

      {/* LEFT: icon zone */}
      <div style={{ padding: "1.25rem 1rem 1.25rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <div style={{ position:"relative", width:"3.25rem", height:"3.25rem" }}>
          <PulseRing color="rgba(255,255,255,0.6)" />
          <div style={{
            width:"100%", height:"100%", borderRadius:"50%",
            background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.4)",
            backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.4rem",
          }}>⚡</div>
        </div>
      </div>

      {/* CENTER: text */}
      <div style={{ flex:1, minWidth:0, padding:"1.1rem 0.5rem" }}>
        <p style={{ fontSize:"0.62rem", fontWeight:800, color:"rgba(255,255,255,0.75)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"0.2rem" }}>
          🎁 FIRSAT KAMPANYASI
        </p>
        <p style={{ fontSize:"1.35rem", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.025em", textShadow:"0 2px 10px rgba(0,0,0,0.2)", marginBottom:"0.2rem" }}>
          {d.name}
        </p>
        <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.72)", fontWeight:500, lineHeight:1.4 }}>
          {d.description || minLabel + " otomatik uygulanır"}
        </p>
      </div>

      {/* RIGHT: big value */}
      <div style={{ padding:"1rem 1.5rem 1rem 0.75rem", flexShrink:0, textAlign:"center" }}>
        <motion.div
          animate={{ boxShadow: ["0 0 0 rgba(255,255,255,0.2)","0 0 20px rgba(255,255,255,0.5)","0 0 0 rgba(255,255,255,0.2)"] }}
          transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
          style={{
            background:"rgba(255,255,255,0.15)",
            border:"2px solid rgba(255,255,255,0.5)",
            borderRadius:"14px",
            padding:"0.6rem 1rem",
            backdropFilter:"blur(10px)",
          }}
        >
          <p style={{ fontSize:"1.65rem", fontWeight:900, color:"#fff", lineHeight:1, letterSpacing:"-0.03em", textShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
            {valueLabel.split(" ")[0]}
          </p>
          <p style={{ fontSize:"0.6rem", fontWeight:800, color:"rgba(255,255,255,0.8)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            indirim
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── BXGY banner ─────────────────────────────────────────────────────────────
function BxgyBanner({ d, i }) {
  const buy = d.buyQty ?? 3;
  const get = d.getQty ?? 1;
  const free = get;

  return (
    <motion.div
      custom={i}
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "linear-gradient(115deg, #00695c 0%, #00bfa5 50%, #004d40 100%)",
        boxShadow: "0 20px 50px rgba(0,105,92,0.5), 0 4px 16px rgba(0,191,165,0.25)",
        display: "flex",
        alignItems: "center",
        minHeight: "6rem",
      }}
    >
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(-48deg,transparent,transparent 8px,rgba(255,255,255,0.04) 8px,rgba(255,255,255,0.04) 10px)",
      }} />
      <div style={{ position:"absolute", top:"-3rem", right:"-3rem", width:"11rem", height:"11rem", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-2.5rem", left:"28%", width:"8rem", height:"8rem", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
      {/* wave shape decorations */}
      <div style={{ position:"absolute", right:"44%", top:"-2rem", width:"5rem", height:"9rem", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.1)", pointerEvents:"none" }} />

      {["✦","◆","×","○","◇","✦"].map((g, k) => (
        <span key={k} style={{
          position:"absolute",
          top:`${[15,72,32,82,18,60][k]}%`,
          left:`${[6,10,36,46,74,88][k]}%`,
          fontSize:["0.65rem","0.5rem","0.8rem","0.5rem","0.6rem","0.5rem"][k],
          color:"#fff", opacity:0.11, pointerEvents:"none", userSelect:"none",
        }}>{g}</span>
      ))}

      {/* LEFT: big X AL Y ÖDE */}
      <div style={{ padding:"1.25rem 0.5rem 1.25rem 1.5rem", flexShrink:0 }}>
        <p style={{ fontSize:"0.6rem", fontWeight:800, color:"rgba(255,255,255,0.7)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"0.15rem" }}>
          🎉 KAMPANYA
        </p>
        <div style={{ display:"flex", alignItems:"baseline", gap:"0.3rem" }}>
          <span style={{ fontSize:"2.4rem", fontWeight:900, color:"#fff", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,0.2)", letterSpacing:"-0.04em" }}>{buy}</span>
          <span style={{ fontSize:"1rem", fontWeight:800, color:"rgba(255,255,255,0.85)" }}>AL</span>
          <span style={{ fontSize:"2.4rem", fontWeight:900, color:"#fff", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,0.2)", letterSpacing:"-0.04em" }}>{buy - free}</span>
          <span style={{ fontSize:"1rem", fontWeight:800, color:"rgba(255,255,255,0.85)" }}>ÖDE</span>
        </div>
      </div>

      {/* vertical divider */}
      <div style={{ width:"1px", alignSelf:"60%", background:"rgba(255,255,255,0.2)", margin:"0 0.75rem", flexShrink:0 }} />

      {/* CENTER: text */}
      <div style={{ flex:1, minWidth:0, padding:"1.1rem 0.5rem" }}>
        <p style={{ fontSize:"1.05rem", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:"0.25rem" }}>
          {d.name}
        </p>
        <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.72)", fontWeight:500, lineHeight:1.4 }}>
          {d.description || `En ucuz ${free} ürün sepete bedavaya gelir`}
        </p>
      </div>

      {/* RIGHT: free badge */}
      <div style={{ padding:"1rem 1.4rem 1rem 0.5rem", flexShrink:0 }}>
        <motion.div
          animate={{ rotate: [-2, 2, -2], boxShadow: ["0 0 0 rgba(255,255,255,0.2)","0 0 18px rgba(255,255,255,0.5)","0 0 0 rgba(255,255,255,0.2)"] }}
          transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}
          style={{
            background:"rgba(255,255,255,0.18)",
            border:"2px solid rgba(255,255,255,0.55)",
            borderRadius:"12px",
            padding:"0.5rem 0.9rem",
            backdropFilter:"blur(10px)",
            textAlign:"center",
          }}
        >
          <p style={{ fontSize:"0.6rem", fontWeight:800, color:"rgba(255,255,255,0.8)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {free} ÜRÜN
          </p>
          <p style={{ fontSize:"1.2rem", fontWeight:900, color:"#fff", lineHeight:1, letterSpacing:"-0.02em" }}>
            BEDAVA
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── CART COUPON banner ──────────────────────────────────────────────────────
function CouponBanner({ d, i }) {
  const valueLabel =
    d.discountType === "percentage" ? `%${d.value} İNDİRİM` : `₺${d.value} İNDİRİM`;

  return (
    <motion.div
      custom={i}
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "linear-gradient(115deg, #4527a0 0%, #7b1fa2 50%, #1a0072 100%)",
        boxShadow: "0 20px 50px rgba(69,39,160,0.5), 0 4px 16px rgba(123,31,162,0.3)",
        display: "flex",
        alignItems: "center",
        minHeight: "6rem",
      }}
    >
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(-48deg,transparent,transparent 8px,rgba(255,255,255,0.035) 8px,rgba(255,255,255,0.035) 10px)",
      }} />
      <div style={{ position:"absolute", top:"-3rem", right:"-3rem", width:"12rem", height:"12rem", borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-2rem", left:"35%", width:"7rem", height:"7rem", borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
      {/* small star burst top-right */}
      <div style={{ position:"absolute", right:"calc(33% - 1px)", top:0, bottom:0, width:"2px", backgroundImage:"repeating-linear-gradient(to bottom, rgba(255,255,255,0.2) 4px, transparent 4px, transparent 8px)", pointerEvents:"none" }} />

      {["✦","◆","×","○","◇","✦","×"].map((g, k) => (
        <span key={k} style={{
          position:"absolute",
          top:`${[10,72,30,80,22,62,45][k]}%`,
          left:`${[5,10,37,44,73,82,91][k]}%`,
          fontSize:["0.7rem","0.5rem","0.85rem","0.55rem","0.6rem","0.5rem","0.75rem"][k],
          color:"#fff", opacity:0.11, pointerEvents:"none", userSelect:"none",
        }}>{g}</span>
      ))}

      {/* LEFT: tag icon zone */}
      <div style={{ padding:"1.25rem 1rem 1.25rem 1.5rem", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"relative", width:"3.25rem", height:"3.25rem" }}>
          <PulseRing color="rgba(255,255,255,0.5)" />
          <div style={{
            width:"100%", height:"100%", borderRadius:"50%",
            background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.4)",
            backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.4rem",
          }}>🏷️</div>
        </div>
      </div>

      {/* CENTER: text */}
      <div style={{ flex:1, minWidth:0, padding:"1.1rem 0.5rem" }}>
        <p style={{ fontSize:"0.6rem", fontWeight:800, color:"rgba(255,255,255,0.7)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"0.15rem" }}>
          ✨ ÖZEL KUPON KODU
        </p>
        <p style={{ fontSize:"1.25rem", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em", textShadow:"0 2px 10px rgba(0,0,0,0.2)", marginBottom:"0.25rem" }}>
          {d.name}
        </p>
        <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.7)", fontWeight:500 }}>
          {d.description || (d.minCartAmount ? `₺${d.minCartAmount} üzeri alışverişlerde geçerli` : "Tüm ürünlerde geçerli")}
        </p>
      </div>

      {/* RIGHT: code + value */}
      <div style={{ padding:"1rem 1.4rem 1rem 0.75rem", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem" }}>
        {/* dashed coupon pill */}
        <motion.div
          animate={{ boxShadow: ["0 0 0 rgba(255,255,255,0.2)","0 0 22px rgba(255,255,255,0.55)","0 0 0 rgba(255,255,255,0.2)"] }}
          transition={{ duration:2.4, repeat:Infinity, ease:"easeInOut" }}
          style={{
            background:"rgba(255,255,255,0.14)",
            border:"2px dashed rgba(255,255,255,0.6)",
            borderRadius:"10px",
            padding:"0.35rem 0.85rem",
            backdropFilter:"blur(10px)",
            textAlign:"center",
          }}
        >
          <p style={{ fontSize:"1.05rem", fontWeight:900, color:"#fff", letterSpacing:"0.06em", textShadow:"0 1px 8px rgba(0,0,0,0.2)" }}>
            {d.code}
          </p>
        </motion.div>
        <p style={{ fontSize:"0.7rem", fontWeight:800, color:"rgba(255,255,255,0.85)", letterSpacing:"0.04em", textAlign:"center" }}>
          {valueLabel}
        </p>
      </div>
    </motion.div>
  );
}

// ─── FIRST ORDER banner ──────────────────────────────────────────────────────
function FirstOrderBanner({ d, i }) {
  const valueLabel =
    d.discountType === "percentage" ? `%${d.value} İNDİRİM` : `₺${d.value} İNDİRİM`;

  // confetti dots positions
  const CONFETTI = [
    { top:"18%", left:"48%", color:"#fff176", size:"0.45rem" },
    { top:"72%", left:"50%", color:"#fff176", size:"0.35rem" },
    { top:"25%", left:"55%", color:"rgba(255,255,255,0.6)", size:"0.4rem" },
    { top:"65%", left:"60%", color:"rgba(255,255,255,0.5)", size:"0.3rem" },
    { top:"15%", left:"67%", color:"#ffcc02", size:"0.5rem" },
    { top:"78%", left:"70%", color:"#ffcc02", size:"0.35rem" },
  ];

  return (
    <motion.div
      custom={i}
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "linear-gradient(115deg, #e65100 0%, #ff8f00 45%, #bf360c 100%)",
        boxShadow: "0 20px 50px rgba(230,81,0,0.5), 0 4px 16px rgba(255,143,0,0.3)",
        display: "flex",
        alignItems: "center",
        minHeight: "6rem",
      }}
    >
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(-48deg,transparent,transparent 8px,rgba(255,255,255,0.04) 8px,rgba(255,255,255,0.04) 10px)",
      }} />
      <div style={{ position:"absolute", top:"-3rem", right:"-3rem", width:"12rem", height:"12rem", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-2rem", left:"30%", width:"7rem", height:"7rem", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

      {/* confetti dots */}
      {CONFETTI.map((c, k) => (
        <motion.div
          key={k}
          animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8 + k * 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ position:"absolute", top:c.top, left:c.left, width:c.size, height:c.size, borderRadius:"50%", background:c.color, pointerEvents:"none" }}
        />
      ))}
      {["✦","◆","×","○","◇","✦","×"].map((g, k) => (
        <span key={k} style={{
          position:"absolute",
          top:`${[10,72,30,80,22,62,45][k]}%`,
          left:`${[5,10,37,44,73,82,91][k]}%`,
          fontSize:["0.7rem","0.5rem","0.85rem","0.55rem","0.6rem","0.5rem","0.75rem"][k],
          color:"#fff", opacity:0.12, pointerEvents:"none", userSelect:"none",
        }}>{g}</span>
      ))}

      {/* LEFT: icon */}
      <div style={{ padding:"1.25rem 1rem 1.25rem 1.5rem", flexShrink:0 }}>
        <div style={{ position:"relative", width:"3.25rem", height:"3.25rem" }}>
          <PulseRing color="rgba(255,255,255,0.55)" />
          <div style={{
            width:"100%", height:"100%", borderRadius:"50%",
            background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.45)",
            backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.4rem",
          }}>🎊</div>
        </div>
      </div>

      {/* CENTER: text */}
      <div style={{ flex:1, minWidth:0, padding:"1.1rem 0.5rem" }}>
        <p style={{ fontSize:"0.6rem", fontWeight:800, color:"rgba(255,255,255,0.75)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"0.15rem" }}>
          🌟 İLK SİPARİŞ ÖZEL TEKLİF
        </p>
        <p style={{ fontSize:"1.3rem", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.025em", textShadow:"0 2px 10px rgba(0,0,0,0.2)", marginBottom:"0.2rem" }}>
          {d.name}
        </p>
        <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.72)", fontWeight:500, lineHeight:1.4 }}>
          {d.description || "İlk siparişinize özel indirim fırsatı"}
        </p>
      </div>

      {/* RIGHT: value */}
      <div style={{ padding:"1rem 1.4rem 1rem 0.75rem", flexShrink:0 }}>
        <motion.div
          animate={{ boxShadow: ["0 0 0 rgba(255,255,255,0.2)","0 0 22px rgba(255,255,255,0.55)","0 0 0 rgba(255,255,255,0.2)"] }}
          transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
          style={{
            background:"rgba(255,255,255,0.16)",
            border:"2px solid rgba(255,255,255,0.5)",
            borderRadius:"14px",
            padding:"0.6rem 1rem",
            backdropFilter:"blur(10px)",
            textAlign:"center",
          }}
        >
          <p style={{ fontSize:"1.6rem", fontWeight:900, color:"#fff", lineHeight:1, letterSpacing:"-0.03em", textShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
            {d.discountType === "percentage" ? `%${d.value}` : `₺${d.value}`}
          </p>
          <p style={{ fontSize:"0.58rem", fontWeight:800, color:"rgba(255,255,255,0.8)", letterSpacing:"0.09em", textTransform:"uppercase" }}>
            indirim
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
/**
 * @param {{ discounts: object[], testMode?: boolean }} props
 * testMode=true  → show ALL discount types as banners (for dev preview)
 * testMode=false → only active banners with publicVisible / threshold / bxgy / first_order
 */
export default function PromoBanners({ discounts = [], testMode = false, isFirstOrder = false }) {
  const visible = (testMode
    ? discounts.filter(isBannerType)
    : discounts.filter((d) => isActive(d) && isBannerType(d))
  ).filter((d) => d.type !== "first_order" || isFirstOrder);

  if (!visible.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {visible.map((d, i) => {
        if (d.type === "threshold")   return <ThresholdBanner  key={d.id} d={d} i={i} />;
        if (d.type === "bxgy")        return <BxgyBanner       key={d.id} d={d} i={i} />;
        if (d.type === "cart_coupon") return <CouponBanner      key={d.id} d={d} i={i} />;
        if (d.type === "first_order") return <FirstOrderBanner  key={d.id} d={d} i={i} />;
        return null;
      })}
    </div>
  );
}
