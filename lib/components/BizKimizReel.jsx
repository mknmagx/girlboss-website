"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   GIRLBOSS – İnteraktif Sprey Reel
   
   • Kullanıcı şişenin pompasına basınca sprey sıkılır
   • Her sıkma rengarenk çiçek + mist partikülleri patlatır
   • Mouse hareketi parallax + glow takip efekti
   • Spray sayacı arttıkça sahne giderek çiçeklerle dolar
   • Mobil: dokunma desteği tam
   ═══════════════════════════════════════════════════════════════ */

/* ── Renk Paleti ── */
const PALETTE = [
  { flower: "#e83e8c", accent: "#f9a8d4", mist: "#fce7f3" },
  { flower: "#a855f7", accent: "#d8b4fe", mist: "#f3e8ff" },
  { flower: "#f59e0b", accent: "#fde68a", mist: "#fef9c3" },
  { flower: "#ec4899", accent: "#fbcfe8", mist: "#fdf2f8" },
  { flower: "#10b981", accent: "#a7f3d0", mist: "#ecfdf5" },
  { flower: "#ef4444", accent: "#fca5a5", mist: "#fef2f2" },
  { flower: "#f97316", accent: "#fed7aa", mist: "#fff7ed" },
  { flower: "#8b5cf6", accent: "#c4b5fd", mist: "#ede9fe" },
  { flower: "#b76e79", accent: "#fecdd3", mist: "#fff1f2" },
  { flower: "#06b6d4", accent: "#a5f3fc", mist: "#ecfeff" },
];

const SCENT_NOTES = [
  "Gül", "Yasemin", "Vanilya", "Şakayık", "Lavanta",
  "Bergamot", "Sümbül", "Manolya", "Iris", "Amber",
  "Sandal", "Orkide", "Zambak", "Neroli", "Paçuli",
];

/* ── SVG Çiçek Bileşeni ── */
function FlowerSVG({ size, color, accent, petals = 6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {Array.from({ length: petals }).map((_, i) => {
        const deg = (360 / petals) * i;
        const rad = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={50 + 22 * Math.cos(rad)}
            cy={50 + 22 * Math.sin(rad)}
            rx={13} ry={22}
            fill={accent}
            transform={`rotate(${deg}, ${50 + 22 * Math.cos(rad)}, ${50 + 22 * Math.sin(rad)})`}
            opacity={0.85}
          />
        );
      })}
      <circle cx={50} cy={50} r={14} fill={color} />
      <circle cx={50} cy={50} r={7} fill="white" opacity={0.3} />
    </svg>
  );
}

/* ── Tek Sprey Partikülü ── */
function MistParticle({ x, y, color, size, angle, distance, delay }) {
  const rad = (angle * Math.PI) / 180;
  const endX = Math.cos(rad) * distance;
  const endY = Math.sin(rad) * distance;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x, top: y,
        width: size, height: size,
        borderRadius: "50%",
        background: color,
        pointerEvents: "none",
        zIndex: 15,
      }}
      initial={{ opacity: 0.8, scale: 0.5, x: 0, y: 0 }}
      animate={{
        x: [0, endX * 0.4, endX * 0.8, endX],
        y: [0, endY * 0.4, endY * 0.8, endY + 20],
        opacity: [0.8, 0.6, 0.3, 0],
        scale: [0.5, 1.2, 1.8, 0.8],
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.6,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

/* ── Bloom Çiçek (Spray sonrası beliren) ── */
function BloomFlower({ x, y, colorSet, size, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 6,
        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
      }}
      initial={{ opacity: 0, scale: 0, rotate: -90 }}
      animate={{
        opacity: [0, 1, 0.85],
        scale: [0, 1.3, 1],
        rotate: [-90, 10, 0],
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <motion.div
        animate={{
          y: [0, -4, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FlowerSVG
          size={size}
          color={colorSet.flower}
          accent={colorSet.accent}
          petals={5 + Math.floor(Math.random() * 3)}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Koku Notu Toast ── */
function ScentNote({ text, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "38%",
        transform: "translateX(-50%)",
        zIndex: 30,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.7 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -10, -30], scale: [0.7, 1, 1, 0.9] }}
      transition={{ duration: 1.8, delay: delay, ease: "easeOut" }}
    >
      <span style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 999,
        padding: "6px 16px",
        fontSize: "clamp(10px, 2.5vw, 14px)",
        color: "white",
        fontWeight: 600,
        letterSpacing: "0.15em",
        whiteSpace: "nowrap",
      }}>
        ✦ {text}
      </span>
    </motion.div>
  );
}

/* ── Shockwave Ring ── */
function ShockwaveRing({ delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%", top: "42%",
        width: 20, height: 20,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.4)",
        transform: "translate(-50%, -50%)",
        zIndex: 14,
        pointerEvents: "none",
      }}
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: [0, 8, 12], opacity: [0.8, 0.2, 0] }}
      transition={{ duration: 1.0, delay, ease: "easeOut" }}
    />
  );
}

