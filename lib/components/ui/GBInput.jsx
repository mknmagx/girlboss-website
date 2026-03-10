"use client";

import { useState, useId } from "react";

/**
 * GBInput — GIRLBOSS Design System Input
 *
 * Props:
 *   label        : string  — floating label text
 *   name         : string
 *   type         : string  — default "text"
 *   value        : string
 *   onChange     : fn
 *   placeholder  : string  — shown when focused (not the floating label)
 *   icon         : ReactNode — left icon (Lucide component etc.)
 *   iconRight    : ReactNode — right action slot (password toggle, clear, etc.)
 *   error        : string  — error message below field
 *   hint         : string  — hint text below field (shown when no error)
 *   disabled     : boolean
 *   required     : boolean
 *   autoComplete : string
 *   maxLength    : number
 */
export default function GBInput({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  icon = null,
  iconRight = null,
  error = "",
  hint = "",
  disabled = false,
  required = false,
  autoComplete,
  maxLength,
  inputRef,
}) {
  const uid = useId();
  const [focused, setFocused] = useState(false);

  const hasValue = value !== "" && value !== undefined && value !== null;
  const isFloating = focused || hasValue;
  const isError = Boolean(error);
  const iconLeft = icon;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    width: "100%",
  };

  const fieldWrapStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: disabled ? "#f9f5f3" : "#ffffff",
    border: `1.5px solid ${isError ? "#e53e3e" : focused ? "#b76e79" : "#e8d5d8"}`,
    borderRadius: "0.875rem",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused ? `0 0 0 3px rgba(183,110,121,0.12)` : "none",
    overflow: "hidden",
    cursor: disabled ? "not-allowed" : "text",
  };

  const innerPadLeft = iconLeft ? "2.875rem" : "1rem";
  const innerPadRight = iconRight ? "2.875rem" : "1rem";

  const labelStyle = {
    position: "absolute",
    left: iconLeft ? "2.875rem" : "1rem",
    top: isFloating ? "0.45rem" : "50%",
    transform: isFloating ? "translateY(0)" : "translateY(-50%)",
    fontSize: isFloating ? "0.6875rem" : "0.9375rem",
    fontWeight: isFloating ? "600" : "400",
    color: isError ? "#e53e3e" : focused ? "#b76e79" : "#a38892",
    pointerEvents: "none",
    transition: "all 0.18s ease",
    whiteSpace: "nowrap",
    letterSpacing: isFloating ? "0.04em" : "0",
    userSelect: "none",
  };

  const inputStyle = {
    width: "100%",
    paddingTop: label ? "1.3rem" : "0.875rem",
    paddingBottom: label ? "0.4rem" : "0.875rem",
    paddingLeft: innerPadLeft,
    paddingRight: innerPadRight,
    fontSize: "0.9375rem",
    color: disabled ? "#a38892" : "#2d2d2d",
    background: "transparent",
    border: "none",
    outline: "none",
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: "inherit",
    minHeight: "3.25rem",
    boxSizing: "border-box",
  };

  const iconStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isError ? "#e53e3e" : focused ? "#b76e79" : "#c4a0a7",
    pointerEvents: "none",
    transition: "color 0.18s ease",
  };

  const iconRightStyle = {
    ...iconStyle,
    right: "0.875rem",
    pointerEvents: "auto",
    cursor: "pointer",
    padding: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      <div style={fieldWrapStyle} onClick={() => !disabled && document.getElementById(uid)?.focus()}>
        {/* Left icon */}
        {iconLeft && (
          <span style={{ ...iconStyle, left: "0.875rem" }}>
            {iconLeft}
          </span>
        )}

        {/* Floating label */}
        {label && (
          <label htmlFor={uid} style={labelStyle}>
            {label}{required && " *"}
          </label>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          id={uid}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          style={inputStyle}
        />

        {/* Right icon / action */}
        {iconRight && (
          <span style={iconRightStyle}>
            {iconRight}
          </span>
        )}
      </div>

      {/* Error / hint */}
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
