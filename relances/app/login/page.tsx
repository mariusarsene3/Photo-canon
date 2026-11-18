import Link from "next/link";
import { login, requestReset, signup } from "./actions";
import { BRAND } from "@/lib/brand";
import { LEGAL } from "@/lib/legal";
import { SubmitButton } from "../submit-button";

export const metadata = { title: `Connexion — ${BRAND.name}` };

/** Panneau de marque (écran large) : promesse + aperçu du produit. */
function BrandPanel() {
  return (
    <aside className="auth-brand" aria-hidden>
      <Link href="/" className="auth-logo">{BRAND.name}</Link>
      <div className="auth-pitch">
        <h2>Vos factures impayées, relancées automatiquement.</h2>
        <p>Rappel courtois, relance ferme, dernier avis : vos clients sont relancés au bon moment, jusqu&apos;au paiement.</p>
      </div>
      <div className="auth-mock">
        <div className="auth-mock-card">
          <span className="auth-mock-top">Récupéré ce mois-ci <em className="demo-tag">Exemple</em></span>
          <strong>4 930 €</strong>
          <div className="auth-mock-bar"><i /></div>
          <ul className="auth-mock-list">
            <li><b>Boulangerie Dupont</b><em>1 250 €</em><i className="ok">Payée</i></li>
            <li><b>SARL Leroy</b><em>480 €</em><i>Relance envoyée</i></li>
            <li><b>Garage Bernard</b><em>3 200 €</em><i className="late">Dernier avis</i></li>
          </ul>
        </div>
        <div className="auth-mock-toast"><b>✓</b> Boulangerie Dupont a payé 1 250 €</div>
      </div>
      <ul className="auth-points">
        <li>{BRAND.trialDays} jours gratuits, sans carte bancaire</li>
        <li>Relances signées à votre nom, avec lien de paiement</li>
        <li>Données hébergées en Europe</li>
      </ul>
    </aside>
  );
}

/** Version compacte du panneau de marque, en haut de l'écran sur téléphone. */
function MobileBrand() {
  return (
    <div className="auth-mbrand" aria-hidden>
      <Link href="/" className="auth-logo">{BRAND.name}</Link>
      <p className="auth-mbrand-title">Vos factures impayées, relancées automatiquement.</p>
      <div className="auth-mock-card">
        <span className="auth-mock-top">Récupéré ce mois-ci <em className="demo-tag">Exemple</em></span>
        <strong>4 930 €</strong>
        <div className="auth-mock-bar"><i /></div>
      </div>
      <div className="auth-mock-toast"><b>✓</b> Boulangerie Dupont a payé 1 250 €</div>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; info?: string }>;
}) {
  const { mode, error, info } = await searchParams;
  const view = mode === "signup" ? "signup" : mode === "reset" ? "reset" : "login";
  const title = { login: "Bon retour 👋", signup: "Créez votre compte", reset: "Mot de passe oublié" }[view];
  const sub = {
    login: "Connectez-vous pour suivre vos factures.",
    signup: `${BRAND.trialDays} jours gratuits, sans carte bancaire. Prêt en 2 minutes.`,
    reset: "Indiquez votre e-mail : nous vous envoyons un lien pour choisir un nouveau mot de passe.",
  }[view];

  return (
    <div className="auth-wrap">
      <BrandPanel />
      <main className="auth-main">
        <MobileBrand />
        <div className="auth-box">
          <h1>{title}</h1>
          <p className="muted">{sub}</p>
          {error && <p className="alert err">{error}</p>}
          {info && <p className="alert ok">{info}</p>}

          {view === "reset" ? (
            <form action={requestReset} className="auth-form">
              <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="vous@entreprise.fr" required /></label>
              <SubmitButton pending="Envoi…">Recevoir le lien</SubmitButton>
            </form>
          ) : (
            <form action={view === "signup" ? signup : login} className="auth-form">
              <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="vous@entreprise.fr" required /></label>
              <label>
                <span className="auth-label-row">
                  Mot de passe
                  {view === "login" && <Link href="/login?mode=reset" className="auth-forgot">Mot de passe oublié ?</Link>}
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder={view === "signup" ? "8 caractères minimum" : "••••••••"}
                  autoComplete={view === "signup" ? "new-password" : "current-password"}
                  minLength={view === "signup" ? 8 : undefined}
                  required
                />
              </label>
              <SubmitButton pending={view === "signup" ? "Création…" : "Connexion…"}>
                {view === "signup" ? "Créer mon compte gratuit" : "Se connecter"}
              </SubmitButton>
              {view === "signup" && (
                <p className="muted small consent">
                  En créant un compte, vous acceptez les <Link href="/cgv">conditions générales de vente</Link> et la{" "}
                  <Link href="/confidentialite">politique de confidentialité</Link>.
                </p>
              )}
            </form>
          )}

          <ul className="auth-trust">
            <li>{BRAND.trialDays} jours gratuits, sans carte bancaire</li>
            <li>Relances signées à votre nom</li>
            <li>Données hébergées en Europe</li>
          </ul>

          <p className="auth-switch">
            {view === "signup" ? (
              <>Déjà un compte ? <Link href="/login">Se connecter</Link></>
            ) : view === "reset" ? (
              <><Link href="/login">← Retour à la connexion</Link></>
            ) : (
              <>Pas encore de compte ? <Link href="/login?mode=signup">Essai gratuit</Link></>
            )}
          </p>
        </div>
        <nav className="auth-legal" aria-label="Informations légales">
          <Link href="/cgv">CGV</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          {LEGAL.contactEmail && <a href={`mailto:${LEGAL.contactEmail}`}>Contact</a>}
        </nav>
      </main>
    </div>
  );
}
