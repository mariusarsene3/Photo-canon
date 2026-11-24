import type { SupabaseClient } from "@supabase/supabase-js";
import { formatIban, paymentUrl } from "./payment";
import { accessFrom, type Billing } from "./billing";
import { planOf, startOfDay, takeEmailQuota, type Plan } from "./limits";
import { sendEmail } from "./email";

/** Espace de stockage Supabase des factures PDF (migration 007). */
export const INVOICE_BUCKET = "factures";

// Scénario de relance : nombre de jours par rapport à l'échéance (négatif = avant).
// L'étape 0 (rappel avant échéance) est facultative : elle dépend de la préférence « remind_before ».
export const STEPS = [
  { step: 0, daysAfterDue: -3, label: "Rappel avant échéance", sent: "Rappel avant échéance envoyé", planned: "Rappel avant échéance prévu" },
  { step: 1, daysAfterDue: 1, label: "Rappel amical", sent: "Rappel amical envoyé", planned: "Rappel amical prévu" },
  { step: 2, daysAfterDue: 7, label: "Relance ferme", sent: "Relance ferme envoyée", planned: "Relance ferme prévue" },
  { step: 3, daysAfterDue: 15, label: "Dernier avis", sent: "Dernier avis envoyé", planned: "Dernier avis prévu" },
] as const;

/** « J-3 », « J+1 »… */
export const dayLabel = (d: number) => (d < 0 ? `J${d}` : `J+${d}`);

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
  paused?: boolean; // migration 006 : relances suspendues pour cette facture
  notes?: string; // migration 006 : notes internes
  pdf_path?: string | null; // migration 007 : facture PDF jointe aux relances
  reminders: { step: number; sent_at: string }[];
};

import { fillTemplate, type Template } from "./template-fill";

export type { Template };

export type Profile = {
  company_name: string;
  iban: string;
  remind_before?: boolean; // migration 007
  templates?: Partial<Record<string, Template>>; // migration 007 : textes personnalisés, par étape
};

/** Le rappel avant échéance n'est envoyé que si la préférence existe et est activée. */
export const remindsBefore = (p?: Profile | null) => p?.remind_before === true;

export const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export const frDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("fr-FR");

export function daysLate(dueDate: string, today = new Date()): number {
  const due = new Date(dueDate + "T00:00:00");
  const t = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((t.getTime() - due.getTime()) / 86_400_000);
}

/** Champs utilisables dans les textes des relances. */
export const PLACEHOLDERS = [
  { key: "client", help: "nom du client" },
  { key: "numero", help: "n° de facture" },
  { key: "montant", help: "montant TTC" },
  { key: "echeance", help: "date d'échéance" },
  { key: "entreprise", help: "votre entreprise" },
  { key: "paiement", help: "lien de paiement et IBAN" },
] as const;

/** Textes par défaut de chaque étape. */
export const DEFAULT_TEMPLATES: Record<number, Template> = {
  0: {
    subject: "Rappel : facture {numero} à régler le {echeance}",
    body: "Bonjour {client},\n\nPour rappel, la facture {numero} d'un montant de {montant} arrive à échéance le {echeance}.\n\nSi le règlement est déjà programmé, merci, et ne tenez pas compte de ce message.\n\n{paiement}\n\nCordialement,\n{entreprise}",
  },
  1: {
    subject: "Petit rappel : facture {numero}",
    body: "Bonjour {client},\n\nSauf erreur de notre part, la facture {numero} d'un montant de {montant}, arrivée à échéance le {echeance}, n'a pas encore été réglée.\n\nS'il s'agit d'un oubli, merci de procéder au règlement dès que possible. Si le paiement est déjà parti, ne tenez pas compte de ce message.\n\n{paiement}\n\nCordialement,\n{entreprise}",
  },
  2: {
    subject: "Relance : facture {numero} en attente de règlement",
    body: "Bonjour {client},\n\nMalgré notre précédent rappel, la facture {numero} ({montant}, échue le {echeance}) reste impayée à ce jour.\n\nMerci de régulariser la situation sous 7 jours, ou de nous contacter si vous rencontrez une difficulté.\n\n{paiement}\n\nCordialement,\n{entreprise}",
  },
  3: {
    subject: "Dernier avis avant mise en demeure : facture {numero}",
    body: "Bonjour {client},\n\nLa facture {numero} ({montant}, échue le {echeance}) demeure impayée malgré nos relances.\n\nSans règlement de votre part sous 8 jours, nous serons contraints d'engager une procédure de recouvrement. Nous vous rappelons que tout retard de paiement entraîne l'application de pénalités ainsi que d'une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce).\n\n{paiement}\n\nCordialement,\n{entreprise}",
  },
};

