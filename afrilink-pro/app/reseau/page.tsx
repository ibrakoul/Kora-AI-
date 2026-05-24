"use client";

import { useState } from "react";
import {
  Users, UserPlus, Search, MapPin, Briefcase, Globe, Filter,
  CheckCircle, Star, MessageSquare, ArrowUpRight, TrendingUp
} from "lucide-react";

const people = [
  { id: 1, name: "Cheikh Oumar Ba", role: "CTO & Co-fondateur", company: "FinTech Sénégal", location: "Dakar, Sénégal", avatar: "CO", color: "emerald", mutual: 28, skills: ["React", "Python", "AWS"], connected: false, verified: true },
  { id: 2, name: "Ama Owusu", role: "Product Director", company: "Jumia Group", location: "Accra, Ghana", avatar: "AO", color: "blue", mutual: 15, skills: ["Product", "UX", "B2C"], connected: false, verified: true },
  { id: 3, name: "Seydou Keïta", role: "Investisseur Angel & Mentor", company: "SeedAfrica", location: "Abidjan, CI", avatar: "SK", color: "orange", mutual: 42, skills: ["VC", "M&A", "Strategy"], connected: true, verified: true },
  { id: 4, name: "Nkechi Okonkwo", role: "Data Engineer", company: "MTN Nigeria", location: "Lagos, Nigeria", avatar: "NK", color: "purple", mutual: 9, skills: ["Spark", "SQL", "Kafka"], connected: false, verified: false },
  { id: 5, name: "Bintou Kouyaté", role: "Marketing Manager", company: "Orange Guinée", location: "Conakry, Guinée", avatar: "BK", color: "emerald", mutual: 7, skills: ["Marketing", "SEO", "Social"], connected: false, verified: false },
  { id: 6, name: "Emmanuel Asante", role: "DevOps Lead", company: "Google Africa", location: "Nairobi, Kenya", avatar: "EA", color: "blue", mutual: 34, skills: ["Kubernetes", "Terraform", "CI/CD"], connected: false, verified: true },
  { id: 7, name: "Rokia Traoré", role: "UX Research Lead", company: "Wave Mobile", location: "Dakar, Sénégal", avatar: "RT", color: "orange", mutual: 21, skills: ["Figma", "Research", "Design"], connected: true, verified: true },
  { id: 8, name: "Yaw Darko", role: "AI Engineer", company: "Andela", location: "Accra, Ghana", avatar: "YD", color: "purple", mutual: 18, skills: ["AI", "LLMs", "Python"], connected: false, verified: true },
];

const avatarBg: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400",
  purple: "bg-purple-500/20 text-purple-400",
};

export default function ReseauPage() {
  const [connections, setConnections] = useState<Set<number>>(new Set([3, 7]));
  const [tab, setTab] = useState("suggestions");

  const toggle = (id: number) => {
    setConnections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Header */}
      <div className="relative py-10 px-4 border-b border-[#1f2d45] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-purple-950/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Développez votre{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              réseau africain
            </span>
          </h1>
          <p className="text-gray-400 mb-6">Connectez-vous avec 2.4M+ professionnels à travers 54 pays africains.</p>

          {/* Search */}
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Nom, poste, compétence, entreprise..." className="input-premium pl-11 py-3" />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Pays" className="input-premium pl-10 py-3 w-32" />
            </div>
            <button className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Vos connexions", value: connections.size, icon: Users, color: "emerald" },
            { label: "Suggestions", value: "1,247", icon: TrendingUp, color: "blue" },
            { label: "Profils vus", value: "342", icon: ArrowUpRight, color: "orange" },
            { label: "Pays couverts", value: "54", icon: Globe, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => {
            const bg: Record<string, string> = {
              emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
              purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            };
            return (
              <div key={label} className="card-premium p-4 flex items-center gap-3">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "suggestions", label: "Suggestions" },
            { id: "mes-connexions", label: "Mes connexions" },
            { id: "suivis", label: "Je suis" },
            { id: "invitations", label: "Invitations (3)" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 border border-[#1f2d45] hover:text-gray-300 hover:border-[#2d4060]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select className="input-premium py-2 text-xs w-auto">
            <option>Tous les secteurs</option>
            <option>Tech</option>
            <option>Finance</option>
            <option>Santé</option>
          </select>
          <select className="input-premium py-2 text-xs w-auto">
            <option>Tous les pays</option>
            <option>Sénégal</option>
            <option>Nigeria</option>
            <option>Ghana</option>
          </select>
          <select className="input-premium py-2 text-xs w-auto">
            <option>Toutes expériences</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>Dirigeant</option>
          </select>
        </div>

        {/* People grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {people.map((person) => {
            const isConnected = connections.has(person.id);
            return (
              <div key={person.id} className="card-premium p-5 text-center group">
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto ${avatarBg[person.color]}`}>
                    {person.avatar}
                  </div>
                  {person.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                      <CheckCircle size={10} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-semibold text-white text-sm mb-0.5 group-hover:text-blue-400 transition-colors">
                  {person.name}
                </h3>
                <p className="text-xs text-gray-400 mb-0.5">{person.role}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <Briefcase size={10} />
                  {person.company}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-3">
                  <MapPin size={10} />
                  {person.location}
                </div>

                {/* Mutual */}
                <div className="text-xs text-gray-500 mb-3">
                  <span className="text-blue-400 font-semibold">{person.mutual}</span> connexions en commun
                </div>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {person.skills.slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-0.5 text-[10px] bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggle(person.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isConnected
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md"
                    }`}
                  >
                    {isConnected ? (
                      <>✓ Connecté</>
                    ) : (
                      <><UserPlus size={12} /> Connecter</>
                    )}
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center border border-[#1f2d45] text-gray-500 rounded-xl hover:text-blue-400 hover:border-blue-500/30 transition-all">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-blue-500/30 hover:text-blue-400 transition-all">
            Voir plus de professionnels
          </button>
        </div>
      </div>
    </div>
  );
}
