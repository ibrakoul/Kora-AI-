"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Brain, BarChart3, MessageSquare, Globe,
  Star, CheckCircle, ChevronRight, Play, Sparkles,
  Code2, FileText, Image, Bot, Cpu, Rocket, Zap, Menu, X
} from "lucide-react";

const tools = [
  { icon: MessageSquare, label: "Kora Chat", desc: "Assistant IA conversationnel multilingue (français, wolof, hausa, swahili...)", color: "violet", badge: "Populaire" },
  { icon: FileText, label: "Kora Write", desc: "Génération de contenu IA : articles, emails, rapports, propositions commerciales", color: "cyan", badge: "Nouveau" },
  { icon: BarChart3, label: "Kora Analytics", desc: "Analyse de données métier avec IA : dashboards, prédictions, insights africains", color: "gold", badge: "Beta" },
  { icon: Image, label: "Kora Vision", desc: "Génération et analyse d'images pour le marketing africain et les médias", color: "rose", badge: "Nouveau" },
  { icon: Code2, label: "Kora Code", desc: "Assistant code IA : autocomplétion, debug, génération, documentation", color: "violet", badge: null },
  { icon: Bot, label: "Kora Bot", desc: "Créez des chatbots IA pour votre site, WhatsApp ou votre app en minutes", color: "cyan", badge: "Populaire" },
];

const stats = [
  { value: "50K+", label: "Entreprises actives" },
  { value: "180M+", label: "Requêtes IA / mois" },
  { value: "54", label: "Pays africains" },
  { value: "99.9%", label: "Uptime garanti" },
];

const testimonials = [
  { name: "Ibrahima Kouyaté", company: "CEO AfriShop", country: "🇸🇳 Sénégal", avatar: "IK", color: "violet", text: "Kora AI a transformé notre service client. Notre chatbot répond en wolof et en français. Satisfaction client +42% en 3 mois.", rating: 5 },
  { name: "Ngozi Okafor", company: "CMO HealthTech Nigeria", country: "🇳🇬 Nigeria", avatar: "NO", color: "cyan", text: "Kora Write génère nos contenus marketing en hausa et en anglais. Nous économisons 80% du temps de notre équipe éditoriale.", rating: 5 },
  { name: "Amara Diallo", company: "CTO FinPay Guinea", country: "🇬🇳 Guinée", avatar: "AD", color: "gold", text: "Les analyses Kora Analytics ont identifié des patterns de fraude que nos équipes n'auraient jamais détectés manuellement.", rating: 5 },
];

const plans = [
  { name: "Starter", price: "0", desc: "Pour découvrir Kora AI", features: ["100K tokens / mois", "3 outils IA inclus", "Kora Chat basique", "Support communauté", "1 utilisateur"], cta: "Commencer gratuitement", popular: false },
  { name: "Pro", price: "19.900", currency: "FCFA / mois", desc: "Pour les équipes ambitieuses", features: ["5M tokens / mois", "Tous les outils IA", "Kora Bot personnalisé", "API access complet", "5 utilisateurs", "Support prioritaire", "Multilingue avancé"], cta: "Démarrer Pro", popular: true },
  { name: "Business", price: "Sur devis", desc: "Pour les grandes entreprises", features: ["Tokens illimités", "Cloud privé africain", "SLA 99.9% garanti", "Intégrations custom", "Utilisateurs illimités", "Account manager dédié", "Formation & onboarding"], cta: "Contacter l'équipe", popular: false },
];

const languages = ["Français", "English", "Wolof", "Hausa", "Swahili", "Amharique", "Arabe", "Yoruba", "Igbo", "Zulu", "Twi", "Bambara"];

/* ─── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-[#1E2A3D]" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow">
              <Brain size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#070B14] animate-pulse" />
            </div>
            <span className="font-bold text-lg text-white font-display">Kora <span className="gradient-kora">AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {["Outils", "Analytics", "Tarifs"].map((label) => (
              <Link key={label} href={`/${label.toLowerCase()}`} className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all font-medium">{label}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Connexion</Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all">Essai gratuit</Link>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden glass border-t border-[#1E2A3D] px-4 py-4 space-y-2">
          {["Outils", "Analytics", "Tarifs"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all">
              <span className="font-medium">{item}</span><ChevronRight size={16} className="text-gray-600" />
            </Link>
          ))}
          <div className="pt-2 space-y-2 border-t border-[#1E2A3D]">
            <Link href="/login" className="flex justify-center w-full py-3 text-sm font-semibold text-gray-300 border border-[#1E2A3D] rounded-xl hover:border-violet-500/40 hover:text-white transition-all">Connexion</Link>
            <Link href="/register" className="flex justify-center w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl">Essai gratuit</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ── */
