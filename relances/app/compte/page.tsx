import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { STATUS_LABEL, accessFrom, getMyBilling } from "@/lib/billing";
import { stripeConfigured } from "@/lib/stripe";
import { SubmitButton } from "../submit-button";
import { deleteAccount, manageSubscription, subscribe } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Mon compte — ${BRAND.name}` };

const frDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const billing = await getMyBilling(supabase);
  const access = accessFrom(billing);
  const payments = stripeConfigured();

  return (
    <main className="account-page">
      <p><Link href="/">← Tableau de bord</Link></p>
      <h1>Mon compte</h1>
      <p className="muted">{user?.email}</p>
      {ok && <p className="alert ok">{ok}</p>}
      {err && <p className="alert err">{err}</p>}

      <section className="card">
        <h2>Abonnement</h2>
        {!billing ? (
          <p className="muted">Abonnement non configuré (migration 003 à appliquer).</p>
        ) : access.reason === "subscribed" ? (
          <>
            <p>
              <span className="badge ok">{STATUS_LABEL[billing.status!] ?? billing.status}</span>{" "}
              {BRAND.name} — {BRAND.price} € HT / mois
            </p>
            {billing.current_period_end && (
              <p className="muted">
                {billing.cancel_at_period_end
                  ? `Résiliation programmée : accès jusqu'au ${frDate(billing.current_period_end)}.`
                  : `Prochain renouvellement le ${frDate(billing.current_period_end)}.`}
              </p>
            )}
            <form action={manageSubscription}>
              <SubmitButton className="secondary" pending="Ouverture…">Gérer : carte, factures, résiliation</SubmitButton>
            </form>
          </>
        ) : (
          <>
            {access.reason === "trial" ? (
              <p>
                <span className="badge">Essai gratuit</span> Il vous reste <b>{access.daysLeft} jour{access.daysLeft > 1 ? "s" : ""}</b>{" "}
                (jusqu&apos;au {frDate(billing.trial_ends_at)}).
              </p>
            ) : (
              <p>
                <span className="badge late">Essai terminé</span> Vos relances automatiques sont en pause. Abonnez-vous pour
                les relancer.
              </p>
            )}
            {billing.status === "canceled" && <p className="muted">Votre précédent abonnement a été résilié.</p>}
            <p className="muted">{BRAND.price} € HT / mois · sans engagement · résiliable à tout moment.</p>
            {payments ? (
              <form action={subscribe}>
                <SubmitButton pending="Ouverture du paiement…">S&apos;abonner</SubmitButton>
              </form>
            ) : (
              <p className="muted small">Le paiement en ligne sera bientôt disponible.</p>
            )}
          </>
        )}
      </section>

      <section className="card danger-zone">
        <h2>Supprimer mon compte</h2>
        <p className="muted">
          Supprime définitivement votre compte, vos factures, vos relances et vos paramètres. Votre abonnement éventuel
          est résilié. Cette action est irréversible.
        </p>
        <form action={deleteAccount} className="row">
          <input name="confirm" placeholder="Tapez SUPPRIMER" autoComplete="off" aria-label="Tapez SUPPRIMER pour confirmer" />
          <SubmitButton className="danger" pending="Suppression…">Supprimer définitivement</SubmitButton>
        </form>
      </section>

      <p className="muted small">
        <Link href="/cgv">Conditions générales de vente</Link> · <Link href="/confidentialite">Confidentialité</Link> ·{" "}
        <Link href="/mentions-legales">Mentions légales</Link>
      </p>
    </main>
  );
}
