"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Users, Briefcase, GraduationCap, TrendingUp, Globe,
  Star, CheckCircle, ChevronRight, Play, Zap, Shield, Award,
  MapPin, Building2, BookOpen, FileText, MessageSquare, Bell,
  Menu, X, ExternalLink, Sparkles
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */
const stats = [
  { value: "2.4M+", label: "Professionnels", icon: Users },
  { value: "85K+", label: "Entreprises", icon: Building2 },
  { value: "320K+", label: "Offres d'emploi", icon: Briefcase },
  { value: "54", label: "Pays africains", icon: Globe },
];

const features = [
  {
    icon: Briefcase,
    color: "emerald",
    title: "Emplois & Recrutement",
    desc: "Trouvez l'opportunité parfaite grâce à notre IA de matching avancée. Candidature en un clic, suivi en temps réel.",
    badge: "IA Powered",
  },
  {
    icon: GraduationCap,
    color: "blue",
    title: "Stages & Jeunes Talents",
    desc: "Un espace dédié aux étudiants et jeunes diplômés pour décrocher le stage idéal et lancer leur carrière.",
    badge: "Populaire",
  },
  {
    icon: BookOpen,
    color: "orange",
    title: "Formations & E-learning",
    desc: "Développez vos compétences avec des milliers de formations certifiantes adaptées au marché africain.",
    badge: "Nouveau",
  },
  {
    icon: FileText,
    color: "purple",
    title: "Appels d'offres",
    desc: "Accédez aux marchés publics et privés de tout le continent africain en un seul endroit.",
    badge: "Business",
  },
  {
    icon: Users,
    color: "emerald",
    title: "Networking Premium",
    desc: "Connectez-vous avec des décideurs, entrepreneurs et investisseurs à travers toute l'Afrique.",
    badge: "Pro",
  },
  {
    icon: TrendingUp,
    color: "blue",
    title: "Freelancing & Business",
    desc: "Proposez vos services, trouvez des missions et développez votre activité sur tout le continent.",
    badge: "Marketplace",
  },
];

