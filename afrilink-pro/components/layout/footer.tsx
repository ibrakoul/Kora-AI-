import Link from "next/link";
import { Globe } from "lucide-react";

const cols = [
  {
    title: "Plateforme",
    links: ["Emplois", "Stages", "Formations", "Appels d'offres", "Freelance"],
  },
  {
    title: "Entreprises",
    links: ["Recrutement", "Marque employeur", "Publicités", "Solutions RH"],
  },
  {
    title: "Ressources",
    links: ["Blog", "Guides carrière", "Podcasts business", "Événements"],
  },
  {
    title: "Légal",
    links: ["Confidentialité", "Conditions d'utilisation", "Cookies", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1f2d45] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-white">AfriLink Pro</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Le réseau professionnel de référence pour les talents africains.
            </p>
            <div className="flex gap-3 mt-4">
              {["𝕏", "in", "f", "▶"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 glass border border-[#1f2d45] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-semibold"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1f2d45] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 AfriLink Pro. Tous droits réservés. Fait avec ❤️ pour l'Afrique.
          </p>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-gray-600 text-sm">Disponible dans 54 pays africains</span>
          </div>
        </div>
      </div>
    </footer>
  );
}