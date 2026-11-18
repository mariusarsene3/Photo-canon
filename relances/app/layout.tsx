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
  title: `${BRAND.name} — vos factures impayées relancées automatiquement`,
  description:
    "Relance automatique des factures impayées pour artisans, indépendants et TPE : rappel à J+1, relance à J+7, dernier avis à J+15.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
