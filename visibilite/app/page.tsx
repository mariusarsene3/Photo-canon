import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CheckForm } from "./check-form";
import { Header, Footer } from "./site-chrome";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;

const STEPS = [
  { t: "Vous faites le test", d: "Une minute, ici même. Vous voyez si ChatGPT vous cite, ou qui il cite à votre place." },
  { t: "Je fais l'audit", d: "Gratuitement. Je regarde votre fiche Google, vos avis et les annuaires où l'IA va chercher, puis je vous explique ce qui manque." },
  { t: "Je corrige pour vous", d: "Si vous êtes d'accord. Vous n'avez rien de technique à faire." },
  { t: "On refait le test ensemble", d: "Un mois plus tard, pour voir la différence. Avant, après." },
];

const FAQ = [
  {
    q: "Pourquoi ChatGPT, ça compte pour un commerce ?",
    a: "Parce que de plus en plus de gens lui demandent directement « un bon fleuriste près de chez moi », au lieu de chercher sur Google. Et Google lui-même affiche maintenant des réponses écrites par une IA. Dans ces réponses, il n'y a que deux ou trois noms. Si le vôtre n'y est pas, le client ne vous voit pas.",
  },
  {
    q: "Vous me garantissez d'être cité ?",
    a: "Non. Personne ne contrôle ChatGPT, et je préfère vous le dire. Ce que je fais, c'est remettre en ordre tout ce sur quoi il se base pour choisir. Puis on refait le test un mois après, et vous jugez vous-même.",
  },
  {
    q: `Pour ${BRAND.offer.setup} €, vous faites quoi exactement ?`,
    a: "Je complète votre fiche Google (catégories, horaires, photos, description), je crée ou corrige vos fiches sur Pages Jaunes, Bing, Apple Plans et les sites repérés pendant le test. Je vous prépare un petit message pour demander des avis à vos clients. Et je refais le test un mois après. Vous payez une fois.",
  },
  {
    q: `Et le suivi à ${BRAND.offer.followUp} € par mois ?`,
    a: "C'est en option. Chaque mois, je refais le test sur plusieurs questions de clients, je vous envoie un petit résumé, et je corrige ce qui a bougé. Vous arrêtez quand vous voulez.",
  },
  {
    q: "Je n'ai pas de site internet.",
    a: "Ce n'est pas un problème. Beaucoup de commerces n'en ont pas. Le plus important, c'est la fiche Google et les avis.",
  },
  {
    q: "Je ne suis pas à l'aise avec l'informatique.",
    a: "C'est justement pour ça que je le fais à votre place. Je vous explique tout avec des mots simples, au téléphone ou en passant vous voir.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero" id="test">
          <div className="wrap hero-grid">
            <div>
              <h1>
                Quand vos clients demandent à ChatGPT, est-ce qu&apos;il parle <em>de vous</em>&nbsp;?
              </h1>
              <p className="lead">
                Je travaille avec les commerces {BRAND.region}. Je regarde ce que l&apos;IA répond quand quelqu&apos;un cherche un commerce
                comme le vôtre, et je corrige ce qui manque. Sans jargon.
              </p>
              <CheckForm />
              <p className="hero-note">
                Gratuit, sans inscription. <Link href="/exemple">Voir un exemple de résultat</Link>
              </p>
            </div>

            <figure className="note" aria-label="Exemple de réponse de ChatGPT, avec des noms inventés">
              <p className="note-label">Exemple · noms inventés</p>
              <p className="note-q">« Je cherche un fleuriste à Mortagne, lesquels me conseilles-tu ? »</p>
              <p className="note-a">Voici les fleuristes que je te conseille :</p>
              <ol>
                <li>Atelier Pivoine</li>
                <li>La Petite Serre</li>
              </ol>
              <p className="note-miss">
                <span>Et votre boutique ?</span> Pas un mot. Le client ne saura jamais que vous existez.
              </p>
            </figure>
          </div>
        </section>

        <section className="block" id="comment">
          <div className="wrap narrow">
            <h2>Comment je travaille</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <span className="n">{i + 1}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="block paper">
          <div className="wrap narrow">
            <h2>Pourquoi je fais ça</h2>
            <div className="prose">
              <p>
                J&apos;ai fait le test pour un commerce de ma famille. ChatGPT répondait qu&apos;il n&apos;y avait <em>aucun</em> fleuriste dans
                son village, et envoyait tout le monde chez les deux concurrents de la ville d&apos;à côté.
              </p>
              <p>
                Ce n&apos;était pas une question de qualité. Les concurrents avaient simplement une fiche Google bien remplie, des avis, et une
                présence sur les annuaires. Tout ça, ça se corrige.
              </p>
              <p>
                Il existe des logiciels pour ça, mais ils sont pensés pour les grandes marques, coûtent souvent plus de 100 € par mois, et vous
                laissent tout faire vous-même. Moi, je viens vous voir et je m&apos;en occupe.
              </p>
            </div>
          </div>
        </section>

        <section className="block" id="tarifs">
          <div className="wrap">
            <h2 className="center">Les tarifs</h2>
            <p className="sub center">Vous ne payez rien avant l&apos;audit, et seulement si vous êtes d&apos;accord.</p>
            <div className="prices">
              <div className="price">
                <h3>Le test</h3>
                <p className="p-amount">Gratuit</p>
                <p>Est-ce que ChatGPT vous cite, et qui cite-t-il à votre place ?</p>
                <a href="#test" className="btn ghost">
                  Faire le test
                </a>
              </div>
              <div className="price main">
                <h3>Audit et mise en place</h3>
                <p className="p-amount">
                  {BRAND.offer.setup} €<small> une fois</small>
                </p>
                <ul className="list">
                  <li>L&apos;audit, offert</li>
                  <li>Votre fiche Google complète</li>
                  <li>Vos fiches d&apos;annuaires corrigées</li>
                  <li>Un message tout prêt pour demander des avis</li>
                  <li>Un nouveau test un mois après</li>
                </ul>
                <a href="#test" className="btn">
                  Commencer par le test
                </a>
              </div>
              <div className="price">
                <h3>Le suivi</h3>
                <p className="p-amount">
                  {BRAND.offer.followUp} €<small> par mois</small>
                </p>
                <p>En option. Un test chaque mois, un petit résumé, et les corrections. Sans engagement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="block paper">
          <div className="wrap narrow">
            <h2>Vos questions</h2>
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

        <section className="block final">
          <div className="wrap narrow center">
            <h2>Une minute pour savoir.</h2>
            <p className="sub center">Et si vous préférez en parler, écrivez-moi : {BRAND.contactEmail}</p>
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
