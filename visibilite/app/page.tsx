import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import { CheckForm } from "./check-form";
import { Header, Footer } from "./site-chrome";
import { Note, Services, MetierLinks, GuideLinks } from "./blocks";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;

const STEPS = [
  { t: "Vous faites le test", d: "Une minute, ici même. Vous voyez si ChatGPT vous cite, ou qui il cite à votre place." },
  { t: "On en parle", d: "Gratuitement, au téléphone ou en visio. Je regarde votre fiche Google, vos avis, votre site et vos réseaux, et je vous dis ce qui manque." },
  { t: "Je m'occupe de tout", d: "Si vous êtes d'accord. Vous n'avez rien de technique à faire." },
  { t: "On regarde le résultat", d: "Un mois plus tard, on refait le test ensemble. Avant, après." },
];

const FAQ = [
  {
    q: "Pourquoi ChatGPT, ça compte pour un commerce ?",
    a: "Parce que de plus en plus de gens lui demandent directement « un bon fleuriste près de chez moi », au lieu de chercher sur Google. Et Google lui-même affiche maintenant des réponses écrites par une IA. Dans ces réponses, il n'y a que quelques noms. Si le vôtre n'y est pas, le client ne vous voit pas.",
  },
  {
    q: "Vous me garantissez d'être cité ?",
    a: "Non. Personne ne contrôle ChatGPT, et je préfère vous le dire. Je remets en ordre tout ce sur quoi il se base pour choisir, puis on refait le test un mois après, et vous jugez vous-même.",
  },
  {
    q: "Vous êtes où ? Vous pouvez travailler avec moi à distance ?",
    a: "Oui. Je travaille avec des commerçants partout en France, par téléphone et en visio. Tout se fait en ligne : vous n'avez pas besoin de me recevoir.",
  },
  {
    q: `Pour ${BRAND.offer.setup} €, vous faites quoi exactement ?`,
    a: "Je complète votre fiche Google (catégories, horaires, photos, description), je crée ou corrige vos fiches sur Pages Jaunes, Bing, Apple Plans et les sites repérés pendant le test. Je vous prépare un petit message pour demander des avis à vos clients. Et je refais le test un mois après. Vous payez une fois.",
  },
  {
    q: `Le site à ${BRAND.offer.website} €, c'est quoi ?`,
    a: "Un site vitrine simple de 1 à 3 pages : ce que vous faites, vos horaires, votre adresse, vos photos, un moyen de vous contacter. Parfait sur téléphone, relié à votre fiche Google. On écrit les textes ensemble. L'hébergement et le nom de domaine sont à prévoir en plus (quelques euros par mois), je vous explique tout avant.",
  },
  {
    q: `Et les réseaux sociaux à ${BRAND.offer.social} € par mois ?`,
    a: `Je prépare ${BRAND.offer.socialPosts} publications par mois pour Facebook et Instagram (textes et visuels), à partir de vos photos et de vos actualités. Vous validez avant publication. Sans engagement : vous arrêtez quand vous voulez. Je ne m'occupe que de ${BRAND.offer.socialSeats} commerces à la fois, pour bien le faire.`,
  },
  {
    q: "Je ne suis pas à l'aise avec l'informatique.",
    a: "C'est justement pour ça que je le fais à votre place. Je vous explique tout avec des mots simples.",
  },
];

// Données structurées pour Google (entreprise + FAQ).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: BRAND.name,
      url: siteUrl(),
      email: BRAND.contactEmail,
      areaServed: "FR",
      description: "Visibilité sur Google et dans ChatGPT, création de site vitrine et réseaux sociaux pour les commerçants et artisans.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="hero" id="test">
          <div className="wrap hero-grid">
            <div>
              <h1>
                Quand vos clients demandent à ChatGPT, est-ce qu&apos;il parle <em>de vous</em>&nbsp;?
              </h1>
              <p className="lead">
                Je travaille avec des commerçants {BRAND.area}. Je regarde ce que l&apos;IA répond quand quelqu&apos;un cherche un commerce comme
                le vôtre, et je corrige ce qui manque. Sans jargon.
              </p>
              <CheckForm />
              <p className="hero-note">
                Gratuit, sans inscription. <Link href="/exemple">Voir un exemple de résultat</Link>
              </p>
            </div>
            <Note question="Je cherche un fleuriste à Mortagne, lesquels me conseilles-tu ?" />
          </div>
        </section>

        <section className="block paper" id="comment">
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

        <Services />

        <section className="block paper">
          <div className="wrap narrow">
            <h2>Pourquoi je fais ça</h2>
            <div className="prose">
              <p>
                J&apos;ai fait le test pour un commerce de ma famille. ChatGPT répondait qu&apos;il n&apos;y avait <em>aucun</em> fleuriste dans
                son village, et envoyait tout le monde chez les deux concurrents de la ville d&apos;à côté.
              </p>
              <p>
                Ce n&apos;était pas une question de qualité. Les concurrents avaient simplement une fiche Google bien remplie, des avis, un site,
                et une présence sur les annuaires. Tout ça, ça se corrige.
              </p>
              <p>
                Il existe des logiciels pour ça, mais ils sont pensés pour les grandes marques, coûtent souvent plus de 100 € par mois, et vous
                laissent tout faire vous-même. Moi, je m&apos;en occupe, et je vous explique.
              </p>
            </div>
          </div>
        </section>

        <MetierLinks />
        <GuideLinks />

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
            <p className="sub center">Ou parlez-moi directement de votre projet.</p>
            <div className="final-actions">
              <a href="#test" className="btn">
                Faire le test gratuit
              </a>
              <Link href="/contact" className="btn ghost">
                Me contacter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
