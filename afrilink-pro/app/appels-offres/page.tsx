"use client";

import { useState } from "react";
import {
  FileText, Search, MapPin, Calendar, DollarSign, Building2,
  Clock, ChevronRight, Bell, Filter, ExternalLink, Download,
  CheckCircle, AlertCircle, Zap, Globe
} from "lucide-react";

const tenders = [
  {
    id: 1,
    title: "Construction et équipement de 50 centres de santé",
    client: "Ministère de la Santé du Sénégal",
    clientType: "Gouvernement",
    country: "Sénégal",
    flag: "🇸🇳",
    budget: "15 Milliards FCFA",
    deadline: "15 Juin 2025",
    published: "il y a 2j",
    sector: "Santé / BTP",
    status: "ouvert",
    desc: "Le Ministère de la Santé lance un appel d'offres international pour la construction et l'équipement de 50 centres de santé dans les zones rurales du Sénégal.",
    daysLeft: 21,
    documents: 4,
    views: 1240,
    featured: true,
  },
  {
    id: 2,
    title: "Développement d'un système de paiement mobile panafricain",
    client: "Union Africaine — BDEAC",
    clientType: "Institution internationale",
    country: "Afrique du Centre",
    flag: "🌍",
    budget: "$8.5 Millions",
    deadline: "30 Juin 2025",
    published: "il y a 5j",
    sector: "Fintech / IT",
    status: "ouvert",
    desc: "Conception, développement et déploiement d'une solution de paiement mobile interopérable pour 12 pays d'Afrique Centrale. API-first, conforme PCI-DSS.",
    daysLeft: 36,
    documents: 7,
    views: 3420,
    featured: true,
  },
  {
    id: 3,
    title: "Fourniture d'équipements solaires pour 200 écoles",
    client: "Ministère de l'Éducation du Ghana",
    clientType: "Gouvernement",
    country: "Ghana",
    flag: "🇬🇭",
    budget: "$2.1 Millions",
    deadline: "20 Mai 2025",
    published: "il y a 10j",
    sector: "Énergie / Éducation",
    status: "urgent",
    desc: "Installation de systèmes solaires photovoltaïques dans 200 établissements scolaires ghanéens. Inclut maintenance sur 5 ans.",
    daysLeft: 7,
    documents: 3,
    views: 2180,
    featured: false,
  },
  {
    id: 4,
    title: "Audit et certification ISO 27001 des infrastructures IT",
    client: "Ecobank Transnational",
    clientType: "Entreprise privée",
    country: "Nigeria",
    flag: "🇳🇬",
    budget: "$450,000",
    deadline: "10 Juillet 2025",
    published: "il y a 1j",
    sector: "Cybersécurité / IT",
    status: "ouvert",
    desc: "Mission d'audit complet de sécurité informatique et certification ISO 27001 pour l'ensemble du groupe Ecobank (36 pays africains).",
    daysLeft: 46,
    documents: 2,
    views: 890,
    featured: false,
  },
  {
    id: 5,
    title: "Construction du nouveau port autonome de Libreville",
    client: "Gouvernement du Gabon",
    clientType: "Gouvernement",
    country: "Gabon",
    flag: "🇬🇦",
    budget: "420 Milliards CFA",
    deadline: "31 Août 2025",
    published: "il y a 3j",
    sector: "Infrastructure / BTP",
    status: "ouvert",
    desc: "Projet majeur d'extension et modernisation du port autonome de Libreville. Capacité cible: 5M TEU/an. Financement BID assuré.",
    daysLeft: 98,
    documents: 12,
    views: 4560,
    featured: false,
  },
];

const sectors = ["Tous", "BTP", "IT / Digital", "Santé", "Énergie", "Agriculture", "Logistique", "Fintech", "Éducation", "Infrastructure"];
const countries = ["Tous", "Sénégal", "Nigeria", "Ghana", "Côte d'Ivoire", "Kenya", "Gabon", "Cameroun"];

export default function AppelsOffrePage() {
  const [activeSector, setActiveSector] = useState("Tous");
  const [query, setQuery] = useState("");

  const filtered = tenders.filter((t) =>
    (activeSector === "Tous" || t.sector.includes(activeSector)) &&
    (t.title.toLowerCase().includes(query.toLowerCase()) || t.client.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero */}
      <div className="relative py-12 px-4 border-b border-[#1f2d45] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 to-purple-950/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-5">
            <FileText size={12} />
            84,200 appels d'offres actifs · Mis à jour en temps réel
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
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mots-clés, client, secteur..." className="input-premium pl-11 py-3" />
            </div>
            <select className="input-premium py-3 w-36">
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sector tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {sectors.map((sector) => (
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
          <p className="text-sm text-gray-400">{filtered.length} appels d'offres trouvés</p>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all">
            <Bell size={13} />
            Créer une alerte secteur
          </button>
        </div>

        {/* Tenders list */}
        <div className="space-y-4">
          {filtered.map((tender) => (
            <div key={tender.id} className={`card-premium p-6 group ${tender.featured ? "border-orange-500/20" : ""}`}>
              {tender.featured && (
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
                      tender.status === "urgent"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {tender.status === "urgent" ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                      {tender.status === "urgent" ? "URGENT" : "Ouvert"}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-[#1a2236] rounded-lg">{tender.sector}</span>
                    <span className="text-xs text-gray-500">{tender.flag} {tender.country}</span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors leading-snug">
                    {tender.title}
                  </h2>

                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} className="text-gray-500" />
                    <span className="text-sm text-gray-400">{tender.client}</span>
                    <span className="text-xs text-gray-600 px-2 py-0.5 bg-[#1a2236] rounded">{tender.clientType}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 truncate-2 leading-relaxed">{tender.desc}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign size={14} />
                      {tender.budget}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar size={13} />
                      Clôture: <span className="text-gray-300 font-medium">{tender.deadline}</span>
                    </span>
                    <span className={`flex items-center gap-1.5 font-semibold ${tender.daysLeft <= 10 ? "text-red-400" : "text-gray-400"}`}>
                      <Clock size={13} />
                      {tender.daysLeft}j restants
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <FileText size={13} />
                      {tender.documents} docs
                    </span>
                    <span className="text-gray-600 text-xs">{tender.views.toLocaleString()} vues</span>
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
                <span className="text-xs text-gray-600">Publié {tender.published}</span>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors">
                  Voir les détails complets <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-400">Aucun appel d'offres trouvé</p>
            <p className="text-sm mt-1">Essayez d'autres critères de recherche</p>
          </div>
        )}

        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-orange-500/30 hover:text-orange-400 transition-all">
            Voir plus d'appels d'offres
          </button>
        </div>
      </div>
    </div>
  );
}
