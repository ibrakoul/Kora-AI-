import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-blue-900/40 to-orange-900/30" />
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="text-6xl mb-6">🌍</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Rejoignez la révolution
              <br />
              professionnelle africaine
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Plus de 2.4 millions de professionnels africains font déjà confiance à AfriLink Pro.
              Votre prochaine opportunité vous attend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all"
              >
                Créer mon compte gratuit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white glass border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all"
              >
                Explorer les opportunités
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}