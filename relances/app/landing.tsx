import "./landing.css";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { StickyCta } from "./sticky-cta";

const SIGNUP = "/login?mode=signup";

const steps = [
  { n: "01", title: "Ajoutez vos factures", text: "Client, montant, échéance. Vingt secondes par facture, depuis votre téléphone ou votre ordinateur." },
  { n: "02", title: "Les relances partent seules", text: "Chaque matin, les factures en retard sont relancées selon un scénario éprouvé, signé à votre nom." },
  { n: "03", title: "Vous êtes payé", text: "Marquez la facture comme payée. Les relances s'arrêtent immédiatement." },
];

const sequence = [
  { day: "J+1", label: "Rappel courtois", subject: "Petit rappel : facture F-042", text: "Un message cordial qui laisse au client le bénéfice du doute. La plupart des retards sont des oublis." },
  { day: "J+7", label: "Relance ferme", subject: "Relance : facture F-042 en attente de règlement", text: "Un ton plus direct, avec un délai précis pour régulariser." },
  { day: "J+15", label: "Dernier avis", subject: "Dernier avis avant mise en demeure", text: "Rappel des pénalités de retard et de l'indemnité forfaitaire de 40 € prévues par la loi." },
];

const features = [
  { title: "Conforme au Code de commerce", text: "Pénalités de retard et indemnité forfaitaire de 40 € (art. L441-10) rappelées au bon moment." },
  { title: "Votre IBAN dans chaque relance", text: "Le client dispose de tout ce qu'il faut pour payer immédiatement." },
  { title: "Arrêt automatique", text: "Une facture marquée payée n'est plus jamais relancée." },
  { title: "Trésorerie en un coup d'œil", text: "À encaisser, en retard, récupéré : vos chiffres, à jour." },
  { title: "Pensé pour le mobile", text: "Ajoutez une facture entre deux rendez-vous, sans ordinateur." },
  { title: "Données hébergées en Europe", text: "Chaque compte est strictement cloisonné." },
];

const faq = [
  {
    q: "Mes clients vont-ils mal le prendre ?",
    a: "Le premier message est un rappel courtois qui précise « si le paiement est déjà parti, ne tenez pas compte de ce message ». Le ton ne se durcit que si le client ne réagit pas.",
  },
  { q: "Les e-mails partent-ils à mon nom ?", a: "Oui, ils sont signés avec le nom de votre entreprise." },
  { q: "Que se passe-t-il si le client paie entre deux relances ?", a: "Vous marquez la facture comme payée en un clic, et plus aucune relance ne part." },
  { q: "Puis-je arrêter à tout moment ?", a: "Oui, l'abonnement est sans engagement." },
];

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
          <div className="ps-row"><span>Boulangerie Dupont</span><span>480 €</span><span><em className="ps-b ps-b-late">Relance envoyée</em></span></div>
          <div className="ps-row"><span>Plomberie Martin</span><span>1 250 €</span><span><em className="ps-b ps-b-ok">Payée</em></span></div>
          <div className="ps-row"><span>Café du Port</span><span>99 €</span><span><em className="ps-b">À venir</em></span></div>
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
          <a href="#fonctionnement" className="lp-hide-sm">Fonctionnement</a>
          <a href="#tarif" className="lp-hide-sm">Tarif</a>
          <Link href="/login">Connexion</Link>
          <Link href={SIGNUP} className="lp-btn lp-btn-sm">Essai gratuit</Link>
        </div>
      </nav>

      <header className="lp-hero lp-wrap">
        <p className="lp-kicker">Relance automatique des factures impayées</p>
        <h1>Faites-vous payer.<br />Sans relancer <span className="lp-nowrap">vous-même.</span></h1>
        <p className="lp-lead">
          Vos clients en retard de paiement sont relancés automatiquement, avec le ton juste à chaque étape,
          jusqu&apos;au règlement. Conçu pour les artisans, indépendants et petites entreprises.
        </p>
        <div className="lp-actions" id="hero-cta">
          <Link href={SIGNUP} className="lp-btn">Commencer l&apos;essai gratuit</Link>
          <a href="#fonctionnement" className="lp-link">Voir le fonctionnement →</a>
        </div>
        <p className="lp-meta">{BRAND.trialDays} jours gratuits · Sans engagement · Prêt en deux minutes</p>
      </header>

      <div className="lp-wrap lp-shot">
        <ProductShot />
      </div>

      <section className="lp-section lp-wrap" id="fonctionnement">
        <div className="lp-head">
          <p className="lp-kicker">Fonctionnement</p>
          <h2>Trois étapes. Une seule vous demande quelque chose.</h2>
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

      <section className="lp-section lp-wrap">
        <div className="lp-head">
          <p className="lp-kicker">Le scénario</p>
          <h2>Le bon ton, au bon moment.</h2>
          <p className="lp-sub">Trois messages rédigés pour préserver la relation client, et ne monter en fermeté que si nécessaire.</p>
        </div>
        <ol className="lp-seq">
          {sequence.map((s) => (
            <li key={s.day}>
              <div className="lp-seq-day">{s.day}<span>{s.label}</span></div>
              <div className="lp-seq-body">
                <p className="lp-seq-subject">{s.subject}</p>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-section lp-wrap">
        <div className="lp-head">
          <p className="lp-kicker">Inclus</p>
          <h2>L&apos;essentiel, bien fait.</h2>
        </div>
        <div className="lp-grid">
          {features.map((f) => (
            <div key={f.title} className="lp-feat">
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-wrap" id="tarif">
        <div className="lp-head">
          <p className="lp-kicker">Tarif</p>
          <h2>Un prix simple.</h2>
          <p className="lp-sub">Une seule facture de 800 € récupérée couvre plus de deux ans d&apos;abonnement.</p>
        </div>
        <div className="lp-price">
          <div className="lp-price-top">
            <p className="lp-plan">{BRAND.name}</p>
            <p className="lp-amount"><strong>{BRAND.price} €</strong><span>HT / mois</span></p>
          </div>
          <ul>
            <li>Factures et relances illimitées</li>
            <li>Scénario J+1, J+7, J+15</li>
            <li>Tableau de bord de trésorerie</li>
            <li>Sans engagement</li>
          </ul>
          <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
          <p className="lp-meta lp-center">{BRAND.trialDays} jours gratuits</p>
        </div>
      </section>

      <section className="lp-section lp-wrap">
        <div className="lp-head">
          <p className="lp-kicker">Questions</p>
          <h2>Questions fréquentes</h2>
        </div>
        <div className="lp-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
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
