export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Créez votre profil",
      desc: "Construisez un profil professionnel qui reflète vos compétences, expériences et ambitions en moins de 5 minutes.",
      icon: "👤",
    },
    {
      step: "02",
      title: "Connectez votre réseau",
      desc: "Notre IA vous suggère les connexions les plus pertinentes dans votre domaine à travers toute l'Afrique.",
      icon: "🌍",
    },
    {
      step: "03",
      title: "Saisissez vos opportunités",
      desc: "Candidatez, collaborez, apprenez ou recrutez. Toutes les opportunités africaines à portée de clic.",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            Comment ça marche
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Démarrez en{" "}
            <span
              className="gradient-text-royal"
              style={{
                background: "linear-gradient(135deg, #60a5fa, #2563EB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              3 étapes simples
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-500/30 to-blue-500/30" />

          {steps.map(({ step, title, desc, icon }) => (
            <div key={step} className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass border border-[#1f2d45] text-4xl mb-6 relative">
                {icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.slice(1)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}