"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, MapPin, Briefcase, Clock, ChevronRight, Filter,
  Star, Bell, ArrowUpRight, Zap, BookmarkPlus,
  Building2, DollarSign, SlidersHorizontal, Loader2, ChevronLeft
} from "lucide-react";
import type { JobRow } from "@/types/database";
import { toggleSaveJob, applyToJob } from "@/lib/api/jobs";

const categories = [
  { label: "Tous", key: "" },
  { label: "Tech & IT", key: "Tech & IT" },
  { label: "Finance", key: "Finance" },
  { label: "Santé", key: "Santé" },
  { label: "BTP", key: "BTP" },
  { label: "Agriculture", key: "Agriculture" },
  { label: "Marketing", key: "Marketing" },
  { label: "Éducation", key: "Éducation" },
  { label: "Logistique", key: "Logistique" },
  { label: "Énergie", key: "Énergie" },
];

const JOB_TYPES = ["CDI", "CDD", "Freelance", "Stage"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

function JobCard({
  job,
  isSaved,
  onToggleSave,
  onApply,
}: {
  job: JobRow;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onApply: (id: string) => void;
}) {
  const salaryText = job.salary_min && job.salary_max
    ? `${(job.salary_min / 1000).toFixed(0)}K – ${(job.salary_max / 1000).toFixed(0)}K ${job.currency}`
    : job.salary_min
    ? `${(job.salary_min / 1000).toFixed(0)}K+ ${job.currency}`
    : "Selon profil";

  const initials = job.company_name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className={`card-premium p-5 group ${job.is_featured ? "border-emerald-500/20" : ""}`}>
      {job.is_featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={12} className="text-yellow-400" fill="currentColor" />
          <span className="text-xs text-yellow-400 font-semibold">Offre mise en avant</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover rounded-xl" />
          ) : initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <button
              onClick={() => onToggleSave(job.id)}
              className={`shrink-0 transition-colors ${isSaved ? "text-emerald-400" : "text-gray-600 hover:text-gray-400"}`}
            >
              <BookmarkPlus size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Building2 size={13} className="text-gray-500" />
            <span className="text-sm text-gray-400 font-medium">{job.company_name}</span>
            <span className="text-gray-600">·</span>
            <MapPin size={13} className="text-gray-500" />
            <span className="text-sm text-gray-500">{job.location}</span>
            {job.remote_status === "remote" && (
              <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-semibold">
                Remote
              </span>
            )}
            {job.remote_status === "hybrid" && (
              <span className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-semibold">
                Hybride
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(job.skills_required ?? []).slice(0, 4).map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">{salaryText}</span>
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={12} />
                {job.job_type}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {timeAgo(job.created_at)}
              </span>
              {job.applicants_count > 0 && <span>{job.applicants_count} candidats</span>}
            </div>
            <button
              onClick={() => onApply(job.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all"
            >
              Postuler
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [remoteFilter, setRemoteFilter] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (activeCategory) params.set("category", activeCategory);
      if (selectedTypes.length === 1) params.set("type", selectedTypes[0]);
      if (remoteFilter) params.set("remote", remoteFilter);
      params.set("page", String(page));
      params.set("limit", "10");

      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, selectedTypes, remoteFilter, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleToggleSave = async (id: string) => {
    const { saved } = await toggleSaveJob(id).catch(() => ({ saved: false }));
    setSavedIds(prev => {
      const next = new Set(prev);
      saved ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleApply = async (id: string) => {
    try {
      await applyToJob(id, {});
      alert("Candidature envoyée !");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur");
    }
  };

  const handleSearch = () => {
    setQuery(searchInput);
    setPage(1);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero search */}
      <div className="relative py-12 px-4 bg-gradient-to-b from-emerald-950/30 to-transparent border-b border-[#1f2d45]">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Zap size={12} />
            {total > 0 ? `${total.toLocaleString()} offres disponibles` : "Offres disponibles"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Trouvez votre prochain emploi en{" "}
            <span className="gradient-text-green" style={{ background: "linear-gradient(135deg, #10B981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Afrique
            </span>
          </h1>
          <p className="text-gray-400 mb-6">Emplois, stages, freelance — tout le marché africain réuni.</p>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Poste, compétence, entreprise..."
                className="input-premium pl-11 py-3"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap"
            >
              Rechercher
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["remote", "on-site", "hybrid"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setRemoteFilter(prev => prev === tag ? "" : tag); setPage(1); }}
                className={`px-3 py-1 text-xs font-medium border rounded-full transition-all capitalize ${
                  remoteFilter === tag
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                    : "text-gray-400 border-[#1f2d45] hover:border-emerald-500/40 hover:text-emerald-400"
                }`}
              >
                {tag === "on-site" ? "Sur site" : tag === "hybrid" ? "Hybride" : "Remote"}
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

              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type de contrat</h3>
                <div className="space-y-2">
                  {JOB_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="accent-emerald-500 w-4 h-4"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider mb-5" />

              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Télétravail</h3>
                <div className="space-y-2">
                  {[
                    { val: "", label: "Tous" },
                    { val: "remote", label: "Full remote" },
                    { val: "hybrid", label: "Hybride" },
                    { val: "on-site", label: "Sur site" },
                  ].map(({ val, label }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="remote"
                        className="accent-emerald-500 w-4 h-4"
                        checked={remoteFilter === val}
                        onChange={() => { setRemoteFilter(val); setPage(1); }}
                      />
                      <span className="text-sm text-gray-400 group-hover:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedTypes([]); setRemoteFilter(""); setQuery(""); setSearchInput(""); setActiveCategory(""); setPage(1); }}
                className="w-full py-2.5 text-sm font-semibold text-gray-400 border border-[#1f2d45] rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
              {categories.map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => { setActiveCategory(key); setPage(1); }}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === key
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 border border-[#1f2d45] hover:border-[#2d4060] hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">
                {loading ? "Chargement..." : `${total} offres trouvées`}
              </span>
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all">
                <Bell size={13} />
                Créer une alerte
              </button>
            </div>

            {/* Job list */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-emerald-400 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-400">Aucune offre trouvée</p>
                <p className="text-sm mt-1">Essayez d'autres filtres ou termes de recherche</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1f2d45] text-gray-400 hover:border-emerald-500/30 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                        page === p
                          ? "bg-emerald-500 text-white"
                          : "text-gray-400 border border-[#1f2d45] hover:border-emerald-500/30 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1f2d45] text-gray-400 hover:border-emerald-500/30 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
