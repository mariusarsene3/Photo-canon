import { db, getSetting, type Invoice } from "./db";

// Scénario de relance : nombre de jours APRÈS l'échéance.
export const STEPS = [
  { step: 1, daysAfterDue: 1, label: "Rappel amical" },
  { step: 2, daysAfterDue: 7, label: "Relance ferme" },
  { step: 3, daysAfterDue: 15, label: "Dernier avis" },
] as const;

export const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const frDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("fr-FR");

export function daysLate(dueDate: string, today = new Date()): number {
  const due = new Date(dueDate + "T00:00:00");
  const t = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((t.getTime() - due.getTime()) / 86_400_000);
}

export function renderEmail(inv: Invoice, step: number) {
  const company = getSetting("company_name", "Votre entreprise");
  const iban = getSetting("iban");
  const amount = euros(inv.amount_cents);
  const due = frDate(inv.due_date);
  const pay = iban ? `\n\nRèglement par virement : ${iban}` : "";
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

async function sendEmail(to: string, subject: string, text: string) {
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
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/** Envoie toutes les relances dues aujourd'hui. Idempotent : chaque étape n'est envoyée qu'une fois. */
export async function runReminders(today = new Date()) {
  const invoices = db
    .prepare(
      `SELECT i.*, COUNT(r.id) AS reminders_sent, MAX(r.sent_at) AS last_reminder_at
         FROM invoices i LEFT JOIN reminders r ON r.invoice_id = i.id
        WHERE i.status = 'pending'
        GROUP BY i.id`
    )
    .all() as unknown as Invoice[];

  const sent: { invoice: string; step: number }[] = [];
  const errors: { invoice: string; error: string }[] = [];

  for (const inv of invoices) {
    const late = daysLate(inv.due_date, today);
    // Étape la plus avancée atteinte et pas encore envoyée (on n'envoie qu'un mail par facture et par passage).
    const due = [...STEPS].reverse().find((s) => late >= s.daysAfterDue);
    if (!due) continue;
    const already = db
      .prepare("SELECT 1 FROM reminders WHERE invoice_id = ? AND step >= ?")
      .get(inv.id, due.step);
    if (already) continue;

    const { subject, text } = renderEmail(inv, due.step);
    try {
      await sendEmail(inv.client_email, subject, text);
      db.prepare("INSERT OR IGNORE INTO reminders (invoice_id, step) VALUES (?, ?)").run(inv.id, due.step);
      sent.push({ invoice: inv.number, step: due.step });
    } catch (e) {
      errors.push({ invoice: inv.number, error: String(e) });
    }
  }
  return { sent, errors };
}
