"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { runReminders } from "@/lib/reminders";
import { cleanIban, isValidIban } from "@/lib/payment";
import { pdfFromForm, savePdf } from "@/lib/invoice-pdf";
import { getMyAccess } from "@/lib/billing";
import { contactHint, invoiceLimitMessage, invoicesLeft, planOf } from "@/lib/limits";

// Toutes les requêtes passent par le client de l'utilisateur connecté :
// les règles RLS de Supabase garantissent qu'il ne touche qu'à ses propres données.

export async function addInvoice(form: FormData) {
  const number = String(form.get("number") ?? "").trim();
  const client_name = String(form.get("client_name") ?? "").trim();
  const client_email = String(form.get("client_email") ?? "").trim();
  const amount = Number(String(form.get("amount") ?? "").replace(",", "."));
  const due_date = String(form.get("due_date") ?? "");
  if (!number || !client_name || !client_email.includes("@") || !(amount > 0) || !due_date) return;

  const { supabase } = await requireUser();
  const plan = planOf(await getMyAccess(supabase));
  if ((await invoicesLeft(supabase, plan)) < 1) redirect(`/?err=${encodeURIComponent(invoiceLimitMessage(plan))}`);
  const { data: created } = await supabase
    .from("invoices")
    .insert({ number, client_name, client_email, amount_cents: Math.round(amount * 100), due_date })
    .select("id, user_id")
    .single();
  const pdf = pdfFromForm(form);
  if (created && pdf) {
    const err = await savePdf(supabase, created.user_id, created.id, pdf);
    if (err) {
      revalidatePath("/");
      redirect(`/factures/${created.id}?err=${encodeURIComponent("Facture ajoutée, mais sans le PDF : " + err)}`);
    }
  }
  revalidatePath("/");
  redirect("/");
}

export async function markPaid(form: FormData) {
  const { supabase } = await requireUser();
  await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", Number(form.get("id")));
  revalidatePath("/");
  redirect("/");
}

export async function deleteInvoice(form: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("invoices").delete().eq("id", Number(form.get("id")));
  revalidatePath("/");
  redirect("/");
}

export async function sendNow() {
  const { supabase } = await requireUser();
  let notice: string;
  let kind = "ok";
  try {
    const { sent, errors, paused, limited } = await runReminders(supabase);
    if (paused) {
      kind = "err";
      notice = "Votre essai gratuit est terminé : les relances sont en pause. Abonnez-vous depuis « Mon compte » pour les relancer.";
    } else if (errors.length) {
      kind = "err";
      notice =
        `${sent.length} relance(s) envoyée(s), ${errors.length} en échec. ` +
        errors.map((e) => `${e.invoice} : ${e.error}`).join(" · ");
    } else if (sent.length || limited) {
      notice =
        (sent.length ? `${sent.length} relance(s) envoyée(s) : ${sent.map((s) => s.invoice).join(", ")}.` : "") +
        (limited
          ? ` ${limited} relance(s) reportée(s) à demain : limite d'envois du jour atteinte.${contactHint()}`
          : "");
      notice = notice.trim();
    } else {
      notice =
        "Aucune relance à envoyer pour l'instant. Les relances partent le lendemain de l'échéance (J+1), puis à J+7 et J+15 (et 3 jours avant l'échéance si ce rappel est activé).";
    }
  } catch (e) {
    kind = "err";
    notice = "Erreur : " + (e instanceof Error ? e.message : JSON.stringify(e));
  }
  revalidatePath("/");
  redirect(`/?${kind}=${encodeURIComponent(notice)}`);
}

export async function saveSettings(form: FormData) {
  const { supabase } = await requireUser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const iban = cleanIban(String(form.get("iban") ?? ""));
  if (iban && !isValidIban(iban)) {
    redirect(`/compte?err=${encodeURIComponent("IBAN invalide : vérifiez qu'il est complet et sans faute de frappe.")}#entreprise`);
  }
  await supabase.from("profiles").upsert({
    user_id: user.id,
    company_name: String(form.get("company_name") ?? "").trim(),
    iban,
  });
  revalidatePath("/");
  revalidatePath("/compte");
  redirect(`/compte?ok=${encodeURIComponent("Informations de l'entreprise enregistrées.")}`);
}
