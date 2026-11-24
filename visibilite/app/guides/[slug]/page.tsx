import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { siteUrl } from "@/lib/site";
import { Header, Footer } from "../../site-chrome";
import { GuideLinks } from "../../blocks";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return { title: `${g.title} — ${BRAND.name}`, description: g.description, alternates: { canonical: `/guides/${g.slug}` } };
}

const dateFr = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.date,
    author: { "@type": "Organization", name: BRAND.name, url: siteUrl() },
  };
  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <article className="wrap narrow article">
          <p className="crumb">
            <Link href="/">Accueil</Link> › <Link href="/guides">Guides</Link>
          </p>
          <h1>{g.title}</h1>
          <p className="lead">{g.description}</p>
          <p className="fine">Mis à jour le {dateFr(g.date)}</p>
          {g.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.list && (
                <ul className="list big">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <div className="cta-box">
            <h2>Et votre commerce, ChatGPT le cite ?</h2>
            <p>Faites le test gratuit : une minute, sans inscription.</p>
            <Link href="/#test" className="btn">
              Faire le test
            </Link>
          </div>
        </article>
        <GuideLinks exclude={g.slug} />
      </main>
      <Footer />
    </>
  );
}
