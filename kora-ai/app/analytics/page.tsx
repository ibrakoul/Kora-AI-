"use client";

import Link from "next/link";
import { Brain, BarChart3, TrendingUp, TrendingDown, Globe, Zap, Download, Calendar, Filter, ArrowRight, MessageSquare, FileText, Bot } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

const tokenData = [
  { day: "01 Mai", chat: 85000, write: 42000, analytics: 28000 },
  { day: "05 Mai", chat: 120000, write: 68000, analytics: 45000 },
  { day: "10 Mai", chat: 95000, write: 55000, analytics: 38000 },
  { day: "15 Mai", chat: 180000, write: 92000, analytics: 67000 },
  { day: "20 Mai", chat: 145000, write: 78000, analytics: 52000 },
  { day: "25 Mai", chat: 210000, write: 105000, analytics: 78000 },
  { day: "30 Mai", chat: 175000, write: 88000, analytics: 61000 },
];

const requestData = [
  { hour: "00h", requests: 120 },
  { hour: "04h", requests: 45 },
  { hour: "08h", requests: 380 },
  { hour: "10h", requests: 620 },
  { hour: "12h", requests: 890 },
  { hour: "14h", requests: 740 },
  { hour: "16h", requests: 950 },
  { hour: "18h", requests: 680 },
  { hour: "20h", requests: 420 },
  { hour: "22h", requests: 280 },
];

const langData = [
  { name: "Français", value: 42, color: "#7C3AED" },
  { name: "English", value: 28, color: "#06B6D4" },
  { name: "Wolof", value: 12, color: "#F59E0B" },
  { name: "Hausa", value: 8, color: "#10B981" },
  { name: "Autres", value: 10, color: "#374151" },
];

const toolUsage = [
  { tool: "Kora Chat", icon: MessageSquare, requests: 24780, tokens: "1.2M", pct: 48, color: "violet" },
  { tool: "Kora Write", icon: FileText, requests: 12400, tokens: "620K", pct: 26, color: "cyan" },
  { tool: "Kora Analytics", icon: BarChart3, requests: 8900, tokens: "380K", pct: 17, color: "gold" },
  { tool: "Kora Bot", icon: Bot, requests: 4200, tokens: "180K", pct: 9, color: "rose" },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
  gold: "bg-yellow-500/10 text-yellow-400",
  rose: "bg-rose-500/10 text-rose-400",
};

const barColorMap: Record<string, string> = {
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
  gold: "bg-yellow-500",
  rose: "bg-rose-500",
};

const periods = ["7 derniers jours", "30 derniers jours", "3 derniers mois", "Cette année"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(periods[1]);

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
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1E2A3D] text-gray-300 text-sm font-medium rounded-xl hover:border-violet-500/30 transition-all glass">
            <Download size={14} />Exporter
          </button>
          <Link href="/chat" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-violet-600 transition-all">
            <MessageSquare size={14} />Chat IA
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">IK</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Title + period */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Analytiques</h1>
            <p className="text-gray-400 text-sm">Suivez l&apos;utilisation de vos outils Kora AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-500" />
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-kora py-2 text-sm w-44">
              {periods.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Tokens consommés", value: "2.4M", sub: "+18% vs période préc.", trend: "up" },
            { label: "Requêtes totales", value: "50,280", sub: "+12% vs période préc.", trend: "up" },
            { label: "Coût estimé", value: "47,200 F", sub: "-5% vs période préc.", trend: "down" },
            { label: "Langues actives", value: "4", sub: "Fr, En, Wo, Ha", trend: null },
          ].map(({ label, value, sub, trend }) => (
            <div key={label} className="card-kora p-5">
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500 mb-2">{label}</div>
              <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-gray-500"}`}>
                {trend === "up" && <TrendingUp size={12} />}
                {trend === "down" && <TrendingDown size={12} />}
                {sub}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token usage stacked */}
          <div className="lg:col-span-2 card-kora p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <TrendingUp size={15} className="text-violet-400" />
                Tokens par outil
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />Chat</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />Write</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />Analytics</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={tokenData}>
                <defs>
                  {[["chat", "#7C3AED"], ["write", "#06B6D4"], ["analytics", "#F59E0B"]].map(([key, color]) => (
                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1E2A3D", borderRadius: "12px", color: "#F9FAFB", fontSize: "12px" }} formatter={(v) => [`${(Number(v)/1000).toFixed(0)}K tokens`]} />
                <Area type="monotone" dataKey="chat" stroke="#7C3AED" strokeWidth={2} fill="url(#grad-chat)" />
                <Area type="monotone" dataKey="write" stroke="#06B6D4" strokeWidth={2} fill="url(#grad-write)" />
                <Area type="monotone" dataKey="analytics" stroke="#F59E0B" strokeWidth={2} fill="url(#grad-analytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Languages pie */}
          <div className="card-kora p-6">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2 mb-5">
              <Globe size={15} className="text-cyan-400" />
              Langues utilisées
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={langData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {langData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1E2A3D", borderRadius: "8px", fontSize: "11px", color: "#F9FAFB" }} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {langData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-gray-400">{name}</span>
                  </div>
                  <span className="text-white font-semibold">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests by hour */}
          <div className="card-kora p-6">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2 mb-5">
              <Zap size={15} className="text-yellow-400" />
              Requêtes par heure (aujourd&apos;hui)
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
                <XAxis dataKey="hour" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1E2A3D", borderRadius: "8px", fontSize: "11px", color: "#F9FAFB" }} />
                <Bar dataKey="requests" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Requêtes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tool breakdown */}
          <div className="card-kora p-6">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2 mb-5">
              <Filter size={15} className="text-violet-400" />
              Utilisation par outil
            </h2>
            <div className="space-y-4">
              {toolUsage.map(({ tool, icon: Icon, requests, tokens, pct, color }) => (
                <div key={tool}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                        <Icon size={13} />
                      </div>
                      <span className="text-sm text-gray-300">{tool}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white font-semibold">{requests.toLocaleString()} req.</div>
                      <div className="text-[10px] text-gray-600">{tokens} tokens</div>
                    </div>
                  </div>
                  <div className="progress-kora">
                    <div className={`h-full rounded-full transition-all ${barColorMap[color]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="relative rounded-2xl p-6 overflow-hidden border border-violet-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-cyan-900/20" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-bold text-white mb-1">Analytiques avancés disponibles avec le plan Business</div>
              <div className="text-sm text-gray-400">Cohortes, funnels, exports illimités et rapports IA automatisés.</div>
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
