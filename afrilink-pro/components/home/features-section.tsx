"use client";

import {
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Briefcase,
    color: "emerald",
    title: "Emplois & Recrutement",
    desc: "Trouvez l'opportunité parfaite grâce à notre IA de matching avancée. Candidature en un clic, suivi en temps réel.",
    badge: "IA Powered",
  },
  {
    icon: GraduationCap,
    color: "blue",
    title: "Stages & Jeunes Talents",
    desc: "Un espace dédié aux étudiants et jeunes diplômés pour décrocher le stage idéal et lancer leur carrière.",
    badge: "Populaire",
  },
  {
    icon: BookOpen,
    color: "orange",
    title: "Formations & E-learning",
    desc: "Développez vos compétences avec des milliers de formations certifiantes adaptées au marché africain.",
    badge: "Nouveau",
  },
  {
    icon: FileText,
    color: "purple",
    title: "Appels d'offres",
    desc: "Accédez aux marchés publics et privés de tout le continent africain en un seul endroit.",
    badge: "Business",
  },
  {
    icon: Users,
    color: "emerald",
    title: "Networking Premium",
    desc: "Connectez-vous avec des décideurs, entrepreneurs et investisseurs à travers toute l'Afrique.",
    badge: "Pro",
  },
  {
    icon: TrendingUp,
    color: "blue",
    title: "Freelancing & Business",
    desc: "Proposez vos services, trouvez des missions et développez votre activité sur tout le continent.",
    badge: "Marketplace",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

const badgeMap: Record<string, string> = {
  "IA Powered": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Populaire": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Nouveau": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Business": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Pro": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Marketplace": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function FeaturesSection() {
  return (
    <section className="py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Zap size={12} />
            Fonctionnalités
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Tout ce dont vous avez{" "}
            <span className="gradient-text">besoin</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Une plateforme complète pensée pour les réalités africaines et la jeunesse ambitieuse du continent.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, desc, badge }) => (
            <div
              key={title}
              className="card-premium glow p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorMap[color]}`}>
                  <Icon size={22} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeMap[badge]}`}>
                  {badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                En savoir plus <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}