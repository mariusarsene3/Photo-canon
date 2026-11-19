import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/payment";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `${BRAND.name} — relance automatique des factures impayées`,
  description:
    "Relance automatique des factures impayées pour artisans, indépendants et TPE : rappel à J+1, relance à J+7, dernier avis à J+15.",
  openGraph: { siteName: BRAND.name, locale: "fr_FR", type: "website" },
  // Google Search Console : coller le code de vérification dans la variable NEXT_PUBLIC_GOOGLE_VERIFICATION sur Vercel.
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
