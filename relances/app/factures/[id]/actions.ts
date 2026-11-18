"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseAmount, parseDate } from "@/lib/import";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIGRATION = "Fonction pas encore activée : appliquez la migration 006 dans Supabase.";

function back(id: number, msg: string, kind: "ok" | "err" = "ok"): never {
  redirect(`/factures/${id}?${kind}=${encodeURIComponent(msg)}`);
}

async function update(id: number, fields: Record<string, unknown>, okMsg: string) {
  const supabase = await createClient();
  const { error, data } = await supabase.from("invoices").update(fields).eq("id", id).select("id");
  if (error) back(id, /column|schema cache/i.test(error.message) ? MIGRATION : "Enregistrement impossible : " + error.message, "err");
  if (!data?.length) back(id, "Facture introuvable.", "err");
  revalidatePath("/");
  revalidatePath(`/factures/${id}`);
  back(id, okMsg);
}

export async function editInvoice(form: FormData) {
  const id = Number(form.get("id"));
  const number = String(form.get("number") ?? "").trim();
  const client_name = String(form.get("client_name") ?? "").trim();
  const client_email = String(form.get("client_email") ?? "").trim();
  const amount_cents = parseAmount(String(form.get("amount") ?? ""));
  const due_date = parseDate(String(form.get("due_date") ?? ""));
  if (!number || !client_name) back(id, "Le numéro et le client sont obligatoires.", "err");
  if (!EMAIL.test(client_email)) back(id, "E-mail du client invalide.", "err");
  if (!amount_cents) back(id, "Montant invalide.", "err");
  if (!due_date) back(id, "Date d'échéance invalide.", "err");
  await update(id, { number, client_name, client_email, amount_cents, due_date }, "Facture mise à jour.");
}

export async function setPaid(form: FormData) {
  const id = Number(form.get("id"));
  const paid = form.get("paid") === "1";
  await update(
    id,
    paid ? { status: "paid", paid_at: new Date().toISOString() } : { status: "pending", paid_at: null },
    paid ? "Facture marquée comme payée : plus aucune relance ne partira." : "Facture remise en attente de paiement.",
  );
}

export async function setPaused(form: FormData) {
  const id = Number(form.get("id"));
  const paused = form.get("paused") === "1";
  await update(id, { paused }, paused ? "Relances mises en pause pour cette facture." : "Relances reprises.");
}

export async function saveNotes(form: FormData) {
  const id = Number(form.get("id"));
  await update(id, { notes: String(form.get("notes") ?? "").slice(0, 2000) }, "Note enregistrée.");
}

export async function removeInvoice(form: FormData) {
  const id = Number(form.get("id"));
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", id);
  revalidatePath("/");
  redirect(`/?ok=${encodeURIComponent("Facture supprimée.")}`);
}