/** Texte utilisé pour une étape : le texte personnalisé s'il existe, sinon celui par défaut. */
export function templateFor(step: number, profile?: Profile | null): Template {
  const custom = profile?.templates?.[String(step)];
  const def = DEFAULT_TEMPLATES[step] ?? DEFAULT_TEMPLATES[1];
  return { subject: custom?.subject?.trim() || def.subject, body: custom?.body?.trim() || def.body };
}

export function renderEmail(inv: Invoice, step: number, profile?: Profile | null) {
  const lines: string[] = [];
  if (inv.pay_token) lines.push(`Régler en ligne (IBAN, QR code) : ${paymentUrl(inv.pay_token)}`);
  if (profile?.iban) lines.push(`Règlement par virement : ${formatIban(profile.iban)}`);
  const pay = lines.join("\n");
  const vars: Record<string, string> = {
    client: inv.client_name,
    numero: inv.number,
    montant: euros(inv.amount_cents),
    echeance: frDate(inv.due_date),
    entreprise: profile?.company_name || "Votre fournisseur",
    paiement: pay,
  };
  return fillTemplate(templateFor(step, profile), vars);
}

/** Étapes actives pour ce compte (sans le rappel avant échéance s'il est désactivé). */
export const activeSteps = (profile?: Profile | null) => STEPS.filter((s) => s.step > 0 || remindsBefore(profile));

/** Étape de relance à envoyer pour cette facture aujourd'hui, ou null. */
export function stepToSend(inv: Invoice, today = new Date(), profile?: Profile | null) {
  if (inv.status !== "pending" || inv.paused) return null;
  const late = daysLate(inv.due_date, today);
  const due = [...activeSteps(profile)].reverse().find((s) => late >= s.daysAfterDue);
  if (!due) return null;
  // Le rappel avant échéance n'a de sens qu'avant l'échéance.
  if (due.step === 0 && late > 0) return null;
  const maxSent = Math.max(-1, ...inv.reminders.map((r) => r.step));
  return maxSent >= due.step ? null : due.step;
}

/** Prochaine relance prévue pour une facture en attente (étape, libellé, date AAAA-MM-JJ), ou null. */
export function nextReminder(inv: Invoice, profile?: Profile | null): { step: number; label: string; planned: string; date: string } | null {
  if (inv.status !== "pending" || inv.paused) return null;
  const maxSent = Math.max(-1, ...inv.reminders.map((r) => r.step));
  const today = new Date().toISOString().slice(0, 10);
  const dateOf = (days: number) => {
    const d = new Date(inv.due_date + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };
  // Un rappel avant échéance dont la date est dépassée ne partira jamais : on passe au suivant.
  const next = activeSteps(profile).find((s) => s.step > maxSent && (s.step > 0 || dateOf(0) >= today));
  if (!next) return null;
  const date = dateOf(next.daysAfterDue);
  return { step: next.step, label: next.label, planned: next.planned, date: date < today ? today : date };
}

/**
 * E-mail du compte. Avec le client admin (cron) : lu dans Supabase Auth.
 * Avec le client de l'utilisateur (bouton « Envoyer les relances dues ») : c'est son propre compte.
 */
export async function accountEmail(supabase: SupabaseClient, userId: string): Promise<string | undefined> {
  const admin = await supabase.auth.admin.getUserById(userId).catch(() => null);
  if (admin && !admin.error && admin.data.user?.email) return admin.data.user.email;
  const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  return data.user?.id === userId ? data.user.email ?? undefined : undefined;
}

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000).toISOString().slice(0, 10);

/** Nom de fichier lisible pour la pièce jointe : « Facture F-042.pdf ». */
export const pdfFilename = (inv: Pick<Invoice, "number">) =>
  `Facture ${inv.number.replace(/[\\/:*?"<>|]+/g, "-")}.pdf`;

