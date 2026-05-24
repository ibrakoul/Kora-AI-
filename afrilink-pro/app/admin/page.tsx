"use client";

import {
  Users, Briefcase, TrendingUp, AlertTriangle, DollarSign, Globe,
  Shield, BarChart3, Activity, Eye, MessageSquare, CheckCircle,
  XCircle, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Flag, UserCheck, Building2, GraduationCap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12400000, users: 4200 },
  { month: "Fév", revenue: 15600000, users: 5100 },
  { month: "Mar", revenue: 18200000, users: 6300 },
  { month: "Avr", revenue: 21800000, users: 7400 },
  { month: "Mai", revenue: 19400000, users: 6900 },
  { month: "Juin", revenue: 24600000, users: 8200 },
  { month: "Juil", revenue: 28900000, users: 9100 },
  { month: "Août", revenue: 31200000, users: 10400 },
];

const usersByCountry = [
  { country: "Sénégal", users: 420000, pct: 18 },
  { country: "Nigeria", users: 380000, pct: 16 },
  { country: "Côte d'Ivoire", users: 310000, pct: 13 },
  { country: "Ghana", users: 280000, pct: 12 },
  { country: "Kenya", users: 240000, pct: 10 },
  { country: "Cameroun", users: 190000, pct: 8 },
  { country: "Autres", users: 580000, pct: 24 },
];

const recentUsers = [
  { name: "Aminata Diallo", email: "aminata@example.com", country: "🇸🇳 Sénégal", type: "Professionnel", status: "active", date: "il y a 5min" },
  { name: "Kwame Osei", email: "kwame@example.com", country: "🇬🇭 Ghana", type: "Entreprise", status: "pending", date: "il y a 12min" },
  { name: "Fatou Bah", email: "fatou@example.com", country: "🇬🇳 Guinée", type: "Étudiant", status: "active", date: "il y a 23min" },
  { name: "Chidi Nwankwo", email: "chidi@example.com", country: "🇳🇬 Nigeria", type: "Freelance", status: "suspended", date: "il y a 1h" },
  { name: "Aïcha Maïga", email: "aicha@example.com", country: "🇲🇱 Mali", type: "Professionnel", status: "active", date: "il y a 2h" },
];

const reports = [
  { user: "User_XY292", reason: "Spam / Contenu inapproprié", reported: "il y a 10min", severity: "high" },
  { user: "Company_00A", reason: "Fausses informations entreprise", reported: "il y a 45min", severity: "medium" },
  { user: "User_TK810", reason: "Comportement harcelant", reported: "il y a 2h", severity: "high" },
  { user: "User_ML002", reason: "Contenu trompeur", reported: "il y a 3h", severity: "low" },
];

