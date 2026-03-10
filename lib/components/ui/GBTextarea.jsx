"use client";

import { useState, useId } from "react";

/**
 * GBTextarea — GIRLBOSS Design System Textarea
 *
 * Props:
 *   label      : string
 *   name       : string
 *   rows       : number  — default 5
 *   value      : string
 *   onChange   : fn
 *   placeholder: string
 *   error      : string
 *   hint       : string
 *   disabled   : boolean
 *   required   : boolean
 *   maxLength  : number
 *   showCount  : boolean — shows char count when maxLength is set
 */
export default function GBTextarea({
  label,
  name,
  rows = 5,
  value = "",
  onChange,
  placeholder = "",
  error = "",
  hint = "",
  disabled = false,
  required = false,
  maxLength,
  showCount = false,
}) {
  const uid = useId();
  const [focused, setFocused] = useState(false);

  const hasValue = value !== "" && value !== undefined && value !== null;
  const isFloating = focused || hasValue;
  const isError = Boolean(error);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    width: "100%",
  };

  const fieldWrapStyle = {
    position: "relative",
    background: disabled ? "#f9f5f3" : "#ffffff",
    border: `1.5px solid ${isError ? "#e53e3e" : focused ? "#b76e79" : "#e8d5d8"}`,
    borderRadius: "0.875rem",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused ? `0 0 0 3px rgba(183,110,121,0.12)` : "none",
    overflow: "hidden",
  };

  const labelStyle = {
    position: "absolute",
    left: "1rem",
    top: isFloating ? "0.5rem" : "1.1rem",
    fontSize: isFloating ? "0.6875rem" : "0.9375rem",
    fontWeight: isFloating ? "600" : "400",
    color: isError ? "#e53e3e" : focused ? "#b76e79" : "#a38892",
    pointerEvents: "none",
    transition: "all 0.18s ease",
    letterSpacing: isFloating ? "0.04em" : "0",
    userSelect: "none",
  };

  const textareaStyle = {
    width: "100%",
    paddingTop: label ? "1.6rem" : "0.875rem",
    paddingBottom: showCount && maxLength ? "1.75rem" : "0.875rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    fontSize: "0.9375rem",
    color: disabled ? "#a38892" : "#2d2d2d",
    background: "transparent",
    border: "none",
    outline: "none",
    resize: "vertical",
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: "inherit",
    lineHeight: "1.6",
    boxSizing: "border-box",
    minHeight: `${rows * 1.6 + 3}rem`,
  };

  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div style={containerStyle}>
      <div style={fieldWrapStyle}>
        {label && (
          <label htmlFor={uid} style={labelStyle}>
            {label}{required && " *"}
          </label>
        )}
        <textarea
          id={uid}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          style={textareaStyle}
        />
        {showCount && maxLength && (
          <span style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.75rem",
            fontSize: "0.6875rem",
            color: charCount >= maxLength ? "#e53e3e" : "#c4a0a7",
            userSelect: "none",
          }}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

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