/* ═══════ ANA BİLEŞEN ═══════ */
export default function BizKimizReel() {
  const containerRef = useRef(null);
  const [sprays, setSprays] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [sprayCount, setSprayCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const bgX = useTransform(mouseX, [0, 1], [8, -8]);
  const bgY = useTransform(mouseY, [0, 1], [8, -8]);
  const glowX = useTransform(mouseX, [0, 1], ["10%", "90%"]);
  const glowY = useTransform(mouseY, [0, 1], ["10%", "90%"]);

  const handlePointerMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  /* ── SPREY SIKMA ── */
  const handleSpray = useCallback(() => {
    if (showHint) setShowHint(false);

    const id = Date.now();
    const count = sprayCount + 1;
    setSprayCount(count);

    const particles = Array.from({ length: 35 }, (_, i) => ({
      id: `${id}-p-${i}`,
      angle: -120 + Math.random() * 60,
      distance: 60 + Math.random() * 120,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 0.3,
      color: PALETTE[count % PALETTE.length].mist,
    }));

    setSprays((prev) => [...prev, { id, particles }]);

    const newFlowers = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, i) => ({
      id: `${id}-f-${i}`,
      x: 10 + Math.random() * 80,
      y: 8 + Math.random() * 45,
      size: 22 + Math.random() * 30,
      colorSet: PALETTE[(count + i) % PALETTE.length],
      delay: 0.3 + i * 0.15,
    }));
    setFlowers((prev) => [...prev.slice(-24), ...newFlowers]);

    setTimeout(() => {
      setSprays((prev) => prev.filter((s) => s.id !== id));
    }, 2500);
  }, [sprayCount, showHint]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      style={{
        aspectRatio: "4/5",
        borderRadius: "1.5rem",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(145deg, #0d0515 0%, #1a0a20 30%, #2a0e2e 60%, #0d0515 100%)",
        boxShadow: "0 32px 80px rgba(183,110,121,0.3), inset 0 0 100px rgba(100,50,120,0.1)",
        cursor: "default",
        userSelect: "none",
        touchAction: "manipulation",
      }}
    >

      {/* ══ LAYER 1: Parallax Arkaplan ══ */}
      <motion.div
        style={{
          position: "absolute", inset: -20,
          x: bgX, y: bgY,
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", borderRadius: "50%",
            width: "65%", height: "65%", top: "10%", left: "20%",
            background: "radial-gradient(circle, rgba(183,110,121,0.5) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", borderRadius: "50%",
            width: "50%", height: "50%", top: "5%", left: "0%",
            background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute", borderRadius: "50%",
            width: "45%", height: "45%", bottom: "5%", right: "0%",
            background: "radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
      </motion.div>

      {/* ══ LAYER 2: Mouse glow ══ */}
      <motion.div
        style={{
          position: "absolute",
          width: 180, height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
          left: glowX, top: glowY,
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ══ LAYER 3: Ambient yıldızlar ══ */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          style={{
            position: "absolute",
            left: `${5 + (i * 47) % 90}%`,
            top: `${3 + (i * 31) % 90}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            borderRadius: "50%",
            background: "white",
            zIndex: 2,
            pointerEvents: "none",
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 2 + (i % 4),
            delay: (i % 5) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ══ LAYER 4: Bloom çiçekleri ══ */}
      <AnimatePresence>
        {flowers.map((f) => (
          <BloomFlower key={f.id} {...f} />
        ))}
      </AnimatePresence>

      {/* ══ LAYER 5: Sprey şişe ══ */}
      <div
        style={{
          position: "absolute",
          left: "50%", bottom: "8%",
          transform: "translateX(-50%)",
          width: "clamp(90px, 25%, 140px)",
          zIndex: 20,
          cursor: "pointer",
        }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: "-30%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(183,110,121,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          animate={isPressed ? { scale: 0.96 } : { y: [0, -5, 0] }}
          transition={isPressed
            ? { duration: 0.1 }
            : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            filter: "drop-shadow(0 8px 30px rgba(183,110,121,0.5))",
          }}
        >
          <svg viewBox="0 0 120 200" fill="none" width="100%" height="100%">
            <rect x={30} y={80} width={60} height={100} rx={14} fill="url(#bGrad)" />
            <rect x={36} y={88} width={12} height={65} rx={6} fill="white" opacity={0.15} />
            <path d="M30 80 Q30 60 50 58 L70 58 Q90 60 90 80 Z" fill="url(#sGrad)" />
            <rect x={44} y={38} width={32} height={22} rx={8} fill="#a070a0" />
            <rect
              x={40} y={isPressed ? 27 : 22}
              width={40} height={16} rx={8}
              fill="#b76e79"
            />
            <rect x={76} y={isPressed ? 30 : 25} width={30} height={5} rx={2.5} fill="#9d5566" />
            {isPressed && (
              <circle cx={108} cy={32.5} r={4} fill="white" opacity={0.7}>
                <animate attributeName="r" values="3;6;3" dur="0.3s" />
                <animate attributeName="opacity" values="0.8;0.3;0" dur="0.3s" />
              </circle>
            )}
            <rect x={36} y={108} width={48} height={50} rx={8} fill="white" opacity={0.1} />
            <text x={60} y={128} textAnchor="middle" fontFamily="serif" fontSize="8" fontWeight="bold" fill="white" opacity={0.9}>GIRL</text>
            <text x={60} y={140} textAnchor="middle" fontFamily="serif" fontSize="8" fontWeight="bold" fill="white" opacity={0.9}>BOSS</text>
            <text x={60} y={150} textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fill="white" opacity={0.5}>BODY MIST</text>
            <line x1={86} y1={86} x2={84} y2={168} stroke="white" strokeWidth={1} strokeOpacity={0.08} strokeLinecap="round" />
            <defs>
              <linearGradient id="bGrad" x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor="#8b6090" />
                <stop offset="50%" stopColor="#c084a8" />
                <stop offset="100%" stopColor="#b76e79" />
              </linearGradient>
              <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b898c0" />
                <stop offset="100%" stopColor="#a070a0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Pompa tıklama alanı */}
        <div
          style={{
            position: "absolute",
            top: "5%", left: "10%",
            width: "80%", height: "22%",
            cursor: "pointer",
            zIndex: 25,
          }}
          onPointerDown={() => {
            setIsPressed(true);
            handleSpray();
          }}
          onPointerUp={() => setIsPressed(false)}
          onPointerLeave={() => setIsPressed(false)}
        />
      </div>

      {/* ══ LAYER 6: Mist partikülleri ══ */}
      <AnimatePresence>
        {sprays.map((spray) =>
          spray.particles.map((p) => (
            <MistParticle
              key={p.id}
              x="50%"
              y="42%"
              color={p.color}
              size={p.size}
              angle={p.angle}
              distance={p.distance}
              delay={p.delay}
            />
          ))
        )}
      </AnimatePresence>

      {/* ══ LAYER 7: Shockwave ══ */}
      <AnimatePresence>
        {sprays.map((spray) => (
          <ShockwaveRing key={`sw-${spray.id}`} />
        ))}
      </AnimatePresence>

      {/* ══ LAYER 8: Koku notu ══ */}
      <AnimatePresence>
        {sprays.slice(-1).map((spray) => (
          <ScentNote
            key={`sn-${spray.id}`}
            text={SCENT_NOTES[sprayCount % SCENT_NOTES.length]}
            delay={0.2}
          />
        ))}
      </AnimatePresence>

      {/* ══ LAYER 9: Aroma yayları ══ */}
      <svg
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 12,
        }}
        viewBox="0 0 400 500"
        fill="none"
      >
        <AnimatePresence>
          {sprays.map((spray) =>
            [1, 2, 3].map((i) => (
              <motion.ellipse
                key={`arc-${spray.id}-${i}`}
                cx={200} cy={210}
                rx={20 * i} ry={14 * i}
                stroke={PALETTE[sprayCount % PALETTE.length].accent}
                strokeWidth={1.2}
                fill="none"
                initial={{ scale: 0.3, opacity: 0.6 }}
                animate={{ scale: [0.3, 1.5 + i * 0.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.0 + i * 0.2, delay: i * 0.12, ease: "easeOut" }}
              />
            ))
          )}
        </AnimatePresence>
      </svg>

      {/* ══ UI: Brand ══ */}
      <div style={{
        position: "absolute", top: "4%", left: 0, right: 0,
        textAlign: "center", zIndex: 25, pointerEvents: "none",
      }}>
        <motion.p
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: "serif",
            fontSize: "clamp(20px, 5vw, 30px)",
            fontWeight: 900,
            letterSpacing: "0.3em",
            color: "white",
            textShadow: "0 2px 20px rgba(183,110,121,0.9)",
          }}
        >
          GIRLBOSS
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7] }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{
            fontSize: "clamp(8px, 2vw, 12px)",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.55)",
            marginTop: 4,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Kokunla Hükmet
        </motion.p>
      </div>

      {/* ══ UI: Spray sayacı ══ */}
      <AnimatePresence>
        {sprayCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute", top: "14%", right: "6%",
              zIndex: 25, pointerEvents: "none",
            }}
          >
            <motion.div
              key={sprayCount}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                width: "clamp(32px,8vw,44px)",
                height: "clamp(32px,8vw,44px)",
                borderRadius: "50%",
                background: "rgba(183,110,121,0.25)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "clamp(12px,3vw,16px)", fontWeight: 800, color: "white", lineHeight: 1 }}>
                {sprayCount}
              </span>
              <span style={{ fontSize: "clamp(5px,1.2vw,7px)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
                püf
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ UI: Hint ══ */}
      <AnimatePresence>
        {showHint && sprayCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0.8], y: [10, 0, 0, -2] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%", bottom: "38%",
              transform: "translateX(-50%)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <div style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: "8px 18px",
              display: "flex", alignItems: "center", gap: 8,
              whiteSpace: "nowrap",
            }}>
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ fontSize: 16 }}
              >
                👆
              </motion.span>
              <span style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "clamp(10px, 2.5vw, 13px)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}>
                Pompaya bas, kokula!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ UI: Alt bilgi ══ */}
      <div style={{
        position: "absolute", bottom: "2.5%", left: 0, right: 0,
        textAlign: "center", zIndex: 25, pointerEvents: "none",
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            display: "inline-flex", gap: 6, alignItems: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "4px 14px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{
            fontSize: "clamp(7px,1.8vw,10px)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.2em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            %100 Vegan · Cruelty-Free
          </span>
        </motion.div>
      </div>

      {/* ══ LAYER 10: Flash efekti ══ */}
      <AnimatePresence>
        {sprays.map((spray) => (
          <motion.div
            key={`flash-${spray.id}`}
            style={{
              position: "absolute", inset: 0, zIndex: 11,
              pointerEvents: "none",
              background: `radial-gradient(circle at 50% 42%, ${PALETTE[sprayCount % PALETTE.length].accent}44 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

    </div>
  );
}
