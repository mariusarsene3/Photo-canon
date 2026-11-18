import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/payment";

// Plan du site pour les moteurs de recherche (pages publiques uniquement).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/outils", priority: 0.8 },
    { path: "/outils/lettre-relance", priority: 0.9 },
    { path: "/outils/mise-en-demeure", priority: 0.9 },
    { path: "/outils/calcul-penalites", priority: 0.9 },
    { path: "/cgv", priority: 0.2 },
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/confidentialite", priority: 0.2 },
  ];
  return pages.map((p) => ({ url: base + p.path, changeFrequency: "monthly", priority: p.priority }));
}
