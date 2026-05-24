"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
  MessageSquare,
  Bell,
  Crown,
  Zap,
  ChevronRight,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

/* ============================================================
   AfriLink Pro – Dashboard Sidebar
   ============================================================ */

export interface AppSidebarProps {
  currentPath?: string;
  user?: {
    name: string;
    role: string;
    avatarSrc?: string;
    verified?: boolean;
    premium?: boolean;
  };
}

interface NavItem {
  label:    string;
  href:     string;
  icon:     React.ElementType;
  badge?:   string | number;
  premium?: boolean;
}

const navItems: NavItem[] = [
  { label: "Accueil",         href: "/dashboard",            icon: Home },
  { label: "Mon profil",      href: "/dashboard/profil",     icon: User },
  { label: "Réseau",          href: "/dashboard/reseau",     icon: Users,        badge: "12" },
  { label: "Emplois",         href: "/dashboard/emplois",    icon: Briefcase },
  { label: "Stages",          href: "/dashboard/stages",     icon: GraduationCap },
  { label: "Formations",      href: "/dashboard/formations", icon: BookOpen },
  { label: "Appels d'offres", href: "/dashboard/appels",     icon: FileText },
  { label: "Messages",        href: "/dashboard/messages",   icon: MessageSquare, badge: 3 },
  { label: "Notifications",   href: "/dashboard/notifications", icon: Bell,       badge: "•" },
  { label: "Premium",         href: "/dashboard/premium",    icon: Crown,        premium: true },
];

const defaultUser = {
  name:     "Utilisateur AfriLink",
  role:     "Professionnel",
  verified: false,
  premium:  false,
};

/* ---------- Single Nav Item ---------- */
function SidebarLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "sidebar-item",
        isActive ? "active" : "",
        item.premium && !isActive
          ? "text-orange-400/80 hover:text-orange-300"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={["sidebar-icon shrink-0", item.premium ? "text-orange-400" : ""].filter(Boolean).join(" ")}>
        <Icon size={18} aria-hidden="true" />
      </span>

      <span className="flex-1 truncate">{item.label}</span>

      {/* Badge / notification count */}
      {item.badge !== undefined && (
        <span
          className={[
            "ml-auto shrink-0 flex items-center justify-center min-w-[18px] h-[18px] px-1",
            "rounded-full text-[10px] font-bold leading-none",
            item.badge === "•"
              ? "text-emerald-400 text-base leading-none"
              : isActive
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-[#1f2d45] text-gray-300",
          ].join(" ")}
        >
          {item.badge}
        </span>
      )}

      {item.premium && (
        <Crown size={12} className="shrink-0 text-orange-400" aria-hidden="true" />
      )}
    </Link>
  );
}

/* ---------- Main Sidebar Component ---------- */
export default function AppSidebar({
  currentPath = "/dashboard",
  user        = defaultUser,
}: AppSidebarProps) {
  const resolvedUser = { ...defaultUser, ...user };

  return (
    <aside
      className="flex flex-col h-full w-full bg-[#0A0F1C] border-r border-[#1f2d45] overflow-hidden"
      aria-label="Sidebar de navigation"
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1f2d45] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.45)]">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-[15px] tracking-tight">
            <span className="gradient-text-green">Afri</span>
            <span className="text-white">Link</span>
            <span className="text-emerald-400 text-xs align-super">Pro</span>
          </span>
          <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">
            Réseau Pro Africain
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar space-y-0.5"
        aria-label="Navigation principale"
      >
        {/* Main nav items */}
        {navItems.slice(0, -1).map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            isActive={
              item.href === "/dashboard"
                ? currentPath === "/dashboard"
                : currentPath.startsWith(item.href)
            }
          />
        ))}

        {/* Divider before Premium */}
        <div className="divider my-3" />

        {/* Premium item */}
        <SidebarLink
          item={navItems[navItems.length - 1]}
          isActive={currentPath.startsWith("/dashboard/premium")}
        />

        {/* Upgrade prompt for non-premium users */}
        {!resolvedUser.premium && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-orange-400" />
              <span className="text-xs font-semibold text-orange-300">Passer à Premium</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">
              Accédez à tous les emplois, recruteurs et fonctionnalités avancées.
            </p>
            <Link
              href="/dashboard/premium"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold hover:from-orange-400 hover:to-amber-400 transition-all duration-150"
            >
              Essayer gratuitement
              <ChevronRight size={12} />
            </Link>
          </div>
        )}
      </nav>

      {/* ── User Profile Card ── */}
      <div className="shrink-0 p-3 border-t border-[#1f2d45]">
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1e2d42] transition-colors duration-150 group"
        >
          <Avatar
            src={resolvedUser.avatarSrc}
            name={resolvedUser.name}
            size="sm"
            online
            verified={resolvedUser.verified}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-sm font-semibold text-gray-100 truncate leading-none">
                {resolvedUser.name}
              </p>
              {resolvedUser.verified && (
                <Badge variant="verified" size="sm" showIcon className="shrink-0 !py-0 !px-1 !text-[9px]">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{resolvedUser.role}</p>
            {resolvedUser.premium && (
              <Badge variant="premium" size="sm" showIcon className="mt-1 !py-0 !px-1.5 !text-[9px]" />
            )}
          </div>
          <ChevronRight
            size={14}
            className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0"
          />
        </Link>
      </div>
    </aside>
  );
}
