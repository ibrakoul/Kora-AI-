"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-6">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-bold text-xl text-white">AfriLink <span className="text-gray-400">Pro</span></span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Email envoyé !</h1>
            <p className="text-gray-400 mb-6">
              Consultez votre boîte mail ({email}) pour réinitialiser votre mot de passe.
            </p>
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié ?</h1>
              <p className="text-gray-400">Entrez votre email pour recevoir un lien de réinitialisation.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Adresse email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={16} />Envoyer le lien</>}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                ← Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
