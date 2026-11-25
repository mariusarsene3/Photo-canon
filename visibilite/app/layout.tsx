import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";

const DESCRIPTION =
  "Test gratuit en 1 minute : est-ce que ChatGPT recommande votre commerce, ou vos concurrents ? Puis visibilité Google et IA, site vitrine et réseaux sociaux pour les commerçants.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `Est-ce que ChatGPT recommande votre commerce ? Test gratuit — ${BRAND.name}`, template: `%s — ${BRAND.name}` },
  description: DESCRIPTION,
  applicationName: BRAND.name,
  openGraph: { siteName: BRAND.name, locale: "fr_FR", type: "website", description: DESCRIPTION },
  twitter: { card: "summary_large_image" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        {/* Mesure d'audience anonyme, sans cookies (à activer dans Vercel > Analytics). */}
        <Analytics />
      </body>
    </html>
  );
}
