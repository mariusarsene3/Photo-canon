import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { METIERS } from "@/lib/metiers";
import { GUIDES } from "@/lib/guides";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label={`${BRAND.name}, accueil`}>
      <span className="brand-mark" aria-hidden>
        R
      </span>
      {BRAND.name}
    </Link>
  );
}

export function Header() {
  return (
    <header className="top">
      <div className="wrap top-in">
        <Logo />
        <nav>
          <a href="/#offres">Offres</a>
          <a href="/guides">Guides</a>
          <a href="/contact" className="nav-cta">
            Me contacter
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Logo />
            <p>Je rends les commerçants visibles sur Google et dans ChatGPT, {BRAND.area}.</p>
            <p>
              <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
            </p>
          </div>
          <div>
            <p className="foot-title">Le test par métier</p>
            <ul>
              {METIERS.map((m) => (
                <li key={m.slug}>
                  <Link href={`/test/${m.slug}`}>{m.plural.charAt(0).toUpperCase() + m.plural.slice(1)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="foot-title">Guides</p>
            <ul>
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                </li>
              ))}
            </ul>
            <p className="foot-title">Infos</p>
            <ul>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/exemple">Exemple de résultat</Link>
              </li>
              <li>
                <Link href="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link href="/confidentialite">Confidentialité</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
