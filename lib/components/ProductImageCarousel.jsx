"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function ProductImageCarousel({
  images = [],
  gradient,
  badge,
  alt,
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const count = images.length;

  const goTo = (index, dir) => {
    setDirection(dir);
    setCurrent(index);
  };

  const prev = () => goTo((current - 1 + count) % count, -1);
  const next = () => goTo((current + 1) % count, 1);

  /* ── Touch / swipe ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    // Only swipe horizontally if horizontal movement > 40px and more horizontal than vertical
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!images || count === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {/* ── Main carousel frame ── */}
      <div
        style={{
          position: "relative",
          borderRadius: "1.5rem",
          overflow: "hidden",
          aspectRatio: "1 / 1",
          background: gradient,
          touchAction: "pan-y",
          userSelect: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide */}
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src={images[current]}
              alt={alt || ""}
              fill
              priority={current === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDIzMCwyMzUsMC44KSIvPjwvc3ZnPg=="
              style={{
                objectFit: "cover",
                objectPosition: "center",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              background: "linear-gradient(to right, #b76e79, #e890a8)",
              color: "#fff",
              fontSize: "11px",
              letterSpacing: "0.1em",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "0.375rem 1rem",
              borderRadius: "9999px",
              zIndex: 10,
            }}
          >
            {badge}
          </div>
        )}

        {/* Arrow buttons — only when multiple images */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Önceki görsel"
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                border: "none",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.85)")
              }
            >
              <ChevronLeft size={18} color="#2d2d2d" />
            </button>

            <button
              onClick={next}
              aria-label="Sonraki görsel"
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                border: "none",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.85)")
              }
            >
              <ChevronRight size={18} color="#2d2d2d" />
            </button>

            {/* Slide counter pill */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                background: "rgba(0,0,0,0.35)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
                zIndex: 10,
                letterSpacing: "0.05em",
              }}
            >
              {current + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip — only when multiple images ── */}
      {count > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.625rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              aria-label={`Görsel ${i + 1}`}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              style={{
                position: "relative",
                width: "3.75rem",
                height: "3.75rem",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border:
                  i === current
                    ? "2.5px solid #b76e79"
                    : "2.5px solid transparent",
                outline: "none",
                background: gradient,
                padding: 0,
                cursor: "pointer",
                flexShrink: 0,
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow:
                  i === current ? "0 0 0 3px rgba(183,110,121,0.2)" : "none",
              }}
            >
              <Image
                src={img}
                alt=""
                fill
                loading="lazy"
                draggable={false}
                sizes="64px"
                style={{
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
