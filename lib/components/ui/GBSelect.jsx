"use client";

import { useState, useRef, useEffect, useId } from "react";

/**
 * GBSelect — GIRLBOSS Design System Custom Select
 *
 * Props:
 *   label    : string
 *   name     : string
 *   options  : Array<{ value: string, label: string }> | Array<string>
 *   value    : string
 *   onChange : fn(value: string)
 *   error    : string
 *   hint     : string
 *   disabled : boolean
 *   required : boolean
 *   placeholder : string
 */
export default function GBSelect({
  label,
  name,
  options = [],
  value = "",
  onChange,
  error = "",
  hint = "",
  disabled = false,
  required = false,
  placeholder = "Seçiniz",
}) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const isError = Boolean(error);
  const hasValue = value !== "" && value !== undefined && value !== null;
  const isFloating = focused || hasValue || open;

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedLabel = normalizedOptions.find((o) => o.value === value)?.label || "";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (optValue) => {
    onChange && onChange(optValue);
    setOpen(false);
    setFocused(false);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    width: "100%",
    position: "relative",
  };

  const triggerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: disabled ? "#f9f5f3" : "#ffffff",
    border: `1.5px solid ${isError ? "#e53e3e" : open ? "#b76e79" : "#e8d5d8"}`,
    borderRadius: open ? "0.875rem 0.875rem 0 0" : "0.875rem",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, border-radius 0.15s ease",
    boxShadow: open ? `0 0 0 3px rgba(183,110,121,0.12)` : "none",
    paddingLeft: "1rem",
    paddingRight: "0.875rem",
    paddingTop: label ? "1.3rem" : "0.875rem",
    paddingBottom: label ? "0.4rem" : "0.875rem",
    minHeight: "3.25rem",
    cursor: disabled ? "not-allowed" : "pointer",
    boxSizing: "border-box",
    userSelect: "none",
  };

  const labelStyle = {
    position: "absolute",
    left: "1rem",
    top: isFloating ? "0.45rem" : "50%",
    transform: isFloating ? "translateY(0)" : "translateY(-50%)",
    fontSize: isFloating ? "0.6875rem" : "0.9375rem",
    fontWeight: isFloating ? "600" : "400",
    color: isError ? "#e53e3e" : open ? "#b76e79" : "#a38892",
    pointerEvents: "none",
    transition: "all 0.18s ease",
    letterSpacing: isFloating ? "0.04em" : "0",
    userSelect: "none",
  };

  const valueStyle = {
    fontSize: "0.9375rem",
    color: hasValue ? "#2d2d2d" : "#a38892",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const chevronStyle = {
    display: "flex",
    alignItems: "center",
    color: open ? "#b76e79" : "#c4a0a7",
    transition: "transform 0.2s ease, color 0.2s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    flexShrink: 0,
    marginLeft: "0.5rem",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#ffffff",
    border: "1.5px solid #b76e79",
    borderTop: "1px solid #f3e8ea",
    borderRadius: "0 0 0.875rem 0.875rem",
    boxShadow: "0 12px 32px rgba(183,110,121,0.18)",
    zIndex: 1000,
    maxHeight: "14rem",
    overflowY: "auto",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle} ref={wrapRef}>
      {/* Hidden native select for form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Custom trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={uid}
        tabIndex={disabled ? -1 : 0}
        style={triggerStyle}
        onClick={() => !disabled && (setOpen((o) => !o), setFocused(true))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); !disabled && setOpen((o) => !o); }
          if (e.key === "Escape") { setOpen(false); setFocused(false); }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!open) setFocused(false); }}
      >
        {label && (
          <label id={uid} style={labelStyle}>
            {label}{required && " *"}
          </label>
        )}
        <span style={valueStyle}>
          {hasValue ? selectedLabel : (isFloating ? placeholder : "")}
        </span>
        <span style={chevronStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={dropdownStyle} role="listbox">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "0.9375rem",
                  color: isSelected ? "#b76e79" : "#2d2d2d",
                  fontWeight: isSelected ? "600" : "400",
                  background: isSelected ? "#fff0f2" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.12s",
                  borderBottom: "1px solid #fdf0f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = "#fff7f8")}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = "transparent")}
              >
                {opt.label}
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isError && (
        <span style={{ fontSize: "0.75rem", color: "#e53e3e", paddingLeft: "0.25rem", fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!isError && hint && (
        <span style={{ fontSize: "0.75rem", color: "#a38892", paddingLeft: "0.25rem" }}>
          {hint}
        </span>
      )}
    </div>
  );
}
