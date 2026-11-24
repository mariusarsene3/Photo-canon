import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { METIERS } from "@/lib/metiers";
import { GUIDES } from "@/lib/guides";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/contact",
    "/guides",
    "/exemple",
    ...METIERS.map((m) => `/test/${m.slug}`),
    ...GUIDES.map((g) => `/guides/${g.slug}`),
    "/mentions-legales",
    "/confidentialite",
  ];
  return paths.map((p) => ({ url: `${siteUrl()}${p}` }));
}
