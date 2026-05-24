"use client";

import { useState } from "react";
import {
  GraduationCap, Search, MapPin, Clock, Building2, Star,
  ArrowUpRight, BookmarkPlus, Zap, Users, Award, ChevronRight,
  Briefcase, CheckCircle
} from "lucide-react";

const internships = [
  {
    id: 1,
    title: "Stage Développement Web Full Stack",
    company: "Wave Mobile Money",
    logo: "WM",
    color: "blue",
    location: "Dakar, Sénégal",
    duration: "6 mois",
    level: "Bac+3/4",
    sector: "Tech",
    paid: true,
    indemnity: "150.000 FCFA/mois",
    skills: ["React", "Node.js", "JavaScript"],
    desc: "Rejoignez l'équipe engineering de Wave pour développer des fonctionnalités de notre app de paiement mobile. Encadrement par un senior dev.",
    deadline: "30 Mai 2025",
    saved: false,
    featured: true,
  },
  {
    id: 2,
    title: "Stage Data Science & IA",
    company: "Orange Digital Center",
    logo: "OD",
    color: "orange",
    location: "Abidjan, Côte d'Ivoire",
    duration: "4 mois",
    level: "Bac+4/5",
    sector: "IA / Data",
    paid: true,
    indemnity: "180.000 FCFA/mois",
    skills: ["Python", "Machine Learning", "Pandas"],
    desc: "Travailler sur des modèles de prédiction pour améliorer la qualité réseau Orange en Afrique. Accès aux données réelles.",
    deadline: "15 Juin 2025",
    saved: true,
    featured: true,
  },
  {
    id: 3,
    title: "Stage Marketing Digital & Growth",
    company: "Jumia Côte d'Ivoire",
    logo: "JU",
    color: "emerald",
    location: "Abidjan, CI",
    duration: "3 mois",
    level: "Bac+3",
    sector: "Marketing",
    paid: true,
    indemnity: "100.000 FCFA/mois",
    skills: ["SEO", "Social Media", "Analytics"],
    desc: "Appui à l'équipe marketing pour les campagnes acquisition et fidélisation. Exposition directe aux outils digitaux professionnels.",
    deadline: "10 Mai 2025",
    saved: false,
    featured: false,
  },
  {
    id: 4,
    title: "Stage Finance & Contrôle de Gestion",
    company: "Ecobank Sénégal",
    logo: "EB",
    color: "blue",
    location: "Dakar, Sénégal",
    duration: "6 mois",
    level: "Bac+4 Finance",
    sector: "Finance",
    paid: true,
    indemnity: "120.000 FCFA/mois",
    skills: ["Excel", "SAP", "Comptabilité"],
    desc: "Participation aux travaux de clôture mensuelle, reporting financier et analyse des coûts au sein de la Direction Financière.",
    deadline: "25 Mai 2025",
    saved: false,
    featured: false,
  },
  {
    id: 5,
    title: "Stage UI/UX Design d'Applications Mobile",
    company: "AfriTech Solutions",
    logo: "AT",
    color: "purple",
    location: "Dakar, Sénégal · Remote possible",
    duration: "4 mois",
    level: "Bac+3 Design",
    sector: "Design",
    paid: true,
    indemnity: "130.000 FCFA/mois",
    skills: ["Figma", "Prototypage", "User Research"],
    desc: "Concevoir l'UX de nouvelles fonctionnalités de notre super-app africaine. Travail direct avec le Product Manager et l'équipe dev.",
    deadline: "20 Mai 2025",
    saved: true,
    featured: false,
  },
];

const logoColors: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const mentors = [
  { name: "Dr. Ibrahima Sow", role: "DG @ FinTech Africa", avatar: "IS", color: "emerald", sessions: 24 },
  { name: "Ama Asante", role: "VP Engineering @ Google", avatar: "AA", color: "blue", sessions: 18 },
  { name: "Mariama Diallo", role: "Chief Product @ Wave", avatar: "MD", color: "orange", sessions: 31 },
];

