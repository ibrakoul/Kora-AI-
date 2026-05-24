"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Building2, GraduationCap, Briefcase, Loader2, CheckCircle } from "lucide-react";

const accountTypes = [
  { id: "professional", label: "Professionnel", icon: User, desc: "Employé, cadre, dirigeant" },
  { id: "student", label: "Étudiant", icon: GraduationCap, desc: "Étudiant, jeune diplômé" },
  { id: "company", label: "Entreprise", icon: Building2, desc: "PME, grande entreprise" },
  { id: "freelance", label: "Freelance", icon: Briefcase, desc: "Indépendant, consultant" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    acceptTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  const countries = [
    "Sénégal", "Côte d'Ivoire", "Ghana", "Nigeria", "Kenya", "Cameroun",
    "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger",
    "Maroc", "Algérie", "Tunisie", "Égypte", "Éthiopie", "Afrique du Sud",
    "Rwanda", "Tanzania", "Ouganda", "Mozambique", "Madagascar", "Angola",
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex">
      {/* Left visual */}
      <div className="hidden lg:flex w-96 flex-col relative overflow-hidden border-r border-[#1f2d45]">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-blue-900/20" />
        <div className="absolute inset-0 dot-grid" />
        <div className="relative z-10 flex flex-col h-full p-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-xl text-white">AfriLink Pro</span>
          </Link>

          <div className="py-12">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Rejoignez 2.4M+ professionnels africains
            </h2>
            <p className="text-gray-400">
              Créez votre profil en 2 minutes et accédez à des milliers d'opportunités sur tout le continent.
            </p>

            {/* Steps indicator */}
            <div className="mt-8 space-y-3">
              {[
                { step: 1, label: "Informations de base", done: step > 1 },
                { step: 2, label: "Type de compte & localisation", done: false },
                { step: 3, label: "Profil complet", done: false },
              ].map(({ step: s, label, done }) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      done
                        ? "bg-emerald-500 text-white"
                        : step === s
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-[#1f2d45] text-gray-600"
                    }`}
                  >
                    {done ? <CheckCircle size={14} /> : s}
                  </div>
                  <span
                    className={`text-sm ${
                      step === s ? "text-white font-medium" : done ? "text-emerald-400" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Amadou Kouyaté</div>
                  <div className="text-xs text-gray-500">Dev Senior · Bamako, Mali</div>
                </div>
                <CheckCircle size={16} className="ml-auto text-emerald-400" />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                &ldquo;J&apos;ai trouvé mon emploi actuel en 3 jours grâce à AfriLink Pro !&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative w-full max-w-lg">
          {/* Mobile logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-white">AfriLink Pro</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? "Créer votre compte" : "Votre profil"}
            </h1>
            <p className="text-gray-400">
              {step === 1
                ? "Rejoignez la communauté professionnelle africaine."
                : "Quelques informations supplémentaires pour personnaliser votre expérience."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Google", icon: "G" },
                    { label: "LinkedIn", icon: "in" },
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1f2d45] text-gray-300 hover:text-white text-sm font-semibold glass transition-all hover:border-emerald-500/30"
                    >
                      <span className="font-bold">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#1f2d45]" />
                  <span className="text-gray-500 text-xs">ou avec email</span>
                  <div className="flex-1 h-px bg-[#1f2d45]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Prénom</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        placeholder="Aminata"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="input-premium pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Diallo"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email professionnel</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="aminata@entreprise.sn"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-premium pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="8+ caractères"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-premium pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition-all ${
                            form.password.length > i * 3
                              ? i < 2 ? "bg-red-500" : i < 3 ? "bg-yellow-500" : "bg-emerald-500"
                              : "bg-[#1f2d45]"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  Continuer
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                {/* Account type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Quel est votre profil ?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {accountTypes.map(({ id, label, icon: Icon, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAccountType(id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          accountType === id
                            ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                            : "border-[#1f2d45] text-gray-400 hover:border-[#2d4060] hover:text-gray-300 glass"
                        }`}
                      >
                        <Icon size={20} className={accountType === id ? "text-emerald-400 mb-2" : "mb-2"} />
                        <div className="font-semibold text-sm">{label}</div>
                        <div className="text-xs opacity-60 mt-0.5">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Pays</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="input-premium"
                    required
                  >
                    <option value="">Sélectionner votre pays</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.acceptTerms}
                    onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-emerald-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    J'accepte les{" "}
                    <Link href="#" className="text-emerald-400 hover:text-emerald-300">
                      Conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="#" className="text-emerald-400 hover:text-emerald-300">
                      Politique de confidentialité
                    </Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-[#2d4060] hover:text-white transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !accountType || !form.country || !form.acceptTerms}
                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      <>
                        Créer mon compte
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
