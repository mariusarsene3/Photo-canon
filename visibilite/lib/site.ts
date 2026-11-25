/**
 * Adresse publique du site. Ordre : NEXT_PUBLIC_SITE_URL (à régler sur Vercel),
 * sinon l'adresse de production fournie par Vercel, sinon le poste local.
 */
export const siteUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (explicit || (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/$/, "");
};
