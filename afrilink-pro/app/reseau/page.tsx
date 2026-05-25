"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, UserPlus, Search, MapPin, Briefcase, Globe,
  CheckCircle, MessageSquare, ArrowUpRight, TrendingUp, Loader2
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";

type SuggestedProfile = {
  id: string;
  first_name: string;
  last_name: string;
  headline: string | null;
  avatar_url: string | null;
  location: string | null;
  country: string | null;
  is_verified: boolean;
};

type ConnProfile = {
  id: string;
  first_name: string;
  last_name: string;
  headline: string | null;
  avatar_url: string | null;
  is_verified: boolean;
};

type ConnectionFull = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  requester: ConnProfile | null;
  receiver: ConnProfile | null;
};

const COLORS = ["emerald", "blue", "orange", "purple"] as const;
type Color = typeof COLORS[number];

const avatarBg: Record<Color, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400",
  purple: "bg-purple-500/20 text-purple-400",
};

function profileColor(id: string): Color {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export default function ReseauPage() {
  const { profile: ownProfile } = useAuthContext();

  const [tab, setTab] = useState("suggestions");
  const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([]);
  const [connections, setConnections] = useState<ConnectionFull[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const loadSuggestions = useCallback(async (q?: string) => {
    setLoadingSuggestions(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (q) params.set("q", q);
      const res = await fetch(`/api/profiles?${params}`);
      const data = await res.json();
      setSuggestions(data.profiles ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const loadConnections = useCallback(async () => {
    setLoadingConnections(true);
    try {
      const res = await fetch("/api/connections");
      const data = await res.json();
      setConnections(Array.isArray(data) ? data : []);
    } catch {
      setConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
    loadConnections();
  }, [loadSuggestions, loadConnections]);

  const handleConnect = async (profileId: string) => {
    try {
      await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: profileId }),
      });
      setPendingIds((prev) => new Set([...prev, profileId]));
    } catch {
      // silent
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSuggestions(query);
  };

  const myConnectedProfiles = connections.map((conn) => {
    const isRequester = conn.requester_id === ownProfile?.id;
    return isRequester ? conn.receiver : conn.requester;
  }).filter(Boolean) as ConnProfile[];

  const displayedSuggestions = suggestions;
  const displayedConnections = myConnectedProfiles;

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
          <p className="text-gray-400 mb-6">Connectez-vous avec des professionnels à travers l'Afrique.</p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, poste, compétence, entreprise..."
                className="input-premium pl-11 py-3"
              />
            </div>
            <button type="submit" className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all">
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Vos connexions", value: displayedConnections.length, icon: Users, color: "emerald" },
            { label: "Suggestions", value: displayedSuggestions.length, icon: TrendingUp, color: "blue" },
            { label: "Pays couverts", value: "54", icon: Globe, color: "purple" },
            { label: "Voir profil", value: ownProfile?.profile_views ?? 0, icon: ArrowUpRight, color: "orange" },
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
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "suggestions", label: "Suggestions" },
            { id: "mes-connexions", label: `Mes connexions (${displayedConnections.length})` },
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

        {/* Content */}
        {tab === "suggestions" && (
          <>
            {loadingSuggestions ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin" />
              </div>
            ) : displayedSuggestions.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-400">Aucune suggestion disponible</p>
                <p className="text-sm mt-1">Vous êtes déjà connecté avec tout le monde !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedSuggestions.map((person) => {
                  const color = profileColor(person.id);
                  const isPending = pendingIds.has(person.id);
                  return (
                    <div key={person.id} className="card-premium p-5 text-center group">
                      <div className="relative inline-block mb-3">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto ${avatarBg[color]}`}>
                          {initials(person.first_name, person.last_name)}
                        </div>
                        {person.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-white text-sm mb-0.5 group-hover:text-blue-400 transition-colors">
                        {person.first_name} {person.last_name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1 line-clamp-2">{person.headline ?? "Professionnel AfriLink"}</p>
                      {person.location && (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-3">
                          <MapPin size={10} />
                          {person.location}
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => !isPending && handleConnect(person.id)}
                          disabled={isPending}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isPending
                              ? "bg-gray-500/10 text-gray-500 border border-gray-500/20 cursor-default"
                              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md"
                          }`}
                        >
                          {isPending ? (
                            "Demande envoyée"
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
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => loadSuggestions(query)}
                className="px-8 py-3 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-blue-500/30 hover:text-blue-400 transition-all"
              >
                Actualiser les suggestions
              </button>
            </div>
          </>
        )}

        {tab === "mes-connexions" && (
          <>
            {loadingConnections ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin" />
              </div>
            ) : displayedConnections.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-400">Aucune connexion pour le moment</p>
                <p className="text-sm mt-1">Explorez les suggestions pour développer votre réseau</p>
                <button
                  onClick={() => setTab("suggestions")}
                  className="mt-4 px-6 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-semibold hover:bg-blue-500/20 transition-all"
                >
                  Voir les suggestions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedConnections.map((person) => {
                  const color = profileColor(person.id);
                  return (
                    <div key={person.id} className="card-premium p-5 text-center group">
                      <div className="relative inline-block mb-3">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto ${avatarBg[color]}`}>
                          {initials(person.first_name, person.last_name)}
                        </div>
                        {person.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-white text-sm mb-0.5 group-hover:text-blue-400 transition-colors">
                        {person.first_name} {person.last_name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{person.headline ?? "Professionnel AfriLink"}</p>

                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Connecté
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center border border-[#1f2d45] text-gray-500 rounded-xl hover:text-blue-400 hover:border-blue-500/30 transition-all">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
