"use client";

import { useState } from "react";
import {
  Crown, CheckCircle, Zap, Star, Shield, TrendingUp, Users,
  MessageSquare, Briefcase, Eye, Award, ArrowRight, Sparkles,
  Globe, BarChart3, Rocket
} from "lucide-react";

const plans = [
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "9.900",
    annualPrice: "7.900",
    currency: "FCFA/mois",
    description: "Pour les professionnels ambitieux",
    color: "emerald",
    icon: Zap,
    popular: true,
    features: [
      { text: "Profil boosté dans les recherches", included: true },
      { text: "Badge vérifié ✓ sur votre profil", included: true },
      { text: "Connexions illimitées / mois", included: true },
      { text: "Candidatures illimitées", included: true },
      { text: "Analyse IA de votre profil", included: true },
      { text: "Messagerie avancée (200+ messages)", included: true },
      { text: "Statistiques détaillées profil", included: true },
      { text: "Accès aux formations premium", included: true },
      { text: "Qui a visité votre profil", included: true },
      { text: "Alertes emploi personnalisées", included: true },
      { text: "Dashboard recruteur", included: false },
      { text: "Publications sponsorisées", included: false },
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: "49.900",
    annualPrice: "39.900",
    currency: "FCFA/mois",
    description: "Pour les entreprises et recruteurs",
    color: "blue",
    icon: Building,
    popular: false,
    features: [
      { text: "Tout ce qui est dans Pro", included: true },
      { text: "Dashboard recruteur complet", included: true },
      { text: "Accès à 2.4M+ de candidats", included: true },
      { text: "Publications sponsorisées (5/mois)", included: true },
      { text: "Analytics recrutement avancés", included: true },
      { text: "Marque employeur renforcée", included: true },
      { text: "Intégrations ATS (Workday, etc.)", included: true },
      { text: "Tests de compétences intégrés", included: true },
      { text: "Entretiens vidéo intégrés", included: true },
      { text: "Support prioritaire 24/7", included: true },
      { text: "Compte multi-utilisateurs (5)", included: true },
      { text: "API access", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: "Sur devis",
    annualPrice: "Sur devis",
    currency: "",
    description: "Solutions personnalisées pour grands groupes",
    color: "orange",
    icon: Crown,
    popular: false,
    features: [
      { text: "Tout ce qui est dans Business", included: true },
      { text: "Utilisateurs illimités", included: true },
      { text: "API access complet", included: true },
      { text: "SSO / SAML integration", included: true },
      { text: "Publications sponsorisées illimitées", included: true },
      { text: "Account manager dédié", included: true },
      { text: "Formations sur mesure", included: true },
      { text: "Rapports personnalisés", included: true },
      { text: "SLA garanti 99.9%", included: true },
      { text: "Onboarding guidé", included: true },
      { text: "Intégrations custom", included: true },
      { text: "Contrôle admin avancé", included: true },
    ],
  },
];

const proFeatures = [
  { icon: Eye, title: "Visibilité maximale", desc: "Apparaissez en tête des résultats de recherche des recruteurs et augmentez vos vues x4.", color: "emerald" },
  { icon: TrendingUp, title: "Analytics profil", desc: "Voyez qui visite votre profil, quels posts performent et vos statistiques de carrière.", color: "blue" },
  { icon: MessageSquare, title: "Messagerie prioritaire", desc: "Envoyez des messages à n'importe quel membre, même sans connexion. Soyez prioritaire.", color: "purple" },
  { icon: Award, title: "Badge vérifié", desc: "Le badge ✓ augmente la confiance des recruteurs et votre taux de réponse de 60%.", color: "orange" },
  { icon: Briefcase, title: "Opportunités exclusives", desc: "Accédez aux offres premium réservées aux membres Pro. Les meilleures opportunités.", color: "emerald" },
  { icon: Sparkles, title: "IA Carrière", desc: "Votre coach carrière IA personnel : optimisation CV, préparation entretien, recommandations.", color: "blue" },
];

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h6" />
    </svg>
  );
}

