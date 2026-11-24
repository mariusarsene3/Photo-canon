import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CheckForm } from "./check-form";

// Une analyse (recherche web + lecture de la réponse) prend jusqu'à une minute.
export const maxDuration = 120;

export default function Home() {
  return (
    <main>
      <header className="top">
        <div className="wrap top-in">
          <span className="logo" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M4 5h16v10H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M8.5 10l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{BRAND.name}</strong>
        </div>
      </header>

      <section className="hero wrap">
        <p className="eyebrow">Test gratuit · 1 minute · sans inscription</p>
        <h1>
          Vos clients demandent à l&apos;IA un bon commerçant.
          <br />
          <span className="accent">Est-ce qu&apos;elle vous cite ?</span>
        </h1>
        <p className="lead">
          De plus en plus de gens tapent « je cherche un bon fleuriste à Nancy » dans ChatGPT au lieu de Google.
          L&apos;IA ne cite que 3 ou 4 noms. Vérifiez si le vôtre en fait partie, ou si ce sont vos concurrents.
        </p>
        <CheckForm />
        <Link href="/exemple" className="example-link">Voir un exemple de résultat →</Link>
      </section>

      <footer className="foot wrap">
        {BRAND.name} · Contact : <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
      </footer>
    </main>
  );
}
