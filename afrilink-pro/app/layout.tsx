import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

/* ---------- Font ---------- */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/* ---------- Metadata ---------- */
export const metadata: Metadata = {
  title: {
    default: "AfriLink Pro – Le Réseau Professionnel Africain",
    template: "%s | AfriLink Pro",
  },
  description:
    "AfriLink Pro est le réseau professionnel de référence pour les talents africains. Connectez-vous avec des professionnels, trouvez des emplois, des stages, des formations et des appels d'offres à travers toute l'Afrique.",
  keywords: [
    "réseau professionnel africain",
    "emploi en Afrique",
    "LinkedIn Afrique",
    "networking Afrique",
    "recrutement Afrique",
    "AfriLink Pro",
  ],
  authors: [{ name: "AfriLink Pro" }],
  creator: "AfriLink Pro",
  publisher: "AfriLink Pro",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://afrilink.pro",
    siteName: "AfriLink Pro",
    title: "AfriLink Pro – Le Réseau Professionnel Africain",
    description:
      "Connectez-vous avec des professionnels africains, trouvez des opportunités de carrière et développez votre réseau professionnel à travers l'Afrique.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfriLink Pro – Le Réseau Professionnel Africain",
    description:
      "Le réseau professionnel de référence pour les talents africains.",
    creator: "@AfriLinkPro",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ---------- Root Layout ---------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      {/*
        suppressHydrationWarning on <body> prevents the flash of
        mismatch that browser extensions can cause on the body element.
      */}
      <body
        className="min-h-full flex flex-col bg-[#0A0F1C] text-gray-100 font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
