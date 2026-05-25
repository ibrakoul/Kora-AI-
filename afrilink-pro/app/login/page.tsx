"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="relative w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-xl text-white">
              Afri<span className="gradient-text-green">Link</span>{" "}
              <span className="text-gray-400">Pro</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bon retour 👋</h1>
            <p className="text-gray-400">
              Connectez-vous à votre espace professionnel africain.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Google", icon: "G", color: "hover:border-red-500/40" },
              { label: "LinkedIn", icon: "in", color: "hover:border-blue-500/40" },
            ].map(({ label, icon, color }) => (
              <button
                key={label}
                type="button"
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1f2d45] text-gray-300 hover:text-white text-sm font-semibold glass transition-all ${color}`}
              >
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1f2d45]" />
            <span className="text-gray-500 text-xs">ou continuer avec email</span>
            <div className="flex-1 h-px bg-[#1f2d45]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-premium pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                <Link href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-premium pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-blue-900/20 to-[#0A0F1C]" />
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="text-7xl mb-8 animate-float">🌍</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Le continent africain
            <br />
            <span className="gradient-text">vous attend</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-sm">
            2.4 millions de professionnels africains connectés. Rejoignez le mouvement.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 w-full max-w-sm">
            {[
              { value: "320K+", label: "Offres actives", icon: "💼" },
              { value: "85K+", label: "Entreprises", icon: "🏢" },
              { value: "12K+", label: "Formations", icon: "📚" },
              { value: "54", label: "Pays couverts", icon: "🗺️" },
            ].map(({ value, label, icon }) => (
              <div key={label} className="card-premium p-4 text-left">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
