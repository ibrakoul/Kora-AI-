import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechJobs SV — Find your next role in French Tech",
  description:
    "Le job board premium pour les ingénieurs et designers de la French Tech. Salaires transparents, analyse IA du marché, offres vérifiées.",
  keywords: ["emploi tech", "French Tech", "ingénieur", "développeur", "IA", "salaire", "CDI", "remote"],
  authors: [{ name: "TechJobs SV" }],
};

export const viewport: Viewport = {
  themeColor: "#050A14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
