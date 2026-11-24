import "../landing.css";
import "../outils/tools.css";
import "./fondateur.css";
import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, founderPrice } from "@/lib/brand";
import { founderSeatsLeft, showSeatCounter } from "@/lib/founder";
import { SiteFooter, SiteNav } from "../site-chrome";

export const revalidate = 300; // le compteur de places se met à jour toutes les 5 minutes

const F = BRAND.founder;

export const metadata: Metadata = {
  title: `Offre fondateur : -${F.discount} % à vie sur ${BRAND.name}`,
  description: `Les ${F.seats} premiers abonnés d'${BRAND.name} paient ${founderPrice()} HT par mois au lieu de ${BRAND.price} €, à vie. Relance automatique des factures impayées pour artisans et indépendants.`,
  alternates: { canonical: "/fondateur" },
};

const faq = [
  { q: "« À vie », vraiment ?", a: `Oui : tant que votre abonnement reste actif, vous gardez ${founderPrice()} HT par mois, même quand le prix augmentera.` },
  { q: "Je dois payer tout de suite ?", a: `Non. Vous commencez par ${BRAND.trialDays} jours d'essai gratuit, sans carte bancaire. Le code s'utilise seulement au moment de vous abonner.` },
  { q: "Je peux arrêter quand je veux ?", a: "Oui, l'abonnement est sans engagement et se résilie en un clic depuis « Mon compte »." },
  { q: "Pourquoi cette réduction ?", a: `${BRAND.name} vient d'être lancé. Les premiers clients nous aident à l'améliorer avec leurs retours : la réduction est notre façon de les remercier.` },
];

export default async function Fondateur() {
  const left = await founderSeatsLeft();
  const taken = F.seats - left;
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page fd">
        <p className="fd-tag">Offre de lancement</p>
        <h1>-{F.discount} % à vie pour les {F.seats} premiers clients</h1>
        <p className="tool-intro">
          {BRAND.name} relance vos clients qui ne paient pas, automatiquement. Les {F.seats} premiers abonnés le paient{" "}
          <strong>{founderPrice()} HT par mois au lieu de {BRAND.price} €</strong>, pour toujours.
        </p>

        <div className="fd-grid">
          <section className="fd-card fd-price" aria-label="Prix fondateur">
            <p className="fd-old">{BRAND.price} € HT / mois</p>
            <p className="fd-new"><strong>{founderPrice()}</strong> HT / mois, à vie</p>
            {showSeatCounter(left) && <div className="fd-seats">
              <div className="fd-bar" role="progressbar" aria-valuemin={0} aria-valuemax={F.seats} aria-valuenow={taken} aria-label="Places prises">
                <i style={{ width: `${Math.max(4, (taken / F.seats) * 100)}%` }} />
              </div>
              <p>{left > 0 ? <><b>{left} place{left > 1 ? "s" : ""}</b> restante{left > 1 ? "s" : ""} sur {F.seats}</> : <b>Toutes les places sont prises</b>}</p>
            </div>}
            {left > 0 ? (
              <>
                <Link href="/login?mode=signup" className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
                <p className="fd-small">{BRAND.trialDays} jours gratuits, sans carte bancaire. Puis code <span className="fd-code">{F.code}</span> au moment de vous abonner.</p>
              </>
            ) : (
              <Link href="/login?mode=signup" className="lp-btn lp-btn-full">Essayer {BRAND.name}</Link>
            )}
          </section>

          <section className="fd-card">
            <h2>Comment en profiter</h2>
            <ol className="fd-steps">
              <li><b>Créez votre compte</b><span>Gratuit pendant {BRAND.trialDays} jours, sans carte bancaire.</span></li>
              <li><b>Ajoutez vos factures en retard</b><span>{BRAND.name} relance vos clients dès le lendemain de l&apos;échéance.</span></li>
              <li><b>Abonnez-vous avec le code {F.code}</b><span>Dans « Mon compte », au moment du paiement. La réduction s&apos;applique à vie.</span></li>
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
