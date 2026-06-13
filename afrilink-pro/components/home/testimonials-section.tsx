import { Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Aminata Diallo",
    role: "Ingénieure logicielle",
    company: "TechAfrica, Dakar",
    avatar: "AD",
    color: "emerald",
    text: "AfriLink Pro a complètement transformé ma carrière. En moins de 2 semaines, j'ai décroché un poste de rêve à Abidjan grâce au matching IA.",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Directeur RH",
    company: "GoldCoast Industries, Accra",
    avatar: "KM",
    color: "blue",
    text: "En tant que recruteur, AfriLink Pro nous offre accès aux meilleurs talents africains. Le système de vérification des profils est excellent.",
    rating: 5,
  },
  {
    name: "Fatoumata Bah",
    role: "Entrepreneur",
    company: "FemTech Guinea, Conakry",
    avatar: "FB",
    color: "orange",
    text: "Grâce à la visibilité offerte par AfriLink Pro, mon startup a attiré 3 investisseurs en 6 mois. La plateforme est indispensable.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
            <Star size={12} fill="currentColor" />
            Témoignages
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ce qu'ils disent{" "}
            <span
              className="gradient-text-orange"
              style={{
                background: "linear-gradient(135deg, #F97316, #FBBF24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              de nous
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, company, avatar, color, text, rating }) => {
            const bgColor =
              color === "emerald"
                ? "bg-emerald-500/20 text-emerald-400"
                : color === "blue"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-orange-500/20 text-orange-400";
            return (
              <div key={name} className="card-premium p-6 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#1f2d45]">
                  <div
                    className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-sm font-bold`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-gray-500">
                      {role} · {company}
                    </div>
                  </div>
                  <CheckCircle size={16} className="ml-auto text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}