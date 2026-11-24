import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CheckForm } from "./check-form";
import { Header, Footer } from "./site-chrome";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;

const STEPS = [
  { t: "Le test gratuit", d: "En 1 minute, vous voyez si ChatGPT vous recommande, et qui il cite à votre place." },
  { t: "L'audit offert", d: "On regarde ce qui vous manque : fiche Google, avis, annuaires où l'IA va chercher." },
  { t: "On corrige pour vous", d: "On s'occupe de tout. Vous n'avez rien de technique à faire." },
  { t: "On vous montre le résultat", d: "Un mois après, on refait le test devant vous : l'avant et l'après." },
];

const COMPARE = [
  { label: "Qui fait le travail ?", us: "Nous, à votre place", soft: "Vous, à partir d'un score", agency: "L'agence" },
  { label: "Prix", us: `${BRAND.offer.setup} € une fois`, soft: "souvent 59 à 199 €/mois", agency: "souvent 100 €/mois et plus + mise en place" },
  { label: "Abonnement obligatoire", us: "Non", soft: "Oui", agency: "Souvent" },
  { label: "Pensé pour", us: "Petits commerces et artisans", soft: "Marques et PME", agency: "PME" },
  { label: "On se voit", us: "Téléphone ou sur place", soft: "Non", agency: "Rarement" },
];

const FAQ = [
  {
    q: "Pourquoi ChatGPT est important pour un commerce ?",
    a: "De plus en plus de gens demandent directement à ChatGPT, à Gemini ou à Google (avec ses réponses d'IA) « un bon fleuriste à côté de chez moi ». L'IA ne donne que quelques noms. Si vous n'en faites pas partie, le client ne vous voit pas.",
  },
  {
    q: "Vous garantissez que ChatGPT va me citer ?",
    a: "Non, et personne ne peut le garantir honnêtement : personne ne contrôle ChatGPT. On corrige tout ce sur quoi l'IA se base pour choisir (fiche Google, avis, annuaires, informations claires), puis on refait le test un mois après pour vous montrer l'avant et l'après.",
  },
  {
    q: `Concrètement, vous faites quoi pour ${BRAND.offer.setup} € ?`,
    a: "On complète votre fiche Google (catégories, horaires, photos, description), on crée ou corrige vos fiches sur les annuaires où l'IA cherche (Pages Jaunes, Bing, Apple Plans et ceux repérés pendant le test), on vous prépare un message tout prêt pour demander des avis à vos clients, et on refait le test un mois après. Payé une fois, sans abonnement obligatoire.",
  },
  {
    q: `Et le suivi à ${BRAND.offer.followUp} € par mois ?`,
    a: "C'est facultatif. Chaque mois, on refait le test sur plusieurs questions de clients, on vous envoie un résumé (cité ou pas, à quelle place, qui sont vos concurrents) et on corrige ce qui a bougé. Sans engagement.",
  },
  {
    q: "Je n'ai pas de site internet, ce n'est pas grave ?",
    a: "Non. Beaucoup de commerces de quartier n'en ont pas. L'essentiel, c'est une fiche Google complète et des avis.",
  },
  {
    q: "Je dois m'y connaître en informatique ?",
    a: "Non. On fait le travail à votre place et on vous explique en mots simples, par téléphone ou sur place.",
  },
];

