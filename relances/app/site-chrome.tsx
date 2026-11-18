import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { LEGAL } from "@/lib/legal";

const SIGNUP = "/login?mode=signup";

/** En-tête commun aux pages publiques (accueil, outils). */
export function SiteNav() {
  return (
    <nav className="lp-nav lp-wrap">
      <Link href="/" className="lp-brand lp-brand-link">{BRAND.name}</Link>
      <div className="lp-nav-links">
        <Link href="/outils" className="lp-hide-sm">Outils gratuits</Link>
        <Link href="/login">Connexion</Link>
        <Link href={SIGNUP} className="lp-btn lp-btn-sm">Essai gratuit</Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="lp-footer lp-wrap">
      <span className="lp-brand">{BRAND.name}</span>
      <span className="lp-footer-links">
        <Link href="/outils">Outils gratuits</Link>
        <Link href="/cgv">CGV</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        {LEGAL.contactEmail && <a href={`mailto:${LEGAL.contactEmail}`}>Contact</a>}
        <span>© {new Date().getFullYear()}</span>
      </span>
    </footer>
  );
}

/** Encart qui présente le service sous chaque outil gratuit. */
export function ProductCta() {
  return (
    <aside className="tool-cta">
      <div>
        <p className="tool-cta-title">Marre de relancer à la main ?</p>
        <p className="tool-cta-text">
          {BRAND.name} envoie automatiquement vos relances à J+1, J+7 et J+15, avec un lien de paiement, jusqu&apos;à ce que
          votre client paie.
        </p>
      </div>
      <Link href={SIGNUP} className="lp-btn">Essayer gratuitement {BRAND.trialDays} jours</Link>
    </aside>
  );
}
