import "./landing.css";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { StickyCta } from "./sticky-cta";

const SIGNUP = "/login?mode=signup";

const steps = [
  { n: "1", title: "Vous ajoutez une facture", text: "Le nom du client, son e-mail, le montant et la date limite de paiement. C'est tout." },
  { n: "2", title: "On surveille la date", text: "Si le client n'a pas payé à temps, il reçoit automatiquement un e-mail de rappel, signé à votre nom." },
  { n: "3", title: "Il paie, ça s'arrête", text: "Quand l'argent arrive, vous cochez « Payée ». Plus aucun e-mail ne part." },
];

const story = [
  { date: "1er mars", who: "Vous", text: "Vous envoyez une facture de 1 250 € à la Boulangerie Dupont, à payer avant le 31 mars. Vous l'ajoutez dans " },
  { date: "31 mars", who: "", text: "Date limite. La boulangerie n'a pas payé." },
  { date: "1er avril", who: "Automatique", text: "La boulangerie reçoit un rappel poli : « Sauf erreur de notre part, la facture n'a pas encore été réglée… »" },
  { date: "7 avril", who: "Automatique", text: "Toujours rien : une relance plus ferme, avec un délai de 7 jours pour payer." },
  { date: "15 avril", who: "Automatique", text: "Dernier avis : rappel des pénalités de retard et de l'indemnité légale de 40 €." },
  { date: "17 avril", who: "Vous", text: "Le virement arrive. Vous cochez « Payée ». C'est terminé." },
];

const sampleEmail = `Bonjour Boulangerie Dupont,

Sauf erreur de notre part, la facture F-042 d'un montant de 1 250,00 €, arrivée à échéance le 31/03, n'a pas encore été réglée.

S'il s'agit d'un oubli, merci de procéder au règlement dès que possible. Si le paiement est déjà parti, ne tenez pas compte de ce message.

Règlement par virement : FR76 •••• •••• •••• •••• •••• 189

Cordialement,
Plomberie Martin`;

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
          <a href="#fonctionnement" className="lp-hide-sm">Fonctionnement</a>
          <a href="#tarif" className="lp-hide-sm">Tarif</a>
          <Link href="/login">Connexion</Link>
          <Link href={SIGNUP} className="lp-btn lp-btn-sm">Essai gratuit</Link>
        </div>
      </nav>

      <header className="lp-hero lp-wrap">
        <p className="lp-kicker">Pour les artisans, indépendants et petites entreprises</p>
        <h1>Vos clients ne paient pas ? On les relance à votre place.</h1>
        <p className="lp-lead">
          Vous ajoutez vos factures. Si un client dépasse la date de paiement, il reçoit automatiquement des
          e-mails de rappel, de plus en plus fermes, jusqu&apos;à ce qu&apos;il paie. Vous n&apos;avez plus à
          relancer personne.
        </p>
        <div className="lp-actions" id="hero-cta">
          <Link href={SIGNUP} className="lp-btn">Commencer l&apos;essai gratuit</Link>
          <a href="#exemple" className="lp-link">Voir un exemple →</a>
        </div>
        <p className="lp-meta">{BRAND.trialDays} jours gratuits · Sans engagement · Prêt en deux minutes</p>
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
          <p className="lp-kicker">Fonctionnement</p>
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

      <section className="lp-section lp-wrap" id="exemple">
        <div className="lp-head">
          <p className="lp-kicker">Exemple concret</p>
          <h2>L&apos;histoire d&apos;une facture.</h2>
          <p className="lp-sub">Entre le 1er et le 17 avril, vous n&apos;avez rien eu à faire.</p>
        </div>
        <ol className="lp-story">
          {story.map((e) => (
            <li key={e.date} className={e.who === "Automatique" ? "is-auto" : ""}>
              <span className="lp-story-date">{e.date}</span>
              <div>
                {e.who && <span className="lp-story-who">{e.who === "Automatique" ? `Envoyé par ${BRAND.name}` : "Vous"}</span>}
                <p>
                  {e.text}
                  {e.text.endsWith("dans ") ? <>{BRAND.name}.</> : null}
                </p>
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
