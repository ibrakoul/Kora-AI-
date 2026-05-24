"use client";

import Link from "next/link";
import { useState } from "react";
import { Brain, Mail, Lock, Eye, EyeOff, User, Building2, GraduationCap, Briefcase, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";

const accountTypes = [
  { id: "individual", icon: User, label: "Particulier", desc: "Accès personnel aux outils IA" },
  { id: "startup", icon: Briefcase, label: "Startup / PME", desc: "Outils IA pour votre équipe" },
  { id: "enterprise", icon: Building2, label: "Grande Entreprise", desc: "Solutions IA à grande échelle" },
  { id: "education", icon: GraduationCap, label: "Éducation / ONG", desc: "Tarifs spéciaux disponibles" },
];

const countries = [
  "Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Burkina Faso",
  "Niger", "Togo", "Bénin", "Cameroun", "Nigeria", "Ghana",
  "Kenya", "Tanzanie", "Rwanda", "Éthiopie", "Maroc", "Tunisie",
  "Algérie", "Égypte", "Afrique du Sud", "Autre",
];

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const labels = ["", "Faible", "Moyen", "Fort", "Très fort"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-emerald-500", "bg-violet-500"];
  return password ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? colors[strength] : "bg-[#1E2A3D]"}`} />
        ))}
      </div>
      <span className="text-[10px] text-gray-500">{labels[strength]}</span>
    </div>
  ) : null;
}

export default function KoraRegisterPage() {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    accountType: "", country: "", company: "", terms: false,
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex">
      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 dot-kora opacity-30" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg relative">
              <Brain size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#070B14] animate-pulse" />
            </div>
            <span className="font-bold text-xl text-white font-display">Kora <span className="gradient-kora">AI</span></span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white" : "bg-[#1E2A3D] text-gray-500"
                }`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? "text-white" : "text-gray-600"}`}>
                  {s === 1 ? "Compte" : "Profil"}
                </span>
                {s < 2 && <div className={`h-px w-12 ${step > s ? "bg-violet-500" : "bg-[#1E2A3D]"}`} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Créer un compte</h1>
              <p className="text-gray-400 mb-8">14 jours gratuits, aucune carte requise.</p>

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

              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom complet</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" required placeholder="Votre nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-kora pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email professionnel</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" required placeholder="vous@entreprise.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-kora pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type={showPass ? "text" : "password"} required placeholder="Minimum 8 caractères" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-kora pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-violet-500/30">
                  Continuer <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Votre profil</h1>
              <p className="text-gray-400 mb-8">Personnalisez votre expérience Kora AI.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Type de compte</label>
                  <div className="grid grid-cols-2 gap-2">
                    {accountTypes.map(({ id, icon: Icon, label, desc }) => (
                      <button key={id} type="button" onClick={() => setForm({ ...form, accountType: id })}
                        className={`p-3 rounded-xl border text-left transition-all ${form.accountType === id ? "border-violet-500/60 bg-violet-500/10" : "border-[#1E2A3D] hover:border-violet-500/30 glass"}`}>
                        <Icon size={18} className={`mb-1.5 ${form.accountType === id ? "text-violet-400" : "text-gray-500"}`} />
                        <div className={`text-xs font-semibold mb-0.5 ${form.accountType === id ? "text-white" : "text-gray-300"}`}>{label}</div>
                        <div className="text-[10px] text-gray-600">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Pays</label>
                  <select required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-kora">
                    <option value="">Sélectionnez votre pays</option>
                    {countries.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {(form.accountType === "startup" || form.accountType === "enterprise") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom de l&apos;entreprise</label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" placeholder="Votre entreprise" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-kora pl-10" />
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div onClick={() => setForm({ ...form, terms: !form.terms })} className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${form.terms ? "bg-violet-600 border-violet-600" : "border-[#1E2A3D] group-hover:border-violet-500/50"}`}>
                    {form.terms && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-xs text-gray-400">
                    J&apos;accepte les <Link href="#" className="text-violet-400 hover:text-violet-300">conditions d&apos;utilisation</Link> et la <Link href="#" className="text-violet-400 hover:text-violet-300">politique de confidentialité</Link> de Kora AI.
                  </span>
                </label>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#1E2A3D] text-gray-300 hover:text-white font-semibold rounded-xl transition-all hover:border-violet-500/30 glass">
                    <ArrowLeft size={16} />
                  </button>
                  <button type="submit" disabled={loading || !form.terms || !form.country || !form.accountType}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-violet-500/30 disabled:opacity-50">
                    {loading ? <><Loader2 size={18} className="animate-spin" />Création...</> : <>Démarrer l&apos;essai gratuit <ArrowRight size={16} /></>}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-gray-500 text-sm mt-8">
            Déjà un compte ? <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Se connecter</Link>
          </p>
        </div>
      </div>

      {/* Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-[#070B14] to-cyan-900/20" />
        <div className="absolute inset-0 grid-kora opacity-30" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Rejoignez <span className="gradient-kora">50,000+</span><br />entreprises africaines
          </h2>
          <p className="text-gray-400 max-w-sm mb-10">Automatisez vos workflows, générez du contenu en 12 langues africaines et analysez vos données avec l&apos;IA.</p>

          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: "✓", text: "14 jours d'essai gratuit" },
              { icon: "✓", text: "Aucune carte bancaire requise" },
              { icon: "✓", text: "Support en français 24/7" },
              { icon: "✓", text: "Données hébergées en Afrique" },
              { icon: "✓", text: "Annulation à tout moment" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <span className="text-violet-400 text-[10px] font-bold">{icon}</span>
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
