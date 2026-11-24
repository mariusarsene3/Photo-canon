import "./landing.css";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { founderSeatsLeft } from "@/lib/founder";
import { LEGAL } from "@/lib/legal";
import { siteUrl } from "@/lib/payment";
import { StickyCta } from "./sticky-cta";
import { DemoVideo } from "./demo-video";

const SIGNUP = "/login?mode=signup";

const steps = [
  { n: "1", title: "Vous ajoutez la facture", text: "Le client, son e-mail, le montant et la date limite. Ou importez-les toutes depuis Excel." },
  { n: "2", title: "Encaissez relance à votre place", text: "J+1 : rappel courtois. J+7 : relance ferme. J+15 : dernier avis. Signés à votre nom." },
  { n: "3", title: "Votre client paie en un clic", text: "Chaque relance contient un lien avec votre IBAN et un QR code. Une fois payé, tout s'arrête." },
];

const benefits = [
  { title: "Payé plus vite", text: "Le client est relancé dès le lendemain de l'échéance, sans que vous ayez à y penser." },
  { title: "Fini les mails gênants", text: "Le ton monte progressivement et reste professionnel : vous gardez une bonne relation client." },
  { title: "Vos retenues de garantie récupérées", text: "Dans le bâtiment, Encaissez vous prévient au bout d'un an pour réclamer vos 5 %." },
];

const faq = [
  { q: "Mes clients vont-ils mal le prendre ?", a: "Non : le premier message est un simple rappel poli, qui précise « si le paiement est déjà parti, ne tenez pas compte de ce message ». La plupart des retards sont des oublis." },
  { q: "Les e-mails partent-ils à mon nom ?", a: "Oui : votre client voit le nom de votre entreprise comme expéditeur, et le message est signé à votre nom. S'il répond, sa réponse arrive directement dans votre boîte mail." },
  { q: "Et si le client paie entre deux relances ?", a: "Vous cochez « Payée » en un clic, ou vous mettez les relances en pause : plus rien ne part." },
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

/** Données structurées pour Google : le logiciel, son prix et la FAQ. */
function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: BRAND.name,
      url: siteUrl(),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      description:
        "Relance automatique des factures impayées pour artisans, indépendants et petites entreprises : rappel à J+1, relance à J+7, dernier avis à J+15, avec lien de paiement.",
      offers: {
        "@type": "Offer",
        price: String(BRAND.price),
        priceCurrency: "EUR",
        description: `${BRAND.trialDays} jours d'essai gratuit, sans engagement`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export async function Landing() {
  const seats = await founderSeatsLeft();
  return (
    <div className="lp">
      <JsonLd />
      {seats > 0 && (
        <Link href="/fondateur" className="fd-banner">
          <span><b>Offre fondateur</b> : -{BRAND.founder.discount} % à vie<span className="fd-long"> pour les {BRAND.founder.seats} premiers clients</span></span>
          <span>{seats} place{seats > 1 ? "s" : ""} restante{seats > 1 ? "s" : ""} →</span>
        </Link>
      )}
      <nav className="lp-nav lp-wrap">
        <span className="lp-brand">{BRAND.name}<small className="lp-tagline">{BRAND.tagline}</small></span>
        <div className="lp-nav-links">
          <a href="#tarif" className="lp-hide-sm">Tarif</a>
          <Link href="/outils" className="lp-hide-sm">Outils gratuits</Link>
          <Link href="/guides" className="lp-hide-sm">Guides</Link>
          <Link href="/login">Connexion</Link>
          <Link href={SIGNUP} className="lp-btn lp-btn-sm">Essai gratuit</Link>
        </div>
      </nav>

      <header className="lp-hero lp-wrap">
        <p className="lp-kicker">Pour les artisans, indépendants et petites entreprises</p>
        <h1>Vos clients ne paient pas ? <em>On les relance à votre place.</em></h1>
        <p className="lp-lead">
          Ajoutez une facture en retard : Encaissez envoie à votre client un rappel poli, puis plus ferme, avec un lien
          pour payer. Vous n&apos;avez plus à relancer personne.
        </p>
        <div className="lp-actions" id="hero-cta">
          <Link href={SIGNUP} className="lp-btn">Commencer l&apos;essai gratuit</Link>
        </div>
        <p className="lp-meta"><strong className="lp-meta-price">{BRAND.price} € HT/mois</strong> · {BRAND.trialDays} jours gratuits · Sans engagement</p>
      </header>

      <div className="lp-wrap lp-video-wrap">
        <DemoVideo />
      </div>

      <div className="lp-wrap lp-duo">
        <figure>
          <figcaption>Ce que reçoit votre client <span className="demo-tag">Exemple</span></figcaption>
          <div className="lp-email">
            <div className="lp-email-head">
              <p><span>De</span>Plomberie Martin</p>
              <p><span>Objet</span><b>Petit rappel : facture F-042</b></p>
            </div>
            <pre>{sampleEmail}</pre>
          </div>
        </figure>
        <figure>
          <figcaption>Ce que vous voyez <span className="demo-tag">Exemple</span></figcaption>
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

      <section className="lp-section lp-wrap">
        <div className="lp-head">
          <h2>Ce qui change pour vous</h2>
        </div>
        <div className="lp-cols">
          {benefits.map((b) => (
            <div key={b.title} className="lp-col">
              <h3>{b.title}</h3>
              <p>{b.text}</p>
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
            <li>Factures et relances illimitées</li>
            <li>Lien de paiement avec IBAN et QR code</li>
            <li>Import Excel et CSV</li>
            <li>Suivi des retenues de garantie</li>
            <li>Sans engagement</li>
          </ul>
          <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
        </div>
      </section>

      <section className="lp-section lp-wrap">
        <div className="lp-head">
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
        <span className="lp-footer-links">
          <Link href="/outils">Outils gratuits</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/fondateur">Offre fondateur</Link>
          <Link href="/cgv">CGV</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          {LEGAL.contactEmail && <a href={`mailto:${LEGAL.contactEmail}`}>Contact</a>}
          <span>© {new Date().getFullYear()}</span>
        </span>
      </footer>

      <StickyCta>
        <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer l&apos;essai gratuit</Link>
      </StickyCta>
    </div>
  );
}
