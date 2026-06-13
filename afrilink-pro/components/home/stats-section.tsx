import { Users, Building2, Briefcase, Globe } from "lucide-react";

const stats = [
  { value: "2.4M+", label: "Professionnels", icon: Users },
  { value: "85K+", label: "Entreprises", icon: Building2 },
  { value: "320K+", label: "Offres d'emploi", icon: Briefcase },
  { value: "54", label: "Pays africains", icon: Globe },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card-premium glow p-8 text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Icon size={22} className="text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}