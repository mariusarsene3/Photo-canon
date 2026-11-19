"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseAmount, parseDate } from "@/lib/import";
import { deletePdf, pdfFromForm, savePdf } from "@/lib/invoice-pdf";

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

export async function uploadPdf(form: FormData) {
  const id = Number(form.get("id"));
  const pdf = pdfFromForm(form);
  if (!pdf) back(id, "Choisissez un fichier PDF.", "err");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: inv } = await supabase.from("invoices").select("id").eq("id", id).maybeSingle();
  if (!inv) back(id, "Facture introuvable.", "err");
  const err = await savePdf(supabase, user.id, id, pdf!);
  if (err) back(id, err, "err");
  revalidatePath(`/factures/${id}`);
  back(id, "PDF ajouté : il sera joint à chaque relance.");
}

export async function removePdf(form: FormData) {
  const id = Number(form.get("id"));
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invoices").select("pdf_path").eq("id", id).maybeSingle();
  if (!inv) back(id, "Facture introuvable.", "err");
  await deletePdf(supabase, id, inv!.pdf_path);
  revalidatePath(`/factures/${id}`);
  back(id, "PDF retiré.");
}

export async function removeInvoice(form: FormData) {
  const id = Number(form.get("id"));
  const supabase = await createClient();
  // Le fichier PDF éventuel est supprimé avec la facture.
  const { data: inv } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
  if (inv?.pdf_path) await supabase.storage.from("factures").remove([inv.pdf_path]);
  await supabase.from("invoices").delete().eq("id", id);
  revalidatePath("/");
  redirect(`/?ok=${encodeURIComponent("Facture supprimée.")}`);
}
