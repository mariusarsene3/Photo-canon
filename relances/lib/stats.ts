import type { Invoice } from "./reminders";

export type MonthPoint = { key: string; label: string; long: string; cents: number; count: number };

/** Montants récupérés (factures payées) par mois, sur les `months` derniers mois, mois en cours inclus. */
export function recoveredByMonth(invoices: Invoice[], months = 6, now = new Date()): MonthPoint[] {
  const points: MonthPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7);
    points.push({
      key,
      label: d.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" }).replace(".", ""),
      long: d.toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }),
      cents: 0,
      count: 0,
    });
  }
  const byKey = new Map(points.map((p) => [p.key, p]));
  for (const inv of invoices) {
    if (inv.status !== "paid" || !inv.paid_at) continue;
    const p = byKey.get(inv.paid_at.slice(0, 7));
    if (p) { p.cents += inv.amount_cents; p.count++; }
  }
  return points;
}

/** Indicateurs de performance des relances. */
export function kpis(invoices: Invoice[]) {
  const paid = invoices.filter((i) => i.status === "paid" && i.paid_at);
  // Délai moyen de paiement après l'échéance (un paiement en avance compte pour 0).
  const delays = paid.map((i) => Math.max(0, Math.round((Date.parse(i.paid_at!) - Date.parse(i.due_date + "T00:00:00Z")) / 86_400_000)));
  const avgDelay = delays.length ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length) : null;
  // Récupéré après au moins une relance : ce que l'outil a vraiment rapporté.
  const afterReminder = paid.filter((i) => i.reminders.length > 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const remindersThisMonth = invoices.reduce((n, i) => n + i.reminders.filter((r) => r.sent_at.slice(0, 7) === thisMonth).length, 0);
  return {
    avgDelay,
    recoveredAfterReminderCents: afterReminder.reduce((s, i) => s + i.amount_cents, 0),
    recoveredAfterReminderCount: afterReminder.length,
    remindersThisMonth,
  };
}
