import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kora AI — L'Intelligence Artificielle au service de l'Afrique",
    template: "%s | Kora AI",
  },
  description:
    "Kora AI est la première plateforme SaaS d'intelligence artificielle conçue pour les entreprises africaines. Automatisation, génération de contenu, analyse de données, chatbots et plus encore.",
  keywords: ["IA Afrique", "SaaS africain", "intelligence artificielle", "Kora AI", "automatisation", "chatbot africain"],
  authors: [{ name: "Kora AI" }],
  creator: "Kora AI",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Kora AI",
    title: "Kora AI — L'Intelligence Artificielle au service de l'Afrique",
    description: "Plateforme SaaS IA pour les entreprises et professionnels africains.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070B14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#070B14] text-gray-100 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
