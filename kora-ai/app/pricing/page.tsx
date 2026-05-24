"use client";

import Link from "next/link";
import { Brain, Check, X, Zap, Building2, Users, ArrowRight, Star, Shield, Globe, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "starter",
    label: "Starter",
    desc: "Pour les indépendants et petites équipes",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "FCFA",
    badge: null,
    color: "gray",
    cta: "Commencer gratuitement",
    ctaHref: "/register",
    ctaStyle: "border border-[#1E2A3D] text-gray-300 hover:border-violet-500/30 hover:text-white glass",
    features: [
      { text: "500,000 tokens / mois", included: true },
      { text: "Kora Chat (modèle Fast)", included: true },
      { text: "Kora Write (5 docs/mois)", included: true },
      { text: "3 langues africaines", included: true },
      { text: "Historique 30 jours", included: true },
      { text: "Kora Analytics", included: false },
      { text: "Kora Bot & Code", included: false },
      { text: "API Access", included: false },
      { text: "Support prioritaire", included: false },
      { text: "Données privées cloud", included: false },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    desc: "Pour les professionnels et startups africaines",
    monthlyPrice: 19900,
    annualPrice: 15900,
    currency: "FCFA",
    badge: "Populaire",
    color: "violet",
    cta: "Démarrer l'essai gratuit",
    ctaHref: "/register",
    ctaStyle: "bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white shadow-lg hover:shadow-violet-500/30",
    features: [
      { text: "5,000,000 tokens / mois", included: true },
      { text: "Kora Chat (modèle Pro)", included: true },
      { text: "Kora Write (illimité)", included: true },
      { text: "12 langues africaines", included: true },
      { text: "Historique illimité", included: true },
      { text: "Kora Analytics complet", included: true },
      { text: "Kora Bot & Code", included: true },
      { text: "API Access (10K req/mois)", included: true },
      { text: "Support prioritaire 24/7", included: false },
      { text: "Données privées cloud", included: false },
    ],
  },
  {
    id: "business",
    label: "Business",
    desc: "Pour les grandes entreprises et institutions",
    monthlyPrice: null,
    annualPrice: null,
    currency: "FCFA",
    badge: "Sur mesure",
    color: "cyan",
    cta: "Contacter l'équipe commerciale",
    ctaHref: "#contact",
    ctaStyle: "bg-gradient-to-r from-cyan-600 to-violet-600 hover:opacity-90 text-white shadow-lg",
    features: [
      { text: "Tokens illimités", included: true },
      { text: "Kora Chat (modèle Ultra)", included: true },
      { text: "Kora Write (illimité)", included: true },
      { text: "12 langues africaines", included: true },
      { text: "Historique illimité", included: true },
      { text: "Kora Analytics avancé", included: true },
      { text: "Kora Bot & Code", included: true },
      { text: "API Access illimité", included: true },
      { text: "Support dédié 24/7", included: true },
      { text: "Cloud privé en Afrique", included: true },
    ],
  },
];

