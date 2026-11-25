import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { METIERS, metierBySlug } from "@/lib/metiers";
import { Header, Footer } from "../../site-chrome";
import { TestHero, Offers, Faq } from "../../blocks";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/seo";

export const maxDuration = 120;
export const dynamicParams = false;
export const generateStaticParams = () => METIERS.map((m) => ({ slug: m.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = metierBySlug((await params).slug);
  if (!m) return {};
  return {
    title: `Est-ce que ChatGPT recommande votre ${m.name} ? Test gratuit`,
    description: `Vérifiez gratuitement si ChatGPT cite votre ${m.name} quand un client lui demande conseil, et qui il recommande à votre place.`,
    alternates: { canonical: `/test/${m.slug}` },
  };
}

export default async function MetierPage({ params }: Props) {
  const m = metierBySlug((await params).slug);
  if (!m) notFound();
  const faq = [
    {
      q: `Comment savoir si ChatGPT recommande mon ${m.name} ?`,
      a: `Faites le test gratuit en haut de cette page : on pose à ChatGPT la question d'un vrai client, avec une recherche sur Internet, et vous voyez tout de suite s'il cite votre ${m.name} ou qui il recommande à votre place.`,
    },
    {
      q: `Pourquoi ChatGPT cite d'autres ${m.plural} et pas le mien ?`,
      a: `L'IA cite les commerces sur lesquels elle trouve des informations claires et rassurantes, souvent sur ${m.sources.slice(0, 3).join(", ")}. Si votre fiche est incomplète, ou si vous avez peu d'avis, elle a moins de raisons de vous citer.`,
    },
    {
      q: "Combien de temps pour être cité ?",
      a: "Il faut en général compter plusieurs semaines après les corrections, le temps que les sites soient mis à jour et relus. Personne ne peut garantir une place : c'est pour ça qu'on refait le test un mois après, pour voir la différence.",
    },
  ];
  return (
    <>
      <Header />
      <main>
        <JsonLd data={breadcrumbLd([{ name: "Accueil", path: "/" }, { name: `Test pour les ${m.plural}`, path: `/test/${m.slug}` }])} />
        <JsonLd data={faqLd(faq)} />
        <TestHero
          crumb={
            <>
              <Link href="/">Accueil</Link> › Test pour les {m.plural}
            </>
          }
          title={<>Est-ce que ChatGPT recommande votre {m.name}&nbsp;?</>}
          lead={m.intro}
          defaultTrade={m.article}
        />
        <section className="block soft">
          <div className="wrap narrow">
            <h2>Pour les {m.plural}, ce qui compte</h2>
            <p className="text">
              Une question typique de client : <em>« {m.question} »</em>
            </p>
            <p className="text">Pour y répondre, l&apos;IA va souvent chercher ses informations sur : {m.sources.join(", ")}.</p>
            <p className="text">Trois conseils simples :</p>
            <ul className="ticks big">
              {m.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
        <Offers />
        <Faq items={faq} />
      </main>
      <Footer />
    </>
  );
}
