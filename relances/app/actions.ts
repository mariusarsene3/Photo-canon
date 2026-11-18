"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { runReminders } from "@/lib/reminders";
import { cleanIban, isValidIban } from "@/lib/payment";

// Toutes les requêtes passent par le client de l'utilisateur connecté :
// les règles RLS de Supabase garantissent qu'il ne touche qu'à ses propres données.

export async function addInvoice(form: FormData) {
  const number = String(form.get("number") ?? "").trim();
  const client_name = String(form.get("client_name") ?? "").trim();
  const client_email = String(form.get("client_email") ?? "").trim();
  const amount = Number(String(form.get("amount") ?? "").replace(",", "."));
  const due_date = String(form.get("due_date") ?? "");
  if (!number || !client_name || !client_email.includes("@") || !(amount > 0) || !due_date) return;

  const supabase = await createClient();
  await supabase.from("invoices").insert({
    number,
    client_name,
    client_email,
    amount_cents: Math.round(amount * 100),
    due_date,
  });
  revalidatePath("/");
  redirect("/");
}

export async function markPaid(form: FormData) {
  const supabase = await createClient();
  await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", Number(form.get("id")));
  revalidatePath("/");
  redirect("/");
}

export async function deleteInvoice(form: FormData) {
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", Number(form.get("id")));
  revalidatePath("/");
  redirect("/");
}

export async function sendNow() {
  const supabase = await createClient();
  let notice: string;
  let kind = "ok";
  try {
    const { sent, errors, paused } = await runReminders(supabase);
    if (paused) {
      kind = "err";
      notice = "Votre essai gratuit est terminé : les relances sont en pause. Abonnez-vous depuis « Mon compte » pour les relancer.";
    } else if (errors.length) {
      kind = "err";
      notice =
        `${sent.length} relance(s) envoyée(s), ${errors.length} en échec. ` +
        errors.map((e) => `${e.invoice} : ${e.error}`).join(" · ");
    } else if (sent.length) {
      notice = `${sent.length} relance(s) envoyée(s) : ${sent.map((s) => s.invoice).join(", ")}.`;
    } else {
      notice =
        "Aucune relance à envoyer pour l'instant. Une relance part à partir du lendemain de l'échéance (J+1), puis à J+7 et J+15.";
    }
  } catch (e) {
    kind = "err";
    notice = "Erreur : " + (e instanceof Error ? e.message : JSON.stringify(e));
  }
  revalidatePath("/");
  redirect(`/?${kind}=${encodeURIComponent(notice)}`);
}

export async function saveSettings(form: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const iban = cleanIban(String(form.get("iban") ?? ""));
  if (iban && !isValidIban(iban)) {
    redirect(`/?serr=${encodeURIComponent("IBAN invalide : vérifiez qu'il est complet et sans faute de frappe.")}#parametres`);
  }
  await supabase.from("profiles").upsert({
    user_id: user.id,
    company_name: String(form.get("company_name") ?? "").trim(),
    iban,
  });
  revalidatePath("/");
  redirect("/");
}
