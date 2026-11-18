import "./landing.css";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { StickyCta } from "./sticky-cta";

const SIGNUP = "/login?mode=signup";

const steps = [
  { n: "1", title: "Ajoutez une facture", text: "Client, montant, date limite." },
  { n: "2", title: "On relance", text: "À J+1, J+7 et J+15 si ce n'est pas payé." },
  { n: "3", title: "Vous êtes payé", text: "Les relances s'arrêtent." },
];

const sampleEmail = `Bonjour Boulangerie Dupont,

Sauf erreur de notre part, la facture F-042 d'un montant de 1 250,00 €, arrivée à échéance le 31/03, n'a pas encore été réglée.

Merci de procéder au règlement dès que possible.

Cordialement,
Plomberie Martin`;

function ProductShot() {
  return (
    <div className="ps" aria-hidden>
      <div className="ps-bar"><i /><i /><i /></div>
      <div className="ps-body">
        <div className="ps-stats">
          <div><span>À encaisser</span><strong>5 029 €</strong></div>
          <div><span>En retard</span><strong className="ps-late">4 930 €</strong></div>
          <div><span>Récupéré</span><strong className="ps-ok">12 480 €</strong></div>
        </div>
        <div className="ps-table">
          <div className="ps-row ps-head"><span>Client</span><span>Montant</span><span>Statut</span></div>
          <div className="ps-row"><span>SARL Leroy</span><span>3 200 €</span><span><em className="ps-b ps-b-late">Dernier avis envoyé</em></span></div>
          <div className="ps-row"><span>Boulangerie Dupont</span><span>1 250 €</span><span><em className="ps-b ps-b-late">Rappel envoyé</em></span></div>
          <div className="ps-row"><span>Café du Port</span><span>480 €</span><span><em className="ps-b ps-b-ok">Payée</em></span></div>
          <div className="ps-row"><span>Garage Bernard</span><span>99 €</span><span><em className="ps-b">À venir</em></span></div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="lp">
      <nav className="lp-nav lp-wrap">
        <span className="lp-brand">{BRAND.name}</span>
        <div className="lp-nav-links">
          <a href="#tarif" className="lp-hide-sm">Tarif</a>
          <Link href="/login">Connexion</Link>
          <Link href={SIGNUP} className="lp-btn lp-btn-sm">Essai gratuit</Link>
        </div>
      </nav>

      <header className="lp-hero lp-wrap">
        <p className="lp-kicker">Pour les artisans, indépendants et petites entreprises</p>
        <h1>Vos clients ne paient pas ? On les relance à votre place.</h1>
        <p className="lp-lead">
          Vous ajoutez vos factures. Les e-mails de rappel partent tout seuls jusqu&apos;au paiement.
        </p>
        <div className="lp-actions" id="hero-cta">
          <Link href={SIGNUP} className="lp-btn">Commencer l&apos;essai gratuit</Link>
        </div>
        <p className="lp-meta">{BRAND.trialDays} jours gratuits · Sans engagement</p>
      </header>

      <div className="lp-wrap lp-duo">
        <figure>
          <figcaption>Ce que reçoit votre client</figcaption>
          <div className="lp-email">
            <div className="lp-email-head">
              <p><span>De</span>Plomberie Martin</p>
              <p><span>Objet</span><b>Petit rappel : facture F-042</b></p>
            </div>
            <pre>{sampleEmail}</pre>
          </div>
        </figure>
        <figure>
          <figcaption>Ce que vous voyez</figcaption>
          <ProductShot />
        </figure>
      </div>

      <section className="lp-section lp-wrap" id="fonctionnement">
        <div className="lp-head">
          <h2>Comment ça marche</h2>
        </div>
        <div className="lp-cols">
          {steps.map((s) => (
            <div key={s.n} className="lp-col">
              <span className="lp-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-wrap" id="tarif">
        <div className="lp-head">
          <h2>Un prix simple.</h2>
        </div>
        <div className="lp-price">
          <div className="lp-price-top">
            <p className="lp-plan">{BRAND.name}</p>
            <p className="lp-amount"><strong>{BRAND.price} €</strong><span>HT / mois</span></p>
          </div>
          <ul>
            <li>Factures illimitées</li>
            <li>Sans engagement</li>
          </ul>
          <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
        </div>
      </section>

      <section className="lp-final lp-wrap">
        <h2>Récupérez ce qu&apos;on vous doit.</h2>
        <Link href={SIGNUP} className="lp-btn">Commencer l&apos;essai gratuit</Link>
      </section>

      <footer className="lp-footer lp-wrap">
        <span className="lp-brand">{BRAND.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>

      <StickyCta>
        <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
      </StickyCta>
    </div>
  );
}
