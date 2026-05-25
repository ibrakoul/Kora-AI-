"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Moon,
} from "lucide-react";
import AppSidebar from "@/components/layout/AppSidebar";
import Avatar from "@/components/ui/Avatar";
import { useAuthContext } from "@/components/providers/AuthProvider";

/* ============================================================
   AfriLink Pro – Dashboard Layout Wrapper
   ============================================================ */

export interface DashboardLayoutProps {
  children:    React.ReactNode;
  currentPath?: string;
  user?: {
    name:       string;
    role:       string;
    avatarSrc?: string;
    verified?:  boolean;
    premium?:   boolean;
  };
}

const SIDEBAR_WIDTH = 260;

/* ---------- Dropdown Menu Item ---------- */
function DropdownItem({
  icon: Icon,
  label,
  href,
  danger,
  onClick,
}: {
  icon:    React.ElementType;
  label:   string;
  href?:   string;
  danger?: boolean;
  onClick?: () => void;
}) {
  const className = [
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
    "transition-colors duration-150 cursor-pointer w-full text-left",
    danger
      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
      : "text-gray-300 hover:bg-white/5 hover:text-white",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        <Icon size={15} className="shrink-0" />
        {label}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type="button">
      <Icon size={15} className="shrink-0" />
      {label}
    </button>
  );
}

/* ---------- Notification Item ---------- */
function NotificationItem({
  avatar, name, message, time, unread,
}: {
  avatar?: string;
  name:    string;
  message: string;
  time:    string;
  unread:  boolean;
}) {
  return (
    <div
      className={[
        "flex gap-3 px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer",
        unread ? "bg-emerald-500/5" : "",
      ].join(" ")}
    >
      <Avatar src={avatar} name={name} size="sm" className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-100 leading-snug">
          <span className="font-semibold">{name}</span>{" "}
          <span className="text-gray-400">{message}</span>
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">{time}</p>
      </div>
      {unread && (
        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
      )}
    </div>
  );
}

const mockNotifications = [
  { id: 1, name: "Amara Diallo",   message: "a commenté votre post.",       time: "Il y a 5 min",  unread: true  },
  { id: 2, name: "Fatou Camara",   message: "vous a envoyé une invitation.", time: "Il y a 20 min", unread: true  },
  { id: 3, name: "Ibrahim Traoré", message: "a partagé votre article.",      time: "Il y a 1h",     unread: false },
  { id: 4, name: "AfriLink Pro",   message: "Votre profil a été vérifié !",  time: "Il y a 2h",     unread: false },
];

/* ---------- Main Layout ---------- */
export default function DashboardLayout({
  children,
  currentPath = "/dashboard",
  user: userProp,
}: DashboardLayoutProps) {
  const { profile, signOut } = useAuthContext();
  const router = useRouter();

  const resolvedUser = userProp ?? {
    name:     profile ? `${profile.first_name} ${profile.last_name}` : "Utilisateur",
    role:     profile?.headline ?? "AfriLink Pro",
    verified: profile?.is_verified ?? false,
    premium:  profile ? profile.premium_tier !== 'free' : false,
  };

  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [userMenuOpen,     setUserMenuOpen]      = useState(false);
  const [notifOpen,        setNotifOpen]         = useState(false);
  const [searchFocused,    setSearchFocused]     = useState(false);
  const [searchValue,      setSearchValue]       = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Close sidebar overlay on desktop resize */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <div className="flex h-screen bg-[#0A0F1C] overflow-hidden">

      {/* ──────────────── SIDEBAR (desktop, fixed) ──────────────── */}
      <div
        className="hidden lg:flex flex-col shrink-0"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <AppSidebar currentPath={currentPath} user={resolvedUser} />
      </div>

      {/* ──────────────── SIDEBAR (mobile, overlay) ──────────────── */}
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        className={[
          "fixed top-0 left-0 z-50 h-full lg:hidden",
          "transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <AppSidebar currentPath={currentPath} user={resolvedUser} />
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* ──────────────── MAIN AREA ──────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Top Header ── */}
        <header className="flex items-center gap-4 px-4 sm:px-6 h-16 shrink-0 bg-[#0A0F1C] border-b border-[#1f2d45] z-30">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative">
            <Search
              size={15}
              className={[
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150",
                searchFocused ? "text-emerald-400" : "text-gray-500",
              ].join(" ")}
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher des personnes, emplois, formations…"
              className="input-premium !pl-9 !py-2 text-sm"
              aria-label="Rechercher"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Effacer la recherche"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1 hidden sm:block" />

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* ── Notifications Bell ── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label={`${unreadCount} nouvelles notifications`}
                aria-expanded={notifOpen}
                aria-haspopup="true"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0A0F1C]" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl glass border border-[#1f2d45] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-scale-in"
                  role="menu"
                  aria-label="Notifications"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2d45]">
                    <h3 className="text-sm font-semibold text-gray-100">Notifications</h3>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      Tout marquer lu
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-[#1f2d45]/50">
                    {mockNotifications.map((notif) => (
                      <NotificationItem key={notif.id} {...notif} />
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#1f2d45]">
                    <Link
                      href="/dashboard/notifications"
                      className="block text-center text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium py-1"
                      onClick={() => setNotifOpen(false)}
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── User Avatar Dropdown ── */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                aria-label="Menu utilisateur"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={resolvedUser.avatarSrc}
                  name={resolvedUser.name}
                  size="sm"
                  ring
                  verified={resolvedUser.verified}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-100 leading-none">{resolvedUser.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-none max-w-[100px] truncate">{resolvedUser.role}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={[
                    "text-gray-500 group-hover:text-gray-300 transition-all duration-200",
                    userMenuOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass border border-[#1f2d45] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-scale-in"
                  role="menu"
                  aria-label="Options utilisateur"
                >
                  {/* User header */}
                  <div className="px-4 py-3 border-b border-[#1f2d45]">
                    <p className="text-sm font-semibold text-gray-100 truncate">{resolvedUser.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{resolvedUser.role}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <DropdownItem
                      icon={User}
                      label="Mon profil"
                      href="/dashboard/profil"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <DropdownItem
                      icon={Settings}
                      label="Paramètres"
                      href="/dashboard/parametres"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <DropdownItem
                      icon={Moon}
                      label="Apparence"
                      href="/dashboard/apparence"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <DropdownItem
                      icon={HelpCircle}
                      label="Aide & Support"
                      href="/aide"
                      onClick={() => setUserMenuOpen(false)}
                    />
                  </div>

                  <div className="p-1.5 border-t border-[#1f2d45]">
                    <DropdownItem
                      icon={LogOut}
                      label="Déconnexion"
                      danger
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                        router.push('/login');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main
          className="flex-1 overflow-y-auto bg-[#0A0F1C]"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
