import type { SupabaseClient } from "@supabase/supabase-js";
import { formatIban, paymentUrl } from "./payment";

// Scénario de relance : nombre de jours APRÈS l'échéance.
export const STEPS = [
  { step: 1, daysAfterDue: 1, label: "Rappel amical" },
  { step: 2, daysAfterDue: 7, label: "Relance ferme" },
  { step: 3, daysAfterDue: 15, label: "Dernier avis" },
] as const;

export type Invoice = {
  id: number;
  user_id: string;
  number: string;
  client_name: string;
  client_email: string;
  amount_cents: number;
  due_date: string; // AAAA-MM-JJ
  status: "pending" | "paid";
  paid_at: string | null;
  created_at: string;
  pay_token?: string; // présent une fois la migration 002 appliquée
  reminders: { step: number; sent_at: string }[];
};

export type Profile = { company_name: string; iban: string };

export const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export const frDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("fr-FR");

export function daysLate(dueDate: string, today = new Date()): number {
  const due = new Date(dueDate + "T00:00:00");
  const t = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((t.getTime() - due.getTime()) / 86_400_000);
}

export function renderEmail(inv: Invoice, step: number, profile?: Profile) {
  const company = profile?.company_name || "Votre fournisseur";
  const amount = euros(inv.amount_cents);
  const due = frDate(inv.due_date);
  const lines: string[] = [];
  if (inv.pay_token) lines.push(`Régler en ligne (IBAN, QR code) : ${paymentUrl(inv.pay_token)}`);
  if (profile?.iban) lines.push(`Règlement par virement : ${formatIban(profile.iban)}`);
  const pay = lines.length ? "\n\n" + lines.join("\n") : "";
  const sign = `\n\nCordialement,\n${company}`;

  if (step === 1)
    return {
      subject: `Petit rappel : facture ${inv.number}`,
      text: `Bonjour ${inv.client_name},\n\nSauf erreur de notre part, la facture ${inv.number} d'un montant de ${amount}, arrivée à échéance le ${due}, n'a pas encore été réglée.\n\nS'il s'agit d'un oubli, merci de procéder au règlement dès que possible. Si le paiement est déjà parti, ne tenez pas compte de ce message.${pay}${sign}`,
    };
  if (step === 2)
    return {
      subject: `Relance : facture ${inv.number} en attente de règlement`,
      text: `Bonjour ${inv.client_name},\n\nMalgré notre précédent rappel, la facture ${inv.number} (${amount}, échue le ${due}) reste impayée à ce jour.\n\nMerci de régulariser la situation sous 7 jours, ou de nous contacter si vous rencontrez une difficulté.${pay}${sign}`,
    };
  return {
    subject: `Dernier avis avant mise en demeure : facture ${inv.number}`,
    text: `Bonjour ${inv.client_name},\n\nLa facture ${inv.number} (${amount}, échue le ${due}) demeure impayée malgré nos relances.\n\nSans règlement de votre part sous 8 jours, nous serons contraints d'engager une procédure de recouvrement. Nous vous rappelons que tout retard de paiement entraîne l'application de pénalités ainsi que d'une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce).${pay}${sign}`,
  };
}

async function sendEmail(to: string, subject: string, text: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    // Mode développement : on affiche l'e-mail au lieu de l'envoyer.
    console.log(`\n📧 [simulation] À: ${to}\nObjet: ${subject}\n\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/** Étape de relance à envoyer pour cette facture aujourd'hui, ou null. */
export function stepToSend(inv: Invoice, today = new Date()) {
  if (inv.status !== "pending") return null;
  const late = daysLate(inv.due_date, today);
  const due = [...STEPS].reverse().find((s) => late >= s.daysAfterDue);
  if (!due) return null;
  const maxSent = Math.max(0, ...inv.reminders.map((r) => r.step));
  return maxSent >= due.step ? null : due.step;
}

/**
 * Envoie toutes les relances dues. Idempotent : chaque étape n'est envoyée qu'une fois.
 * Avec le client de l'utilisateur → ses factures uniquement (RLS).
 * Avec le client admin (cron) → toutes les factures de tous les comptes.
 */
export async function runReminders(supabase: SupabaseClient, today = new Date()) {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, reminders(step, sent_at)")
    .eq("status", "pending")
    .lte("due_date", today.toISOString().slice(0, 10));
  if (error) throw error;
  const invoices = (data ?? []) as Invoice[];

  const userIds = [...new Set(invoices.map((i) => i.user_id))];
  const { data: profs } = userIds.length
    ? await supabase.from("profiles").select("user_id, company_name, iban").in("user_id", userIds)
    : { data: [] };
  const profiles = new Map((profs ?? []).map((p) => [p.user_id as string, p as Profile]));

  const sent: { invoice: string; step: number }[] = [];
  const errors: { invoice: string; error: string }[] = [];

  for (const inv of invoices) {
    const step = stepToSend(inv, today);
    if (!step) continue;
    const { subject, text } = renderEmail(inv, step, profiles.get(inv.user_id));
    try {
      // On réserve l'étape AVANT l'envoi : si deux passages tournent en même temps,
      // la contrainte unique empêche le doublon.
      const { error: insErr } = await supabase
        .from("reminders")
        .insert({ invoice_id: inv.id, user_id: inv.user_id, step });
      if (insErr) {
        if (insErr.code === "23505") continue; // déjà envoyée
        throw insErr;
      }
      try {
        await sendEmail(inv.client_email, subject, text);
      } catch (e) {
        // Échec d'envoi : on libère l'étape pour réessayer au prochain passage.
        await supabase.from("reminders").delete().eq("invoice_id", inv.id).eq("step", step);
        throw e;
      }
      sent.push({ invoice: inv.number, step });
    } catch (e) {
      errors.push({ invoice: inv.number, error: e instanceof Error ? e.message : JSON.stringify(e) });
    }
  }
  return { sent, errors };
}
