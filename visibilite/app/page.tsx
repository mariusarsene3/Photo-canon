import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import { Header, Footer } from "./site-chrome";
import { TestHero, Offers, Faq } from "./blocks";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;
export const metadata = { alternates: { canonical: "/" } };

const FAQ = [
  {
    q: "Pourquoi ChatGPT, ça compte pour un commerce ?",
    a: "Parce que de plus en plus de gens lui demandent directement « un bon fleuriste près de chez moi », au lieu de chercher sur Google. Et Google affiche maintenant lui aussi des réponses écrites par une IA. Dans ces réponses, il n'y a que quelques noms. Si le vôtre n'y est pas, le client ne vous voit pas.",
  },
  {
    q: "Vous me garantissez d'être cité ?",
    a: "Non. Personne ne contrôle ChatGPT, et je préfère vous le dire. Je remets en ordre tout ce sur quoi il se base pour choisir (fiche Google, avis, annuaires, site), puis on refait le test un mois après, et vous jugez vous-même.",
  },
  {
    q: "Vous travaillez où ?",
    a: "Partout en France, par téléphone et en visio. Tout se fait en ligne : vous n'avez pas besoin de me recevoir.",
  },
  {
    q: "Comment ça se passe, concrètement ?",
    a: "Vous me laissez vos coordonnées, je vous appelle (c'est gratuit), on regarde ensemble ce qui manque, et je vous dis exactement ce que je ferais et pour combien. Vous ne payez que si vous êtes d'accord.",
  },
  {
    q: "Et le site, l'hébergement ?",
    a: "Le site est simple et clair (1 à 3 pages), parfait sur téléphone et relié à votre fiche Google. Je vous explique avant tout ce qu'il faut pour le nom de domaine et l'hébergement, pour qu'il n'y ait aucune surprise.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: BRAND.name,
      url: siteUrl(),
      email: BRAND.contactEmail,
      areaServed: "FR",
      description: "Test gratuit : est-ce que ChatGPT recommande votre commerce ? Puis visibilité Google et IA, site vitrine et réseaux sociaux pour les commerçants.",
    },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <TestHero
          title={<>Est-ce que ChatGPT recommande votre commerce&nbsp;?</>}
          lead="Vos clients lui demandent conseil. Faites le test : en 1 minute, vous voyez s'il vous cite… ou s'il envoie tout le monde chez vos concurrents."
        />
        <Offers />
        <Faq items={FAQ} />
      </main>
      <Footer />
    </>
  );
}
