import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo() {
  return (
    <Link href="/" className="brand">
      <span className="logo" aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9.3 10l1.8 1.8 3.6-3.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <strong>{BRAND.name}</strong>
    </Link>
  );
}

export function Header() {
  return (
    <header className="top">
      <div className="wrap top-in">
        <Logo />
        <nav>
          <a href="/#comment">Comment ça marche</a>
          <a href="/#tarifs">Tarifs</a>
          <a href="/#test" className="nav-cta">Faire le test</a>
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
          <p>Être recommandé par ChatGPT et Google, pour les commerçants, artisans et indépendants.</p>
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
