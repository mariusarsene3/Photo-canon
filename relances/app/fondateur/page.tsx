import "../landing.css";
import "../outils/tools.css";
import "./fondateur.css";
import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, founderOffer } from "@/lib/brand";
import { founderSeatsLeft, showSeatCounter } from "@/lib/founder";
import { SiteFooter, SiteNav } from "../site-chrome";

export const revalidate = 300; // le compteur de places se met à jour toutes les 5 minutes

const F = BRAND.founder;

export const metadata: Metadata = {
  title: `Offre fondateur : ${founderOffer()} sur ${BRAND.name}`,
  description: `Les ${F.seats} premiers abonnés d'${BRAND.name} profitent de ${founderOffer()}. Relance automatique des factures impayées pour artisans et indépendants.`,
  alternates: { canonical: "/fondateur" },
};

const faq = [
  { q: "Et après les 3 mois ?", a: `L'abonnement Pro passe à ${BRAND.price} € HT par mois, sans engagement. Vous pouvez arrêter à tout moment et revenir à la version gratuite.` },
  { q: "Je dois payer quelque chose pour commencer ?", a: `Non. La version gratuite permet de suivre jusqu'à ${BRAND.freeInvoices} factures en cours, sans carte bancaire. Le code s'utilise seulement si vous passez au Pro.` },
  { q: "Je peux arrêter quand je veux ?", a: "Oui, l'abonnement est sans engagement et se résilie en un clic depuis « Mon compte »." },
  { q: "Pourquoi cette offre ?", a: `${BRAND.name} vient d'être lancé. Les premiers clients nous aident à l'améliorer avec leurs retours : ces mois offerts sont notre façon de les remercier.` },
];

export default async function Fondateur() {
  const left = await founderSeatsLeft();
  const taken = F.seats - left;
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page fd">
        <p className="fd-tag">Offre de lancement</p>
        <h1>{founderOffer()} pour les {F.seats} premiers clients</h1>
        <p className="tool-intro">
          {BRAND.name} relance vos clients qui ne paient pas, automatiquement. Les {F.seats} premiers à passer au Pro profitent de{" "}
          <strong>{founderOffer()}</strong> : factures illimitées, sans rien payer pendant {F.monthsFree} mois.
        </p>

        <div className="fd-grid">
          <section className="fd-card fd-price" aria-label="Prix fondateur">
            <p className="fd-old">{BRAND.price} € HT / mois</p>
            <p className="fd-new"><strong>0 €</strong> pendant {F.monthsFree} mois</p>
            {showSeatCounter(left) && <div className="fd-seats">
              <div className="fd-bar" role="progressbar" aria-valuemin={0} aria-valuemax={F.seats} aria-valuenow={taken} aria-label="Places prises">
                <i style={{ width: `${Math.max(4, (taken / F.seats) * 100)}%` }} />
              </div>
              <p>{left > 0 ? <><b>{left} place{left > 1 ? "s" : ""}</b> restante{left > 1 ? "s" : ""} sur {F.seats}</> : <b>Toutes les places sont prises</b>}</p>
            </div>}
            {left > 0 ? (
              <>
                <Link href="/login?mode=signup" className="lp-btn lp-btn-full">Créer mon compte gratuit</Link>
                <p className="fd-small">Gratuit pour commencer, sans carte bancaire. Puis code <span className="fd-code">{F.code}</span> au moment de passer au Pro.</p>
              </>
            ) : (
              <Link href="/login?mode=signup" className="lp-btn lp-btn-full">Essayer {BRAND.name}</Link>
            )}
          </section>

          <section className="fd-card">
            <h2>Comment en profiter</h2>
            <ol className="fd-steps">
              <li><b>Créez votre compte</b><span>Gratuit, sans carte bancaire.</span></li>
              <li><b>Ajoutez vos factures en retard</b><span>{BRAND.name} relance vos clients dès le lendemain de l&apos;échéance.</span></li>
              <li><b>Passez au Pro avec le code {F.code}</b><span>Dans « Mon compte », au moment du paiement : les {F.monthsFree} premiers mois sont offerts.</span></li>
            </ol>
            <h2 className="fd-h2b">En échange, une seule chose</h2>
            <p className="fd-ask">Vos retours : ce qui vous plaît, ce qui manque, ce qui vous agace. Un e-mail ou un appel de 10 minutes de temps en temps suffit.</p>
          </section>
        </div>

        <section className="tool-tips">
          <h2>Questions fréquentes</h2>
          {faq.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
