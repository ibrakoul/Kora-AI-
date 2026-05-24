"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

/* ============================================================
   AfriLink Pro – Avatar Component
   ============================================================ */

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  /** Image URL */
  src?: string | null;
  /** Full name – used to derive initials fallback */
  name?: string;
  /** Alt text for the image */
  alt?: string;
  size?: AvatarSize;
  /** Show a gradient ring border */
  ring?: boolean;
  /** Show a green online indicator dot */
  online?: boolean;
  /** Show a small verified checkmark overlay */
  verified?: boolean;
  className?: string;
}

/* ---------- Style Maps ---------- */
const sizeMap: Record<AvatarSize, { container: string; text: string; img: number; dot: string; badge: string }> = {
  "xs":  { container: "w-6  h-6",  text: "text-[9px]  font-semibold",  img: 24,  dot: "w-1.5 h-1.5 border",       badge: "w-3  h-3  -bottom-0.5 -right-0.5" },
  "sm":  { container: "w-8  h-8",  text: "text-[11px] font-semibold",  img: 32,  dot: "w-2   h-2   border",       badge: "w-3.5 h-3.5 -bottom-0.5 -right-0.5" },
  "md":  { container: "w-10 h-10", text: "text-sm     font-semibold",  img: 40,  dot: "w-2.5 h-2.5 border-2",    badge: "w-4  h-4  -bottom-0.5 -right-0.5" },
  "lg":  { container: "w-12 h-12", text: "text-base   font-bold",      img: 48,  dot: "w-3   h-3   border-2",    badge: "w-5  h-5  -bottom-1 -right-1" },
  "xl":  { container: "w-16 h-16", text: "text-xl     font-bold",      img: 64,  dot: "w-3.5 h-3.5 border-2",    badge: "w-5  h-5  -bottom-0.5 -right-0.5" },
  "2xl": { container: "w-24 h-24", text: "text-3xl    font-bold",      img: 96,  dot: "w-4   h-4   border-2",    badge: "w-6  h-6  -bottom-0.5 -right-0.5" },
};

/* ---------- Helpers ---------- */
function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name?: string): string {
  const colors = [
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-orange-500 to-amber-600",
    "from-purple-500 to-violet-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-sky-600",
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/* ---------- Component ---------- */
export default function Avatar({
  src,
  name,
  alt,
  size     = "md",
  ring     = false,
  online   = false,
  verified = false,
  className = "",
}: AvatarProps) {
  const s       = sizeMap[size];
  const initials = getInitials(name);
  const gradient = getColorFromName(name);

  const inner = (
    <div className={["relative shrink-0 inline-flex", className].filter(Boolean).join(" ")}>
      {/* Ring wrapper */}
      <div
        className={[
          "relative rounded-full overflow-hidden flex items-center justify-center",
          s.container,
          ring
            ? "ring-2 ring-offset-2 ring-offset-[#0A0F1C] ring-emerald-500/60"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? name ?? "Avatar"}
            width={s.img}
            height={s.img}
            className="object-cover w-full h-full"
            unoptimized={src.startsWith("http")}
          />
        ) : (
          <div
            className={[
              "w-full h-full flex items-center justify-center",
              "bg-gradient-to-br text-white select-none",
              gradient,
            ].join(" ")}
          >
            <span className={s.text}>{initials}</span>
          </div>
        )}
      </div>

      {/* Online indicator */}
      {online && (
        <span
          className={[
            "absolute rounded-full bg-emerald-400 border-[#0A0F1C]",
            "bottom-0 right-0",
            s.dot,
          ].join(" ")}
          aria-label="En ligne"
        />
      )}

      {/* Verified badge */}
      {verified && !online && (
        <span
          className={[
            "absolute flex items-center justify-center",
            "rounded-full bg-[#0A0F1C]",
            s.badge,
          ].join(" ")}
          aria-label="Compte vérifié"
        >
          <CheckCircle2 className="w-full h-full text-emerald-400" />
        </span>
      )}
    </div>
  );

  return inner;
}
