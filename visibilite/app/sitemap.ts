import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { METIERS } from "@/lib/metiers";
import { GUIDES } from "@/lib/guides";

// Date de dernière modification importante des pages (à changer quand on les met à jour).
const UPDATED = new Date("2026-11-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const u = siteUrl();
  return [
    { url: `${u}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    ...METIERS.map((m) => ({ url: `${u}/test/${m.slug}`, lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${u}/guides`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.7 },
    ...GUIDES.map((g) => ({ url: `${u}/guides/${g.slug}`, lastModified: new Date(g.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${u}/contact`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.5 },
  ];
}
