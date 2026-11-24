import "./landing.css";
import Link from "next/link";
import { BRAND, founderOffer } from "@/lib/brand";
import { founderSeatsLeft, showSeatCounter } from "@/lib/founder";
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

/** Fonctionnalités : icône (tracé SVG 24×24), titre, explication courte. */
const features = [
  { icon: "M4 6h16v12H4z M4 7l8 6 8-6", title: "Relances automatiques", text: "Rappel 3 jours avant l'échéance, puis à J+1, J+7 et J+15. Le ton monte poliment, tout seul." },
  { icon: "M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h4", title: "Facture PDF jointe", text: "Votre client reçoit sa facture avec chaque relance : plus besoin de vous la redemander." },
  { icon: "M3 7h18v10H3z M3 11h18 M7 15h3", title: "Lien de paiement", text: "IBAN et QR code prêts à l'emploi : votre client paie en un clic depuis l'e-mail." },
  { icon: "M12 4a8 8 0 100 16 8 8 0 000-16z M8 12h8 M12 8v8", title: "À votre nom", text: "L'e-mail vient de votre entreprise, et les réponses arrivent dans votre boîte mail." },
  { icon: "M5 4h14v16H5z M9 8h6 M9 12h6 M9 16h3", title: "Textes modifiables", text: "Tutoiement, signature, numéro de téléphone : chaque relance à votre façon." },
  { icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z M9 12l2 2 4-4", title: "Retenues de garantie", text: "Dans le bâtiment, on vous prévient au bout d'un an pour réclamer vos 5 %." },
  { icon: "M12 4v11 M7 10l5 5 5-5 M5 20h14", title: "Import Excel et PDF", text: "Toutes vos factures en retard ajoutées d'un coup, sans tout retaper." },
  { icon: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2", title: "Résumé du lundi", text: "Chaque semaine : ce qui a été payé, ce qui reste en retard. Sans ouvrir le site." },
];

/** Comparaison avec les logiciels de recouvrement pour entreprises. */
const compare = [
  { label: "Prix", us: `Gratuit, puis ${BRAND.price} € HT / mois`, them: "De 130 à 700 € / mois, souvent sur devis" },
  { label: "Mise en route", us: "2 minutes, seul", them: "Démonstration commerciale, paramétrage" },
  { label: "Pour qui", us: "Artisans, indépendants, TPE", them: "PME avec un service comptable" },
  { label: "Engagement", us: "Aucun, résiliable en un clic", them: "Souvent annuel" },
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
      offers: [
        { "@type": "Offer", name: "Gratuit", price: "0", priceCurrency: "EUR", description: `Jusqu'à ${BRAND.freeInvoices} factures en cours` },
        { "@type": "Offer", name: "Pro", price: String(BRAND.price), priceCurrency: "EUR", description: "Factures illimitées, sans engagement" },
      ],
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
          <span><b>Offre fondateur</b> : {founderOffer()}<span className="fd-long"> pour les {BRAND.founder.seats} premiers clients</span></span>
          <span>{showSeatCounter(seats) ? `${seats} place${seats > 1 ? "s" : ""} restante${seats > 1 ? "s" : ""}` : "En profiter"} →</span>
        </Link>
      )}
      <nav className="lp-nav lp-wrap">
        <span className="lp-brand">{BRAND.name}<small className="lp-tagline">{BRAND.tagline}</small></span>
        <div className="lp-nav-links">
          <a href="#fonctionnalites" className="lp-hide-sm">Fonctionnalités</a>
          <a href="#tarif" className="lp-hide-sm">Tarif</a>
          <Link href="/outils" className="lp-hide-sm">Outils gratuits</Link>
          <Link href="/guides" className="lp-hide-sm">Guides</Link>
          <Link href="/login">Connexion</Link>
          <Link href={SIGNUP} className="lp-btn lp-btn-sm">Commencer</Link>
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
          <Link href={SIGNUP} className="lp-btn">Commencer gratuitement</Link>
          <Link href="/demo" className="lp-btn lp-btn-ghost">Voir une démo</Link>
        </div>
        <p className="lp-meta"><strong className="lp-meta-price">Gratuit jusqu&apos;à {BRAND.freeInvoices} factures</strong> · Pro {BRAND.price} € HT/mois · Sans carte bancaire</p>
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

      <section className="lp-section lp-wrap" id="fonctionnalites">
        <div className="lp-head">
          <h2>Tout ce qu&apos;il faut pour être payé</h2>
        </div>
        <div className="lp-feats">
          {features.map((f) => (
            <div key={f.title} className="lp-feat">
              <span className="lp-feat-ico" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-wrap">
        <div className="lp-head">
          <h2>Pourquoi {BRAND.name} ?</h2>
          <p className="lp-sub">Les logiciels de relance existent, mais ils sont faits pour les grandes entreprises. {BRAND.name} est fait pour vous.</p>
        </div>
        <div className="lp-compare" role="table" aria-label="Comparaison">
          <div className="lp-cmp-row lp-cmp-head" role="row">
            <span role="columnheader" />
            <span role="columnheader" className="lp-cmp-us">{BRAND.name}</span>
            <span role="columnheader">Logiciels pour entreprises</span>
          </div>
          {compare.map((c) => (
            <div key={c.label} className="lp-cmp-row" role="row">
              <span role="rowheader">{c.label}</span>
              <span role="cell" className="lp-cmp-us">✓ {c.us}</span>
              <span role="cell">{c.them}</span>
            </div>
          ))}
        </div>
        <ul className="lp-trust">
          <li>Vos données ne sont jamais revendues</li>
          <li>Support en français</li>
          <li>Sans engagement</li>
          <li>Gratuit pour commencer, sans carte bancaire</li>
        </ul>
      </section>

      <section className="lp-section lp-wrap" id="tarif">
        <div className="lp-head">
          <h2>Un prix simple.</h2>
        </div>
        <div className="lp-prices">
          <div className="lp-price">
            <div className="lp-price-top">
              <p className="lp-plan">Gratuit</p>
              <p className="lp-amount"><strong>0 €</strong><span>pour toujours</span></p>
            </div>
            <ul>
              <li>Jusqu&apos;à {BRAND.freeInvoices} factures en cours en même temps</li>
              <li>Relances automatiques J-3, J+1, J+7, J+15</li>
              <li>Facture PDF jointe et lien de paiement</li>
              <li>Sans carte bancaire</li>
            </ul>
            <Link href={SIGNUP} className="lp-btn lp-btn-ghost lp-btn-full">Commencer gratuitement</Link>
          </div>
          <div className="lp-price lp-price-pro">
            <div className="lp-price-top">
              <p className="lp-plan">Pro</p>
              <p className="lp-amount"><strong>{BRAND.price} €</strong><span>HT / mois</span></p>
            </div>
            <ul>
              <li>Factures et relances illimitées</li>
              <li>Import Excel, CSV et PDF</li>
              <li>Suivi des retenues de garantie</li>
              <li>Résumé chaque lundi</li>
              <li>Sans engagement</li>
            </ul>
            <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer gratuitement</Link>
          </div>
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
        <div className="lp-actions">
          <Link href={SIGNUP} className="lp-btn">Commencer gratuitement</Link>
          <Link href="/demo" className="lp-btn lp-btn-ghost">Voir une démo</Link>
        </div>
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
        <Link href={SIGNUP} className="lp-btn lp-btn-full">Commencer gratuitement</Link>
      </StickyCta>
    </div>
  );
}
