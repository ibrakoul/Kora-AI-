"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

/* ============================================================
   AfriLink Pro – Landing Page Navbar
   ============================================================ */

const navLinks = [
  { label: "Accueil",    href: "/" },
  { label: "Emplois",    href: "/emplois" },
  { label: "Formations", href: "/formations" },
  { label: "À propos",   href: "/a-propos" },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  /* Track scroll for background blur */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-out",
          scrolled
            ? "bg-[#0A0F1C]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 group flex-shrink-0"
              aria-label="AfriLink Pro – Accueil"
            >
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.7)] transition-shadow duration-300">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="gradient-text-green">Afri</span>
                <span className="text-white">Link</span>
                <span className="text-emerald-400 text-base align-super ml-0.5">Pro</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTA Buttons ── */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/connexion">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/inscription">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ChevronRight size={14} />}
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Menu Panel ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu mobile"
        className={[
          "fixed top-16 left-0 right-0 z-50 md:hidden",
          "bg-[#0A0F1C]/95 backdrop-blur-xl border-b border-white/5",
          "transition-all duration-300 ease-out origin-top",
          mobileOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}

          <div className="divider my-2" />

          <div className="flex flex-col gap-2 pb-2">
            <Link href="/connexion" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="md" fullWidth>
                Connexion
              </Button>
            </Link>
            <Link href="/inscription" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="md" fullWidth rightIcon={<ChevronRight size={15} />}>
                S&apos;inscrire gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
