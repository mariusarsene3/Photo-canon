/** Adresse publique du site (variable NEXT_PUBLIC_SITE_URL sur Vercel). */
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
