import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { getMyAccess } from "@/lib/billing";
import { STEPS, daysLate, euros, nextReminder, type Invoice, type Profile } from "@/lib/reminders";
import { addInvoice, sendNow } from "./actions";
import { SubmitButton } from "./submit-button";
import { Landing } from "./landing";
import { AppShell } from "./app-shell";
import { InvoiceList, type Row } from "./invoice-list";

export const dynamic = "force-dynamic";

const frShort = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

/** Prépare une ligne de la liste : statut lisible et prochaine relance. */
function toRow(i: Invoice): Row {
  const late = daysLate(i.due_date);
  const lastStep = Math.max(0, ...i.reminders.map((r) => r.step));
  const lastSent = STEPS.find((s) => s.step === lastStep)?.sent;
  const next = nextReminder(i);
  let kind: Row["kind"], status: string;
  if (i.status === "paid") { kind = "paid"; status = "Payée"; }
  else if (i.paused) { kind = "paused"; status = "Relances en pause"; }
  else if (late > 0) { kind = "late"; status = `${late} j de retard`; }
  else if (late === 0) { kind = "today"; status = "Échéance aujourd'hui"; }
  else { kind = "upcoming"; status = `Dans ${-late} j`; }
  return {
    id: i.id,
    number: i.number,
    client: i.client_name,
    email: i.client_email,
    amount: euros(i.amount_cents),
    due: frShort(i.due_date),
    kind,
    status,
    next:
      kind === "paid" ? null
      : next ? `${next.label} le ${frShort(next.date)}`
      : lastSent ?? null,
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Landing />;

  const [{ data: inv }, { data: prof }, access] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, reminders(step, sent_at)")
      .order("status", { ascending: false })
      .order("due_date", { ascending: true }),
    supabase.from("profiles").select("company_name, iban").maybeSingle(),
    getMyAccess(supabase),
  ]);
  const invoices = (inv ?? []) as Invoice[];
  const profile = (prof ?? { company_name: "", iban: "" }) as Profile;
  const pending = invoices.filter((i) => i.status === "pending");
  const overdue = pending.filter((i) => daysLate(i.due_date) > 0);
  const paid = invoices.filter((i) => i.status === "paid");
  const sum = (a: Invoice[]) => euros(a.reduce((s, i) => s + i.amount_cents, 0));
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

      {ok && <p className="alert ok">{ok}</p>}
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

      <section className="stats">
        <div className="stat"><span>À encaisser</span><strong>{sum(pending)}</strong><em>{pending.length} facture(s)</em></div>
        <div className="stat warn"><span>En retard</span><strong>{sum(overdue)}</strong><em>{overdue.length} facture(s)</em></div>
        <div className="stat good"><span>Récupéré</span><strong>{sum(paid)}</strong><em>{paid.length} facture(s)</em></div>
      </section>

      <details className="card new-inv" id="nouvelle" open={invoices.length === 0}>
        <summary>
          <span className="new-inv-plus" aria-hidden>+</span> Nouvelle facture
        </summary>
        <form action={addInvoice} className="form-grid">
          <label>N° de facture<input name="number" placeholder="F-2026-042" required /></label>
          <label>Client<input name="client_name" placeholder="Boulangerie Dupont" required /></label>
          <label>E-mail du client<input name="client_email" type="email" placeholder="contact@client.fr" required /></label>
          <label>Montant TTC (€)<input name="amount" inputMode="decimal" placeholder="1250" required /></label>
          <label>Échéance<input name="due_date" type="date" defaultValue={today} required /></label>
          <SubmitButton pending="Ajout…">Ajouter la facture</SubmitButton>
        </form>
        <p className="muted small">
          Plusieurs factures ? <Link href="/importer">Importez-les depuis Excel, CSV ou PDF</Link>. Relances automatiques :{" "}
          {STEPS.map((s) => `${s.label.toLowerCase()} à J+${s.daysAfterDue}`).join(", ")}.
        </p>
      </details>

      <section className="card" id="factures">
        {invoices.length === 0 ? (
          <div className="empty">
            <p><b>Aucune facture pour l&apos;instant.</b></p>
            <p className="muted">Ajoutez une facture en retard : {BRAND.name} s&apos;occupe des relances.</p>
          </div>
        ) : (
          <InvoiceList rows={invoices.map(toRow)} />
        )}
      </section>
    </AppShell>
  );
}