export default function StagesPage() {
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set([2, 5]));
  const [sector, setSector] = useState("Tous");

  const sectors = ["Tous", "Tech", "Finance", "Marketing", "Design", "IA / Data", "BTP", "Santé"];

  const toggleSave = (id: number) =>
    setSavedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = sector === "Tous" ? internships : internships.filter((i) => i.sector === sector);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero */}
      <div className="relative py-12 px-4 border-b border-[#1f2d45] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 to-blue-950/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5">
            <GraduationCap size={13} />
            24,800 stages disponibles en Afrique · Mis à jour quotidiennement
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Lancez votre{" "}
            <span style={{ background: "linear-gradient(135deg, #10B981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              carrière africaine
            </span>
          </h1>
          <p className="text-gray-400 mb-6 text-lg">Stages, alternances, premiers emplois — l'espace dédié aux jeunes talents africains.</p>

          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Poste, compétence, entreprise..." className="input-premium pl-11 py-3" />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Stages disponibles", value: "24,800", icon: Briefcase, color: "emerald" },
            { label: "Entreprises partenaires", value: "3,400", icon: Building2, color: "blue" },
            { label: "Jeunes placés en 2024", value: "48,200", icon: Users, color: "orange" },
            { label: "Mentors disponibles", value: "1,240", icon: Award, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => {
            const bg: Record<string, string> = {
              emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
              purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            };
            return (
              <div key={label} className="card-premium p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg[color]}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Internships */}
          <div className="lg:col-span-2">
            {/* Sector tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    sector === s
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 border border-[#1f2d45] hover:text-gray-300 hover:border-[#2d4060]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map((item) => (
                <div key={item.id} className={`card-premium p-5 group ${item.featured ? "border-emerald-500/20" : ""}`}>
                  {item.featured && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star size={12} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-yellow-400 font-semibold">Stage mis en avant</span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${logoColors[item.color]}`}>
                      {item.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                        <button
                          onClick={() => toggleSave(item.id)}
                          className={`shrink-0 ml-2 transition-colors ${savedItems.has(item.id) ? "text-emerald-400" : "text-gray-600 hover:text-gray-400"}`}
                        >
                          <BookmarkPlus size={18} fill={savedItems.has(item.id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2 flex-wrap">
                        <span className="flex items-center gap-1"><Building2 size={12} />{item.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} />{item.location}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{item.duration}</span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3 truncate-2">{item.desc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.skills.map((s) => (
                          <span key={s} className="px-2.5 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-lg">{s}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 text-xs">
                          {item.paid && (
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                              💰 {item.indemnity}
                            </span>
                          )}
                          <span className="text-gray-600 flex items-center gap-1">
                            <GraduationCap size={11} />{item.level}
                          </span>
                          <span className="text-gray-600">Limite: {item.deadline}</span>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                          Postuler <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Jeune Talent Badge */}
            <div className="card-premium p-5 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Badge Jeune Talent 🌍</div>
                  <div className="text-xs text-gray-500">Visible par 85K+ recruteurs</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Complétez votre profil étudiant pour obtenir le badge "Jeune Talent Africain" et être recommandé automatiquement aux recruteurs.
              </p>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Profil créé", done: true },
                  { label: "CV uploadé", done: true },
                  { label: "Compétences ajoutées", done: false },
                  { label: "Lettre de motivation", done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle size={14} className={done ? "text-emerald-400" : "text-gray-700"} />
                    <span className={`text-xs ${done ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all">
                Compléter mon profil
              </button>
            </div>

            {/* Mentors */}
            <div className="card-premium p-5">
              <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                Mentors disponibles
              </h3>
              <div className="space-y-3">
                {mentors.map(({ name, role, avatar, color, sessions }) => {
                  const avatarBg: Record<string, string> = {
                    emerald: "bg-emerald-500/20 text-emerald-400",
                    blue: "bg-blue-500/20 text-blue-400",
                    orange: "bg-orange-500/20 text-orange-400",
                  };
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarBg[color]}`}>
                        {avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{name}</div>
                        <div className="text-xs text-gray-500 truncate">{role}</div>
                        <div className="text-xs text-gray-600">{sessions} sessions complétées</div>
                      </div>
                      <button className="shrink-0 px-3 py-1.5 text-xs font-semibold border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all">
                        Réserver
                      </button>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-3 py-2.5 text-xs font-semibold border border-[#1f2d45] text-gray-400 rounded-xl hover:border-blue-500/30 hover:text-blue-400 transition-all">
                Voir tous les mentors
              </button>
            </div>

            {/* Tips */}
            <div className="card-premium p-5">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" />
                Conseils stage
              </h3>
              <div className="space-y-2">
                {[
                  "Personnalisez chaque candidature",
                  "Préparez 3 questions pour l'entretien",
                  "Recherchez l'entreprise en profondeur",
                  "Répondez sous 48h à toute offre",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-emerald-400 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
