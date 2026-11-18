"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { runReminders } from "@/lib/reminders";

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
}

export async function markPaid(form: FormData) {
  const supabase = await createClient();
  await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", Number(form.get("id")));
  revalidatePath("/");
}

export async function deleteInvoice(form: FormData) {
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", Number(form.get("id")));
  revalidatePath("/");
}

export async function sendNow() {
  const supabase = await createClient();
  await runReminders(supabase);
  revalidatePath("/");
}

export async function saveSettings(form: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").upsert({
    user_id: user.id,
    company_name: String(form.get("company_name") ?? "").trim(),
    iban: String(form.get("iban") ?? "").trim(),
  });
  revalidatePath("/");
}
