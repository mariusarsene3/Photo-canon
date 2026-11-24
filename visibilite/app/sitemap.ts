import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/exemple", "/mentions-legales", "/confidentialite"].map((p) => ({ url: `${siteUrl()}${p}` }));
}
