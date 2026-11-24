"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { MAX_RATE, claimLetter, type Guarantee } from "@/lib/guarantees";
import { parseAmount, parseDate } from "@/lib/import";
import { sendEmail } from "@/lib/email";
import { getMyAccess } from "@/lib/billing";
import { contactHint, planOf, startOfDay, takeEmailQuota } from "@/lib/limits";

const back = (msg: string, kind: "ok" | "err" = "ok"): never => redirect(`/retenues?${kind}=${encodeURIComponent(msg)}`);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addGuarantee(form: FormData) {
  const site = String(form.get("site") ?? "").trim();
  const client_name = String(form.get("client_name") ?? "").trim();
  const client_email = String(form.get("client_email") ?? "").trim();
  const kind = form.get("kind") === "caution" ? "caution" : "retenue";
  const contract = parseAmount(String(form.get("contract_amount") ?? ""));
  let amount = parseAmount(String(form.get("amount") ?? ""));
  const reception = parseDate(String(form.get("reception_date") ?? ""));

  // Montant de la retenue : saisi, ou 5 % du montant des travaux.
  if (!amount && contract) amount = Math.round((contract * MAX_RATE) / 100);
  if (!site || !client_name) back("Indiquez le chantier et le client.", "err");
  if (client_email && !EMAIL.test(client_email)) back("E-mail du client invalide.", "err");
  if (!amount) back("Indiquez le montant de la retenue ou le montant des travaux.", "err");
  if (!reception) back("Indiquez la date de réception des travaux.", "err");

  const { supabase } = await requireUser();
  const { error } = await supabase.from("guarantees").insert({
    site, client_name, client_email, kind,
    contract_amount_cents: contract, amount_cents: amount, reception_date: reception,
  });
  if (error) back("Enregistrement impossible : " + error.message, "err");
  revalidatePath("/retenues");
  back("Retenue ajoutée. Vous serez prévenu 30 jours avant sa libération.");
}

async function load(id: number) {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("guarantees").select("*").eq("id", id).maybeSingle();
  if (!data) back("Retenue introuvable.", "err");
  return { supabase, g: data as Guarantee };
}

/** Envoie la demande de libération au client par e-mail. */
export async function sendClaim(form: FormData) {
  const { supabase, g } = await load(Number(form.get("id")));
  if (!g.client_email) back("Ajoutez l'e-mail du client pour lui envoyer la demande, ou imprimez la lettre.", "err");
  const access = await getMyAccess(supabase);
  // Anti-abus : les demandes de retenue comptent dans le plafond d'e-mails du jour, avec les relances.
  const since = startOfDay();
  const [claims, reminders] = await Promise.all([
    supabase.from("guarantees").select("id", { count: "exact", head: true }).gte("claimed_at", since),
    supabase.from("reminders").select("id", { count: "exact", head: true }).gte("sent_at", since),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  if (!(await takeEmailQuota(user!.id, planOf(access), (claims.count ?? 0) + (reminders.count ?? 0))))
    back(`Limite d'envois du jour atteinte : réessayez demain.${contactHint()}`, "err");

  const { data: prof } = await supabase.from("profiles").select("company_name, iban").maybeSingle();
  const { subject, body } = claimLetter(g, prof?.company_name ?? "", prof?.iban ?? "");
  try {
    await sendEmail(g.client_email, subject, body, {
      fromName: prof?.company_name || undefined,
      replyTo: user?.email ?? undefined,
    });
  } catch (e) {
    back("L'e-mail n'a pas pu partir : " + (e instanceof Error ? e.message : String(e)), "err");
  }
  await supabase.from("guarantees").update({ status: "claimed", claimed_at: new Date().toISOString() }).eq("id", g.id);
  revalidatePath("/retenues");
  back(`Demande envoyée à ${g.client_email}.`);
}

/** Le client n'a pas payé : on crée une facture que les relances automatiques prendront en charge. */
export async function toInvoice(form: FormData) {
  const { supabase, g } = await load(Number(form.get("id")));
  if (!g.client_email) back("Ajoutez l'e-mail du client pour pouvoir le relancer.", "err");
  if (g.invoice_id) back("Cette retenue est déjà suivie comme une facture.", "err");
  const due = new Date(Date.now() + 8 * 86_400_000).toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      number: `RG – ${g.site}`.slice(0, 60),
      client_name: g.client_name,
      client_email: g.client_email,
      amount_cents: g.amount_cents,
      due_date: due,
    })
    .select("id")
    .single();
  if (error) back("Création impossible : " + error.message, "err");
  await supabase.from("guarantees").update({ invoice_id: data!.id, status: "claimed", claimed_at: g.claimed_at ?? new Date().toISOString() }).eq("id", g.id);
  revalidatePath("/retenues");
  revalidatePath("/");
  back(`Ajoutée à vos factures (échéance le ${new Date(due).toLocaleDateString("fr-FR")}) : les relances partiront automatiquement.`);
}

export async function markReleased(form: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("guarantees").update({ status: "released", released_at: new Date().toISOString() }).eq("id", Number(form.get("id")));
  revalidatePath("/retenues");
  back("Bravo, retenue récupérée ✓");
}

export async function deleteGuarantee(form: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("guarantees").delete().eq("id", Number(form.get("id")));
  revalidatePath("/retenues");
  back("Retenue supprimée.");
}
