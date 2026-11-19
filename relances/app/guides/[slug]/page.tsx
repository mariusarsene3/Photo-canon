import "../../landing.css";
import "../../outils/tools.css";
import "../guides.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { GUIDES, guideBySlug, type Block } from "@/lib/guides";
import { siteUrl } from "@/lib/payment";
import { ProductCta, SiteFooter, SiteNav } from "../../site-chrome";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: { absolute: g.seoTitle },
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", title: g.seoTitle, description: g.description, modifiedTime: g.updated },
  };
}

function Render({ b }: { b: Block }) {
  if ("h" in b) return <h2>{b.h}</h2>;
  if ("p" in b) return <p>{b.p}</p>;
  if ("list" in b) return <ul>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>;
  if ("steps" in b)
    return (
      <ol className="guide-steps">
        {b.steps.map((s) => <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>)}
      </ol>
    );
  if ("tip" in b) return <p className="guide-tip"><b>Bon à savoir : </b>{b.tip}</p>;
  return (
    <Link href={b.tool.href} className="guide-tool">
      <span><small>Outil gratuit</small>{b.tool.label}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const others = GUIDES.filter((o) => o.slug !== g.slug);
  const updated = new Date(g.updated + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    inLanguage: "fr-FR",
    mainEntityOfPage: `${siteUrl()}/guides/${g.slug}`,
    publisher: { "@type": "Organization", name: BRAND.name, url: siteUrl() },
  };
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page">
        <article className="guide">
          <p className="tool-crumbs"><Link href="/guides">Guides</Link> / {g.title.split(" :")[0].split(" (")[0]}</p>
          <h1>{g.title}</h1>
          <p className="tool-intro">{g.intro}</p>
          <p className="guide-meta">Mis à jour le {updated} · {g.readMinutes} min de lecture</p>
          <div className="guide-body">
            {g.blocks.map((b, i) => <Render key={i} b={b} />)}
          </div>
          <p className="guide-disclaimer">Ce guide donne une information générale ; il ne remplace pas le conseil d&apos;un professionnel du droit pour une situation particulière.</p>
        </article>
        <ProductCta />
        <section className="guide-more">
          <h2>À lire aussi</h2>
          <div className="tool-list">
            {others.map((o) => (
              <Link key={o.slug} href={`/guides/${o.slug}`} className="tool-card">
                <h2>{o.title}</h2>
                <span>Lire le guide →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
