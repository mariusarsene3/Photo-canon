import Link from "next/link";
import { Toast } from "./toast";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { getMyAccess } from "@/lib/billing";
import { activeSteps, dayLabel, daysLate, type Invoice, type Profile } from "@/lib/reminders";
import { addInvoice, sendNow } from "./actions";
import { SubmitButton } from "./submit-button";
import { Landing } from "./landing";
import { AppShell } from "./app-shell";
import { InvoiceList } from "./invoice-list";
import { HeroCard, PerfSection, toRow } from "./dashboard-parts";
import { NewInvoiceFab } from "./new-invoice-fab";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string; nouvelle?: string }> }) {
  const { ok, err, nouvelle } = await searchParams;
  const wantsNew = nouvelle !== undefined; // bouton « Nouvelle facture » de la barre latérale
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Landing />;

  const [{ data: inv }, { data: prof }, access] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, reminders(step, sent_at)")
      .order("status", { ascending: false })
      .order("due_date", { ascending: true }),
    supabase.from("profiles").select("*").maybeSingle(),
    getMyAccess(supabase),
  ]);
  const invoices = (inv ?? []) as Invoice[];
  const profile = (prof ?? { company_name: "", iban: "" }) as Profile;
  const paid = invoices.filter((i) => i.status === "paid");
  const today = new Date().toISOString().slice(0, 10);

  // Premiers pas : la carte disparaît une fois tout fait.
  const steps = [
    { done: !!profile.company_name, label: "Indiquer le nom de votre entreprise", hint: "Il signe vos relances.", href: "/compte#entreprise" },
    { done: !!profile.iban, label: "Ajouter votre IBAN", hint: "Vos clients pourront payer en un clic.", href: "/compte#entreprise" },
    { done: invoices.length > 0, label: "Ajouter une facture en retard", hint: "Ou importez-les depuis Excel.", href: "#nouvelle" },
    { done: invoices.some((i) => i.reminders.length > 0), label: "Envoyer votre première relance", hint: "Elle part toute seule le lendemain de l'échéance.", href: "#factures" },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <AppShell active="factures" email={user.email}>
      <div className="page-head">
        <h1>Factures</h1>
        <form action={sendNow}>
          <SubmitButton className="secondary small" pending="Envoi en cours…">Envoyer les relances dues</SubmitButton>
        </form>
      </div>

      <Toast message={ok} />
      {err && <p className="alert err">{err}</p>}
      {access.reason === "trial" && access.daysLeft <= 14 && (
        <p className="alert trial">
          Essai gratuit : encore <b>{access.daysLeft} jour{access.daysLeft > 1 ? "s" : ""}</b>. <Link href="/compte">S&apos;abonner</Link>
        </p>
      )}
      {!access.ok && (
        <p className="alert err">
          Votre essai gratuit est terminé : les relances automatiques sont en pause. <Link href="/compte">Abonnez-vous</Link> pour
          les relancer.
        </p>
      )}

      <HeroCard invoices={invoices} />

      {doneCount < steps.length && (
        <section className="card onboard">
          <div className="onboard-head">
            <h2>Bien démarrer</h2>
            <span className="muted small">{doneCount} / {steps.length}</span>
          </div>
          <div className="onboard-bar"><i style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div>
          <ol className="onboard-steps">
            {steps.map((s) => (
              <li key={s.label} className={s.done ? "done" : ""}>
                <span className="onboard-check" aria-hidden>{s.done ? "✓" : ""}</span>
                {s.done ? (
                  <span><b>{s.label}</b></span>
                ) : (
                  <a href={s.href}><b>{s.label}</b><small>{s.hint}</small></a>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {paid.length > 0 && <PerfSection invoices={invoices} />}

      <details className="card new-inv" id="nouvelle" open={invoices.length === 0 || wantsNew}>
        <summary>
          <span className="new-inv-plus" aria-hidden>+</span> Nouvelle facture
        </summary>
        <form action={addInvoice} className="form-grid">
          <label>N° de facture<input name="number" placeholder="F-2026-042" required autoFocus={wantsNew} /></label>
          <label>Client<input name="client_name" placeholder="Boulangerie Dupont" required /></label>
          <label>E-mail du client<input name="client_email" type="email" placeholder="contact@client.fr" required /></label>
          <label>Montant TTC (€)<input name="amount" inputMode="decimal" placeholder="1250" required /></label>
          <label>Échéance<input name="due_date" type="date" defaultValue={today} required /></label>
          <label className="file-field" title="Jointe automatiquement aux relances">Facture PDF (facultatif)<input name="pdf" type="file" accept="application/pdf" /></label>
          <SubmitButton pending="Ajout…">Ajouter la facture</SubmitButton>
        </form>
        <p className="muted small">
          Plusieurs factures ? <Link href="/importer">Importez-les depuis Excel, CSV ou PDF</Link>. Relances automatiques :{" "}
          {activeSteps(profile).map((s) => `${s.label.toLowerCase()} à ${dayLabel(s.daysAfterDue)}`).join(", ")}.{" "}
          <Link href="/relances">Personnaliser</Link>
        </p>
      </details>

      <section className="card" id="factures">
        {invoices.length === 0 ? (
          <div className="empty">
            <p><b>Aucune facture pour l&apos;instant.</b></p>
            <p className="muted">Ajoutez une facture en retard : {BRAND.name} s&apos;occupe des relances.</p>
          </div>
        ) : (
          <InvoiceList rows={invoices.map((i) => toRow(i, profile))} />
        )}
      </section>
      <NewInvoiceFab />
    </AppShell>
  );
}
