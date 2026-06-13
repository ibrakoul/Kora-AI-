"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Sparkles, Briefcase, Users, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh dot-grid" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-emerald-500/20 animate-fade-up">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-sm text-gray-300">
            La plateforme professionnelle{" "}
            <span className="text-emerald-400 font-semibold">#1 en Afrique</span>
          </span>
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
          <span className="text-white">Le futur des</span>
          <br />
          <span className="gradient-text">talents africains</span>
          <br />
          <span className="text-white">commence ici.</span>
        </h1>

        {/* Subline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 animate-fade-up delay-200">
          AfriLink Pro connecte{" "}
          <strong className="text-white">professionnels, entreprises et opportunités</strong>{" "}
          à travers les 54 pays africains. Emplois, stages, formations, appels d'offres — tout en un.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up delay-300">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all"
          >
            Rejoindre gratuitement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 glass border border-[#1f2d45] rounded-2xl hover:border-emerald-500/40 hover:text-white transition-all">
            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Play size={12} className="text-emerald-400 ml-0.5" fill="currentColor" />
            </div>
            Voir la démo
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 animate-fade-up delay-400">
          {["Gratuit pour commencer", "Sans carte bancaire", "54 pays couverts", "500K+ inscrits"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              {item}
            </span>
          ))}
        </div>

        {/* Hero image / preview */}
        <div className="mt-20 relative animate-fade-up delay-500">
          <div className="relative max-w-5xl mx-auto">
            {/* Glow effect behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-600/20 to-orange-500/20 rounded-3xl blur-2xl" />

            {/* Mock dashboard preview */}
            <div className="relative glass border border-[#1f2d45] rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f2d45] bg-[#111827]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-[#1f2d45] rounded-md flex items-center px-3">
                  <span className="text-xs text-gray-500">afrilink.pro/dashboard</span>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="bg-[#0A0F1C] p-6 grid grid-cols-12 gap-4 min-h-[300px]">
                {/* Sidebar */}
                <div className="col-span-2 space-y-1">
                  {["🏠", "👤", "👥", "💼", "📚", "💬"].map((icon, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                        i === 0 ? "bg-emerald-500/10 text-emerald-400" : "text-gray-600"
                      }`}
                    >
                      <span>{icon}</span>
                      <div
                        className={`h-2 rounded ${
                          i === 0 ? "bg-emerald-500/30 w-12" : "bg-[#1f2d45] w-8"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Main feed */}
                <div className="col-span-7 space-y-3">
                  {[
                    { color: "emerald", w: "w-32" },
                    { color: "blue", w: "w-24" },
                    { color: "orange", w: "w-28" },
                  ].map(({ color, w }, i) => (
                    <div key={i} className="card-premium p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-full bg-${color}-500/20 border border-${color}-500/30`}
                        />
                        <div className="space-y-1">
                          <div className={`h-2.5 bg-[#1f2d45] rounded ${w}`} />
                          <div className="h-2 bg-[#1a2236] rounded w-16" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-[#1a2236] rounded w-full" />
                        <div className="h-2 bg-[#1a2236] rounded w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right panel */}
                <div className="col-span-3 space-y-3">
                  <div className="card-premium p-3">
                    <div className="h-2.5 bg-emerald-500/20 rounded w-20 mb-3" />
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#1f2d45]" />
                        <div className="h-2 bg-[#1a2236] rounded flex-1" />
                      </div>
                    ))}
                  </div>
                  <div className="card-premium p-3 border-emerald-500/20">
                    <div className="h-2.5 bg-blue-500/20 rounded w-16 mb-3" />
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5">
                        <div className="w-5 h-5 rounded bg-[#1f2d45]" />
                        <div className="space-y-1 flex-1">
                          <div className="h-2 bg-[#1a2236] rounded" />
                          <div className="h-1.5 bg-[#111827] rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-8 top-1/3 card-premium p-3 flex items-center gap-3 shadow-xl hidden lg:flex">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Briefcase size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">320K+ emplois</div>
                <div className="text-xs text-gray-500">Disponibles maintenant</div>
              </div>
            </div>

            <div className="absolute -right-8 top-1/4 card-premium p-3 flex items-center gap-3 shadow-xl hidden lg:flex">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">2.4M+ membres</div>
                <div className="text-xs text-gray-500">54 pays africains</div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 card-premium p-3 flex items-center gap-3 shadow-xl hidden lg:flex">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-orange-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">+180% de recrutements</div>
                <div className="text-xs text-gray-500">En 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}