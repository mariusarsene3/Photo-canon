import { STEPS, daysLate, euros, nextReminder, type Invoice, type Profile } from "@/lib/reminders";
import { kpis, recoveredByMonth } from "@/lib/stats";
import type { Row } from "./invoice-list";
import { RecoveredChart } from "./recovered-chart";

/** Morceaux du tableau de bord, partagés par la vraie page et la démo. */
const frShort = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

/** Prépare une ligne de la liste : statut lisible et prochaine relance. */
export function toRow(i: Invoice, profile: Profile): Row {
  const late = daysLate(i.due_date);
  const lastStep = Math.max(-1, ...i.reminders.map((r) => r.step));
  const lastSent = STEPS.find((s) => s.step === lastStep)?.sent;
  const next = nextReminder(i, profile);
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


/** Carte « À encaisser » en haut du tableau de bord. */
export function HeroCard({ invoices }: { invoices: Invoice[] }) {
  const pending = invoices.filter((i) => i.status === "pending");
  const overdue = pending.filter((i) => daysLate(i.due_date) > 0);
  const paid = invoices.filter((i) => i.status === "paid");
  const total = (a: Invoice[]) => a.reduce((s, i) => s + i.amount_cents, 0);
  const sum = (a: Invoice[]) => euros(total(a));
  const recoveredPct = total(invoices) ? Math.round((total(paid) / total(invoices)) * 100) : 0;
  return (
      <section className="hero-card" aria-label="Synthèse">
      <div className="hero-top">
        <span className="hero-label">À encaisser</span>
        <span className="hero-count">{pending.length} facture{pending.length > 1 ? "s" : ""} en attente</span>
      </div>
      <strong className="hero-amount">{sum(pending)}</strong>
      <div className="hero-progress" aria-hidden>
        <i style={{ width: `${recoveredPct}%` }} />
      </div>
      <div className="hero-figures">
        <div>
          <span className="dot dot-late" />
          <span>En retard</span>
          <b>{sum(overdue)}</b>
        </div>
        <div>
          <span className="dot dot-ok" />
          <span>Récupéré</span>
          <b>{sum(paid)}</b>
        </div>
        <div>
          <span className="dot dot-rate" />
          <span>Recouvrement</span>
          <b>{recoveredPct} %</b>
        </div>
      </div>
    </section>
  );
}

/** Graphique « Récupéré par mois » et chiffres clés (affiché dès le premier paiement). */
export function PerfSection({ invoices }: { invoices: Invoice[] }) {
  const k = kpis(invoices);
  return (
          <section className="perf">
            <div className="card perf-chart">
              <div className="perf-head">
                <h2>Récupéré par mois</h2>
                <span className="muted small">6 derniers mois</span>
              </div>
              <RecoveredChart points={recoveredByMonth(invoices)} />
            </div>
            <div className="perf-kpis">
              <div className="card kpi">
                <span>Récupéré après relance</span>
                <strong>{euros(k.recoveredAfterReminderCents)}</strong>
                <em>{k.recoveredAfterReminderCount} facture{k.recoveredAfterReminderCount > 1 ? "s" : ""} payée{k.recoveredAfterReminderCount > 1 ? "s" : ""} après un rappel</em>
              </div>
              <div className="card kpi">
                <span>Délai moyen de paiement</span>
                <strong>{k.avgDelay === null ? "—" : `${k.avgDelay} j`}</strong>
                <em>{k.avgDelay === null ? "dès la première facture payée" : "après l'échéance"}</em>
              </div>
              <div className="card kpi">
                <span>Relances ce mois-ci</span>
                <strong>{k.remindersThisMonth}</strong>
                <em>envoyées automatiquement</em>
              </div>
            </div>
          </section>
  );
}
