"use client";

import Link from "next/link";
import {
  TrendingUp, Eye, Users, Briefcase, Bell, Heart, MessageCircle,
  Share2, Bookmark, MoreHorizontal, MapPin, ArrowUpRight,
  Zap, Star, Award, ChevronRight, Plus, GraduationCap, BookOpen
} from "lucide-react";

/* ─── Mock Data ─────────────────────────────────── */
const feedPosts = [
  {
    id: 1,
    user: { name: "Fatou Ndiaye", role: "DG AfriTech Solutions", location: "Dakar, Sénégal", avatar: "FN", color: "emerald", verified: true },
    time: "il y a 2h",
    content: "Fiers d'annoncer que nous venons de clôturer notre série A à 5M€ ! 🎉 Merci à tous nos investisseurs qui croient en la vision africaine. AfriTech est maintenant présente dans 12 pays. Le meilleur est à venir. #AfricaTech #Startup #Fintech",
    likes: 342,
    comments: 87,
    shares: 56,
    saved: false,
    liked: false,
    image: null,
  },
  {
    id: 2,
    user: { name: "Kwame Mensah", role: "Engineering Manager @ Google", location: "Accra, Ghana", avatar: "KM", color: "blue", verified: true },
    time: "il y a 4h",
    content: "📢 Mon équipe recrute ! Nous recherchons 3 Senior Software Engineers pour rejoindre notre hub Accra. Stack: Go, Python, Kubernetes. Remote possible. Salaire compétitif + equity. DM ou candidatez directement. RT apprécié 🙏 #Jobs #Tech #Ghana",
    likes: 198,
    comments: 134,
    shares: 89,
    saved: true,
    liked: true,
    image: null,
  },
  {
    id: 3,
    user: { name: "Aïssatou Barry", role: "Data Scientist | IA Researcher", location: "Conakry, Guinée", avatar: "AB", color: "purple", verified: false },
    time: "il y a 6h",
    content: "J'ai passé 3 ans à construire un modèle NLP capable de comprendre 15 langues africaines. Aujourd'hui, notre papier est accepté à NeurIPS 2025 🔥 Preuve que l'IA africaine peut rivaliser avec le monde entier. Continuons à pousser. #AI #NLP #AfriqueTech",
    likes: 521,
    comments: 203,
    shares: 167,
    saved: false,
    liked: false,
    image: null,
  },
];

const suggestedConnections = [
  { name: "Moussa Traoré", role: "CTO @ FinPay Africa", avatar: "MT", color: "orange", mutual: 12 },
  { name: "Rokia Koné", role: "Product Manager @ Wave", avatar: "RK", color: "blue", mutual: 8 },
  { name: "Ibrahima Diop", role: "Investisseur Angel", avatar: "ID", color: "emerald", mutual: 21 },
];

const jobAlerts = [
  { title: "Lead Developer React", company: "TechCo Abidjan", location: "Côte d'Ivoire", salary: "800K FCFA", type: "CDI", time: "Nouveau", color: "emerald" },
  { title: "Data Analyst Senior", company: "MTN Group", location: "Accra, Ghana", salary: "$2,500", type: "Remote", time: "1j", color: "blue" },
  { title: "UX Designer", company: "Wave Mobile", location: "Dakar, Sénégal", salary: "600K FCFA", type: "CDI", time: "2j", color: "purple" },
];

const statsCards = [
  { label: "Vues du profil", value: "1,247", change: "+18%", icon: Eye, color: "emerald" },
  { label: "Connexions", value: "384", change: "+24", icon: Users, color: "blue" },
  { label: "Candidatures", value: "12", change: "5 vues", icon: Briefcase, color: "orange" },
  { label: "Score profil", value: "87%", change: "+5pts", icon: Star, color: "purple" },
];

/* ─── Components ─────────────────────────────── */
function StatCard({ label, value, change, icon: Icon, color }: typeof statsCards[0]) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <div className="card-premium p-5 group">
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
}

