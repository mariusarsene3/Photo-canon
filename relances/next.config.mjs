/** @type {import('next').NextConfig} */
const nextConfig = {
  // Import de factures : fichiers Excel/CSV et PDF jusqu'à ~10 Mo chacun.
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  // Bibliothèque de lecture Excel : à charger telle quelle côté serveur.
  serverExternalPackages: ["exceljs"],
};
export default nextConfig;
