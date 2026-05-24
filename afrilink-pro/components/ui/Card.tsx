"use client";

import React from "react";

/* ============================================================
   AfriLink Pro – Card Component
   ============================================================ */

type CardPadding = "none" | "sm" | "md" | "lg" | "xl";
type CardVariant = "default" | "glass" | "gradient" | "flat";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Internal padding preset */
  padding?: CardPadding;
  /** Enable the lift + border glow hover effect */
  hover?: boolean;
  /** Optional glow color on hover */
  glowColor?: "green" | "blue" | "orange" | "none";
  /** Render as a different element (e.g., "article", "section") */
  as?: React.ElementType;
}

/* ---------- Style Maps ---------- */
const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-[#111827] border border-[#1f2d45]",
  glass:
    "glass",
  gradient:
    "bg-gradient-card border border-[#1f2d45]",
  flat:
    "bg-[#111827] border border-transparent",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-6",
  xl:   "p-8",
};

const glowStyles: Record<string, string> = {
  green:  "hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(16,185,129,0.25)] hover:border-emerald-500/30",
  blue:   "hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.25)]  hover:border-blue-500/30",
  orange: "hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(249,115,22,0.25)] hover:border-orange-500/30",
  none:   "hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]",
};

/* ---------- Component ---------- */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant    = "default",
      padding    = "md",
      hover      = false,
      glowColor  = "green",
      as: Tag    = "div",
      className  = "",
      children,
      ...rest
    },
    ref
  ) => {
    const hoverClasses = hover
      ? [
          "transition-all duration-250 ease-out cursor-pointer",
          "hover:-translate-y-0.5",
          glowStyles[glowColor],
        ].join(" ")
      : "";

    const classes = [
      "rounded-2xl",
      "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
      variantStyles[variant],
      paddingStyles[padding],
      hoverClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classes} {...rest}>
        {children}
      </Tag>
    );
  }
);

Card.displayName = "Card";

/* ---------- Sub-components ---------- */
export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex items-center justify-between gap-3 mb-4", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={["text-base font-semibold text-gray-100 leading-snug", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={["text-sm text-gray-400 leading-relaxed", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#1f2d45]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
