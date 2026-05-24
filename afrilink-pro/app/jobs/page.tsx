"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, Briefcase, Clock, ChevronRight, Filter,
  Star, Bell, ArrowUpRight, Zap, CheckCircle, BookmarkPlus,
  Building2, DollarSign, SlidersHorizontal, X
} from "lucide-react";

const categories = [
  { label: "Tous", count: 320450 },
  { label: "Tech & IT", count: 84200 },
  { label: "Finance", count: 42100 },
  { label: "Santé", count: 28600 },
  { label: "BTP", count: 31200 },
  { label: "Agriculture", count: 19800 },
  { label: "Marketing", count: 22400 },
  { label: "Éducation", count: 16700 },
  { label: "Logistique", count: 14300 },
  { label: "Énergie", count: 11900 },
];

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer (React/Next.js)",
    company: "AfriTech Solutions",
    logo: "AT",
    logoColor: "emerald",
    location: "Dakar, Sénégal",
    salary: "700K – 1.2M FCFA",
    type: "CDI",
    remote: true,
    time: "il y a 2h",
    tags: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    desc: "Nous recherchons un développeur frontend senior pour rejoindre notre équipe produit en pleine croissance. Vous travaillerez sur des produits utilisés par des millions d'africains.",
    saved: false,
    featured: true,
    applicants: 47,
  },
  {
    id: 2,
    title: "Data Scientist – Machine Learning",
    company: "MTN Mobile Money",
    logo: "MT",
    logoColor: "yellow",
    location: "Accra, Ghana",
    salary: "$3,000 – $4,500",
    type: "CDI",
    remote: false,
    time: "il y a 4h",
    tags: ["Python", "TensorFlow", "SQL", "Spark"],
    desc: "MTN Mobile Money recrute un Data Scientist expérimenté pour rejoindre l'équipe Analytics Afrique. Mission: améliorer la détection de fraude et l'expérience client.",
    saved: true,
    featured: false,
    applicants: 123,
  },
  {
    id: 3,
    title: "Product Manager – Fintech",
    company: "Wave Mobile",
    logo: "WM",
    logoColor: "blue",
    location: "Dakar, Sénégal",
    salary: "1.5M – 2M FCFA",
    type: "CDI",
    remote: true,
    time: "il y a 6h",
    tags: ["Product Strategy", "Agile", "Fintech", "UX Research"],
    desc: "Wave recherche un Product Manager passionné pour piloter nos produits de paiement mobile. Vous définirez la roadmap et collaborerez avec des équipes pluridisciplinaires.",
    saved: false,
    featured: true,
    applicants: 89,
  },
  {
    id: 4,
    title: "DevOps Engineer – Cloud AWS",
    company: "Jumia Group",
    logo: "JG",
    logoColor: "orange",
    location: "Lagos, Nigeria",
    salary: "$2,800 – $4,000",
    type: "CDI",
    remote: true,
    time: "il y a 1j",
    tags: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
    desc: "Jumia recrute un DevOps Engineer pour moderniser notre infrastructure cloud. Vous gérerez des déploiements à grande échelle pour des millions d'utilisateurs.",
    saved: false,
    featured: false,
    applicants: 201,
  },
  {
    id: 5,
    title: "Responsable Commercial Afrique Subsaharienne",
    company: "Société Générale Afrique",
    logo: "SG",
    logoColor: "red",
    location: "Abidjan, Côte d'Ivoire",
    salary: "Selon profil",
    type: "CDI",
    remote: false,
    time: "il y a 2j",
    tags: ["Sales", "B2B", "Finance", "Leadership"],
    desc: "Piloter le développement commercial de notre portefeuille clients entreprises en Afrique Subsaharienne avec une équipe de 15 commerciaux.",
    saved: false,
    featured: false,
    applicants: 67,
  },
  {
    id: 6,
    title: "UX/UI Designer – Applications Mobile",
    company: "Orange Digital Center",
    logo: "OD",
    logoColor: "orange",
    location: "Bamako, Mali",
    salary: "500K – 800K FCFA",
    type: "CDI",
    remote: true,
    time: "il y a 3j",
    tags: ["Figma", "Sketch", "Mobile", "User Research"],
    desc: "Créez des expériences utilisateur exceptionnelles pour des applications mobiles utilisées par des millions d'africains. Liberté créative et impact réel.",
    saved: true,
    featured: false,
    applicants: 134,
  },
];

