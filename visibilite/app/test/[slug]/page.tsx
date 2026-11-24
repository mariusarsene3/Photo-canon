import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { METIERS, metierBySlug } from "@/lib/metiers";
import { CheckForm } from "../../check-form";
import { Header, Footer } from "../../site-chrome";
import { Note, Services, GuideLinks } from "../../blocks";

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
        <section className="hero" id="test">
          <div className="wrap hero-grid">
            <div>
              <p className="crumb">
                <Link href="/">Accueil</Link> › Test pour les {m.plural}
              </p>
              <h1>
                Est-ce que ChatGPT recommande <em>votre {m.name}</em>&nbsp;?
              </h1>
              <p className="lead">{m.intro}</p>
              <CheckForm defaultTrade={m.article} />
              <p className="hero-note">Gratuit, sans inscription, résultat en une minute.</p>
            </div>
            <Note question={m.question} names={m.examples} />
          </div>
        </section>

        <section className="block paper">
          <div className="wrap narrow">
            <h2>Pour les {m.plural}, ce qui compte</h2>
            <div className="prose">
              <p>Quand on lui demande conseil, l&apos;IA va souvent chercher ses informations sur : {m.sources.join(", ")}.</p>
              <p>Trois conseils simples pour mettre toutes les chances de votre côté :</p>
            </div>
            <ul className="list big">
              {m.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="prose-note">
              Et si vous préférez que je m&apos;en occupe : <Link href="/contact">parlons-en</Link>.
            </p>
          </div>
        </section>

        <Services />
        <GuideLinks />
      </main>
      <Footer />
    </>
  );
}
