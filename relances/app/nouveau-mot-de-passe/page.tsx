import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { updatePassword } from "../login/actions";
import { SubmitButton } from "../submit-button";

export const metadata = { title: `Nouveau mot de passe — ${BRAND.name}` };

export default async function NewPassword({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="auth-wrap auth-single">
      <main className="auth-main">
        <Link href="/" className="auth-logo auth-logo-mobile">{BRAND.name}</Link>
        <div className="auth-box">
          <h1>Nouveau mot de passe</h1>
          <p className="muted">Choisissez un mot de passe d&apos;au moins 8 caractères.</p>
          {error && <p className="alert err">{error}</p>}
          <form action={updatePassword} className="auth-form">
            <label>Nouveau mot de passe<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
            <label>Confirmez-le<input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>
            <SubmitButton pending="Enregistrement…">Enregistrer</SubmitButton>
          </form>
        </div>
      </main>
    </div>
  );
}