const testimonials = [
  {
    name: "Aminata Diallo",
    role: "Ingénieure logicielle",
    company: "TechAfrica, Dakar",
    avatar: "AD",
    color: "emerald",
    text: "AfriLink Pro a complètement transformé ma carrière. En moins de 2 semaines, j'ai décroché un poste de rêve à Abidjan grâce au matching IA.",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Directeur RH",
    company: "GoldCoast Industries, Accra",
    avatar: "KM",
    color: "blue",
    text: "En tant que recruteur, AfriLink Pro nous offre accès aux meilleurs talents africains. Le système de vérification des profils est excellent.",
    rating: 5,
  },
  {
    name: "Fatoumata Bah",
    role: "Entrepreneur",
    company: "FemTech Guinea, Conakry",
    avatar: "FB",
    color: "orange",
    text: "Grâce à la visibilité offerte par AfriLink Pro, mon startup a attiré 3 investisseurs en 6 mois. La plateforme est indispensable.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    color: "gray",
    features: [
      "Profil professionnel complet",
      "50 connexions / mois",
      "Accès au feed & actualités",
      "5 candidatures / mois",
      "Messagerie de base",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.900",
    period: "FCFA / mois",
    color: "emerald",
    features: [
      "Tout ce qui est dans Gratuit",
      "Connexions illimitées",
      "Candidatures illimitées",
      "Badge vérifié premium",
      "Analyse de profil IA",
      "Priorité dans les recherches",
      "Messagerie avancée",
    ],
    cta: "Commencer Pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    color: "blue",
    features: [
      "Tout ce qui est dans Pro",
      "Dashboard recruteur complet",
      "Publications sponsorisées",
      "Analytics avancés",
      "Intégrations ATS",
      "Support dédié 24/7",
      "Marque employeur renforcée",
    ],
    cta: "Contacter l'équipe",
    popular: false,
  },
];

const navLinks = [
  { label: "Emplois", href: "/jobs" },
  { label: "Formations", href: "/formations" },
  { label: "Entreprises", href: "/reseau" },
  { label: "À propos", href: "#about" },
];

/* ─── Sub-components ─────────────────────────────────── */
function Navbar() {
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
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all"
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

function HeroSection() {
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
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300"
          >
            Rejoindre gratuitement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 glass border border-[#1f2d45] rounded-2xl hover:border-emerald-500/30 hover:text-white transition-all duration-300">
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
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs ${i === 0 ? "bg-emerald-500/10 text-emerald-400" : "text-gray-600"}`}
                    >
                      <span>{icon}</span>
                      <div className={`h-2 rounded ${i === 0 ? "bg-emerald-500/30 w-12" : "bg-[#1f2d45] w-8"}`} />
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
                        <div className={`w-8 h-8 rounded-full bg-${color}-500/20 border border-${color}-500/30`} />
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

function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card-premium glow p-8 text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Icon size={22} className="text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  };

  const badgeMap: Record<string, string> = {
    "IA Powered": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Populaire": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Nouveau": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Business": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Pro": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Marketplace": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <section className="py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Zap size={12} />
            Fonctionnalités
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Tout ce dont vous avez{" "}
            <span className="gradient-text">besoin</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Une plateforme complète pensée pour les réalités africaines et la jeunesse ambitieuse du continent.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, desc, badge }) => (
            <div
              key={title}
              className="card-premium glow p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorMap[color]}`}>
                  <Icon size={22} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeMap[badge]}`}>
                  {badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                En savoir plus <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Créez votre profil",
      desc: "Construisez un profil professionnel qui reflète vos compétences, expériences et ambitions en moins de 5 minutes.",
      icon: "👤",
    },
    {
      step: "02",
      title: "Connectez votre réseau",
      desc: "Notre IA vous suggère les connexions les plus pertinentes dans votre domaine à travers toute l'Afrique.",
      icon: "🌍",
    },
    {
      step: "03",
      title: "Saisissez vos opportunités",
      desc: "Candidatez, collaborez, apprenez ou recrutez. Toutes les opportunités africaines à portée de clic.",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            Comment ça marche
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Démarrez en{" "}
            <span className="gradient-text-royal" style={{ background: "linear-gradient(135deg, #60a5fa, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              3 étapes simples
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-500/30 to-blue-500/30" />

          {steps.map(({ step, title, desc, icon }) => (
            <div key={step} className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass border border-[#1f2d45] text-4xl mb-6 relative">
                {icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.slice(1)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
            <Star size={12} fill="currentColor" />
            Témoignages
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ce qu'ils disent{" "}
            <span className="gradient-text-orange" style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              de nous
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, company, avatar, color, text, rating }) => {
            const bgColor = color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
                            color === "blue" ? "bg-blue-500/20 text-blue-400" :
                            "bg-orange-500/20 text-orange-400";
            return (
              <div key={name} className="card-premium p-6 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#1f2d45]">
                  <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-sm font-bold`}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-gray-500">
                      {role} · {company}
                    </div>
                  </div>
                  <CheckCircle size={16} className="ml-auto text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Award size={12} />
            Tarifs
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple et{" "}
            <span className="gradient-text">transparent</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Commencez gratuitement. Évoluez selon vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ name, price, period, features, cta, popular }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                popular
                  ? "bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                  : "card-premium"
              }`}
            >
              {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  {period && <span className="text-gray-400 text-sm">{period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                  popular
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-lg hover:shadow-emerald-500/30"
                    : "border border-[#1f2d45] text-gray-300 hover:border-emerald-500/40 hover:text-white hover:bg-emerald-500/5"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-blue-900/40 to-orange-900/30" />
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="text-6xl mb-6">🌍</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Rejoignez la révolution
              <br />
              professionnelle africaine
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Plus de 2.4 millions de professionnels africains font déjà confiance à AfriLink Pro.
              Votre prochaine opportunité vous attend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 transition-all"
              >
                Créer mon compte gratuit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white glass border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all"
              >
                Explorer les opportunités
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      title: "Plateforme",
      links: ["Emplois", "Stages", "Formations", "Appels d'offres", "Freelance"],
    },
    {
      title: "Entreprises",
      links: ["Recrutement", "Marque employeur", "Publicités", "Solutions RH"],
    },
    {
      title: "Ressources",
      links: ["Blog", "Guides carrière", "Podcasts business", "Événements"],
    },
    {
      title: "Légal",
      links: ["Confidentialité", "Conditions d'utilisation", "Cookies", "Contact"],
    },
  ];

  return (
    <footer className="border-t border-[#1f2d45] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-white">AfriLink Pro</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Le réseau professionnel de référence pour les talents africains.
            </p>
            <div className="flex gap-3 mt-4">
              {["𝕏", "in", "f", "▶"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 glass border border-[#1f2d45] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-bold"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1f2d45] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 AfriLink Pro. Tous droits réservés. Fait avec ❤️ pour l'Afrique.
          </p>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-gray-600 text-sm">Disponible dans 54 pays africains</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
