"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MapPin, Briefcase, GraduationCap, Star, MessageSquare,
  UserPlus, Share2, MoreHorizontal, CheckCircle,
  Globe, Award, Download, ExternalLink, Eye,
  ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import type { ProfileWithDetails, ExperienceRow, EducationRow, SkillRow, CertificationRow, LanguageRow } from "@/types/database";
import { useAuthContext } from "@/components/providers/AuthProvider";

const COLORS = ["emerald", "blue", "orange", "purple", "yellow"] as const;
type Color = typeof COLORS[number];

const colorMap: Record<Color, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const progressColor: Record<Color, string> = {
  blue: "from-blue-500 to-blue-400",
  emerald: "from-emerald-500 to-emerald-400",
  orange: "from-orange-500 to-orange-400",
  purple: "from-purple-500 to-purple-400",
  yellow: "from-yellow-500 to-yellow-400",
};

function strColor(s: string): Color {
  const sum = s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function nameInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function companyInitials(name: string): string {
  const words = name.split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatPeriod(start: string, end: string | null, isCurrent: boolean): string {
  const startStr = new Date(start).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  if (isCurrent) return `${startStr} – Présent`;
  const endStr = end ? new Date(end).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : "";
  return `${startStr} – ${endStr}`;
}

function formatEduPeriod(start: number, end: number | null, isCurrent: boolean): string {
  if (isCurrent) return `${start} – Présent`;
  return `${start} – ${end ?? ""}`;
}

const proficiencyLabel: Record<string, string> = {
  native: "Natif",
  professional: "Professionnel",
  intermediate: "Intermédiaire",
  basic: "Basique",
};

function certIcon(issuer: string): string {
  const lower = issuer.toLowerCase();
  if (lower.includes("amazon") || lower.includes("aws")) return "☁️";
  if (lower.includes("google")) return "🌐";
  if (lower.includes("meta") || lower.includes("facebook")) return "⚛️";
  if (lower.includes("microsoft")) return "🔷";
  return "🏆";
}

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { profile: ownProfile } = useAuthContext();
  const [profileData, setProfileData] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const fetchProfile = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/profile/${params.id}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setProfileData(data as ProfileWithDetails);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <Loader2 size={40} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !profileData) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center text-gray-600">
        <p className="text-2xl font-bold text-white mb-2">Profil introuvable</p>
        <p className="text-sm">Ce profil n'existe pas ou a été supprimé.</p>
      </div>
    );
  }

  const isOwnProfile = ownProfile?.id === profileData.id;
  const fullName = `${profileData.first_name} ${profileData.last_name}`;
  const avatarColor = strColor(profileData.id);
  const skills: SkillRow[] = (profileData as ProfileWithDetails).skills ?? [];
  const experiences: ExperienceRow[] = (profileData as ProfileWithDetails).experiences ?? [];
  const educations: EducationRow[] = (profileData as ProfileWithDetails).educations ?? [];
  const certifications: CertificationRow[] = (profileData as ProfileWithDetails).certifications ?? [];
  const languages: LanguageRow[] = (profileData as ProfileWithDetails).languages ?? [];

  const displayedSkills = showAllSkills ? skills : skills.slice(0, 5);
  const displayedExp = showAllExp ? experiences : experiences.slice(0, 2);

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
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-[#111827] shadow-2xl ${colorMap[avatarColor]}`}>
                  {nameInitials(fullName)}
                </div>
                {profileData.is_verified && (
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
                  <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                  {profileData.premium_tier !== "free" && (
                    <span className="badge-premium">PRO</span>
                  )}
                </div>
                <p className="text-gray-300 font-medium">{profileData.headline ?? "Professionnel AfriLink Pro"}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                  {profileData.location && (
                    <span className="flex items-center gap-1"><MapPin size={13} />{profileData.location}</span>
                  )}
                  {profileData.country && (
                    <span className="flex items-center gap-1"><Globe size={13} />{profileData.country}</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              {!isOwnProfile && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConnected(!connected)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      connected
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30"
                    }`}
                  >
                    <UserPlus size={16} />
                    {connected ? "Connecté" : "Connecter"}
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
              )}
              {isOwnProfile && (
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#1f2d45] text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                  Modifier le profil
                </button>
              )}
            </div>

            {/* Bio */}
            {profileData.bio && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{profileData.bio}</p>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1f2d45]">
                {languages.map((lang) => (
                  <span key={lang.id} className="px-3 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] rounded-full text-gray-400">
                    🗣 {lang.name} · <span className="text-gray-300">{proficiencyLabel[lang.proficiency] ?? lang.proficiency}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics (own profile) */}
        {isOwnProfile && (
          <div className="card-premium p-5">
            <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Eye size={16} className="text-emerald-400" />
              Statistiques du profil
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Vues profil", value: profileData.profile_views.toLocaleString(), period: "Total" },
                { label: "Impressions", value: profileData.profile_impressions.toLocaleString(), period: "Total" },
                { label: "Recherches", value: profileData.search_appearances.toLocaleString(), period: "Total" },
              ].map(({ label, value, period }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{value}</div>
                  <div className="text-xs font-medium text-gray-400">{label}</div>
                  <div className="text-xs text-gray-600">{period}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="card-premium p-5">
            <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
              <Award size={16} className="text-emerald-400" />
              Compétences
            </h2>
            <div className="space-y-4">
              {displayedSkills.map((skill) => {
                const color = strColor(skill.category ?? skill.name);
                return (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                          <Star size={12} />
                        </div>
                        <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                        {skill.endorsements_count > 0 && (
                          <span className="text-xs text-gray-600">+{skill.endorsements_count}</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">{skill.proficiency}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-bar-fill bg-gradient-to-r ${progressColor[color]}`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {skills.length > 5 && (
              <button
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                {showAllSkills
                  ? <><ChevronUp size={14} /> Voir moins</>
                  : <><ChevronDown size={14} /> Voir toutes les compétences ({skills.length})</>
                }
              </button>
            )}
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="card-premium p-5">
            <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-400" />
              Expériences professionnelles
            </h2>
            <div className="space-y-6">
              {displayedExp.map((exp) => {
                const color = strColor(exp.company);
                return (
                  <div key={exp.id} className="flex gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${colorMap[color]}`}>
                      {companyInitials(exp.company)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white mb-0.5">{exp.title}</div>
                      <div className="text-sm text-gray-400 mb-0.5">{exp.company}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
                        {exp.location && ` · ${exp.location}`}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">{exp.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((s) => (
                          <span key={s} className="px-2.5 py-1 text-xs bg-[#1a2236] border border-[#1f2d45] text-gray-400 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {experiences.length > 2 && (
              <button
                onClick={() => setShowAllExp(!showAllExp)}
                className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                {showAllExp
                  ? <><ChevronUp size={14} /> Voir moins</>
                  : <><ChevronDown size={14} /> Voir toutes les expériences</>
                }
              </button>
            )}
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="card-premium p-5">
            <h2 className="font-semibold text-white text-sm mb-5 flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-400" />
              Formation
            </h2>
            <div className="space-y-4">
              {educations.map((edu) => {
                const color = strColor(edu.school_name);
                return (
                  <div key={edu.id} className="flex gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${colorMap[color]}`}>
                      {companyInitials(edu.school_name)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{edu.school_name}</div>
                      <div className="text-sm text-gray-400">{edu.degree} · {edu.field_of_study}</div>
                      <div className="text-xs text-gray-600">{formatEduPeriod(edu.start_year, edu.end_year, edu.is_current)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="card-premium p-5">
            <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Award size={16} className="text-emerald-400" />
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#1a2236] border border-[#1f2d45] hover:border-emerald-500/20 transition-all">
                  <div className="text-2xl mb-2">{certIcon(cert.issuer)}</div>
                  <div className="text-sm font-semibold text-white leading-snug mb-1">{cert.name}</div>
                  <div className="text-xs text-gray-500">{cert.issuer}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(cert.issue_date).getFullYear()}
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5">
                        Voir <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
