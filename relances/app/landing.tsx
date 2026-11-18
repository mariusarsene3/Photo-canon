import "./landing.css";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Calculator } from "./calculator";
import { StickyCta } from "./sticky-cta";

const SIGNUP = "/login?mode=signup";

const timeline = [
  {
    day: "J+1",
    tone: "soft",
    label: "Rappel amical",
    subject: "Petit rappel : facture F-042",
    excerpt: "Sauf erreur de notre part, la facture n'a pas encore été réglée. S'il s'agit d'un oubli…",
  },
  {
    day: "J+7",
    tone: "firm",
    label: "Relance ferme",
    subject: "Relance : facture F-042 en attente",
    excerpt: "Malgré notre précédent rappel, la facture reste impayée. Merci de régulariser sous 7 jours…",
  },
  {
    day: "J+15",
    tone: "hard",
    label: "Dernier avis",
    subject: "Dernier avis avant mise en demeure",
    excerpt: "Sans règlement sous 8 jours, nous engagerons une procédure de recouvrement. Indemnité de 40 €…",
  },
];

const features = [
  { icon: "⚖️", color: "violet", title: "Mentions légales incluses", text: "Pénalités de retard et indemnité de 40 € (art. L441-10) rappelées au bon moment." },
  { icon: "🏦", color: "blue", title: "Votre IBAN dans chaque mail", text: "Le client a tout pour payer immédiatement, sans vous rappeler." },
  { icon: "🛑", color: "green", title: "Stop dès que c'est payé", text: "Un clic sur « Payée » et plus aucune relance ne part." },
  { icon: "📊", color: "orange", title: "Votre trésorerie en clair", text: "À encaisser, en retard, récupéré : tout en un coup d'œil." },
  { icon: "📱", color: "pink", title: "Fait pour le téléphone", text: "Ajoutez une facture entre deux chantiers, en 20 secondes." },
  { icon: "🔒", color: "teal", title: "Données protégées", text: "Comptes cloisonnés, données hébergées en Europe." },
];

const faq = [
  {
    q: "Mes clients vont-ils mal le prendre ?",
    a: "Le premier message est un simple rappel aimable (« si le paiement est déjà parti, ne tenez pas compte de ce message »). La plupart des retards sont des oublis : un rappel poli suffit souvent.",
  },
  { q: "Les e-mails partent-ils à mon nom ?", a: "Oui, ils sont signés avec le nom de votre entreprise." },
  { q: "Et si le client paie entre deux relances ?", a: "Marquez la facture comme payée en un clic : plus aucune relance ne part." },
  { q: "Je peux arrêter quand je veux ?", a: "Oui, l'abonnement est sans engagement." },
];

