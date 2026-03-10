"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * GBButton — GIRLBOSS Design System Button
 *
 * variant: "primary" | "secondary" | "outline" | "ghost" | "white" | "danger"
 * size: "sm" | "md" | "lg"
 * shape: "pill" | "rounded"
 * fullWidth: boolean
 * loading: boolean
 * icon: ReactNode (left icon)
 * iconRight: ReactNode (right icon)
 * href: string → renders as <Link>
 */

const VARIANTS = {
  primary: {
    background: "linear-gradient(135deg, #b76e79, #c4587a)",
    color: "#ffffff",
    border: "none",
    hoverBg: "linear-gradient(135deg, #a35e68, #b04a6c)",
    shadow: "0 4px 20px rgba(183,110,121,0.35)",
  },
  secondary: {
    background: "#ffffff",
    color: "#b76e79",
    border: "2px solid #b76e79",
    hoverBg: "#fff5f5",
    shadow: "0 2px 12px rgba(183,110,121,0.12)",
  },
  outline: {
    background: "transparent",
    color: "#b76e79",
    border: "1.5px solid #e8c5c9",
    hoverBg: "#fff5f5",
    shadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "#b76e79",
    border: "none",
    hoverBg: "rgba(183,110,121,0.07)",
    shadow: "none",
  },
  white: {
    background: "#ffffff",
    color: "#b76e79",
    border: "none",
    hoverBg: "#fff5f5",
    shadow: "0 4px 20px rgba(0,0,0,0.12)",
  },
  danger: {
    background: "linear-gradient(135deg, #e53e3e, #c53030)",
    color: "#ffffff",
    border: "none",
    hoverBg: "linear-gradient(135deg, #c53030, #9b2c2c)",
    shadow: "0 4px 16px rgba(229,62,62,0.3)",
  },
  social: {
    background: "#ffffff",
    color: "#2d2d2d",
    border: "1.5px solid #e8d8d3",
    hoverBg: "#faf6f3",
    shadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
};

const SIZES = {
  sm: { padding: "0.5rem 1.25rem", fontSize: "0.75rem", gap: "0.375rem", iconSize: 13, minHeight: "2rem" },
  md: { padding: "0.75rem 1.75rem", fontSize: "0.8125rem", gap: "0.5rem", iconSize: 15, minHeight: "2.75rem" },
  lg: { padding: "1rem 2.5rem", fontSize: "0.9375rem", gap: "0.625rem", iconSize: 17, minHeight: "3.25rem" },
};

export default function GBButton({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  href = null,
  onClick,
  type = "button",
  className = "",
  style = {},
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const borderRadius = shape === "pill" ? "9999px" : "0.875rem";
  const isDisabled = disabled || loading;

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontWeight: "700",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderRadius,
    border: v.border || "none",
    background: v.background,
    color: v.color,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    whiteSpace: "nowrap",
    minHeight: s.minHeight,
    textDecoration: "none",
    boxSizing: "border-box",
    width: fullWidth ? "100%" : "auto",
    boxShadow: v.shadow,
    transition: "all 0.18s ease",
    ...style,
  };

  const content = (
    <>
      {loading ? (
        <svg
          style={{ width: s.iconSize, height: s.iconSize, flexShrink: 0 }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
          </path>
        </svg>
      ) : (
        icon && (
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {icon}
          </span>
        )
      )}
      {children && (
        <span style={{ display: "flex", alignItems: "center" }}>{children}</span>
      )}
      {!loading && iconRight && (
        <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {iconRight}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.div whileHover={!isDisabled ? { scale: 1.03 } : {}} whileTap={!isDisabled ? { scale: 0.97 } : {}}>
        <Link href={href} style={baseStyle} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      style={baseStyle}
      className={className}
    >
      {content}
    </motion.button>
  );
}