export default function PremiumPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [activePlan, setActivePlan] = useState("pro");

  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  };

  const iconColor: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  const planColor: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-600 to-blue-700",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-yellow-950/10 to-transparent" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-semibold mb-6">
            <Crown size={16} />
            AfriLink Pro Premium
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Accélérez votre carrière{" "}
            <span style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              sans limites
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Les membres Premium trouvent un emploi 3x plus vite, reçoivent 8x plus de messages de recruteurs et accèdent aux meilleures opportunités africaines.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#111827] border border-[#1f2d45] rounded-xl mb-12">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${billing === "monthly" ? "bg-[#1a2236] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === "annual" ? "bg-[#1a2236] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Annuel
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                -20%
              </span>
            </button>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlan(plan.id)}
                  className={`relative rounded-2xl border p-6 cursor-pointer transition-all ${
                    plan.popular
                      ? `bg-gradient-to-b ${colorMap[plan.color]} shadow-xl`
                      : activePlan === plan.id
                      ? `bg-gradient-to-b ${colorMap[plan.color]}`
                      : "bg-[#111827] border-[#1f2d45] hover:border-[#2d4060]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow">
                        ⭐ Plus populaire
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={20} className={`text-${plan.color}-400`} />
                        <span className="font-bold text-white text-lg">{plan.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    {price !== "Sur devis" ? (
                      <div>
                        <span className="text-3xl font-bold text-white">{price}</span>
                        <span className="text-gray-500 text-sm ml-1">{plan.currency}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-white">Sur devis</span>
                    )}
                    {billing === "annual" && price !== "Sur devis" && (
                      <div className="text-xs text-emerald-400 mt-1 font-medium">
                        Économisez 20% vs mensuel
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {plan.features.slice(0, 8).map(({ text, included }) => (
                      <div key={text} className={`flex items-start gap-2 text-sm ${included ? "text-gray-300" : "text-gray-700"}`}>
                        <CheckCircle size={15} className={`shrink-0 mt-0.5 ${included ? `text-${plan.color}-400` : "text-gray-700"}`} />
                        {text}
                      </div>
                    ))}
                  </div>

                  <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? `bg-gradient-to-r ${planColor[plan.color]} text-white shadow-lg hover:opacity-90`
                      : "border border-[#1f2d45] text-gray-300 hover:border-emerald-500/30 hover:text-white"
                  }`}>
                    {plan.id === "enterprise" ? "Contacter l'équipe" : `Commencer avec ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Pourquoi choisir{" "}
            <span style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Premium ?
            </span>
          </h2>
          <p className="text-gray-400">Toutes les fonctionnalités qui font la différence dans votre carrière africaine.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {proFeatures.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`p-6 rounded-2xl bg-gradient-to-br border ${colorMap[color]} group hover:border-opacity-60 transition-all`}>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${iconColor[color]}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 card-premium p-8 text-center">
          <div className="flex justify-center gap-8 mb-6 flex-wrap">
            {[
              { value: "3x", label: "Plus vite pour trouver un emploi" },
              { value: "8x", label: "Plus de messages de recruteurs" },
              { value: "60%", label: "Meilleur taux de réponse" },
              { value: "2.4M+", label: "Membres Premium actifs" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold gradient-text-orange" style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {value}
                </div>
                <div className="text-sm text-gray-500 max-w-[120px]">{label}</div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 mb-6">
            Rejoignez des milliers de professionnels africains qui accélèrent leur carrière avec Premium.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:from-orange-400 hover:to-orange-500 transition-all hover:shadow-orange-500/30">
            <Crown size={20} />
            Essayer Premium gratuitement 30 jours
            <ArrowRight size={18} />
          </button>
          <p className="text-xs text-gray-600 mt-3">Annulable à tout moment · Sans carte bancaire requise pour l'essai</p>
        </div>
      </div>
    </div>
  );
}
