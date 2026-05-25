"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye, Users, Briefcase, Bell, Heart, MessageCircle,
  Share2, Bookmark, MoreHorizontal, MapPin, ArrowUpRight,
  Zap, Star, ChevronRight, Plus, Loader2, Send, X
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { fetchPosts, createPost, likePost } from "@/lib/api/posts";
import type { PostRow, ProfileRow, JobRow } from "@/types/database";

type PostWithAuthor = PostRow & { author: ProfileRow; is_liked: boolean };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

function FeedPost({
  post,
  currentUserId,
  onLike,
}: {
  post: PostWithAuthor;
  currentUserId: string | undefined;
  onLike: (id: string) => void;
}) {
  const author = post.author;
  const name = author ? `${author.first_name} ${author.last_name}` : "Utilisateur";
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div className="card-premium p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {author?.avatar_url
              ? <img src={author.avatar_url} alt={name} className="w-full h-full object-cover rounded-full" />
              : initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{name}</span>
              {author?.is_verified && (
                <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{author?.headline ?? ""}</div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
              <MapPin size={10} />
              {author?.location ?? author?.country ?? ""} · {timeAgo(post.created_at)}
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-400 p-1 rounded-lg hover:bg-white/5 transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center justify-between text-xs text-gray-600 py-2 border-t border-b border-[#1f2d45] mb-3">
        <span>{post.likes_count} j'aime</span>
        <span>{post.comments_count} commentaires · {post.shares_count} partages</span>
      </div>

      <div className="flex items-center gap-1">
        {[
          { icon: Heart, label: "J'aime", active: post.is_liked, action: () => onLike(post.id) },
          { icon: MessageCircle, label: "Commenter", active: false, action: () => {} },
          { icon: Share2, label: "Partager", active: false, action: () => {} },
          { icon: Bookmark, label: "Sauvegarder", active: false, action: () => {} },
        ].map(({ icon: Icon, label, active, action }) => (
          <button
            key={label}
            onClick={action}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              active ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            <Icon size={15} fill={active ? "currentColor" : "none"} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onPost }: { onClose: () => void; onPost: (content: string) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onPost(content);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Créer une publication</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Partagez une actualité professionnelle, une offre d'emploi, une réflexion..."
            rows={5}
            className="input-premium w-full resize-none text-sm"
            autoFocus
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-600">{content.length} caractères</span>
            <button
              type="submit"
              disabled={!content.trim() || loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuthContext();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [page, setPage] = useState(1);

  const userName = profile ? `${profile.first_name} ${profile.last_name}` : "vous";
  const userInitials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  useEffect(() => {
    const loadPosts = async () => {
      setLoadingPosts(true);
      try {
        const data = await fetchPosts({ page });
        setPosts(prev => page === 1 ? data.posts : [...prev, ...data.posts]);
      } catch {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, [page]);

  useEffect(() => {
    fetch("/api/jobs?limit=3&page=1")
      .then(r => r.json())
      .then(d => setJobs(d.jobs ?? []))
      .catch(() => {});
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const { liked } = await likePost(postId);
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: liked, likes_count: liked ? p.likes_count + 1 : p.likes_count - 1 }
          : p
      ));
    } catch {}
  };

  const handleCreatePost = async (content: string) => {
    try {
      const newPost = await createPost({ content });
      setPosts(prev => [{ ...newPost, author: profile as ProfileRow, is_liked: false }, ...prev]);
    } catch {}
  };

  const statsCards = [
    { label: "Vues du profil", value: (profile?.profile_views ?? 0).toLocaleString(), change: "+18%", icon: Eye, color: "emerald" },
    { label: "Score profil", value: `${profile?.profile_completion ?? 0}%`, change: "+5pts", icon: Star, color: "purple" },
  ];

  return (
    <>
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPost={handleCreatePost}
        />
      )}

      <div className="min-h-screen bg-[#0A0F1C]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Welcome banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 p-6 border border-[#1f2d45]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-blue-900/30" />
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">
                  Bonjour, {profile?.first_name ?? "vous"} 👋
                </h1>
                <p className="text-gray-400 text-sm">
                  {profile?.profile_completion && profile.profile_completion < 100
                    ? `Votre profil est complété à ${profile.profile_completion}%. Continuez à l'enrichir.`
                    : "Bienvenue sur votre tableau de bord AfriLink Pro."}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/jobs" className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-all">
                  <Zap size={14} />
                  Explorer les offres
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map(({ label, value, change, icon: Icon, color }) => {
              const colors: Record<string, string> = {
                emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
              };
              return (
                <div key={label} className="card-premium p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                      {change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{label}</div>
                </div>
              );
            })}

            <div className="card-premium p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl border bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+0</span>
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-500 mt-0.5">Connexions</div>
            </div>

            <div className="card-premium p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl border bg-orange-500/10 text-orange-400 border-orange-500/20 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">—</span>
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-500 mt-0.5">Candidatures</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Create post */}
              <div className="card-premium p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {userInitials}
                  </div>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="flex-1 text-left px-4 py-3 rounded-xl bg-[#1a2236] border border-[#1f2d45] text-gray-500 text-sm hover:border-emerald-500/30 hover:text-gray-400 transition-all"
                  >
                    Partagez une actualité professionnelle...
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1f2d45]">
                  {[
                    { label: "Photo", icon: "📷" },
                    { label: "Vidéo", icon: "🎬" },
                    { label: "Article", icon: "📝" },
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      onClick={() => setShowCreatePost(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all"
                    >
                      <span>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              {loadingPosts && posts.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={32} className="text-emerald-400 animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="card-premium p-8 text-center text-gray-600">
                  <p className="font-medium text-gray-400">Aucune publication</p>
                  <p className="text-sm mt-1">Soyez le premier à partager quelque chose !</p>
                </div>
              ) : (
                posts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    currentUserId={undefined}
                    onLike={handleLike}
                  />
                ))
              )}

              {posts.length > 0 && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loadingPosts}
                  className="w-full py-3 text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition-colors disabled:opacity-50"
                >
                  {loadingPosts ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                  Voir plus de publications →
                </button>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Profile card */}
              <div className="card-premium p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {userInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{userName}</div>
                    <div className="text-xs text-gray-500">{profile?.headline ?? profile?.account_type ?? "AfriLink Pro"}</div>
                  </div>
                </div>
                {profile && (
                  <>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Profil complété</span>
                        <span className="text-emerald-400 font-semibold">{profile.profile_completion}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${profile.profile_completion}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {!profile.avatar_url && (
                        <button className="flex items-center gap-2 w-full text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Plus size={12} />
                          Ajouter une photo de profil
                        </button>
                      )}
                      {!profile.headline && (
                        <button className="flex items-center gap-2 w-full text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Plus size={12} />
                          Ajouter un titre professionnel
                        </button>
                      )}
                      {!profile.bio && (
                        <button className="flex items-center gap-2 w-full text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Plus size={12} />
                          Rédiger votre biographie
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Latest jobs */}
              {jobs.length > 0 && (
                <div className="card-premium p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white text-sm">Offres pour vous</h3>
                    <Link href="/jobs" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                      Voir tout <ChevronRight size={12} />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#1a2236] transition-all cursor-pointer group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          💼
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {job.title}
                          </div>
                          <div className="text-xs text-gray-500">{job.company_name} · {job.location}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {job.salary_min && (
                              <span className="text-xs font-semibold text-emerald-400">
                                {(job.salary_min / 1000).toFixed(0)}K+ {job.currency}
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              {job.job_type}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications bell */}
              <Link
                href="/notifications"
                className="card-premium p-4 flex items-center gap-3 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    Notifications
                  </div>
                  <div className="text-xs text-gray-500">Restez informé de vos activités</div>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
