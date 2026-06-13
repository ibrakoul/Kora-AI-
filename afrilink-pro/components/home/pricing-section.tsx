import Link from "next/link";
import { Award, CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    color: "gray",
    features: [
      "Profil professionnel complet",
      "50 connexions / mois",
      "Accès au feed & actualités",
      "5 candidatures / mois",
      "Messagerie de base",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.900",
    period: "FCFA / mois",
    color: "emerald",
    features: [
      "Tout ce qui est dans Gratuit",
      "Connexions illimitées",
      "Candidatures illimitées",
      "Badge vérifié premium",
      "Analyse de profil IA",
      "Priorité dans les recherches",
      "Messagerie avancée",
    ],
    cta: "Commencer Pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    color: "blue",
    features: [
      "Tout ce qui est dans Pro",
      "Dashboard recruteur complet",
      "Publications sponsorisées",
      "Analytics avancés",
      "Intégrations ATS",
      "Support dédié 24/7",
      "Marque employeur renforcée",
    ],
    cta: "Contacter l'équipe",
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Award size={12} />
            Tarifs
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple et{" "}
            <span className="gradient-text">transparent</span>
          </h2>
          <p className="text-gray-400 text-lg">Commencez gratuitement. Évoluez selon vos besoins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ name, price, period, features, cta, popular }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                popular
                  ? "bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                  : "card-premium"
              }`}
            >
              {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  {period && <span className="text-gray-400 text-sm">{period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                  popular
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-lg hover:shadow-emerald-500/30"
                    : "border border-[#1f2d45] text-gray-300 hover:border-emerald-500/40 hover:text-white hover:bg-emerald-500/5"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}