function FeedPost({ post }: { post: typeof feedPosts[0] }) {
  const avatarBg: Record<string, string> = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="card-premium p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarBg[post.user.color]}`}>
            {post.user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{post.user.name}</span>
              {post.user.verified && (
                <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{post.user.role}</div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
              <MapPin size={10} />
              {post.user.location} · {post.time}
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-400 p-1 rounded-lg hover:bg-white/5 transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-gray-600 py-2 border-t border-b border-[#1f2d45] mb-3">
        <span>{post.likes} j'aime</span>
        <span>{post.comments} commentaires · {post.shares} partages</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {[
          { icon: Heart, label: "J'aime", active: post.liked },
          { icon: MessageCircle, label: "Commenter", active: false },
          { icon: Share2, label: "Partager", active: false },
          { icon: Bookmark, label: "Sauvegarder", active: post.saved },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              active
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
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

/* ─── Page ─────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-20 glass border-b border-[#1f2d45] flex items-center px-4 lg:pl-72 gap-4">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Rechercher des personnes, emplois, formations..."
            className="input-premium py-2.5 pl-4 pr-10 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/notifications" className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">9+</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            AM
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 overflow-y-auto no-scrollbar bg-[#0d1626] border-r border-[#1f2d45] hidden lg:block">
        <nav className="p-3 space-y-0.5">
          {[
            { label: "Tableau de bord", href: "/dashboard", icon: TrendingUp, active: true },
            { label: "Mon profil", href: "/profile/me", icon: "👤" },
            { label: "Réseau", href: "/reseau", icon: Users },
            { label: "Emplois", href: "/jobs", icon: Briefcase },
            { label: "Stages", href: "/stages", icon: GraduationCap },
            { label: "Formations", href: "/formations", icon: BookOpen },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`sidebar-item ${item.active ? "active" : ""}`}
            >
              {typeof item.icon === "string" ? (
                <span>{item.icon}</span>
              ) : (
                <item.icon size={18} />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="pt-16 lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Welcome banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 p-6 border border-[#1f2d45]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-blue-900/30" />
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Bonjour, Amadou 👋</h1>
                <p className="text-gray-400 text-sm">Votre profil est vu 18% plus souvent cette semaine.</p>
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
            {statsCards.map((card) => <StatCard key={card.label} {...card} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Create post */}
              <div className="card-premium p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    AM
                  </div>
                  <button className="flex-1 text-left px-4 py-3 rounded-xl bg-[#1a2236] border border-[#1f2d45] text-gray-500 text-sm hover:border-emerald-500/30 hover:text-gray-400 transition-all">
                    Partagez une actualité professionnelle...
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1f2d45]">
                  {[
                    { label: "Photo", icon: "📷" },
                    { label: "Vidéo", icon: "🎬" },
                    { label: "Article", icon: "📝" },
                    { label: "Sondage", icon: "📊" },
                  ].map(({ label, icon }) => (
                    <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">
                      <span>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              {feedPosts.map((post) => <FeedPost key={post.id} post={post} />)}

              {/* Load more */}
              <button className="w-full py-3 text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Voir plus de publications →
              </button>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Profile completion */}
              <div className="card-premium p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">Amadou Mbaye</div>
                    <div className="text-xs text-gray-500">Dev Full Stack · Dakar</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Profil complété</span>
                    <span className="text-emerald-400 font-semibold">87%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: "87%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    "Ajouter une photo de profil",
                    "Compléter vos compétences",
                    "Ajouter une expérience",
                  ].map((item) => (
                    <button key={item} className="flex items-center gap-2 w-full text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      <Plus size={12} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job alerts */}
              <div className="card-premium p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm">Offres pour vous</h3>
                  <Link href="/jobs" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                    Voir tout <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {jobAlerts.map((job) => {
                    const badgeColor: Record<string, string> = {
                      emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                    };
                    return (
                      <div key={job.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#1a2236] transition-all cursor-pointer group">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 border ${badgeColor[job.color]}`}>
                          💼
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {job.title}
                          </div>
                          <div className="text-xs text-gray-500">{job.company} · {job.location}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-emerald-400">{job.salary}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${badgeColor[job.color]}`}>{job.type}</span>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div className="card-premium p-5">
                <h3 className="font-semibold text-white text-sm mb-4">Personnes à connecter</h3>
                <div className="space-y-3">
                  {suggestedConnections.map(({ name, role, avatar, color, mutual }) => {
                    const bg: Record<string, string> = {
                      orange: "bg-orange-500/20 text-orange-400",
                      blue: "bg-blue-500/20 text-blue-400",
                      emerald: "bg-emerald-500/20 text-emerald-400",
                    };
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg[color]}`}>
                          {avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{name}</div>
                          <div className="text-xs text-gray-500 truncate">{role}</div>
                          <div className="text-xs text-gray-600">{mutual} connexions en commun</div>
                        </div>
                        <button className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all">
                          +Suivre
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trending topics */}
              <div className="card-premium p-5">
                <h3 className="font-semibold text-white text-sm mb-4">Tendances africaines</h3>
                <div className="space-y-2">
                  {[
                    { tag: "#AfricaTech", count: "12.4K posts" },
                    { tag: "#FinTechAfrica", count: "8.2K posts" },
                    { tag: "#JobsAfrica", count: "6.7K posts" },
                    { tag: "#StartupAfrica", count: "5.1K posts" },
                    { tag: "#TalentsAfrique", count: "3.9K posts" },
                  ].map(({ tag, count }) => (
                    <div key={tag} className="flex items-center justify-between hover:bg-[#1a2236] p-2 rounded-lg cursor-pointer group transition-all">
                      <span className="text-sm text-emerald-400 group-hover:text-emerald-300 font-semibold">{tag}</span>
                      <span className="text-xs text-gray-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
