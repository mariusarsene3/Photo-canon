import type { SupabaseClient } from "@supabase/supabase-js";
import { BRAND } from "./brand";
import { sendEmail } from "./email";
import { formatIban, siteUrl } from "./payment";
import { euros } from "./reminders";
import { daysUntilRelease, frLong, releaseDate } from "./guarantee-dates";

export { daysUntilRelease, frLong, releaseDate };

/**
 * Retenue de garantie (loi n° 71-584 du 16 juillet 1971, art. 1er) : au plus 5 % du montant des travaux.
 * Elle est libérée un an après la réception des travaux (avec ou sans réserves), même sans mainlevée,
 * sauf opposition motivée du maître d'ouvrage notifiée par lettre recommandée avant cette date.
 */
export type Guarantee = {
  id: number;
  user_id: string;
  site: string;
  client_name: string;
  client_email: string;
  kind: "retenue" | "caution";
  contract_amount_cents: number | null;
  amount_cents: number;
  reception_date: string; // AAAA-MM-JJ
  status: "waiting" | "claimed" | "released";
  claimed_at: string | null;
  released_at: string | null;
  alert_30_sent_at: string | null;
  alert_0_sent_at: string | null;
  invoice_id: number | null;
};

export const MAX_RATE = 5; // %

/** Alerte à envoyer à l'artisan aujourd'hui : 30 jours avant, puis le jour J (ou après, si ratée). */
export function dueAlert(g: Guarantee, now = new Date()): "30" | "0" | null {
  if (g.status !== "waiting") return null;
  const days = daysUntilRelease(g.reception_date, now);
  if (days <= 0 && !g.alert_0_sent_at) return "0";
  if (days > 0 && days <= 30 && !g.alert_30_sent_at) return "30";
  return null;
}

/** Demande de libération adressée au client (maître d'ouvrage). */
export function claimLetter(g: Guarantee, company: string, iban?: string): { subject: string; body: string } {
  const amount = euros(g.amount_cents);
  const subject =
    g.kind === "retenue"
      ? `Demande de restitution de la retenue de garantie – ${g.site}`
      : `Demande de mainlevée de la caution de retenue de garantie – ${g.site}`;
  const request =
    g.kind === "retenue"
      ? `Nous vous remercions de bien vouloir nous restituer la somme de ${amount} dans les meilleurs délais` +
        (iban ? `, par virement sur le compte suivant : ${formatIban(iban)}.` : ".")
      : `La caution bancaire fournie en remplacement de la retenue de garantie (${amount}) est donc libérée. ` +
        `Nous vous remercions de bien vouloir nous en adresser la mainlevée dans les meilleurs délais.`;
  const body = [
    "Madame, Monsieur,",
    "",
    `Les travaux que nous avons réalisés (${g.site}) ont fait l'objet d'une réception le ${frLong(g.reception_date)}.`,
    "",
    `Le délai d'un an prévu par l'article 1er de la loi n° 71-584 du 16 juillet 1971 a expiré le ${frLong(releaseDate(g.reception_date))}. ` +
      "Sauf opposition motivée de votre part notifiée par lettre recommandée avant cette date, la retenue de garantie doit nous être libérée.",
    "",
    request,
    "",
    "Nous restons à votre disposition pour toute question.",
    "",
    "Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.",
    "",
    company || "[Votre entreprise]",
  ].join("\n");
  return { subject, body };
}

/** Alerte envoyée à l'artisan. */
export function alertEmail(g: Guarantee, which: "30" | "0") {
  const amount = euros(g.amount_cents);
  const when = frLong(releaseDate(g.reception_date));
  const url = `${siteUrl()}/retenues`;
  if (which === "30") {
    return {
      subject: `Dans 30 jours : ${amount} de retenue de garantie à récupérer`,
      text:
        `Bonjour,\n\nLa retenue de garantie du chantier « ${g.site} » (${g.client_name}) sera libérable le ${when}.\n\n` +
        `Montant : ${amount}.\n\nPensez à vérifier que les éventuelles réserves ont bien été levées. Le jour venu, ${BRAND.name} ` +
        `vous enverra un rappel et vous pourrez envoyer la demande de libération en un clic : ${url}\n\nL'équipe ${BRAND.name}`,
    };
  }
  return {
    subject: `C'est le moment : réclamez ${amount} de retenue de garantie`,
    text:
      `Bonjour,\n\nLe délai d'un an est écoulé depuis la réception du chantier « ${g.site} » (${g.client_name}) : ` +
      `la retenue de garantie de ${amount} peut être réclamée depuis le ${when}.\n\n` +
      `Envoyez la demande de libération à votre client en un clic : ${url}\n\nL'équipe ${BRAND.name}`,
  };
}

/** Passage quotidien : alerte les artisans dont une retenue arrive à échéance. À appeler avec le client admin. */
export async function runGuaranteeAlerts(admin: SupabaseClient, now = new Date()) {
  const { data, error } = await admin.from("guarantees").select("*").eq("status", "waiting");
  if (error) return { sent: 0, skipped: "migration 005 non appliquée" };
  const due = (data as Guarantee[]).map((g) => ({ g, which: dueAlert(g, now) })).filter((x) => x.which);
  let sent = 0;
  const errors: string[] = [];
  const emails = new Map<string, string | undefined>();
  for (const { g, which } of due) {
    if (!emails.has(g.user_id)) {
      const { data: u } = await admin.auth.admin.getUserById(g.user_id);
      emails.set(g.user_id, u.user?.email ?? undefined);
    }
    const to = emails.get(g.user_id);
    if (!to) continue;
    const col = which === "30" ? "alert_30_sent_at" : "alert_0_sent_at";
    // Réservation avant envoi : ne passe que si l'alerte n'a pas déjà été marquée envoyée.
    const { data: claimed } = await admin
      .from("guarantees").update({ [col]: now.toISOString() }).eq("id", g.id).is(col, null).select("id");
    if (!claimed?.length) continue;
    const { subject, text } = alertEmail(g, which!);
    try {
      await sendEmail(to, subject, text);
      sent++;
    } catch (e) {
      await admin.from("guarantees").update({ [col]: null }).eq("id", g.id);
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  return { sent, errors };
}
