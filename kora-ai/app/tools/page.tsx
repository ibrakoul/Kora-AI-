"use client";

import Link from "next/link";
import { Brain, MessageSquare, FileText, BarChart3, Bot, Code2, Image as ImageIcon, ArrowRight, Zap, Globe, Shield, Clock, Star, Search, Filter } from "lucide-react";
import { useState } from "react";

const tools = [
  {
    id: "chat", icon: MessageSquare, label: "Kora Chat", category: "communication",
    desc: "Assistant IA conversationnel multilingue pour vos équipes africaines. Répond en français, wolof, hausa, swahili et 8 autres langues.",
    features: ["12 langues africaines", "Mémoire contextuelle", "Mode voix", "Partage de conversation"],
    badge: "Populaire", badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    color: "violet", href: "/chat",
    stats: { label: "Requêtes/mois", value: "180M+" },
  },
  {
    id: "write", icon: FileText, label: "Kora Write", category: "content",
    desc: "Génération de contenu IA adapté aux marchés africains. Emails, rapports, articles, posts réseaux sociaux en plusieurs langues.",
    features: ["Génération longue forme", "Adaptation culturelle", "SEO africain", "Templates métiers"],
    badge: "Nouveau", badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    color: "cyan", href: "/tools",
    stats: { label: "Documents générés", value: "2M+" },
  },
  {
    id: "analytics", icon: BarChart3, label: "Kora Analytics", category: "data",
    desc: "Analyse de données et génération de rapports intelligents. Visualisations adaptées aux réalités économiques africaines.",
    features: ["Analyse prédictive", "Dashboards auto", "Export PDF/Excel", "Insights IA"],
    badge: null, badgeColor: "",
    color: "gold", href: "/analytics",
    stats: { label: "Datasets analysés", value: "500K+" },
  },
  {
    id: "bot", icon: Bot, label: "Kora Bot", category: "automation",
    desc: "Créez des chatbots intelligents pour WhatsApp, Telegram et votre site web. Sans code, en quelques minutes.",
    features: ["WhatsApp Business", "Multi-canaux", "Escalade humaine", "Analytics intégré"],
    badge: "Bêta", badgeColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    color: "rose", href: "/tools",
    stats: { label: "Chatbots déployés", value: "12K+" },
  },
  {
    id: "code", icon: Code2, label: "Kora Code", category: "development",
    desc: "Assistant développement IA spécialisé pour les technologies utilisées en Afrique. Mobile, web, fintech, agritech.",
    features: ["Génération code", "Revue de code", "Debug intelligent", "API docs auto"],
    badge: null, badgeColor: "",
    color: "violet", href: "/tools",
    stats: { label: "Lignes générées", value: "50M+" },
  },
  {
    id: "vision", icon: ImageIcon, label: "Kora Vision", category: "media",
    desc: "Génération et analyse d'images IA avec contexte africain. Visuels marketing, infographies, illustrations culturelles.",
    features: ["Génération images", "Analyse visuelle", "Styles africains", "Édition IA"],
    badge: "Nouveau", badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    color: "cyan", href: "/tools",
    stats: { label: "Images créées", value: "800K+" },
  },
];

const categories = [
  { id: "all", label: "Tous les outils" },
  { id: "communication", label: "Communication" },
  { id: "content", label: "Contenu" },
  { id: "data", label: "Données" },
  { id: "automation", label: "Automatisation" },
  { id: "development", label: "Développement" },
  { id: "media", label: "Médias" },
];

const colorMap: Record<string, string> = {
  violet: "from-violet-600 to-violet-800",
  cyan: "from-cyan-600 to-cyan-800",
  gold: "from-yellow-600 to-yellow-800",
  rose: "from-rose-600 to-rose-800",
};

const iconBgMap: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  gold: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tools.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* Header */}
      <header className="glass border-b border-[#1E2A3D] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-white font-display">Kora <span className="gradient-kora">AI</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-violet-600 transition-all">
            <MessageSquare size={14} />Chat IA
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">IK</div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#1E2A3D]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#070B14] to-cyan-900/10" />
        <div className="absolute inset-0 dot-kora opacity-20" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-semibold mb-6">
            <Zap size={12} />6 outils IA puissants
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            La suite IA complète<br />pour <span className="gradient-kora">l&apos;Afrique</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">Tous vos outils d&apos;intelligence artificielle en un seul endroit. Conçus pour les langues, cultures et marchés africains.</p>
          <div className="flex justify-center gap-6 text-sm">
            {[
              { icon: Globe, text: "12 langues africaines" },
              { icon: Shield, text: "Données sécurisées" },
              { icon: Clock, text: "99.9% uptime" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-400">
                <Icon size={14} className="text-violet-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-kora pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter size={14} className="text-gray-500 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-violet-600 text-white"
                    : "glass border border-[#1E2A3D] text-gray-400 hover:text-white hover:border-violet-500/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ id, icon: Icon, label, desc, features, badge, badgeColor, color, href, stats }) => (
            <div key={id} className="card-kora p-6 group hover:border-violet-500/30 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconBgMap[color]}`}>
                  <Icon size={22} />
                </div>
                {badge && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${badgeColor}`}>{badge}</span>
                )}
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{label}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{desc}</p>

              <div className="space-y-1.5 mb-5">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-violet-500" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1E2A3D]">
                <div>
                  <div className="text-xs font-bold gradient-kora">{stats.value}</div>
                  <div className="text-[10px] text-gray-600">{stats.label}</div>
                </div>
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold bg-gradient-to-r ${colorMap[color]} hover:opacity-90 transition-all`}
                >
                  Utiliser <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <Bot size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun outil trouvé pour &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Integrations CTA */}
        <div className="mt-12 relative rounded-2xl p-8 overflow-hidden border border-violet-500/20 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-cyan-900/20" />
          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg mb-5">
              <Star size={24} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Besoin d&apos;une intégration sur mesure ?</h2>
            <p className="text-gray-400 mb-6">Notre API permet d&apos;intégrer Kora AI dans vos applications existantes. Documentation complète disponible.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="#" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg">
                Voir la documentation API <ArrowRight size={15} />
              </Link>
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 border border-[#1E2A3D] text-gray-300 font-semibold rounded-xl hover:border-violet-500/30 hover:text-white transition-all glass">
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
