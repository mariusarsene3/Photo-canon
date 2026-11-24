import Link from "next/link";
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import type { CheckResult } from "@/lib/check";
import { Report } from "../report";
import { Header, Footer } from "../site-chrome";

export const metadata: Metadata = { title: `Exemple de résultat — ${BRAND.name}` };

// Exemple FICTIF : noms de commerces inventés, pour montrer à quoi ressemble un rapport.
const EXEMPLE: CheckResult = {
  business: "Les Fleurs de Marie",
  trade: "un fleuriste",
  city: "Nancy",
  question: "Je cherche un fleuriste à Nancy. Lesquels me conseilles-tu ?",
  results: [
    {
      label: "ChatGPT",
      ok: true,
      cited: false,
      position: null,
      recommended: ["Atelier Pivoine", "La Petite Serre", "Fleurs & Compagnie", "Le Jardin d'Émile"],
      answer:
        "Voici quelques fleuristes bien notés à Nancy :\n\n1. Atelier Pivoine : très apprécié pour ses bouquets de mariage, plus de 200 avis à 4,8/5.\n2. La Petite Serre : compositions originales, livraison dans tout Nancy.\n3. Fleurs & Compagnie : bon rapport qualité-prix, ouvert le dimanche matin.\n4. Le Jardin d'Émile : spécialiste des plantes d'intérieur.\n\nJe vous conseille de regarder les avis récents sur Google avant de choisir.",
      sourceDomains: ["google.com", "pagesjaunes.fr", "tripadvisor.fr", "lest-eclair-exemple.fr"],
    },
  ],
};

export default function Exemple() {
  return (
    <>
    <Header />
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 760 }}>
      <p className="notice">
        <strong>Exemple fictif</strong> : les noms de commerces sont inventés. <Link href="/">Faire le test pour votre commerce →</Link>
      </p>
      <Report result={EXEMPLE} />
    </main>
    <Footer />
    </>
  );
}
