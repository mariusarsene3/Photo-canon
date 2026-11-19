import "../landing.css";
import "./tools.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCta, SiteFooter, SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Outils gratuits pour les factures impayées",
  description:
    "Lettre de relance, mise en demeure de payer, calcul des pénalités de retard, retenue de garantie : des outils gratuits et sans inscription pour récupérer vos factures impayées.",
  alternates: { canonical: "/outils" },
};

const tools = [
  { href: "/outils/lettre-relance", title: "Lettre de relance", text: "Un rappel cordial ou une relance ferme, prête à envoyer." },
  { href: "/outils/mise-en-demeure", title: "Mise en demeure de payer", text: "Le dernier courrier avant une procédure, avec les mentions légales." },
  { href: "/outils/calcul-penalites", title: "Calcul des pénalités de retard", text: "Ce que votre client vous doit vraiment, avec les taux officiels." },
  { href: "/outils/retenue-de-garantie", title: "Retenue de garantie", text: "La date de libération de vos 5 % et la lettre pour les réclamer." },
];

export default function Outils() {
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page">
        <h1>Outils gratuits pour les factures impayées</h1>
        <p className="tool-intro">Gratuits, sans inscription. Rien de ce que vous saisissez n&apos;est enregistré.</p>
        <div className="tool-list">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="tool-card">
              <h2>{t.title}</h2>
              <p>{t.text}</p>
              <span>Utiliser l&apos;outil →</span>
            </Link>
          ))}
        </div>
        <ProductCta />
      </main>
      <SiteFooter />
    </div>
  );
}