const faqs = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement." },
  { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons Orange Money, Wave, MTN MoMo, Moov, cartes Visa/Mastercard et virements bancaires." },
  { q: "Où sont hébergées mes données ?", a: "Vos données sont hébergées sur des serveurs en Afrique (Dakar, Lagos, Nairobi) pour garantir la souveraineté numérique." },
  { q: "Y a-t-il un engagement minimum ?", a: "Non, aucun engagement. Vous pouvez annuler à tout moment sans frais supplémentaires." },
  { q: "Proposez-vous des tarifs pour les ONG et universités ?", a: "Oui, nous proposons des tarifs spéciaux pour les ONG, universités et institutions publiques africaines. Contactez-nous." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* Header */}
      <header className="glass border-b border-[#1E2A3D] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center relative">
            <Brain size={16} className="text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#070B14] animate-pulse" />
          </div>
          <span className="font-bold text-white font-display">Kora <span className="gradient-kora">AI</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Connexion</Link>
          <Link href="/register" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-violet-600 transition-all">
            Essai gratuit <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden py-16 text-center border-b border-[#1E2A3D]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#070B14] to-cyan-900/10" />
        <div className="absolute inset-0 dot-kora opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-semibold mb-6">
            <Star size={12} />Tarification simple et transparente
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            L&apos;IA africaine à votre<br /><span className="gradient-kora">portée de budget</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">Paiement en FCFA, CFA, KES, NGN et USD. Aucune surprise.</p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-[#111827] border border-[#1E2A3D]">
            <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "bg-violet-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>
              Mensuel
            </button>
            <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-violet-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}>
              Annuel
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map(({ id, label, desc, monthlyPrice, annualPrice, badge, cta, ctaHref, ctaStyle, features, color }) => {
            const price = annual ? annualPrice : monthlyPrice;
            const isPopular = id === "pro";
            return (
              <div key={id} className={`card-kora p-7 flex flex-col relative ${isPopular ? "border-violet-500/40 shadow-lg shadow-violet-500/10" : ""}`}>
                {badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                    isPopular ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white" : "bg-[#1E2A3D] text-gray-300"
                  }`}>{badge}</div>
                )}

                <div className="mb-5">
                  <h2 className="font-display text-xl font-bold text-white mb-1">{label}</h2>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>

                <div className="mb-6">
                  {price === null ? (
                    <div>
                      <div className="text-3xl font-bold text-white">Sur devis</div>
                      <div className="text-xs text-gray-500 mt-1">Adapté à vos besoins</div>
                    </div>
                  ) : price === 0 ? (
                    <div>
                      <div className="text-3xl font-bold text-white">Gratuit</div>
                      <div className="text-xs text-gray-500 mt-1">Pour toujours</div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-white">{price.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm mb-1">FCFA</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">par mois {annual ? "(facturé annuellement)" : ""}</div>
                    </div>
                  )}
                </div>

                <Link href={ctaHref} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all mb-6 ${ctaStyle}`}>
                  {cta} {price !== null && <ArrowRight size={14} />}
                </Link>

                <div className="space-y-3 flex-1">
                  {features.map(({ text, included }) => (
                    <div key={text} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${included ? "bg-violet-500/20" : "bg-[#1E2A3D]"}`}>
                        {included ? <Check size={10} className="text-violet-400" /> : <X size={10} className="text-gray-600" />}
                      </div>
                      <span className={`text-xs ${included ? "text-gray-300" : "text-gray-600"}`}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Shield, label: "Paiement sécurisé", desc: "Orange Money, Wave, Visa" },
            { icon: Globe, label: "Données en Afrique", desc: "Serveurs à Dakar, Lagos, Nairobi" },
            { icon: Clock, label: "Support 24/7", desc: "En français et en anglais" },
            { icon: Users, label: "50,000+ clients", desc: "Dans 54 pays africains" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-kora p-4 text-center">
              <Icon size={20} className="text-violet-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white mb-0.5">{label}</div>
              <div className="text-xs text-gray-600">{desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="card-kora p-5">
                <div className="font-semibold text-white text-sm mb-2">{q}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="relative rounded-2xl p-10 overflow-hidden border border-violet-500/20 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-cyan-900/20" />
          <div className="absolute inset-0 dot-kora opacity-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl mb-6">
              <Building2 size={28} className="text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Solution entreprise ?</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">Déploiement sur cloud privé, SLA garanti, formation équipe, intégration sur mesure. Nous travaillons avec les plus grandes institutions africaines.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="#" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-sm">
                <MessageSquare size={16} />Parler à un expert
              </Link>
              <Link href="/tools" className="flex items-center gap-2 px-8 py-4 border border-[#1E2A3D] text-gray-300 font-semibold rounded-xl hover:border-violet-500/30 hover:text-white transition-all glass text-sm">
                Voir les outils <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
