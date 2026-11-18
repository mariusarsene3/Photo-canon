import Link from "next/link";
import { login, signup } from "./actions";
import { BRAND } from "@/lib/brand";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; info?: string }>;
}) {
  const { mode, error, info } = await searchParams;
  const isSignup = mode === "signup";

  return (
    <main className="auth">
      <h1><Link href="/" className="brand-link">{BRAND.name}</Link></h1>
      <p className="muted">Vos factures impayées relancées automatiquement.</p>

      <section className="card">
        <h2>{isSignup ? "Créer un compte" : "Se connecter"}</h2>
        {error && <p className="alert err">{error}</p>}
        {info && <p className="alert ok">{info}</p>}
        <form action={isSignup ? signup : login} className="stack">
          <input name="email" type="email" placeholder="E-mail" autoComplete="email" required />
          <input
            name="password"
            type="password"
            placeholder={isSignup ? "Mot de passe (8 caractères min.)" : "Mot de passe"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />
          <button type="submit">{isSignup ? "Créer mon compte" : "Se connecter"}</button>
          {isSignup && (
            <p className="muted small consent">
              En créant un compte, vous acceptez les <Link href="/cgv">conditions générales de vente</Link> et la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          )}
        </form>
        <p className="muted small">
          {isSignup ? (
            <>Déjà un compte ? <Link href="/login">Se connecter</Link></>
          ) : (
            <>Pas encore de compte ? <Link href="/login?mode=signup">Essai gratuit</Link></>
          )}
        </p>
      </section>
    </main>
  );
}
