import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SERVICES } from "@/lib/services";
import { GUIDES } from "@/lib/guides";
import { CheckForm } from "./check-form";

/** Le haut de page jaune : la question, le test, les 3 étapes. */
export function TestHero({ title, lead, defaultTrade, crumb }: { title: React.ReactNode; lead: string; defaultTrade?: string; crumb?: React.ReactNode }) {
  return (
    <section className="hero" id="test">
      <div className="wrap">
        {crumb && <p className="crumb">{crumb}</p>}
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <CheckForm defaultTrade={defaultTrade} />
        <ol className="how">
          <li>
            <b>1</b>Vous faites le test
          </li>
          <li>
            <b>2</b>Vous voyez qui ChatGPT recommande
          </li>
          <li>
            <b>3</b>Pas cité ? Je m&apos;en occupe
          </li>
        </ol>
      </div>
    </section>
  );
}

export function Offers() {
  return (
    <section className="block" id="offres">
      <div className="wrap">
        <h2>Pas cité ? Je m&apos;en occupe.</h2>
        <p className="sub">Je travaille avec des commerçants {BRAND.area}. Vous ne payez rien avant qu&apos;on en ait parlé.</p>
        <div className="offers">
          {SERVICES.map((s) => {
            const star = "star" in s && s.star;
            return (
              <div className={`offer${star ? " star" : ""}`} key={s.id}>
                {star && <span className="badge">Le plus complet</span>}
                <h3>{s.name}</h3>
                <p className="price">
                  {s.price} <small>{s.unit}</small>
                </p>
                <p className="desc">{s.desc}</p>
                <ul className="ticks">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <Link href={`/contact?service=${s.id}`} className={`btn${star ? "" : " alt"}`}>
                  Ça m&apos;intéresse
                </Link>
              </div>
            );
          })}
        </div>
        <div className="test-band">
          <span>Pas sûr ? Faites d&apos;abord le test gratuit : est-ce que ChatGPT vous recommande ?</span>
          <a href="#test" className="btn">
            Faire le test
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="block soft">
      <div className="wrap narrow">
        <h2>Vos questions</h2>
        <div className="faq-list">
          {items.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuideLinks({ exclude, asPage }: { exclude?: string; asPage?: boolean }) {
  return (
    <section className="block">
      <div className="wrap narrow">
        {asPage ? <h1 className="page-title">Guides pratiques</h1> : <h2>Guides pratiques</h2>}
        <ul className="guide-list">
          {GUIDES.filter((g) => g.slug !== exclude).map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`}>{g.title}</Link>
              <p>{g.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
