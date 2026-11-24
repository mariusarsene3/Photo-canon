import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CheckForm } from "./check-form";
import { Header, Footer } from "./site-chrome";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;

const FAQ = [
  {
    q: "Pourquoi ChatGPT est important pour un commerce ?",
    a: "De plus en plus de gens demandent directement à ChatGPT, Gemini ou à Google (avec ses réponses d'IA) « un bon fleuriste à côté de chez moi ». L'IA ne donne que 2 à 5 noms. Si vous n'en faites pas partie, le client ne vous voit pas.",
  },
  {
    q: "Vous garantissez que ChatGPT va me citer ?",
    a: "Non, et personne ne peut le garantir honnêtement : personne ne contrôle ChatGPT. Ce qu'on fait, c'est corriger tout ce sur quoi l'IA se base pour choisir (fiche Google, avis, annuaires, informations claires). On refait le test un mois après pour vous montrer le résultat, avant et après.",
  },
  {
    q: "Concrètement, vous faites quoi pour 149 € ?",
    a: "On met à jour votre fiche Google (catégories, horaires, photos, description), on crée ou corrige vos fiches sur les annuaires où l'IA cherche (Pages Jaunes et ceux repérés pendant le test), on vous donne un message tout prêt pour demander des avis à vos clients, et si vous n'avez pas de site, une page simple avec vos infos. C'est payé une fois, sans abonnement obligatoire.",
  },
  {
    q: "Et le suivi à 19 € par mois ?",
    a: "C'est facultatif. Chaque mois, on refait le test sur plusieurs questions de clients, on vous envoie un résumé (cité ou pas, à quelle place, qui sont vos concurrents) et on corrige ce qui a bougé. Sans engagement : vous arrêtez quand vous voulez.",
  },
  {
    q: "Je n'ai pas de site internet, ce n'est pas grave ?",
    a: "Non. Beaucoup de commerces de quartier n'en ont pas. L'essentiel, c'est une fiche Google complète et des avis. On peut aussi vous faire une page simple.",
  },
  {
    q: "Je dois m'y connaître en informatique ?",
    a: "Non. On fait le travail à votre place et on vous explique en mots simples, par téléphone ou sur place.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero wrap" id="test">
          <p className="eyebrow">Test gratuit · 1 minute · sans inscription</p>
          <h1>
            Vos clients demandent à l&apos;IA un bon commerçant.
            <br />
            <span className="accent">Est-ce qu&apos;elle vous recommande&nbsp;?</span>
          </h1>
          <p className="lead">
            On pose à ChatGPT la question qu&apos;un vrai client lui pose, avec une vraie recherche sur Internet. Vous voyez tout de suite
            s&apos;il vous cite, ou s&apos;il envoie vos clients chez vos concurrents.
          </p>
          <CheckForm />
          <Link href="/exemple" className="example-link">
            Voir un exemple de résultat →
          </Link>
        </section>

        <section className="band" id="comment">
          <div className="wrap">
            <h2>Comment ça marche</h2>
            <ol className="steps">
              <li>
                <span>1</span>
                <h3>Le test gratuit</h3>
                <p>En 1 minute, vous voyez si ChatGPT vous recommande, et qui il cite à votre place.</p>
              </li>
              <li>
                <span>2</span>
                <h3>L&apos;audit offert</h3>
                <p>On regarde ce qui vous manque : fiche Google, avis, annuaires où l&apos;IA va chercher. On vous l&apos;explique simplement.</p>
              </li>
              <li>
                <span>3</span>
                <h3>On corrige pour vous</h3>
                <p>On s&apos;occupe de tout. Vous n&apos;avez rien à faire de technique.</p>
              </li>
              <li>
                <span>4</span>
                <h3>On vous montre le résultat</h3>
                <p>Un mois après, on refait le test : vous voyez la différence, avant et après.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="wrap" id="tarifs">
          <h2>Des prix de petit commerce</h2>
          <div className="prices">
            <div className="price">
              <p className="p-name">Test</p>
              <p className="p-amount">0 €</p>
              <p>Est-ce que ChatGPT vous cite ? Qui cite-t-il à votre place ?</p>
              <a href="#test" className="btn ghost">
                Faire le test
              </a>
            </div>
            <div className="price main">
              <p className="p-badge">Recommandé</p>
              <p className="p-name">Audit + mise en place</p>
              <p className="p-amount">
                {BRAND.offer.setup} €<small> une fois</small>
              </p>
              <ul className="checks">
                <li>Audit offert, sans engagement</li>
                <li>Fiche Google complète et optimisée</li>
                <li>Inscription sur les annuaires où l&apos;IA cherche</li>
                <li>Message prêt à envoyer pour obtenir des avis</li>
                <li>Nouveau test un mois après</li>
              </ul>
              <a href="#test" className="btn">
                Commencer par le test
              </a>
            </div>
            <div className="price">
              <p className="p-name">Suivi</p>
              <p className="p-amount">
                {BRAND.offer.followUp} €<small> / mois</small>
              </p>
              <p>Un test chaque mois sur plusieurs questions de clients, un résumé clair et les corrections. Sans engagement.</p>
              <p className="fine">En option, après la mise en place.</p>
            </div>
          </div>
          <p className="fine center">Vous ne payez rien avant l&apos;audit, et seulement si vous êtes d&apos;accord.</p>
        </section>

        <section className="band">
          <div className="wrap why">
            <h2>Pourquoi nous plutôt qu&apos;un logiciel ?</h2>
            <div className="why-grid">
              <div>
                <h3>On fait le travail</h3>
                <p>Les logiciels vous montrent un score, puis c&apos;est à vous de tout corriger. Nous, on corrige à votre place.</p>
              </div>
              <div>
                <h3>Pas d&apos;abonnement obligatoire</h3>
                <p>Vous payez la mise en place une fois. Le suivi est en option, sans engagement.</p>
              </div>
              <div>
                <h3>Honnêtes sur les résultats</h3>
                <p>Personne ne contrôle ChatGPT. On ne vous promet pas la 1re place : on vous montre l&apos;avant et l&apos;après.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap faq">
          <h2>Questions fréquentes</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section className="wrap final">
          <h2>Faites le test maintenant</h2>
          <p>C&apos;est gratuit, sans inscription, et ça prend une minute.</p>
          <a href="#test" className="btn">
            Est-ce que ChatGPT me recommande ?
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
