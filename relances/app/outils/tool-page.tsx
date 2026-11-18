import "../landing.css";
import "./tools.css";
import Link from "next/link";
import { RelancesCta, SiteFooter, SiteNav } from "../site-chrome";

/** Mise en page commune des outils gratuits. */
export function ToolPage({
  kicker, title, intro, children, tips,
}: {
  kicker: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  tips: { q: string; a: string }[];
}) {
  return (
    <div className="lp">
      <SiteNav />
      <main className="lp-wrap tool-page">
        <p className="tool-crumbs"><Link href="/outils">Outils gratuits</Link> / {kicker}</p>
        <h1>{title}</h1>
        <p className="tool-intro">{intro}</p>
        {children}
        <RelancesCta />
        <section className="tool-tips">
          <h2>Bon à savoir</h2>
          {tips.map((t) => (
            <div key={t.q}>
              <h3>{t.q}</h3>
              <p>{t.a}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
