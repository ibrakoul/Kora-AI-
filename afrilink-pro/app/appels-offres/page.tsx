"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText, Search, Calendar, DollarSign, Building2,
  Clock, ChevronRight, Bell, ExternalLink, Download,
  CheckCircle, AlertCircle, Zap, Loader2
} from "lucide-react";
import type { TenderRow } from "@/types/database";
import { fetchTenders } from "@/lib/api/tenders";

const SECTORS = ["Tous", "BTP", "IT / Digital", "Santé", "Énergie", "Agriculture", "Logistique", "Fintech", "Éducation", "Infrastructure"];
const COUNTRIES = ["Tous", "Sénégal", "Nigeria", "Ghana", "Côte d'Ivoire", "Kenya", "Gabon", "Cameroun"];

const clientTypeLabel: Record<string, string> = {
  Government: "Gouvernement",
  International: "Institution internationale",
  Private: "Entreprise privée",
};

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "il y a 1j";
  return `il y a ${days}j`;
}

function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function AppelsOffrePage() {
  const [tenders, setTenders] = useState<TenderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("Tous");
  const [activeCountry, setActiveCountry] = useState("Tous");
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (sector: string, country: string, q: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: "20" };
      if (sector !== "Tous") params.sector = sector;
      if (country !== "Tous") params.country = country;
      if (q) params.q = q;
      const data = await fetchTenders(params);
      setTenders(data);
    } catch {
      setTenders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(activeSector, activeCountry, query);
  }, [activeSector, activeCountry, load]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      load(activeSector, activeCountry, query);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero */}
      <div className="relative py-12 px-4 border-b border-[#1f2d45] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 to-purple-950/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-5">
            <FileText size={12} />
            Appels d'offres actifs · Mis à jour en temps réel
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Marchés publics & privés{" "}
            <span style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              africains
            </span>
          </h1>
          <p className="text-gray-400 mb-6">Accédez aux appels d'offres gouvernementaux et privés de 54 pays africains en temps réel.</p>

          {/* Search */}
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mots-clés, client, secteur..."
                className="input-premium pl-11 py-3"
              />
            </div>
            <select
              value={activeCountry}
              onChange={(e) => setActiveCountry(e.target.value)}
              className="input-premium py-3 w-40"
            >
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button
              onClick={() => load(activeSector, activeCountry, query)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg"
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sector tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeSector === sector
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 border border-[#1f2d45] hover:border-[#2d4060] hover:text-gray-300"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Alert bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-400">{tenders.length} appels d'offres trouvés</p>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all">
            <Bell size={13} />
            Créer une alerte secteur
          </button>
        </div>

        {/* Tenders list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-orange-400 animate-spin" />
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-400">Aucun appel d'offres trouvé</p>
            <p className="text-sm mt-1">Essayez d'autres critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenders.map((tender) => {
              const left = daysLeft(tender.deadline);
              const isUrgent = tender.status === "urgent" || (left !== null && left <= 10);
              const budgetStr = tender.budget_amount
                ? `${tender.budget_amount.toLocaleString()} ${tender.budget_currency}`
                : "Budget à définir";

              return (
                <div key={tender.id} className={`card-premium p-6 group ${tender.is_featured ? "border-orange-500/20" : ""}`}>
                  {tender.is_featured && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Zap size={12} className="text-orange-400" />
                      <span className="text-xs text-orange-400 font-semibold">Appel d'offres featured</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      {/* Status + Sector */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          isUrgent
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {isUrgent ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                          {isUrgent ? "URGENT" : "Ouvert"}
                        </span>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-[#1a2236] rounded-lg">{tender.sector}</span>
                        <span className="text-xs text-gray-500">{tender.country}</span>
                      </div>

                      <h2 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors leading-snug">
                        {tender.title}
                      </h2>

                      <div className="flex items-center gap-2 mb-3">
                        <Building2 size={13} className="text-gray-500" />
                        <span className="text-sm text-gray-400">{tender.client_name}</span>
                        <span className="text-xs text-gray-600 px-2 py-0.5 bg-[#1a2236] rounded">
                          {clientTypeLabel[tender.client_type] ?? tender.client_type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{tender.description}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <DollarSign size={14} />
                          {budgetStr}
                        </span>
                        {tender.deadline && (
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={13} />
                            Clôture: <span className="text-gray-300 font-medium ml-1">{formatDeadline(tender.deadline)}</span>
                          </span>
                        )}
                        {left !== null && (
                          <span className={`flex items-center gap-1.5 font-semibold ${left <= 10 ? "text-red-400" : "text-gray-400"}`}>
                            <Clock size={13} />
                            {left}j restants
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <FileText size={13} />
                          {tender.documents_count} docs
                        </span>
                        <span className="text-gray-600 text-xs">{tender.views_count.toLocaleString()} vues</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-md hover:shadow-orange-500/30 whitespace-nowrap">
                        Déposer un dossier
                        <ChevronRight size={14} />
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 border border-[#1f2d45] text-gray-400 text-sm font-semibold rounded-xl hover:border-orange-500/30 hover:text-orange-400 transition-all whitespace-nowrap">
                        <Download size={14} />
                        Télécharger le DAO
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1f2d45]">
                    <span className="text-xs text-gray-600">Publié {timeAgo(tender.created_at)}</span>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors">
                      Voir les détails complets <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && tenders.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-orange-500/30 hover:text-orange-400 transition-all">
              Voir plus d'appels d'offres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