function Hero() {
  const [typed, setTyped] = useState("");
  const phrases = ["Génère un rapport de vente en wolof", "Analyse mes données clients africains", "Crée un chatbot WhatsApp multilingue", "Détecte les anomalies dans mes transactions", "Génère du contenu en hausa et swahili"];
  const [phraseIdx, setPhraseIdx] = useState(0);
  useEffect(() => {
    let i = 0;
    const phrase = phrases[phraseIdx];
    const id = setInterval(() => {
      setTyped(phrase.slice(0, ++i));
      if (i >= phrase.length) {
        clearInterval(id);
        setTimeout(() => { setPhraseIdx((p) => (p + 1) % phrases.length); setTyped(""); }, 2000);
      }
    }, 50);
    return () => clearInterval(id);
  }, [phraseIdx]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-kora-mesh" />
      <div className="absolute inset-0 grid-kora opacity-30" />
      <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-violet-600/12 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/5 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2.5s" }} />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-violet-500/8 rounded-full animate-spin-slow hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-violet-500/20 animate-fade-up">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">La première IA <span className="gradient-kora font-semibold">panafricaine</span> · 12 langues africaines</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
          <span className="text-white">L&apos;IA qui parle</span><br />
          <span className="gradient-kora">africain.</span>
        </h1>

        <div className="max-w-xl mx-auto mb-6 animate-fade-up delay-200">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl glass border border-violet-500/20 text-left">
            <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center shrink-0">
              <Brain size={16} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-300 text-sm">{typed}</span>
              <span className="text-violet-400">|</span>
            </div>
            <button className="shrink-0 w-8 h-8 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-colors">
              <ArrowRight size={14} className="text-white" />
            </button>
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-10 animate-fade-up delay-200">
          Kora AI donne aux entreprises africaines accès aux <strong className="text-white">meilleurs modèles d&apos;IA</strong> — génération de contenu, analyse de données, chatbots, vision — dans vos langues locales.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-fade-up delay-300">
          <Link href="/register" className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-2xl shadow-xl hover:shadow-violet-500/40 transition-all">
            Essayer gratuitement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 glass border border-[#1E2A3D] rounded-2xl hover:border-violet-500/30 hover:text-white transition-all">
            <div className="w-8 h-8 bg-violet-600/10 border border-violet-500/20 rounded-full flex items-center justify-center">
              <Play size={12} className="text-violet-400 ml-0.5" fill="currentColor" />
            </div>
            Voir la démo
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500 animate-fade-up delay-400">
          {["14 jours gratuit", "Sans carte bancaire", "RGPD conforme", "Hébergé en Afrique"].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><CheckCircle size={13} className="text-violet-400" />{t}</span>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 relative animate-fade-up delay-500">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-violet-500/15 rounded-3xl blur-2xl" />
            <div className="relative glass border border-[#1E2A3D] rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E2A3D] bg-[#0D1117]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-[#1E2A3D] rounded-md flex items-center px-3"><span className="text-xs text-gray-500">app.kora-ai.com/dashboard</span></div>
                <div className="badge-ai text-[10px]">Kora AI Pro</div>
              </div>
              <div className="bg-[#070B14] p-6 grid grid-cols-12 gap-4 min-h-[260px]">
                <div className="col-span-2 space-y-1.5">
                  {["💬", "✍️", "📊", "🖼️", "⚡", "🤖"].map((icon, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${i === 0 ? "bg-violet-600/15 text-violet-400 border border-violet-500/20" : "text-gray-700"}`}>
                      <span>{icon}</span><div className={`h-1.5 rounded ${i === 0 ? "bg-violet-500/30 w-10" : "bg-[#1E2A3D] w-7"}`} />
                    </div>
                  ))}
                </div>
                <div className="col-span-7 space-y-3">
                  {[{ r: "user", t: "Génère un rapport de vente Q1 pour le marché sénégalais" }, { r: "ai", t: "✅ Voici votre rapport Q1 2025 — Marché Sénégalais..." }, { r: "user", t: "Traduis maintenant en wolof" }].map(({ r, t }, i) => (
                    <div key={i} className={`flex gap-2 ${r === "user" ? "flex-row-reverse" : ""}`}>
                      {r === "ai" && <div className="w-6 h-6 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0"><Brain size={12} className="text-violet-400" /></div>}
                      <div className={`px-3 py-2 rounded-xl text-[11px] max-w-[75%] ${r === "user" ? "bg-violet-600/20 text-violet-200" : "bg-[#161D2E] text-gray-300 border border-[#1E2A3D]"}`}>{t}</div>
                    </div>
                  ))}
                  <div className="flex gap-1.5 items-center px-3"><div className="w-6 h-6 rounded-lg bg-violet-600/20 flex items-center justify-center"><Brain size={12} className="text-violet-400" /></div>
                    {[0,1,2].map((d) => <div key={d} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}
                  </div>
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="card-kora p-3"><div className="text-[10px] font-semibold text-violet-400 mb-1">Tokens</div><div className="text-lg font-bold text-white">2.4M</div><div className="text-[10px] text-gray-600">/ 5M ce mois</div><div className="progress-kora mt-2"><div className="progress-fill-kora" style={{ width: "48%" }} /></div></div>
                  <div className="card-kora p-3"><div className="text-[10px] font-semibold text-cyan-400 mb-1">Langue</div><div className="text-sm font-bold text-white">Wolof</div><div className="text-[10px] text-gray-600">98.2% confiance</div></div>
                </div>
              </div>
            </div>
            <div className="absolute -left-8 top-1/3 card-kora p-3 flex items-center gap-3 glow-violet hidden lg:flex">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center"><Globe size={16} className="text-violet-400" /></div>
              <div><div className="text-xs font-bold text-white">12 langues</div><div className="text-[10px] text-gray-500">Africaines natives</div></div>
            </div>
            <div className="absolute -right-8 top-1/4 card-kora p-3 flex items-center gap-3 glow-cyan hidden lg:flex">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center"><Zap size={16} className="text-cyan-400" /></div>
              <div><div className="text-xs font-bold text-white">180M+ requêtes</div><div className="text-[10px] text-gray-500">Par mois</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ── */
export default function KoraLanding() {
  const colorsMap: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    gold: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  const badgeMap: Record<string, string> = {
    Populaire: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    Nouveau: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    Beta: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };
  const avatarColors: Record<string, string> = {
    violet: "bg-violet-500/20 text-violet-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    gold: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="min-h-screen bg-[#070B14]">
      <Navbar />
      <Hero />

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="card-kora p-8 text-center">
                <div className="text-4xl font-bold font-display gradient-kora mb-2">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <Cpu size={12} />Suite IA complète
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Tout l&apos;IA dont vous avez <span className="gradient-kora">besoin</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg">6 outils IA puissants, conçus pour le marché africain, depuis une seule plateforme.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map(({ icon: Icon, label, desc, color, badge }) => (
              <div key={label} className="card-kora p-6 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorsMap[color]}`}><Icon size={22} /></div>
                  {badge && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeMap[badge]}`}>{badge}</span>}
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-violet-400 transition-colors">{label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Essayer <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 via-transparent to-cyan-950/15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <Globe size={12} />Multilingue africain natif
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            L&apos;IA qui comprend <span style={{ background: "linear-gradient(135deg, #67E8F9, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>vos langues</span>
          </h2>
          <p className="text-gray-400 mb-10">Kora AI est entraîné nativement sur les langues africaines — pas de traduction approximative.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <div key={lang} className="px-5 py-2.5 glass border border-[#1E2A3D] rounded-full text-sm font-medium text-gray-300 hover:border-violet-500/40 hover:text-violet-300 transition-all cursor-pointer">{lang}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Ils font confiance à <span className="gradient-kora">Kora AI</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, company, country, avatar, color, text, rating }) => (
              <div key={name} className="card-kora p-6 flex flex-col gap-4">
                <div className="flex gap-1">{[...Array(rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}</div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1E2A3D]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColors[color]}`}>{avatar}</div>
                  <div><div className="text-sm font-semibold text-white">{name}</div><div className="text-xs text-gray-500">{company} · {country}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/8 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Tarifs <span className="gradient-kora">transparents</span></h2>
            <p className="text-gray-400">Commencez gratuitement. Évoluez selon vos besoins.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {plans.map(({ name, price, currency, desc, features, cta, popular }) => (
              <div key={name} className={`relative rounded-2xl p-7 flex flex-col ${popular ? "bg-gradient-to-b from-violet-900/40 to-violet-950/40 border-2 border-violet-500/40 glow-violet" : "card-kora"}`}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-xs font-bold rounded-full shadow-lg">⭐ Plus populaire</span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-display font-bold text-white text-xl mb-1">{name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{desc}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    {currency && <span className="text-sm text-gray-500">{currency}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={15} className="text-violet-400 shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${popular ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-500 hover:to-violet-600 shadow-lg" : "border border-[#1E2A3D] text-gray-300 hover:border-violet-500/40 hover:text-violet-300"}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-[#070B14] to-cyan-900/30" />
            <div className="absolute inset-0 dot-kora opacity-30" />
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-xl">
                <Rocket size={28} className="text-white" />
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Prêt à démarrer avec<br /><span className="gradient-kora">Kora AI ?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">14 jours d&apos;essai gratuit. Aucune carte bancaire requise. Configuré en 5 minutes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-2xl shadow-xl hover:shadow-violet-500/40 transition-all">
                  Commencer gratuitement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/tools" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white glass border border-white/10 rounded-2xl hover:border-violet-500/30 transition-all">
                  Explorer les outils <Sparkles size={16} className="text-violet-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2A3D] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-white">Kora AI</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">La première plateforme SaaS IA panafricaine.</p>
            </div>
            {[
              { title: "Produit", links: ["Kora Chat", "Kora Write", "Kora Analytics", "Kora Bot", "API"] },
              { title: "Entreprise", links: ["À propos", "Blog", "Carrières", "Presse"] },
              { title: "Support", links: ["Documentation", "Tutoriels", "Status", "Contact"] },
              { title: "Légal", links: ["Confidentialité", "CGU", "Cookies", "RGPD"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
                <ul className="space-y-2">{links.map((l) => <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-[#1E2A3D] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 Kora AI. Tous droits réservés. Fait en Afrique 🌍</p>
            <div className="badge-ai">Données hébergées en Afrique</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