/** Aperçu illustratif d'une conversation (noms fictifs). */
function ChatPreview() {
  return (
    <figure className="chat" aria-label="Exemple de réponse de ChatGPT">
      <div className="chat-bar">
        <b>Ce que voit votre client</b>
        <span className="tag">Exemple</span>
      </div>
      <div className="chat-body">
        <div className="bubble-user">Je cherche un fleuriste à Mortagne. Lesquels me conseilles-tu&nbsp;?</div>
        <div className="bubble-ai">
          Voici les fleuristes que je te conseille :
          <ol>
            <li>
              <b>Atelier Pivoine</b> : très bien noté, livraison le jour même
            </li>
            <li>
              <b>La Petite Serre</b> : ouvert le dimanche matin
            </li>
          </ol>
        </div>
        <div className="chat-verdict">
          <span className="dot">!</span>
          <div>
            <strong>Votre boutique n&apos;est pas citée</strong>
            <span>Le client part chez vos concurrents sans vous connaître.</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero" id="test">
          <div className="wrap hero-grid">
            <div>
              <span className="pill">
                <i /> Test gratuit avec le vrai ChatGPT
              </span>
              <h1>
                Vos clients demandent à l&apos;IA. <span className="accent">Est-ce qu&apos;elle vous recommande&nbsp;?</span>
              </h1>
              <p className="lead">
                On pose à ChatGPT la question d&apos;un vrai client, avec une vraie recherche sur Internet. Vous voyez tout de suite s&apos;il vous
                cite, ou s&apos;il envoie vos clients chez vos concurrents.
              </p>
              <CheckForm />
              <Link href="/exemple" className="example-link">
                Voir un exemple de résultat →
              </Link>
            </div>
            <ChatPreview />
          </div>
          <div className="wrap">
            <ul className="trust">
              <li>Audit offert, sans engagement</li>
              <li>Vous ne payez qu&apos;après l&apos;audit, si vous êtes d&apos;accord</li>
              <li>Aucune promesse impossible</li>
            </ul>
          </div>
        </section>

        <section className="block soft" id="comment">
          <div className="wrap">
            <div className="head">
              <p className="kicker">Comment ça marche</p>
              <h2>Du test au résultat, en 4 étapes.</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <span className="n">{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className="head">
              <p className="kicker">Pourquoi {BRAND.name}</p>
              <h2>On fait le travail, pas juste un score.</h2>
              <p className="sub">
                Les logiciels vous montrent un tableau de bord, puis c&apos;est à vous de tout corriger. Nous, on s&apos;en occupe, à un prix de
                petit commerce.
              </p>
            </div>
            <div className="compare" role="table" aria-label="Comparaison">
              <div className="cmp-row" role="row">
                <span role="columnheader" />
                <span role="columnheader" className="cmp-us">
                  {BRAND.name}
                </span>
                <span role="columnheader">Logiciels</span>
                <span role="columnheader">Agences</span>
              </div>
              {COMPARE.map((c) => (
                <div className="cmp-row" role="row" key={c.label}>
                  <span role="cell">{c.label}</span>
                  <span role="cell" className="cmp-us">
                    {c.us}
                  </span>
                  <span role="cell">{c.soft}</span>
                  <span role="cell">{c.agency}</span>
                </div>
              ))}
            </div>
            <p className="cmp-note">Prix constatés en novembre 2026 sur des offres françaises publiques ; ils varient selon les prestataires.</p>
          </div>
        </section>

        <section className="block soft" id="tarifs">
          <div className="wrap">
            <div className="head">
              <p className="kicker">Tarifs</p>
              <h2>Des prix de petit commerce.</h2>
            </div>
            <div className="prices">
              <div className="price">
                <p className="p-name">Test</p>
                <p className="p-amount">0 €</p>
                <p className="p-desc">Est-ce que ChatGPT vous cite ? Qui cite-t-il à votre place ?</p>
                <ul className="checks">
                  <li>Résultat en 1 minute</li>
                  <li>Sans inscription</li>
                </ul>
                <a href="#test" className="btn ghost">
                  Faire le test
                </a>
              </div>
              <div className="price main">
                <div className="p-top">
                  <p className="p-name">Audit + mise en place</p>
                  <span className="p-badge">Recommandé</span>
                </div>
                <p className="p-amount">
                  {BRAND.offer.setup} €<small>une fois</small>
                </p>
                <p className="p-desc">On corrige tout ce sur quoi l&apos;IA se base.</p>
                <ul className="checks">
                  <li>Audit offert, sans engagement</li>
                  <li>Fiche Google complète</li>
                  <li>Annuaires où l&apos;IA cherche</li>
                  <li>Message prêt pour obtenir des avis</li>
                  <li>Nouveau test un mois après</li>
                </ul>
                <a href="#test" className="btn">
                  Commencer par le test
                </a>
              </div>
              <div className="price">
                <p className="p-name">Suivi</p>
                <p className="p-amount">
                  {BRAND.offer.followUp} €<small>/ mois</small>
                </p>
                <p className="p-desc">En option, après la mise en place.</p>
                <ul className="checks">
                  <li>Un test chaque mois sur plusieurs questions</li>
                  <li>Un résumé clair</li>
                  <li>Les corrections au fil de l&apos;eau</li>
                  <li>Sans engagement</li>
                </ul>
              </div>
            </div>
            <p className="price-note">Vous ne payez rien avant l&apos;audit, et seulement si vous êtes d&apos;accord.</p>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className="head">
              <p className="kicker">Questions fréquentes</p>
              <h2>Ce qu&apos;on nous demande.</h2>
            </div>
            <div className="faq-list">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="block soft final">
          <div className="wrap">
            <h2>Et vous, l&apos;IA vous recommande&nbsp;?</h2>
            <p className="sub">C&apos;est gratuit, sans inscription, et ça prend une minute.</p>
            <a href="#test" className="btn">
              Faire le test gratuit
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
