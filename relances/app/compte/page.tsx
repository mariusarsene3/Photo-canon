import type { Metadata } from "next";
import { Toast } from "../toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND, founderPrice } from "@/lib/brand";
import { founderSeatsLeft, showSeatCounter } from "@/lib/founder";
import { STATUS_LABEL, accessFrom, getMyBilling } from "@/lib/billing";
import { stripeConfigured } from "@/lib/stripe";
import { SubmitButton } from "../submit-button";
import { deleteAccount, manageSubscription, savePreferences, subscribe } from "./actions";
import { saveSettings } from "../actions";
import { AppShell } from "../app-shell";
import { formatIban } from "@/lib/payment";

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
  const founderLeft = await founderSeatsLeft();
  const { data: prefs, error: prefsErr } = await supabase.from("profiles").select("*").maybeSingle();
  const productEmails = prefs?.product_emails !== false;
  // Le résumé du lundi n'apparaît qu'une fois la migration 007 appliquée (ou sans profil encore créé).
  const probe = await supabase.from("profiles").select("weekly_summary").limit(1);
  const hasWeekly = !prefsErr && !probe.error;
  const weekly = prefs?.weekly_summary !== false;
  const { data: company } = await supabase.from("profiles").select("company_name, iban").maybeSingle();

  return (
    <AppShell active="compte" email={user?.email}>
    <div className="account-page">
      <h1>Mon compte</h1>
      <p className="muted">{user?.email}</p>
      <Toast message={ok} />
      {err && <p className="alert err">{err}</p>}

      <section className="card" id="entreprise">
        <h2>Mon entreprise</h2>
        <p className="muted small">Ces informations apparaissent dans les relances et sur la page de paiement de vos clients.</p>
        <form action={saveSettings} className="form-grid one-col">
          <label>Nom de l&apos;entreprise<input name="company_name" placeholder="Plomberie Martin" defaultValue={company?.company_name ?? ""} /></label>
          <label>IBAN<input name="iban" placeholder="FR76 …" defaultValue={company?.iban ? formatIban(company.iban) : ""} autoComplete="off" /></label>
          <SubmitButton pending="Enregistrement…">Enregistrer</SubmitButton>
        </form>
      </section>

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
            {payments && founderLeft > 0 && (
              <p className="founder-note">
                <b>Offre fondateur</b> : entrez le code <code>{BRAND.founder.code}</code> sur la page de paiement pour payer{" "}
                {founderPrice()} HT / mois à vie{showSeatCounter(founderLeft) ? ` (${founderLeft} place${founderLeft > 1 ? "s" : ""} restante${founderLeft > 1 ? "s" : ""})` : ""}.
              </p>
            )}
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

      {!prefsErr && (
        <section className="card">
          <h2>E-mails</h2>
          <form action={savePreferences} className="prefs">
            <label className="check">
              <input type="checkbox" name="product_emails" defaultChecked={productEmails} />
              <span>Recevoir les conseils pour bien démarrer et les rappels de fin d&apos;essai</span>
            </label>
            {hasWeekly && (
              <label className="check">
                <input type="hidden" name="has_weekly" value="1" />
                <input type="checkbox" name="weekly_summary" defaultChecked={weekly} />
                <span>Recevoir chaque lundi le résumé de mes factures (relances envoyées, paiements reçus, retards)</span>
              </label>
            )}
            <SubmitButton className="secondary small" pending="…">Enregistrer</SubmitButton>
          </form>
        </section>
      )}

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
    </div>
    </AppShell>
  );
}
