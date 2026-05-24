"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

/* ============================================================
   AfriLink Pro – Button Component
   ============================================================ */

type Variant = "primary" | "secondary" | "royal" | "accent" | "ghost" | "danger";
type Size    = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: Variant;
  /** Size preset */
  size?: Size;
  /** Show loading spinner and disable the button */
  loading?: boolean;
  /** Icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label */
  rightIcon?: React.ReactNode;
  /** Stretch to full width of container */
  fullWidth?: boolean;
  /** Remove border-radius (useful inside button groups) */
  square?: boolean;
}

/* ---------- Style Maps ---------- */
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 " +
    "text-white shadow-[0_0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] " +
    "border border-emerald-500/20 active:scale-[0.98]",

  secondary:
    "bg-transparent border border-[#1f2d45] hover:border-emerald-500/40 hover:bg-emerald-500/5 " +
    "text-gray-300 hover:text-white active:scale-[0.98]",

  royal:
    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 " +
    "text-white shadow-[0_0_0_0_rgba(37,99,235,0)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] " +
    "border border-blue-600/20 active:scale-[0.98]",

  accent:
    "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 " +
    "text-white shadow-[0_0_0_0_rgba(249,115,22,0)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] " +
    "border border-orange-500/20 active:scale-[0.98]",

  ghost:
    "bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200 " +
    "border border-transparent active:scale-[0.98]",

  danger:
    "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 " +
    "text-white border border-red-600/20 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  xs: "h-7  px-2.5 text-xs  gap-1.5 rounded-md",
  sm: "h-8  px-3   text-sm  gap-2   rounded-md",
  md: "h-10 px-4   text-sm  gap-2   rounded-lg",
  lg: "h-11 px-5   text-base gap-2.5 rounded-lg",
  xl: "h-13 px-7   text-base gap-3   rounded-xl",
};

const loadingSpinnerSize: Record<Size, number> = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 18,
};

/* ---------- Component ---------- */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size    = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      square    = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = [
      "inline-flex items-center justify-center",
      "font-semibold tracking-wide",
      "transition-all duration-200 ease-out",
      "select-none cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1C]",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      square ? "!rounded-none" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const spinnerSize = loadingSpinnerSize[size];

    return (
      <button ref={ref} className={baseClasses} disabled={isDisabled} {...rest}>
        {loading ? (
          <Loader2
            size={spinnerSize}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {children && (
          <span className={loading ? "opacity-70" : ""}>{children}</span>
        )}

        {!loading && rightIcon && (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
