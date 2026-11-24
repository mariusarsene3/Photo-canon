import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  openGraph: { siteName: BRAND.name, locale: "fr_FR", type: "website" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } : undefined,
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Test gratuit : est-ce que ChatGPT recommande votre commerce, ou vos concurrents ? Audit offert, puis on s'occupe de votre visibilité sur Google et dans l'IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