function Mockup() {
  return (
    <div className="mock-wrap" aria-hidden>
      <div className="mock">
        <div className="mock-top">
          <span className="mock-title">{BRAND.name}</span>
          <span className="mock-pill">Ce mois-ci</span>
        </div>
        <div className="mock-big">
          <span>Récupéré</span>
          <strong>4 930 €</strong>
          <div className="mock-bar"><i style={{ width: "78%" }} /></div>
        </div>
        <div className="mock-rows">
          <div className="mock-row"><b>SARL Leroy</b><span>3 200 €</span><em className="t-ok">Payée</em></div>
          <div className="mock-row"><b>Boulangerie Dupont</b><span>480 €</span><em className="t-firm">Relance J+7</em></div>
          <div className="mock-row"><b>Café du Port</b><span>1 250 €</span><em className="t-soft">Rappel J+1</em></div>
        </div>
      </div>
      <div className="toast toast-1">✅ <span><b>SARL Leroy</b> a payé 3 200 €</span></div>
      <div className="toast toast-2">📧 <span>Relance envoyée à <b>Café du Port</b></span></div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="lp">
      <section className="lp-hero">
        <div className="lp-glow" />
        <nav className="lp-nav">
          <span className="lp-brand"><span className="lp-logo">€</span>{BRAND.name}</span>
          <div className="lp-nav-links">
            <Link href="/login">Connexion</Link>
            <Link href={SIGNUP} className="lp-btn lp-btn-light lp-btn-sm">Essai gratuit</Link>
          </div>
        </nav>

        <div className="lp-hero-grid">
          <div className="lp-hero-text">
            <span className="lp-chip">💸 Pour artisans, indépendants &amp; TPE</span>
            <h1>
              Vos clients vous doivent de l&apos;argent.
              <br />
              <span className="lp-hl">On va le chercher.</span>
            </h1>
            <p className="lp-lead">
              Vos factures impayées sont relancées automatiquement, avec le bon ton au bon moment. Vous, vous
              travaillez. L&apos;argent rentre.
            </p>
            <div className="lp-cta" id="hero-cta">
              <Link href={SIGNUP} className="lp-btn lp-btn-cta">Essayer gratuitement {BRAND.trialDays} jours →</Link>
              <span className="lp-cta-note">Sans engagement · Prêt en 2 minutes</span>
            </div>
            <div className="lp-steps-inline">
              <span><i className="d-soft" />J+1 rappel</span>
              <span><i className="d-firm" />J+7 relance</span>
              <span><i className="d-hard" />J+15 dernier avis</span>
            </div>
          </div>
          <Mockup />
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-h2">Fini de courir après votre argent</h2>
        <div className="lp-compare">
          <div className="lp-col lp-col-bad">
            <h3>😩 Sans {BRAND.name}</h3>
            <ul>
              <li>Vous n&apos;osez pas relancer un bon client</li>
              <li>Vous y pensez le soir… puis vous oubliez</li>
              <li>Des semaines de retard, la trésorerie trinque</li>
              <li>Des heures perdues à écrire des mails gênants</li>
            </ul>
          </div>
          <div className="lp-col lp-col-good">
            <h3>😎 Avec {BRAND.name}</h3>
            <ul>
              <li>Les relances partent toutes seules, chaque matin</li>
              <li>Un ton pro et progressif, jamais agressif</li>
              <li>Vous êtes payé plus vite</li>
              <li>20 secondes par facture, et c&apos;est tout</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-h2">Un ton qui monte, seulement si nécessaire</h2>
        <p className="lp-sub">Trois e-mails prêts à l&apos;emploi, signés à votre nom. Dès que le client paie, tout s&apos;arrête.</p>
        <div className="lp-timeline">
          {timeline.map((t) => (
            <div key={t.day} className={`lp-mail lp-mail-${t.tone}`}>
              <div className="lp-mail-day">{t.day}<small>{t.label}</small></div>
              <div className="lp-mail-body">
                <b>{t.subject}</b>
                <p>{t.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-h2">Tout ce qu&apos;il faut, rien de plus</h2>
        <div className="lp-features">
          {features.map((f) => (
            <div key={f.title} className="lp-feature">
              <span className={`lp-ico lp-ico-${f.color}`}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section" id="tarif">
        <h2 className="lp-h2">Rentabilisé dès la première facture</h2>
        <div className="lp-pricing">
          <Calculator price={BRAND.price} />
          <div className="lp-price">
            <span className="lp-badge">Tarif de lancement</span>
            <p className="lp-amount"><strong>{BRAND.price} €</strong> HT / mois</p>
            <ul>
              <li>Factures et relances illimitées</li>
              <li>Scénario J+1 / J+7 / J+15</li>
              <li>Tableau de bord de trésorerie</li>
              <li>Sans engagement</li>
            </ul>
            <Link href={SIGNUP} className="lp-btn lp-btn-cta lp-btn-full">Commencer l&apos;essai gratuit</Link>
            <p className="lp-small">{BRAND.trialDays} jours gratuits pour essayer.</p>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-h2">Questions fréquentes</h2>
        <div className="lp-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lp-final">
        <h2>Récupérez l&apos;argent qu&apos;on vous doit.</h2>
        <p>Créez votre compte et ajoutez votre première facture en 2 minutes.</p>
        <Link href={SIGNUP} className="lp-btn lp-btn-light">Essayer gratuitement →</Link>
      </section>

      <footer className="lp-footer">© {new Date().getFullYear()} {BRAND.name}</footer>

      <StickyCta>
        <Link href={SIGNUP} className="lp-btn lp-btn-cta lp-btn-full">Essai gratuit {BRAND.trialDays} jours</Link>
      </StickyCta>
    </div>
  );
}