const logoColors: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function JobsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set([2, 6]));
  const [query, setQuery] = useState("");

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredJobs = jobs.filter((j) =>
    activeCategory === "Tous" ||
    j.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4)))
  );

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero search */}
      <div className="relative py-12 px-4 bg-gradient-to-b from-emerald-950/30 to-transparent border-b border-[#1f2d45]">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Zap size={12} />
            320,450 offres disponibles
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Trouvez votre prochain emploi en{" "}
            <span className="gradient-text-green" style={{ background: "linear-gradient(135deg, #10B981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Afrique
            </span>
          </h1>
          <p className="text-gray-400 mb-6">Emplois, stages, freelance — tout le marché africain réuni.</p>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Poste, compétence, entreprise..."
                className="input-premium pl-11 py-3"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Pays / Ville"
                className="input-premium pl-10 py-3 w-40"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap">
              Rechercher
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Remote", "CDI", "Startup", "Multinationale", "Senegal", "Nigeria", "Kenya"].map((tag) => (
              <button key={tag} className="px-3 py-1 text-xs font-medium text-gray-400 border border-[#1f2d45] rounded-full hover:border-emerald-500/40 hover:text-emerald-400 transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card-premium p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-emerald-400" />
                <h2 className="font-semibold text-white text-sm">Filtres</h2>
              </div>

              {/* Contract type */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type de contrat</h3>
                <div className="space-y-2">
                  {["CDI", "CDD", "Freelance", "Stage", "Alternance", "Volunteer"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="accent-emerald-500 w-4 h-4" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider mb-5" />

              {/* Salary */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Salaire</h3>
                <div className="space-y-2">
                  {["< 500K FCFA", "500K – 1M FCFA", "1M – 2M FCFA", "> 2M FCFA", "$1,000 – $3,000", "> $3,000"].map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="salary" className="accent-emerald-500 w-4 h-4" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-300">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider mb-5" />

              {/* Experience */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Expérience</h3>
                {["Junior (0-2 ans)", "Mid (2-5 ans)", "Senior (5-10 ans)", "Expert (10+ ans)"].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group mb-2">
                    <input type="checkbox" className="accent-emerald-500 w-4 h-4" />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300">{level}</span>
                  </label>
                ))}
              </div>

              <button className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all">
                Appliquer les filtres
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
              {categories.map(({ label, count }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === label
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 border border-[#1f2d45] hover:border-[#2d4060] hover:text-gray-300"
                  }`}
                >
                  {label}
                  <span className={`ml-1.5 text-xs ${activeCategory === label ? "text-emerald-400/70" : "text-gray-600"}`}>
                    {(count / 1000).toFixed(0)}K
                  </span>
                </button>
              ))}
            </div>

            {/* Alert + sort bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{filteredJobs.length} offres trouvées</span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all">
                  <Bell size={13} />
                  Créer une alerte
                </button>
                <select className="input-premium py-2 text-xs w-auto">
                  <option>Plus récents</option>
                  <option>Salaire croissant</option>
                  <option>Pertinence</option>
                </select>
              </div>
            </div>

            {/* Job list */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`card-premium p-5 group ${job.featured ? "border-emerald-500/20" : ""}`}
                >
                  {job.featured && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star size={12} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-yellow-400 font-semibold">Offre mise en avant</span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${logoColors[job.logoColor] || logoColors.emerald}`}>
                      {job.logo}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className={`shrink-0 transition-colors ${savedJobs.has(job.id) ? "text-emerald-400" : "text-gray-600 hover:text-gray-400"}`}
                        >
                          <BookmarkPlus size={18} fill={savedJobs.has(job.id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Building2 size={13} className="text-gray-500" />
                        <span className="text-sm text-gray-400 font-medium">{job.company}</span>
                        <span className="text-gray-600">·</span>
                        <MapPin size={13} className="text-gray-500" />
                        <span className="text-sm text-gray-500">{job.location}</span>
                        {job.remote && (
                          <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-semibold">
                            Remote
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-3 truncate-2">{job.desc}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">{job.salary}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {job.time}
                          </span>
                          <span>{job.applicants} candidats</span>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                          Postuler
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, "...", 12].map((page, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                    page === 1
                      ? "bg-emerald-500 text-white"
                      : "text-gray-400 border border-[#1f2d45] hover:border-emerald-500/30 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
