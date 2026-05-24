"use client";

import Link from "next/link";
import { Brain, MessageSquare, FileText, BarChart3, Bot, Code2, Image as ImageIcon, Zap, TrendingUp, Clock, Star, ArrowRight, Plus, Globe, Cpu, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const usageData = [
  { day: "Lun", tokens: 120000 },
  { day: "Mar", tokens: 240000 },
  { day: "Mer", tokens: 180000 },
  { day: "Jeu", tokens: 310000 },
  { day: "Ven", tokens: 280000 },
  { day: "Sam", tokens: 90000 },
  { day: "Dim", tokens: 150000 },
];

const quickTools = [
  { icon: MessageSquare, label: "Kora Chat", desc: "Assistant IA", color: "violet", href: "/chat" },
  { icon: FileText, label: "Kora Write", desc: "Génération contenu", color: "cyan", href: "/tools" },
  { icon: BarChart3, label: "Kora Analytics", desc: "Analyse données", color: "gold", href: "/analytics" },
  { icon: Bot, label: "Kora Bot", desc: "Créer un chatbot", color: "rose", href: "/tools" },
  { icon: Code2, label: "Kora Code", desc: "Assistant dev", color: "violet", href: "/tools" },
  { icon: ImageIcon, label: "Kora Vision", desc: "Génération images", color: "cyan", href: "/tools" },
];

const recentActivity = [
  { tool: "Kora Write", action: "Rapport Q1 généré en français", time: "il y a 5min", tokens: 12400, icon: FileText, color: "cyan" },
  { tool: "Kora Chat", action: "Analyse contrat en wolof", time: "il y a 22min", tokens: 8200, icon: MessageSquare, color: "violet" },
  { tool: "Kora Analytics", action: "Dashboard ventes Nigeria créé", time: "il y a 1h", tokens: 24000, icon: BarChart3, color: "gold" },
  { tool: "Kora Bot", action: "Chatbot WhatsApp configuré", time: "il y a 3h", tokens: 5100, icon: Bot, color: "rose" },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  gold: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function DashboardPage() {
  const tokensUsed = 2400000;
  const tokensTotal = 5000000;
  const pct = Math.round((tokensUsed / tokensTotal) * 100);

  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* Top bar */}
      <header className="glass border-b border-[#1E2A3D] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-white font-display">Kora AI</span>
          <span className="badge-pro text-[10px]">PRO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Activity size={13} className="text-violet-400" />
            <span>{tokensUsed.toLocaleString()} / {tokensTotal.toLocaleString()} tokens</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">IK</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="relative rounded-2xl p-6 overflow-hidden border border-[#1E2A3D]">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-cyan-900/20" />
          <div className="absolute inset-0 dot-kora opacity-20" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Bonjour, Ibrahima 👋</h1>
              <p className="text-gray-400 text-sm">Vous avez utilisé <span className="text-violet-400 font-semibold">{pct}%</span> de vos tokens ce mois. Renouvellement dans 12 jours.</p>
            </div>
            <Link href="/chat" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-violet-600 transition-all shadow-lg">
              <MessageSquare size={15} />Nouvelle conversation
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Tokens utilisés", value: "2.4M", sub: "/ 5M ce mois", icon: Cpu, color: "violet", pct: 48 },
            { label: "Requêtes aujourd'hui", value: "1,247", sub: "+18% vs hier", icon: Zap, color: "cyan", pct: null },
            { label: "Économies estimées", value: "84h", sub: "de travail économisé", icon: Clock, color: "gold", pct: null },
            { label: "Langues utilisées", value: "4", sub: "Fr, En, Wolof, Ha", icon: Globe, color: "rose", pct: null },
          ].map(({ label, value, sub, icon: Icon, color, pct: p }) => (
            <div key={label} className="card-kora p-5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[color]}`}>
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-xs text-gray-500 mb-2">{label}</div>
              <div className="text-xs text-gray-600">{sub}</div>
              {p !== null && (
                <div className="progress-kora mt-2">
                  <div className="progress-fill-kora" style={{ width: `${p}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage chart */}
          <div className="lg:col-span-2 card-kora p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" />
                Utilisation tokens — 7 derniers jours
              </h2>
              <select className="input-kora py-1.5 text-xs w-32">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorKora" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1E2A3D", borderRadius: "12px", color: "#F9FAFB" }} formatter={(v) => [`${(Number(v)/1000).toFixed(0)}K tokens`, "Utilisation"]} />
                <Area type="monotone" dataKey="tokens" stroke="#7C3AED" strokeWidth={2} fill="url(#colorKora)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity feed */}
          <div className="card-kora p-5">
            <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Clock size={15} className="text-violet-400" />
              Activité récente
            </h2>
            <div className="space-y-3">
              {recentActivity.map(({ tool, action, time, tokens, icon: Icon, color }) => (
                <div key={action} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#161D2E] transition-all">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[color]}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">{tool}</div>
                    <div className="text-xs text-gray-500 truncate">{action}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-600">{time}</span>
                      <span className="text-[10px] text-violet-400">{(tokens/1000).toFixed(1)}K tokens</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick tools */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Accès rapide aux outils</h2>
            <Link href="/tools" className="text-xs text-violet-400 font-semibold hover:text-violet-300 flex items-center gap-1">
              Voir tous <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickTools.map(({ icon: Icon, label, desc, color, href }) => (
              <Link key={label} href={href} className="card-kora p-4 text-center group hover:border-violet-500/30 transition-all">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-3 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">{label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="relative rounded-2xl p-6 overflow-hidden border border-violet-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-cyan-900/20" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Star size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-white">Passez à Business</div>
                <div className="text-sm text-gray-400">Tokens illimités, cloud privé, support dédié</div>
              </div>
            </div>
            <Link href="/pricing" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg">
              Voir les offres <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
