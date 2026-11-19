import "../landing.css";
import "../outils/tools.css";
import "./guides.css";
import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { ProductCta, SiteFooter, SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Guides : se faire payer ses factures",
  description:
    "Relancer un client, que faire face à une facture impayée, récupérer sa retenue de garantie, calculer les pénalités de retard : des guides clairs pour les artisans et indépendants.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page">
        <h1>Guides pour se faire payer</h1>
        <p className="tool-intro">Des réponses claires aux questions que se posent les artisans et indépendants face à un client qui ne paie pas.</p>
        <div className="tool-list">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="tool-card">
              <h2>{g.title}</h2>
              <p>{g.intro}</p>
              <span>Lire le guide · {g.readMinutes} min →</span>
            </Link>
          ))}
        </div>
        <ProductCta />
      </main>
      <SiteFooter />
    </div>
  );
}