const kpiCards = [
  { label: "Utilisateurs totaux", value: "2,400,000", change: "+18.4%", up: true, icon: Users, color: "emerald" },
  { label: "Revenus du mois", value: "31.2M FCFA", change: "+24.1%", up: true, icon: DollarSign, color: "blue" },
  { label: "Offres d'emploi", value: "320,450", change: "+12.8%", up: true, icon: Briefcase, color: "orange" },
  { label: "Signalements actifs", value: "47", change: "-8.2%", up: false, icon: Flag, color: "red" },
  { label: "Entreprises vérifiées", value: "85,200", change: "+31.5%", up: true, icon: Building2, color: "purple" },
  { label: "Formations actives", value: "12,400", change: "+45.2%", up: true, icon: GraduationCap, color: "blue" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Admin header */}
      <div className="border-b border-[#1f2d45] px-6 py-4 glass sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">AfriLink Pro — Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Panneau d'administration · Accès restreint</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Système opérationnel</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {kpiCards.map(({ label, value, change, up, icon: Icon, color }) => {
            const bg: Record<string, string> = {
              emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
              red: "bg-red-500/10 text-red-400 border-red-500/20",
              purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            };
            return (
              <div key={label} className="card-premium p-5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${bg[color]}`}>
                  <Icon size={16} />
                </div>
                <div className="text-xl font-bold text-white mb-0.5">{value}</div>
                <div className="text-xs text-gray-500 mb-2">{label}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {change} ce mois
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Revenue chart */}
          <div className="xl:col-span-2 card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-white mb-1">Revenus & Inscriptions</h2>
                <p className="text-sm text-gray-500">8 derniers mois</p>
              </div>
              <select className="input-premium py-1.5 text-xs w-32">
                <option>Cette année</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2d45" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1f2d45", borderRadius: "12px", color: "#f9fafb" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} fill="url(#colorUsers)" name="Inscrits" />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#colorRevenue)" name="Revenus (FCFA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Users by country */}
          <div className="card-premium p-6">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <Globe size={16} className="text-emerald-400" />
              Répartition géographique
            </h2>
            <div className="space-y-3">
              {usersByCountry.map(({ country, users, pct }) => (
                <div key={country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{country}</span>
                    <span className="text-xs text-gray-500">{(users / 1000).toFixed(0)}K · {pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent users */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white flex items-center gap-2">
                <UserCheck size={16} className="text-emerald-400" />
                Nouveaux utilisateurs
              </h2>
              <button className="text-xs text-emerald-400 font-semibold hover:text-emerald-300">
                Voir tout →
              </button>
            </div>
            <div className="space-y-3">
              {recentUsers.map(({ name, email, country, type, status, date }) => (
                <div key={email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a2236] transition-all group">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{name}</div>
                    <div className="text-xs text-gray-500">{email} · {country}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-600 px-2 py-1 bg-[#1a2236] rounded">{type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                      status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {status === "active" ? "✓ Actif" : status === "pending" ? "⏳ En attente" : "⛔ Suspendu"}
                    </span>
                    <span className="text-xs text-gray-600">{date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                Signalements à traiter
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
                  {reports.length}
                </span>
              </h2>
              <button className="text-xs text-red-400 font-semibold hover:text-red-300">
                Voir tout →
              </button>
            </div>
            <div className="space-y-3">
              {reports.map(({ user, reason, reported, severity }) => (
                <div key={user} className="flex items-start gap-3 p-3 rounded-xl bg-[#1a2236] border border-[#1f2d45]">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    severity === "high" ? "bg-red-400" :
                    severity === "medium" ? "bg-yellow-400" :
                    "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{user}</div>
                    <div className="text-xs text-gray-400">{reason}</div>
                    <div className="text-xs text-gray-600 mt-1">{reported}</div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="w-7 h-7 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition-all" title="Résoudre">
                      <CheckCircle size={13} />
                    </button>
                    <button className="w-7 h-7 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all" title="Suspendre">
                      <XCircle size={13} />
                    </button>
                    <button className="w-7 h-7 bg-[#111827] text-gray-500 rounded-lg flex items-center justify-center hover:text-gray-300 transition-all" title="Plus">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Vérifier entreprises", icon: Building2, color: "emerald", count: "23 en attente" },
            { label: "Modérer contenus", icon: Shield, color: "blue", count: "14 à revoir" },
            { label: "Valider formations", icon: GraduationCap, color: "orange", count: "8 nouvelles" },
            { label: "Générer rapport", icon: BarChart3, color: "purple", count: "Mensuel dispo" },
          ].map(({ label, icon: Icon, color, count }) => {
            const bg: Record<string, string> = {
              emerald: "from-emerald-900/30 to-emerald-950/50 border-emerald-500/20 hover:border-emerald-500/40",
              blue: "from-blue-900/30 to-blue-950/50 border-blue-500/20 hover:border-blue-500/40",
              orange: "from-orange-900/30 to-orange-950/50 border-orange-500/20 hover:border-orange-500/40",
              purple: "from-purple-900/30 to-purple-950/50 border-purple-500/20 hover:border-purple-500/40",
            };
            const ic: Record<string, string> = {
              emerald: "bg-emerald-500/10 text-emerald-400",
              blue: "bg-blue-500/10 text-blue-400",
              orange: "bg-orange-500/10 text-orange-400",
              purple: "bg-purple-500/10 text-purple-400",
            };
            return (
              <button key={label} className={`p-5 rounded-2xl bg-gradient-to-br border transition-all text-left ${bg[color]}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ic[color]}`}>
                  <Icon size={18} />
                </div>
                <div className="font-semibold text-white text-sm mb-1">{label}</div>
                <div className="text-xs text-gray-500">{count}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
