import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label={`${BRAND.name}, accueil`}>
      <span className="brand-name">{BRAND.name}</span>
      <span className="brand-dot" aria-hidden />
    </Link>
  );
}

export function Header() {
  return (
    <header className="top">
      <div className="wrap top-in">
        <Logo />
        <nav>
          <a href="/#comment">Comment je travaille</a>
          <a href="/#tarifs">Tarifs</a>
          <a href="/#test" className="nav-cta">
            Faire le test
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div>
          <Logo />
          <p>Je rends les commerces {BRAND.region} visibles sur Google et dans les réponses de ChatGPT.</p>
        </div>
        <p className="links">
          <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
          <Link href="/exemple">Exemple de résultat</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </p>
      </div>
    </footer>
  );
}
