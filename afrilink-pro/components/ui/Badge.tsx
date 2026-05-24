"use client";

import React from "react";
import { CheckCircle2, Crown, Zap, Flame, Tag } from "lucide-react";

/* ============================================================
   AfriLink Pro – Badge Component
   ============================================================ */

type BadgeVariant = "verified" | "premium" | "new" | "hot" | "default";
type BadgeSize    = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

/* ---------- Style Maps ---------- */
const variantStyles: Record<BadgeVariant, string> = {
  verified:
    "bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 " +
    "[background:rgba(16,185,129,0.12)]",
  premium:
    "bg-orange-500/12 text-orange-300 border border-orange-500/25 " +
    "[background:rgba(249,115,22,0.12)]",
  new:
    "bg-blue-500/12 text-blue-300 border border-blue-500/25 " +
    "[background:rgba(37,99,235,0.12)]",
  hot:
    "bg-red-500/12 text-red-300 border border-red-500/25 " +
    "[background:rgba(239,68,68,0.12)]",
  default:
    "bg-white/5 text-gray-400 border border-white/10",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5 gap-1",
  md: "text-xs    px-2.5 py-1 gap-1.5",
};

const defaultLabels: Record<BadgeVariant, string> = {
  verified: "Vérifié",
  premium:  "Premium",
  new:      "Nouveau",
  hot:      "Populaire",
  default:  "Badge",
};

const VariantIcon: Record<BadgeVariant, React.ElementType> = {
  verified: CheckCircle2,
  premium:  Crown,
  new:      Zap,
  hot:      Flame,
  default:  Tag,
};

const iconSizeMap: Record<BadgeSize, number> = {
  sm: 10,
  md: 12,
};

/* ---------- Component ---------- */
export default function Badge({
  variant   = "default",
  size      = "md",
  children,
  showIcon  = true,
  className = "",
}: BadgeProps) {
  const Icon     = VariantIcon[variant];
  const iconSize = iconSizeMap[size];
  const label    = children ?? defaultLabels[variant];

  return (
    <span
      className={[
        "inline-flex items-center justify-center font-semibold",
        "rounded-full tracking-wider uppercase select-none",
        "leading-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showIcon && (
        <Icon size={iconSize} className="shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </span>
  );
}
