import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { METIERS, metierBySlug } from "@/lib/metiers";
import { Header, Footer } from "../../site-chrome";
import { TestHero, Offers } from "../../blocks";

export const maxDuration = 120;
export const dynamicParams = false;
export const generateStaticParams = () => METIERS.map((m) => ({ slug: m.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = metierBySlug((await params).slug);
  if (!m) return {};
  return {
    title: `Est-ce que ChatGPT recommande votre ${m.name} ? Test gratuit — ${BRAND.name}`,
    description: `Vérifiez gratuitement si ChatGPT cite votre ${m.name} quand un client lui demande conseil, et qui il recommande à votre place.`,
    alternates: { canonical: `/test/${m.slug}` },
  };
}

export default async function MetierPage({ params }: Props) {
  const m = metierBySlug((await params).slug);
  if (!m) notFound();
  return (
    <>
      <Header />
      <main>
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
      </main>
      <Footer />
    </>
  );
}
