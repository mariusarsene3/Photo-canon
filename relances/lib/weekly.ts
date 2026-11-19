import type { SupabaseClient } from "@supabase/supabase-js";
import { BRAND } from "./brand";
import { accessFrom, type Billing } from "./billing";
import { sendEmail } from "./email";
import { LEGAL } from "./legal";
import { siteUrl } from "./payment";
import { daysLate, euros, frDate } from "./reminders";

/**
 * Résumé du lundi : ce qui s'est passé pendant les 7 derniers jours et ce qui reste à surveiller.
 * Envoyé une fois par semaine (le lundi) aux comptes en essai ou abonnés qui l'ont activé (migration 007).
 */
export type WeeklyInvoice = {
  number: string;
  client_name: string;
  amount_cents: number;
  due_date: string;
  status: "pending" | "paid";
  paid_at: string | null;
  paused?: boolean;
};

export type Weekly = {
  paidCents: number;
  paidCount: number;
  remindersSent: number;
  overdueCents: number;
  overdue: { client: string; number: string; amount: string; late: number }[];
  overdueCount: number;
  upcoming: { client: string; number: string; amount: string; due: string }[];
};

const DAY = 86_400_000;

/** Prépare le résumé, ou null s'il n'y a rien à dire (aucune activité, rien en attente). */
export function buildWeekly(invoices: WeeklyInvoice[], remindersSent: number, now = new Date()): Weekly | null {
  const weekAgo = now.getTime() - 7 * DAY;
  const paid = invoices.filter((i) => i.status === "paid" && i.paid_at && new Date(i.paid_at).getTime() >= weekAgo);
  const pending = invoices.filter((i) => i.status === "pending");
  const overdue = pending.filter((i) => daysLate(i.due_date, now) > 0).sort((a, b) => b.amount_cents - a.amount_cents);
  const upcoming = pending
    .filter((i) => { const d = daysLate(i.due_date, now); return d <= 0 && d > -7; })
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
  if (!paid.length && !remindersSent && !overdue.length && !upcoming.length) return null;
  return {
    paidCents: paid.reduce((s, i) => s + i.amount_cents, 0),
    paidCount: paid.length,
    remindersSent,
    overdueCents: overdue.reduce((s, i) => s + i.amount_cents, 0),
    overdueCount: overdue.length,
    overdue: overdue.slice(0, 5).map((i) => ({ client: i.client_name, number: i.number, amount: euros(i.amount_cents), late: daysLate(i.due_date, now) })),
    upcoming: upcoming.slice(0, 5).map((i) => ({ client: i.client_name, number: i.number, amount: euros(i.amount_cents), due: frDate(i.due_date) })),
  };
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

export function renderWeekly(w: Weekly) {
  const url = siteUrl();
  const subject =
    w.paidCents > 0
      ? `Votre semaine : ${euros(w.paidCents)} récupérés`
      : w.overdueCents > 0
        ? `Votre semaine : ${euros(w.overdueCents)} encore à récupérer`
        : `Votre semaine : ${plural(w.remindersSent, "relance envoyée", "relances envoyées")}`;

  const lines = [
    "Bonjour,",
    "",
    `Voici votre semaine sur ${BRAND.name} :`,
    "",
    `✓ ${euros(w.paidCents)} récupérés (${plural(w.paidCount, "facture payée", "factures payées")})`,
    `✉ ${plural(w.remindersSent, "relance envoyée", "relances envoyées")} à vos clients`,
    w.overdueCount
      ? `⚠ ${euros(w.overdueCents)} en retard (${plural(w.overdueCount, "facture", "factures")})`
      : "✓ Aucune facture en retard",
  ];
  if (w.overdue.length) {
    lines.push("", "À surveiller :");
    for (const o of w.overdue) lines.push(`• ${o.client} (${o.number}) : ${o.amount}, ${plural(o.late, "jour", "jours")} de retard`);
    if (w.overdueCount > w.overdue.length) lines.push(`• … et ${plural(w.overdueCount - w.overdue.length, "autre", "autres")}`);
  }
  if (w.upcoming.length) {
    lines.push("", "À échéance cette semaine :");
    for (const u of w.upcoming) lines.push(`• ${u.client} (${u.number}) : ${u.amount}, le ${u.due}`);
  }
  lines.push(
    "",
    `Les relances continuent de partir toutes seules. Voir mes factures : ${url}`,
    "",
    `Bonne semaine,\nL'équipe ${BRAND.name}`,
    "",
    "—",
    `Vous recevez ce résumé chaque lundi. Pour ne plus le recevoir : ${url}/compte`,
  );
  return { subject, text: lines.join("\n") };
}

/** Lundi de la semaine en cours (AAAA-MM-JJ) : sert de clé pour n'envoyer qu'un résumé par semaine. */
export const weekKey = (now: Date) => {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};

/** Passage quotidien : n'agit que le lundi. À appeler avec le client admin. */
export async function runWeekly(admin: SupabaseClient, now = new Date()) {
  if (now.getUTCDay() !== 1) return { skipped: "pas lundi" };
  const kind = `weekly:${weekKey(now)}`;

  const [{ data: profiles, error: profErr }, { data: log, error: logErr }] = await Promise.all([
    admin.from("profiles").select("*"),
    admin.from("lifecycle_emails").select("user_id").eq("kind", kind),
  ]);
  if (profErr || logErr) return { skipped: "migrations 004 / 007 non appliquées" };
  // Seuls les comptes qui ont la préférence (migration 007, activée par défaut) le reçoivent.
  const wanted = new Set((profiles ?? []).filter((p) => p.weekly_summary === true).map((p) => p.user_id as string));
  for (const l of log ?? []) wanted.delete(l.user_id);
  if (!wanted.size) return { sent: [], errors: [] };

  const ids = [...wanted];
  const since = new Date(now.getTime() - 7 * DAY).toISOString();
  const [{ data: billing }, { data: invoices }, { data: reminders }] = await Promise.all([
    admin.from("billing").select("*").in("user_id", ids),
    admin.from("invoices").select("user_id, number, client_name, amount_cents, due_date, status, paid_at, paused").in("user_id", ids),
    admin.from("reminders").select("user_id").in("user_id", ids).gte("sent_at", since),
  ]);
  const bill = new Map(((billing ?? []) as Billing[]).map((b) => [b.user_id, b]));
  const byUser = new Map<string, WeeklyInvoice[]>();
  for (const i of invoices ?? []) {
    if (!byUser.has(i.user_id)) byUser.set(i.user_id, []);
    byUser.get(i.user_id)!.push(i as WeeklyInvoice);
  }
  const sentCount = new Map<string, number>();
  for (const r of reminders ?? []) sentCount.set(r.user_id, (sentCount.get(r.user_id) ?? 0) + 1);

  const result = { sent: [] as string[], errors: [] as { email: string; error: string }[] };
  for (const id of ids) {
    if (!accessFrom(bill.get(id) ?? null, now).ok) continue;
    const w = buildWeekly(byUser.get(id) ?? [], sentCount.get(id) ?? 0, now);
    if (!w) continue;
    const { data: u } = await admin.auth.admin.getUserById(id);
    const email = u?.user?.email;
    if (!email) continue;
    // Réservation avant l'envoi : la clé primaire (user_id, kind) empêche tout doublon.
    const { error: insErr } = await admin.from("lifecycle_emails").insert({ user_id: id, kind });
    if (insErr) continue;
    const { subject, text } = renderWeekly(w);
    try {
      await sendEmail(email, subject, text, { replyTo: LEGAL.contactEmail || undefined });
      result.sent.push(email);
    } catch (e) {
      await admin.from("lifecycle_emails").delete().eq("user_id", id).eq("kind", kind);
      result.errors.push({ email, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return result;
}
