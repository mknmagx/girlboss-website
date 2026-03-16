"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Note pill positions ───────────────────── */
const NOTE_POSITIONS = [
  { top: "11%", left: "3%" },
  { top: "42%", right: "3%" },
  { top: "72%", left: "3%" },
];



/* ═══════════════════════════════════════════════
   ProductReelScene — one product's animated scene
   ═══════════════════════════════════════════════ */
function ProductReelScene({ product }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>

      {/* Glow blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute", top: "46%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "360px", height: "360px", borderRadius: "50%",
          background: `radial-gradient(circle, ${product.color}45 0%, transparent 68%)`,
          filter: "blur(36px)", pointerEvents: "none",
        }}
      />

      {/* Bottle — entry wrapper (fade + scale) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.78, y: -20 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: "46%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Infinite float — separate from entry so it always runs */}
        <motion.div
          animate={{ y: [0, -13, 0] }}
          transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={480}
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{
              height: "clamp(200px, 38vh, 480px)",
              width: "auto",
              maxWidth: "unset",
              objectFit: "contain",
              filter: `drop-shadow(0 22px 50px ${product.color}60) drop-shadow(0 8px 20px rgba(0,0,0,0.14))`,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Product name + tagline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.38, delay: 0.18 }}
        style={{
          position: "absolute", bottom: "5%", left: 0, right: 0,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "1.35rem", fontWeight: 900, color: "#2d2d2d",
            letterSpacing: "-0.02em", lineHeight: 1.1,
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontSize: "0.68rem", color: "#b76e79", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px",
          }}
        >
          {product.tagline}
        </p>
      </motion.div>

      {/* Floating note pills */}
      {product.notes.map((note, i) => (
        <motion.div
          key={`${product.id}-${note}`}
          initial={{ opacity: 0, scale: 0.72, x: i % 2 === 0 ? -14 : 14 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.72 }}
          transition={{ duration: 0.32, delay: 0.1 + i * 0.11 }}
          style={{
            position: "absolute",
            ...NOTE_POSITIONS[i],
            padding: "0.35rem 0.85rem",
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${product.color}28`,
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#3a3a3a",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 6px 20px rgba(0,0,0,0.09), 0 0 0 1px ${product.color}20`,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          ✦ {note}
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HeroReelPanel — full right-side panel (export)
   ═══════════════════════════════════════════════ */
export function HeroReelPanel({ product }) {
  return (
    <div
      className="relative w-full max-w-75 sm:max-w-sm mx-auto lg:max-w-full"
      style={{ height: "clamp(340px, 50vh, 600px)" }}
    >
      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.1, 1], opacity: [0.28, 0, 0.28] }}
          transition={{ duration: 3.8, delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "46%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "160px", height: "160px",
            borderRadius: "50%",
            border: `1.5px solid ${product.color}55`,
            pointerEvents: "none",
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        <ProductReelScene key={product.id} product={product} />
      </AnimatePresence>
    </div>
  );
}
