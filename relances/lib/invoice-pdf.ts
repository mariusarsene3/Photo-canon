import type { SupabaseClient } from "@supabase/supabase-js";
import { INVOICE_BUCKET } from "./reminders";
import { isPdf } from "./file-check";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MIGRATION = "Fonction pas encore activée : appliquez la migration 007 dans Supabase.";

/** Valeur du champ fichier, ou null s'il est vide. */
export function pdfFromForm(form: FormData): File | null {
  const f = form.get("pdf");
  return f instanceof File && f.size > 0 ? f : null;
}

/**
 * Enregistre la facture PDF dans le dossier privé de l'utilisateur et la rattache à la facture.
 * Renvoie un message d'erreur lisible, ou null si tout s'est bien passé.
 */
export async function savePdf(supabase: SupabaseClient, userId: string, invoiceId: number, file: File): Promise<string | null> {
  // Taille vérifiée avant de lire le fichier, puis vrai type d'après le contenu (pas le nom).
  if (file.size > MAX_PDF_BYTES) return "Le PDF dépasse 10 Mo.";
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isPdf(bytes)) return "Ce fichier n'est pas un vrai PDF.";
  // Nom choisi par le serveur : le nom d'origine n'est jamais utilisé pour l'enregistrement.
  const path = `${userId}/${invoiceId}.pdf`;
  const up = await supabase.storage.from(INVOICE_BUCKET).upload(path, bytes, { contentType: "application/pdf", upsert: true });
  if (up.error) {
    console.error("Envoi du PDF", up.error.message);
    return /bucket|not found/i.test(up.error.message) ? MIGRATION : "Le PDF n'a pas pu être enregistré. Réessayez.";
  }
  const { error } = await supabase.from("invoices").update({ pdf_path: path }).eq("id", invoiceId);
  if (error) return /column|schema cache/i.test(error.message) ? MIGRATION : "Le PDF n'a pas pu être rattaché à la facture.";
  return null;
}

/** Retire le PDF d'une facture (fichier compris). */
export async function deletePdf(supabase: SupabaseClient, invoiceId: number, path: string | null | undefined) {
  if (path) await supabase.storage.from(INVOICE_BUCKET).remove([path]);
  await supabase.from("invoices").update({ pdf_path: null }).eq("id", invoiceId);
}