/** Facture PDF à joindre, si l'utilisateur en a ajouté une. Une erreur de lecture n'empêche pas la relance. */
async function invoicePdf(supabase: SupabaseClient, inv: Invoice) {
  if (!inv.pdf_path) return null;
  const { data, error } = await supabase.storage.from(INVOICE_BUCKET).download(inv.pdf_path);
  if (error || !data) {
    console.error("PDF introuvable pour la facture", inv.number, error?.message);
    return null;
  }
  return { filename: pdfFilename(inv), content: Buffer.from(await data.arrayBuffer()).toString("base64") };
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
    .lte("due_date", addDays(today, 3)); // le rappel avant échéance part 3 jours avant
  if (error) throw error;
  let invoices = (data ?? []) as Invoice[];

  // Seuls les comptes en essai ou abonnés sont relancés. Si la table billing n'existe pas encore
  // (migration 003 non appliquée), personne n'est bloqué.
  let paused = 0;
  const ids = [...new Set(invoices.map((i) => i.user_id))];
  const plans = new Map<string, Plan>(); // formule de chaque compte, pour le plafond d'envois du jour
  if (ids.length) {
    const { data: bills, error: billErr } = await supabase.from("billing").select("*").in("user_id", ids);
    if (!billErr) {
      const byUser = new Map((bills as Billing[]).map((b) => [b.user_id, b]));
      const allowed = new Set(ids.filter((id) => accessFrom(byUser.get(id) ?? null, today).ok));
      for (const id of ids) plans.set(id, planOf(accessFrom(byUser.get(id) ?? null, today)));
      paused = invoices.filter((i) => !allowed.has(i.user_id)).length;
      invoices = invoices.filter((i) => allowed.has(i.user_id));
    }
  }

  const userIds = [...new Set(invoices.map((i) => i.user_id))];
  const { data: profs } = userIds.length
    ? await supabase.from("profiles").select("*").in("user_id", userIds)
    : { data: [] };
  const profiles = new Map((profs ?? []).map((p) => [p.user_id as string, p as Profile]));

  // Adresse e-mail de chaque artisan, pour que les réponses de ses clients lui arrivent directement.
  const owners = new Map<string, string | undefined>();
  const ownerEmail = async (userId: string) => {
    if (!owners.has(userId)) owners.set(userId, await accountEmail(supabase, userId));
    return owners.get(userId);
  };

  // Anti-abus : e-mails déjà envoyés aujourd'hui par compte (repli si le compteur serveur est indisponible).
  const sentToday = new Map<string, number>();
  if (userIds.length) {
    const { data: todays } = await supabase
      .from("reminders")
      .select("user_id")
      .in("user_id", userIds)
      .gte("sent_at", startOfDay(today));
    for (const r of todays ?? []) sentToday.set(r.user_id, (sentToday.get(r.user_id) ?? 0) + 1);
  }
  let limited = 0;

  const sent: { invoice: string; step: number }[] = [];
  const errors: { invoice: string; error: string }[] = [];

  for (const inv of invoices) {
    const profile = profiles.get(inv.user_id);
    const step = stepToSend(inv, today, profile);
    if (step === null) continue;
    if (!(await takeEmailQuota(inv.user_id, plans.get(inv.user_id) ?? "trial", sentToday.get(inv.user_id) ?? 0))) {
      limited++; // reportée : quota d'envois du jour atteint
      continue;
    }
    const { subject, text } = renderEmail(inv, step, profile);
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
        const pdf = await invoicePdf(supabase, inv);
        // Le client voit le nom de l'artisan comme expéditeur, et ses réponses arrivent chez l'artisan.
        await sendEmail(inv.client_email, subject, text, {
          fromName: profile?.company_name || undefined,
          replyTo: await ownerEmail(inv.user_id),
          attachments: pdf ? [pdf] : undefined,
        });
      } catch (e) {
        // Échec d'envoi : on libère l'étape pour réessayer au prochain passage.
        await supabase.from("reminders").delete().eq("invoice_id", inv.id).eq("step", step);
        throw e;
      }
      sent.push({ invoice: inv.number, step });
      sentToday.set(inv.user_id, (sentToday.get(inv.user_id) ?? 0) + 1);
    } catch (e) {
      errors.push({ invoice: inv.number, error: e instanceof Error ? e.message : JSON.stringify(e) });
    }
  }
  return { sent, errors, paused, limited };
}
