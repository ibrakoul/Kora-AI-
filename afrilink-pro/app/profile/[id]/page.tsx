"use client";

import { useState } from "react";
import {
  MapPin, Briefcase, GraduationCap, Star, MessageSquare,
  UserPlus, Share2, MoreHorizontal, Edit, CheckCircle,
  Globe, Award, Download, ExternalLink, Heart, Eye,
  ChevronDown, ChevronUp, Code, Palette, Database,
  LineChart, Server, Smartphone
} from "lucide-react";

const profile = {
  name: "Aminata Diallo",
  role: "Senior Full Stack Developer & Tech Lead",
  company: "AfriTech Solutions",
  location: "Dakar, Sénégal",
  connections: "1,247",
  followers: "3,892",
  verified: true,
  premium: true,
  bio: "Passionnée par la tech africaine et l'innovation. Je construis des produits qui impactent des millions de personnes à travers l'Afrique. 8 ans d'expérience en développement full stack, spécialisée React, Node.js, et cloud AWS. Mentor, speaker et fondatrice de Women in Tech Sénégal.",
  tags: ["Open to Work", "Mentor disponible", "Speaker"],
  stats: [
    { label: "Vues profil", value: "8,420", period: "30 derniers jours" },
    { label: "Impressions", value: "24,100", period: "30 derniers jours" },
    { label: "Recherches", value: "342", period: "cette semaine" },
  ],
  skills: [
    { name: "React / Next.js", level: 95, icon: Code, color: "blue" },
    { name: "Node.js / Express", level: 90, icon: Server, color: "emerald" },
    { name: "TypeScript", level: 88, icon: Code, color: "blue" },
    { name: "AWS / Cloud", level: 82, icon: Database, color: "orange" },
    { name: "UI/UX Design", level: 75, icon: Palette, color: "purple" },
    { name: "React Native", level: 78, icon: Smartphone, color: "blue" },
    { name: "Data Analysis", level: 65, icon: LineChart, color: "emerald" },
    { name: "Leadership", level: 92, icon: Star, color: "yellow" },
  ],
  experiences: [
    {
      title: "Tech Lead & Senior Developer",
      company: "AfriTech Solutions",
      period: "Jan 2022 – Présent · 2 ans",
      location: "Dakar, Sénégal · Hybride",
      desc: "Leadership technique d'une équipe de 12 développeurs. Architecture et développement de la plateforme AfriPay, utilisée par 2M+ d'utilisateurs. Mise en place des standards de code et CI/CD.",
      skills: ["React", "Node.js", "AWS", "PostgreSQL"],
      logo: "AT",
      color: "emerald",
    },
    {
      title: "Full Stack Developer",
      company: "Wave Mobile",
      period: "Mars 2020 – Dec 2021 · 1 an 9 mois",
      location: "Dakar, Sénégal",
      desc: "Développement de fonctionnalités clés de l'application Wave. Optimisation des performances (réduction de 60% du temps de chargement). Collaboration avec les équipes produit et design.",
      skills: ["React Native", "Django", "PostgreSQL"],
      logo: "WM",
      color: "blue",
    },
    {
      title: "Junior Developer",
      company: "Gainde 2000",
      period: "Sep 2018 – Feb 2020 · 1 an 5 mois",
      location: "Dakar, Sénégal",
      desc: "Développement d'applications web pour la gestion portuaire. First job, première vraie expérience professionnelle dans le domaine de la tech.",
      skills: ["Java", "Spring Boot", "Angular"],
      logo: "G2",
      color: "purple",
    },
  ],
  education: [
    {
      school: "École Polytechnique de Dakar",
      degree: "Ingénierie Informatique",
      period: "2014 – 2018",
      logo: "EP",
      color: "emerald",
    },
    {
      school: "Coursera / Stanford Online",
      degree: "Machine Learning Specialization",
      period: "2021",
      logo: "CS",
      color: "blue",
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2023", icon: "☁️" },
    { name: "Google Cloud Professional", issuer: "Google Cloud", date: "2022", icon: "🌐" },
    { name: "Meta React Developer", issuer: "Meta", date: "2022", icon: "⚛️" },
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Wolof", level: "Natif" },
    { name: "Anglais", level: "Professionnel" },
    { name: "Arabe", level: "Intermédiaire" },
  ],
};

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const progressColor: Record<string, string> = {
  blue: "from-blue-500 to-blue-400",
  emerald: "from-emerald-500 to-emerald-400",
  orange: "from-orange-500 to-orange-400",
  purple: "from-purple-500 to-purple-400",
  yellow: "from-yellow-500 to-yellow-400",
};

export default function ProfilePage() {
  const [following, setFollowing] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);

  const displayedSkills = showAllSkills ? profile.skills : profile.skills.slice(0, 5);
  const displayedExp = showAllExp ? profile.experiences : profile.experiences.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Profile card */}
        <div className="card-premium overflow-hidden">
          {/* Banner */}
          <div className="relative h-40 bg-gradient-to-br from-emerald-900/60 via-blue-900/40 to-purple-900/30 overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-40" />
            <div className="absolute -bottom-6 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-[#111827] shadow-2xl">
                  AD
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" fill="white" />
                  </div>
                )}
              </div>
            </div>
            {/* Actions top right */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 glass rounded-xl text-white hover:bg-white/10 transition-all">
                <Share2 size={16} />
              </button>
              <button className="p-2 glass rounded-xl text-white hover:bg-white/10 transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pt-10 pb-6">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  {profile.premium && (
                    <span className="badge-premium">PRO</span>
                  )}
                </div>
                <p className="text-gray-300 font-medium">{profile.role}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Briefcase size={13} />{profile.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} />{profile.location}</span>
                  <span className="flex items-center gap-1"><Globe size={13} />
                    <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium">Site web</a>
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFollowing(!following)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    following
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30"
                  }`}
                >
                  <UserPlus size={16} />
                  {following ? "Connecté" : "Connecter"}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#1f2d45] text-gray-300 hover:border-blue-500/30 hover:text-blue-400 transition-all">
                  <MessageSquare size={16} />
                  Message
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#1f2d45] text-gray-500 hover:border-[#2d4060] hover:text-gray-300 transition-all">
                  <Download size={16} />
                  CV
                </button>
              </div>
            </div>

            {/* Availability tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.tags.map((tag) => (
                <span key={tag} className="badge-verified">{tag}</span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{profile.bio}</p>

            {/* Connection stats */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white font-semibold">{profile.connections} <span className="text-gray-500 font-normal">connexions</span></span>
              <span className="text-white font-semibold">{profile.followers} <span className="text-gray-500 font-normal">abonnés</span></span>
              <Link href="#" className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1">
                Voir tout le réseau <ExternalLink size={11} />
              </Link>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1f2d45]">
              {profile.languages.map(({ name, level }) => (
                <span key={name} className="px-3 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] rounded-full text-gray-400">
                  🗣 {name} · <span className="text-gray-300">{level}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics (self view) */}
        <div className="card-premium p-5">
          <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <Eye size={16} className="text-emerald-400" />
            Statistiques du profil
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {profile.stats.map(({ label, value, period }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-xs font-medium text-gray-400">{label}</div>
                <div className="text-xs text-gray-600">{period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card-premium p-5">
          <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <Award size={16} className="text-emerald-400" />
            Compétences
          </h2>
          <div className="space-y-4">
            {displayedSkills.map(({ name, level, icon: Icon, color }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                      <Icon size={12} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{name}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{level}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill bg-gradient-to-r ${progressColor[color]}`}
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            {showAllSkills ? <><ChevronUp size={14} /> Voir moins</> : <><ChevronDown size={14} /> Voir toutes les compétences ({profile.skills.length})</>}
          </button>
        </div>

        {/* Experience */}
        <div className="card-premium p-5">
          <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-400" />
            Expériences professionnelles
          </h2>
          <div className="space-y-6">
            {displayedExp.map((exp, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${colorMap[exp.color]}`}>
                  {exp.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white mb-0.5">{exp.title}</div>
                  <div className="text-sm text-gray-400 mb-0.5">{exp.company}</div>
                  <div className="text-xs text-gray-600 mb-2">{exp.period} · {exp.location}</div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-2">{exp.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {profile.experiences.length > 2 && (
            <button onClick={() => setShowAllExp(!showAllExp)} className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              {showAllExp ? <><ChevronUp size={14} /> Voir moins</> : <><ChevronDown size={14} /> Voir toutes les expériences</>}
            </button>
          )}
        </div>

        {/* Education */}
        <div className="card-premium p-5">
          <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-400" />
            Formation
          </h2>
          <div className="space-y-4">
            {profile.education.map((edu, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${colorMap[edu.color]}`}>
                  {edu.logo}
                </div>
                <div>
                  <div className="font-semibold text-white">{edu.school}</div>
                  <div className="text-sm text-gray-400">{edu.degree}</div>
                  <div className="text-xs text-gray-600">{edu.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="card-premium p-5">
          <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <Award size={16} className="text-emerald-400" />
            Certifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {profile.certifications.map(({ name, issuer, date, icon }) => (
              <div key={name} className="p-4 rounded-xl bg-[#1a2236] border border-[#1f2d45] hover:border-emerald-500/20 transition-all">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-semibold text-white leading-snug mb-1">{name}</div>
                <div className="text-xs text-gray-500">{issuer}</div>
                <div className="text-xs text-gray-600 mt-1">{date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}
