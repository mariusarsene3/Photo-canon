"use server";

import { revalidatePath } from "next/cache";
import { db, setSetting } from "@/lib/db";
import { runReminders } from "@/lib/reminders";

export async function addInvoice(form: FormData) {
  const number = String(form.get("number") ?? "").trim();
  const client_name = String(form.get("client_name") ?? "").trim();
  const client_email = String(form.get("client_email") ?? "").trim();
  const amount = Number(String(form.get("amount") ?? "").replace(",", "."));
  const due_date = String(form.get("due_date") ?? "");
  if (!number || !client_name || !client_email.includes("@") || !(amount > 0) || !due_date) return;

  db.prepare(
    "INSERT INTO invoices (number, client_name, client_email, amount_cents, due_date) VALUES (?, ?, ?, ?, ?)"
  ).run(number, client_name, client_email, Math.round(amount * 100), due_date);
  revalidatePath("/");
}

export async function markPaid(form: FormData) {
  db.prepare("UPDATE invoices SET status = 'paid', paid_at = datetime('now') WHERE id = ?").run(
    Number(form.get("id"))
  );
  revalidatePath("/");
}

export async function deleteInvoice(form: FormData) {
  const id = Number(form.get("id"));
  db.prepare("DELETE FROM reminders WHERE invoice_id = ?").run(id);
  db.prepare("DELETE FROM invoices WHERE id = ?").run(id);
  revalidatePath("/");
}

export async function sendNow() {
  await runReminders();
  revalidatePath("/");
}

export async function saveSettings(form: FormData) {
  setSetting("company_name", String(form.get("company_name") ?? "").trim());
  setSetting("iban", String(form.get("iban") ?? "").trim());
  revalidatePath("/");
}
