import type { Metadata } from "next";
import { Toast } from "../../toast";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { STEPS, daysLate, euros, nextReminder, renderEmail, type Invoice, type Profile } from "@/lib/reminders";
import { paymentUrl } from "@/lib/payment";
import { AppShell } from "../../app-shell";
import { SubmitButton } from "../../submit-button";
import { CopyButton } from "../../payer/[token]/copy-button";
import { Avatar } from "../../invoice-list";
import { editInvoice, removeInvoice, saveNotes, setPaid, setPaused } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Facture — ${BRAND.name}` };

const frLong = (iso: string) =>
  new Date(iso.length === 10 ? iso + "T00:00:00" : iso)
    .toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    .replace(/^1 /, "1er ");

type Event = { date: string; title: string; detail?: string; kind: "done" | "late" | "next" | "ok" };

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data }, { data: prof }] = await Promise.all([
    supabase.from("invoices").select("*, reminders(step, sent_at)").eq("id", Number(id)).maybeSingle(),
    supabase.from("profiles").select("company_name, iban").maybeSingle(),
  ]);
  if (!data) notFound();
  const inv = data as Invoice;
  const profile = (prof ?? { company_name: "", iban: "" }) as Profile;
  const paid = inv.status === "paid";
  const late = daysLate(inv.due_date);
  const next = nextReminder(inv);
  const hasPauseColumn = "paused" in inv;

  // Historique
  const events: Event[] = [
    { date: inv.created_at, title: "Facture ajoutée", kind: "done" },
    { date: inv.due_date, title: "Échéance", detail: late > 0 && !paid ? `${late} jour${late > 1 ? "s" : ""} de retard` : undefined, kind: late > 0 && !paid ? "late" : "done" },
    ...[...inv.reminders]
      .sort((a, b) => a.sent_at.localeCompare(b.sent_at))
      .map((r) => ({ date: r.sent_at, title: STEPS.find((s) => s.step === r.step)?.sent ?? "Relance envoyée", detail: `à ${inv.client_email}`, kind: "done" as const })),
  ];
  if (paid && inv.paid_at) events.push({ date: inv.paid_at, title: "Payée ✓", kind: "ok" });
  else if (next) events.push({ date: next.date, title: next.planned, detail: "envoi automatique", kind: "next" });
  events.sort((a, b) => a.date.slice(0, 10).localeCompare(b.date.slice(0, 10)));

  const preview = next ? renderEmail(inv, next.step, profile) : null;

  let badge: { cls: string; text: string };
  if (paid) badge = { cls: "b-paid", text: "Payée" };
  else if (inv.paused) badge = { cls: "b-paused", text: "Relances en pause" };
  else if (late > 0) badge = { cls: "b-late", text: `${late} j de retard` };
  else badge = { cls: "b-upcoming", text: late === 0 ? "Échéance aujourd'hui" : `Échéance dans ${-late} j` };

  return (
    <AppShell active="factures" email={user?.email}>
      <p className="crumb"><Link href="/">← Factures</Link></p>
      <div className="inv-head card">
        <div className="inv-head-id">
          <Avatar name={inv.client_name} size={52} />
          <div>
          <h1>{inv.client_name}</h1>
          <p className="muted">Facture n° {inv.number} · {inv.client_email}</p>
          </div>
        </div>
        <div className="inv-head-amount">
          <strong>{euros(inv.amount_cents)}</strong>
          <span className={`badge ${badge.cls}`}><i className="badge-dot" />{badge.text}</span>
        </div>
      </div>

      <Toast message={ok} />
      {err && <p className="alert err">{err}</p>}

      <div className="inv-actions">
        <form action={setPaid}>
          <input type="hidden" name="id" value={inv.id} />
          <input type="hidden" name="paid" value={paid ? "0" : "1"} />
          {paid ? (
            <SubmitButton className="secondary" pending="…">Remettre en attente</SubmitButton>
          ) : (
            <SubmitButton pending="…">Marquer comme payée ✓</SubmitButton>
          )}
        </form>
        {!paid && hasPauseColumn && (
          <form action={setPaused}>
            <input type="hidden" name="id" value={inv.id} />
            <input type="hidden" name="paused" value={inv.paused ? "0" : "1"} />
            <SubmitButton className="secondary" pending="…">{inv.paused ? "Reprendre les relances" : "Mettre les relances en pause"}</SubmitButton>
          </form>
        )}
        {!paid && inv.pay_token && (
          <CopyButton value={paymentUrl(inv.pay_token)} label="Copier le lien de paiement" />
        )}
      </div>

      <div className="detail-grid">
        <section className="card">
          <h2>Historique</h2>
          <ol className="timeline">
            {events.map((e, i) => (
              <li key={i} className={`t-${e.kind}`}>
                <span className="t-dot" aria-hidden />
                <div>
                  <b>{e.title}</b>
                  <small>{frLong(e.date)}{e.detail ? ` · ${e.detail}` : ""}</small>
                </div>
              </li>
            ))}
          </ol>
          {inv.paused && !paid && <p className="muted small">Les relances sont en pause : rien ne partira tant que vous ne les reprenez pas.</p>}
        </section>

        <div className="detail-side">
          {hasPauseColumn && (
            <section className="card">
              <h2>Notes</h2>
              <form action={saveNotes} className="notes">
                <input type="hidden" name="id" value={inv.id} />
                <textarea name="notes" rows={4} defaultValue={inv.notes ?? ""} placeholder="Ex. : client a promis de payer vendredi, appelé le 12/11…" />
                <SubmitButton className="secondary small" pending="…">Enregistrer</SubmitButton>
              </form>
              <p className="muted small">Visibles uniquement par vous.</p>
            </section>
          )}

          <details className="card">
            <summary className="summary-title">Modifier la facture</summary>
            <form action={editInvoice} className="form-grid one-col">
              <input type="hidden" name="id" value={inv.id} />
              <label>N° de facture<input name="number" defaultValue={inv.number} required /></label>
              <label>Client<input name="client_name" defaultValue={inv.client_name} required /></label>
              <label>E-mail du client<input name="client_email" type="email" defaultValue={inv.client_email} required /></label>
              <label>Montant TTC (€)<input name="amount" inputMode="decimal" defaultValue={(inv.amount_cents / 100).toFixed(2).replace(".", ",")} required /></label>
              <label>Échéance<input name="due_date" type="date" defaultValue={inv.due_date} required /></label>
              <SubmitButton pending="Enregistrement…">Enregistrer</SubmitButton>
            </form>
          </details>

          {preview && (
            <details className="card">
              <summary className="summary-title">Aperçu de la prochaine relance</summary>
              <p className="muted small">Objet : {preview.subject}</p>
              <pre className="mail-preview">{preview.text}</pre>
            </details>
          )}

          <form action={removeInvoice} className="danger-link">
            <input type="hidden" name="id" value={inv.id} />
            <SubmitButton className="ghost small" pending="…">Supprimer cette facture</SubmitButton>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
