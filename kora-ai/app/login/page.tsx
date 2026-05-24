"use client";

import Link from "next/link";
import { useState } from "react";
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function KoraLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex">
      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 dot-kora opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg relative">
              <Brain size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#070B14] animate-pulse" />
            </div>
            <span className="font-bold text-xl text-white font-display">Kora <span className="gradient-kora">AI</span></span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Bon retour 👋</h1>
          <p className="text-gray-400 mb-8">Connectez-vous pour accéder à vos outils IA africains.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ label: "Google", icon: "G" }, { label: "Microsoft", icon: "M" }].map(({ label, icon }) => (
              <button key={label} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1E2A3D] text-gray-300 hover:text-white text-sm font-semibold glass transition-all hover:border-violet-500/30">
                <span className="font-bold">{icon}</span>{label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1E2A3D]" />
            <span className="text-gray-500 text-xs">ou avec email</span>
            <div className="flex-1 h-px bg-[#1E2A3D]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" required placeholder="vous@entreprise.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-kora pl-10" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 font-medium">Oublié ?</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-kora pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-violet-500/30 disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin" />Connexion...</> : <>Se connecter <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Pas de compte ? <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Essai gratuit 14 jours</Link>
          </p>
        </div>
      </div>

      {/* Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-[#070B14] to-cyan-900/20" />
        <div className="absolute inset-0 grid-kora opacity-30" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 border border-violet-500/10 rounded-full animate-spin-slow" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl mb-8 animate-float">
            <Brain size={36} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">L&apos;IA au service<br /><span className="gradient-kora">de l&apos;Afrique</span></h2>
          <p className="text-gray-400 max-w-sm mb-8">50,000+ entreprises africaines font confiance à Kora AI pour automatiser leurs processus.</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {[{ v: "12", l: "Langues africaines" }, { v: "180M+", l: "Requêtes / mois" }, { v: "50K+", l: "Entreprises" }, { v: "99.9%", l: "Uptime" }].map(({ v, l }) => (
              <div key={l} className="card-kora p-4 text-left">
                <div className="text-xl font-bold gradient-kora mb-0.5">{v}</div>
                <div className="text-xs text-gray-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
