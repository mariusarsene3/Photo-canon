import Link from "next/link";
import { BRAND } from "@/lib/brand";

const SIGNUP = "/login?mode=signup";

const steps = [
  {
    n: "1",
    title: "Ajoutez vos factures",
    text: "Numéro, client, montant, échéance. 20 secondes par facture.",
  },
  {
    n: "2",
    title: "On relance pour vous",
    text: "Rappel courtois à J+1, relance ferme à J+7, dernier avis à J+15. Automatiquement, chaque matin.",
  },
  {
    n: "3",
    title: "Vous êtes payé",
    text: "Marquez la facture « payée » : les relances s'arrêtent aussitôt.",
  },
];

const features = [
  {
    icon: "📈",
    title: "Un ton qui monte progressivement",
    text: "Le premier message reste cordial pour préserver la relation. Le ton ne se durcit que si le client ne réagit pas.",
  },
  {
    icon: "⚖️",
    title: "Mentions légales incluses",
    text: "Le dernier avis rappelle les pénalités de retard et l'indemnité forfaitaire de 40 € (art. L441-10 du Code de commerce).",
  },
  {
    icon: "🏦",
    title: "Votre IBAN dans chaque relance",
    text: "Le client a toutes les informations pour payer tout de suite, sans vous rappeler.",
  },
  {
    icon: "📊",
    title: "Tout votre argent en un coup d'œil",
    text: "Ce qui reste à encaisser, ce qui est en retard, ce que vous avez récupéré.",
  },
  {
    icon: "📱",
    title: "Pensé pour le téléphone",
    text: "Ajoutez une facture entre deux chantiers, directement depuis votre mobile.",
  },
  {
    icon: "🔒",
    title: "Vos données protégées",
    text: "Chaque compte est cloisonné. Données hébergées en Europe.",
  },
];

const faq = [
  {
    q: "Mes clients vont-ils mal le prendre ?",
    a: "Le premier message est un simple rappel aimable, qui précise « si le paiement est déjà parti, ne tenez pas compte de ce message ». La plupart des retards sont des oublis : un rappel poli suffit souvent.",
  },
  {
    q: "Les e-mails partent-ils à mon nom ?",
    a: "Oui. Ils sont signés avec le nom de votre entreprise, que vous réglez dans les paramètres.",
  },
  {
    q: "Et si le client paie entre deux relances ?",
    a: "Marquez la facture comme payée en un clic : plus aucune relance ne part.",
  },
  {
    q: "Je peux arrêter quand je veux ?",
    a: "Oui, l'abonnement est sans engagement.",
  },
];

const sampleEmail = `Bonjour Boulangerie Dupont,

Sauf erreur de notre part, la facture F-2026-042 d'un montant de 480,00 €, arrivée à échéance le 12/11/2026, n'a pas encore été réglée.

S'il s'agit d'un oubli, merci de procéder au règlement dès que possible. Si le paiement est déjà parti, ne tenez pas compte de ce message.

Cordialement,
Plomberie Martin`;

export function Landing() {
  return (
    <div className="landing">
      <nav className="lnav">
        <span className="brand">{BRAND.name}</span>
        <div className="lnav-links">
          <Link href="/login">Se connecter</Link>
          <Link href={SIGNUP} className="btn small">Essai gratuit</Link>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">Pour les artisans, indépendants et TPE</p>
        <h1>Vos factures impayées, relancées automatiquement.</h1>
        <p className="lead">
          Arrêtez de courir après votre argent : vos clients sont relancés à votre place, avec le bon ton
          au bon moment, jusqu&apos;à ce que vous soyez payé.
        </p>
        <div className="cta-row">
          <Link href={SIGNUP} className="btn big">Essayer gratuitement {BRAND.trialDays} jours</Link>
          <span className="muted small">Sans engagement · Prêt en 2 minutes</span>
        </div>

        <div className="email-preview" aria-label="Exemple de relance envoyée">
          <div className="email-head">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="email-subject">Petit rappel : facture F-2026-042</span>
          </div>
          <pre>{sampleEmail}</pre>
        </div>
      </header>

      <section className="lsection">
        <h2>Relancer, c&apos;est pénible. On s&apos;en occupe.</h2>
        <div className="pain">
          <p>😩 Vous n&apos;osez pas relancer de peur de froisser un bon client.</p>
          <p>⏳ Vous y pensez le soir, puis vous oubliez.</p>
          <p>💸 Pendant ce temps, votre trésorerie trinque.</p>
        </div>
      </section>

      <section className="lsection">
        <h2>Comment ça marche</h2>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className="step">
              <span className="step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lsection">
        <h2>Tout ce qu&apos;il faut, rien de plus</h2>
        <div className="features">
          {features.map((f) => (
            <div key={f.title} className="feature">
              <span className="feature-icon" aria-hidden>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lsection" id="tarif">
        <h2>Un seul tarif, simple</h2>
        <div className="price-card">
          <p className="price"><strong>{BRAND.price} €</strong> HT / mois</p>
          <ul>
            <li>✓ Factures et relances illimitées</li>
            <li>✓ Scénario en 3 étapes J+1 / J+7 / J+15</li>
            <li>✓ Tableau de bord de trésorerie</li>
            <li>✓ Sans engagement</li>
          </ul>
          <Link href={SIGNUP} className="btn big full">Commencer l&apos;essai gratuit</Link>
          <p className="muted small center">
            Une seule facture récupérée suffit souvent à rembourser l&apos;année.
          </p>
        </div>
      </section>

      <section className="lsection">
        <h2>Questions fréquentes</h2>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Récupérez l&apos;argent qu&apos;on vous doit.</h2>
        <Link href={SIGNUP} className="btn big">Essayer gratuitement</Link>
      </section>

      <footer className="lfooter muted small">
        © {new Date().getFullYear()} {BRAND.name}
      </footer>
    </div>
  );
}
