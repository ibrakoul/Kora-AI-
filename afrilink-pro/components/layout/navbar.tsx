"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Emplois", href: "/jobs" },
  { label: "Formations", href: "/formations" },
  { label: "Entreprises", href: "/reseau" },
  { label: "À propos", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-[#1f2d45]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-white">
              Afri<span className="gradient-text-green">Link</span>{" "}
              <span className="text-gray-400">Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              S'inscrire gratuitement
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-[#1f2d45] px-4 py-4 space-y-2 animate-slide-right">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <span className="font-medium">{link.label}</span>
              <ChevronRight size={16} className="text-gray-600" />
            </Link>
          ))}
          <div className="pt-2 space-y-2 border-t border-[#1f2d45]">
            <Link
              href="/login"
              className="flex items-center justify-center w-full py-3 text-sm font-semibold text-gray-300 border border-[#1f2d45] rounded-xl hover:border-emerald-500/40 hover:text-white transition-all"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl"
            >
              S'inscrire gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}